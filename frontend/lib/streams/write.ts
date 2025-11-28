/**
 * Somnia Data Streams - Write Operations
 * All write operations for publishing data to streams
 * NOTE: These should only be used in server-side code or secure environments
 */

import { waitForTransactionReceipt } from 'viem/actions';
import { 
  getWalletSDK, 
  getSchemaId, 
  getSchemaEncoder,
  generateDataId,
  toBytes32,
  zeroBytes32,
  type Hex,
  type Address,
} from './client';
import { SCHEMAS, EVENT_SCHEMAS } from './config';

// ============================================
// Helper Functions
// ============================================

/**
 * Unwrap SDK result that may return T | Error
 */
function unwrapTxHash(result: Hex | Error | null | undefined): Hex | undefined {
  if (result instanceof Error) return undefined;
  return result ?? undefined;
}

/**
 * Check if result is an error
 */
function isError<T>(result: T | Error): result is Error {
  return result instanceof Error;
}

// ============================================
// Type Definitions for Write Operations
// ============================================

export interface WriteResult {
  success: boolean;
  txHash?: Hex;
  dataId?: Hex;
  error?: string;
}

export interface AgentExecutionInput {
  agentId: string;
  executor: Address;
  functionSelector: string;
  success: boolean;
  gasUsed: bigint;
  errorMessage?: string;
}

export interface ChatMessageInput {
  sessionId: string;
  sender: Address;
  agentId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  intentAction?: string;
}

export interface AgentAnalyticsInput {
  agentId: string;
  totalCalls: bigint;
  successCount: bigint;
  totalGasUsed: bigint;
  uniqueUsers: bigint;
}

export interface TransactionEventInput {
  txHash: string;
  user: Address;
  agentId: string;
  action: string;
  status: string;
  gasUsed: bigint;
}

export interface ActivityFeedInput {
  entityId: string;
  entityType: 'agent' | 'transaction' | 'chat' | 'user';
  action: string;
  actor: Address;
  metadata?: Record<string, any>;
}

export interface LeaderboardInput {
  agentId: string;
  agentName: string;
  score: bigint;
  totalExecutions: bigint;
  successRate: bigint;
}

// ============================================
// Schema Registration
// ============================================

/**
 * Register all ContractMind schemas on-chain
 * Should be called once during initial setup
 */
export async function registerAllSchemas(privateKey: Hex): Promise<WriteResult[]> {
  const sdk = getWalletSDK(privateKey);
  const results: WriteResult[] = [];
  
  const schemaRegistrations = [
    { schemaName: 'agent_execution', schema: SCHEMAS.AGENT_EXECUTION },
    { schemaName: 'chat_message', schema: SCHEMAS.CHAT_MESSAGE },
    { schemaName: 'agent_analytics', schema: SCHEMAS.AGENT_ANALYTICS },
    { schemaName: 'transaction_event', schema: SCHEMAS.TRANSACTION_EVENT },
    { schemaName: 'activity_feed', schema: SCHEMAS.ACTIVITY_FEED },
    { schemaName: 'leaderboard', schema: SCHEMAS.LEADERBOARD },
  ];
  
  for (const reg of schemaRegistrations) {
    try {
      const txHash = await sdk.streams.registerDataSchemas([
        {
          schemaName: reg.schemaName,
          schema: reg.schema,
          parentSchemaId: zeroBytes32 as Hex,
        },
      ], true); // ignoreAlreadyRegistered = true
      
      if (txHash instanceof Error) {
        results.push({ success: false, error: txHash.message });
      } else {
        results.push({
          success: true,
          txHash: unwrapTxHash(txHash),
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Ignore already registered errors
      if (errorMessage.includes('SchemaAlreadyRegistered')) {
        results.push({ success: true });
      } else {
        results.push({ success: false, error: errorMessage });
      }
    }
  }
  
  return results;
}

/**
 * Register event schemas for real-time subscriptions
 * Note: This is an advanced feature that may require additional SDK configuration
 */
export async function registerEventSchemas(privateKey: Hex): Promise<WriteResult> {
  try {
    const sdk = getWalletSDK(privateKey);
    
    // Build event schema registrations
    const eventSchemas = Object.values(EVENT_SCHEMAS).map(e => ({
      id: e.id,
      schema: e.eventTopic, // Event signature as schema
      params: e.params.map(p => ({
        name: p.name,
        paramType: p.paramType,
        isIndexed: p.isIndexed,
      })),
      eventTopic: e.eventTopic,
    }));
    
    // Cast to expected type - SDK typing may not be accurate
    const txHash = await sdk.streams.registerEventSchemas(eventSchemas as any);
    
    if (txHash instanceof Error) {
      return { success: false, error: txHash.message };
    }
    
    return { success: true, txHash: unwrapTxHash(txHash) };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// ============================================
// Write Functions
// ============================================

/**
 * Publish agent execution event
 */
export async function publishAgentExecution(
  privateKey: Hex,
  input: AgentExecutionInput
): Promise<WriteResult> {
  try {
    const sdk = getWalletSDK(privateKey);
    const schemaId = await getSchemaId(SCHEMAS.AGENT_EXECUTION);
    const encoder = getSchemaEncoder(SCHEMAS.AGENT_EXECUTION);
    
    const encodedData = encoder.encodeData([
      { name: 'timestamp', value: Date.now().toString(), type: 'uint64' },
      { name: 'agentId', value: toBytes32(input.agentId), type: 'bytes32' },
      { name: 'executor', value: input.executor, type: 'address' },
      { name: 'functionSelector', value: toBytes32(input.functionSelector), type: 'bytes32' },
      { name: 'success', value: input.success, type: 'bool' },
      { name: 'gasUsed', value: input.gasUsed.toString(), type: 'uint256' },
      { name: 'errorMessage', value: input.errorMessage || '', type: 'string' },
    ]);
    
    const dataId = generateDataId('exec', `${input.agentId}-${Date.now()}`);
    
    // Publish with event emission for real-time updates
    const txHash = await sdk.streams.setAndEmitEvents(
      [{ id: dataId, schemaId, data: encodedData }],
      [{
        id: EVENT_SCHEMAS.AGENT_EXECUTED.id,
        argumentTopics: [toBytes32(input.agentId)],
        data: encodedData,
      }]
    );
    
    if (txHash instanceof Error) {
      return { success: false, error: txHash.message };
    }
    
    return { success: true, txHash: unwrapTxHash(txHash), dataId };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Publish chat message
 */
export async function publishChatMessage(
  privateKey: Hex,
  input: ChatMessageInput
): Promise<WriteResult> {
  try {
    const sdk = getWalletSDK(privateKey);
    const schemaId = await getSchemaId(SCHEMAS.CHAT_MESSAGE);
    const encoder = getSchemaEncoder(SCHEMAS.CHAT_MESSAGE);
    
    const encodedData = encoder.encodeData([
      { name: 'timestamp', value: Date.now().toString(), type: 'uint64' },
      { name: 'sessionId', value: toBytes32(input.sessionId), type: 'bytes32' },
      { name: 'sender', value: input.sender, type: 'address' },
      { name: 'agentId', value: toBytes32(input.agentId), type: 'bytes32' },
      { name: 'role', value: input.role, type: 'string' },
      { name: 'content', value: input.content, type: 'string' },
      { name: 'intentAction', value: input.intentAction || '', type: 'string' },
    ]);
    
    const dataId = generateDataId('chat', `${input.sessionId}-${Date.now()}`);
    
    // Publish with event emission
    const txHash = await sdk.streams.setAndEmitEvents(
      [{ id: dataId, schemaId, data: encodedData }],
      [{
        id: EVENT_SCHEMAS.CHAT_MESSAGE_SENT.id,
        argumentTopics: [toBytes32(input.sessionId)],
        data: encodedData,
      }]
    );
    
    if (txHash instanceof Error) {
      return { success: false, error: txHash.message };
    }
    
    return { success: true, txHash: unwrapTxHash(txHash), dataId };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Publish agent analytics snapshot
 */
export async function publishAgentAnalytics(
  privateKey: Hex,
  input: AgentAnalyticsInput
): Promise<WriteResult> {
  try {
    const sdk = getWalletSDK(privateKey);
    const schemaId = await getSchemaId(SCHEMAS.AGENT_ANALYTICS);
    const encoder = getSchemaEncoder(SCHEMAS.AGENT_ANALYTICS);
    
    const encodedData = encoder.encodeData([
      { name: 'timestamp', value: Date.now().toString(), type: 'uint64' },
      { name: 'agentId', value: toBytes32(input.agentId), type: 'bytes32' },
      { name: 'totalCalls', value: input.totalCalls.toString(), type: 'uint256' },
      { name: 'successCount', value: input.successCount.toString(), type: 'uint256' },
      { name: 'totalGasUsed', value: input.totalGasUsed.toString(), type: 'uint256' },
      { name: 'uniqueUsers', value: input.uniqueUsers.toString(), type: 'uint256' },
    ]);
    
    const dataId = generateDataId('analytics', `${input.agentId}-${Date.now()}`);
    
    const txHash = await sdk.streams.set([{ id: dataId, schemaId, data: encodedData }]);
    
    return { success: true, txHash: unwrapTxHash(txHash), dataId };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Publish transaction event
 */
export async function publishTransactionEvent(
  privateKey: Hex,
  input: TransactionEventInput
): Promise<WriteResult> {
  try {
    const sdk = getWalletSDK(privateKey);
    const schemaId = await getSchemaId(SCHEMAS.TRANSACTION_EVENT);
    const encoder = getSchemaEncoder(SCHEMAS.TRANSACTION_EVENT);
    
    const encodedData = encoder.encodeData([
      { name: 'timestamp', value: Date.now().toString(), type: 'uint64' },
      { name: 'txHash', value: toBytes32(input.txHash), type: 'bytes32' },
      { name: 'user', value: input.user, type: 'address' },
      { name: 'agentId', value: toBytes32(input.agentId), type: 'bytes32' },
      { name: 'action', value: input.action, type: 'string' },
      { name: 'status', value: input.status, type: 'string' },
      { name: 'gasUsed', value: input.gasUsed.toString(), type: 'uint256' },
    ]);
    
    const dataId = generateDataId('tx', input.txHash);
    
    const txHash = await sdk.streams.set([{ id: dataId, schemaId, data: encodedData }]);
    
    return { success: true, txHash: unwrapTxHash(txHash), dataId };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Publish activity feed item
 */
export async function publishActivityFeedItem(
  privateKey: Hex,
  input: ActivityFeedInput
): Promise<WriteResult> {
  try {
    const sdk = getWalletSDK(privateKey);
    const schemaId = await getSchemaId(SCHEMAS.ACTIVITY_FEED);
    const encoder = getSchemaEncoder(SCHEMAS.ACTIVITY_FEED);
    
    const metadataJson = JSON.stringify(input.metadata || {});
    
    const encodedData = encoder.encodeData([
      { name: 'timestamp', value: Date.now().toString(), type: 'uint64' },
      { name: 'entityId', value: toBytes32(input.entityId), type: 'bytes32' },
      { name: 'entityType', value: input.entityType, type: 'string' },
      { name: 'action', value: input.action, type: 'string' },
      { name: 'actor', value: input.actor, type: 'address' },
      { name: 'metadata', value: metadataJson, type: 'string' },
    ]);
    
    const dataId = generateDataId('activity', `${input.entityId}-${Date.now()}`);
    
    const txHash = await sdk.streams.set([{ id: dataId, schemaId, data: encodedData }]);
    
    return { success: true, txHash: unwrapTxHash(txHash), dataId };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Publish or update leaderboard entry
 */
export async function publishLeaderboardEntry(
  privateKey: Hex,
  input: LeaderboardInput
): Promise<WriteResult> {
  try {
    const sdk = getWalletSDK(privateKey);
    const schemaId = await getSchemaId(SCHEMAS.LEADERBOARD);
    const encoder = getSchemaEncoder(SCHEMAS.LEADERBOARD);
    
    const encodedData = encoder.encodeData([
      { name: 'timestamp', value: Date.now().toString(), type: 'uint64' },
      { name: 'agentId', value: toBytes32(input.agentId), type: 'bytes32' },
      { name: 'agentName', value: input.agentName, type: 'string' },
      { name: 'score', value: input.score.toString(), type: 'uint256' },
      { name: 'totalExecutions', value: input.totalExecutions.toString(), type: 'uint256' },
      { name: 'successRate', value: input.successRate.toString(), type: 'uint256' },
    ]);
    
    // Use agent ID as data ID for upsert behavior
    const dataId = toBytes32(input.agentId);
    
    const txHash = await sdk.streams.set([{ id: dataId, schemaId, data: encodedData }]);
    
    return { success: true, txHash: unwrapTxHash(txHash), dataId };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Batch publish multiple data streams in one transaction
 */
export async function batchPublish(
  privateKey: Hex,
  items: Array<{
    schema: keyof typeof SCHEMAS;
    data: Record<string, any>;
  }>
): Promise<WriteResult> {
  try {
    const sdk = getWalletSDK(privateKey);
    
    const dataStreams = await Promise.all(
      items.map(async (item) => {
        const schema = SCHEMAS[item.schema];
        const schemaId = await getSchemaId(schema);
        const encoder = getSchemaEncoder(schema);
        
        const fields = Object.entries(item.data).map(([name, value]) => ({
          name,
          value: typeof value === 'bigint' ? value.toString() : value,
          type: inferType(value),
        }));
        
        const encodedData = encoder.encodeData(fields);
        const dataId = generateDataId(item.schema.toLowerCase(), Date.now().toString());
        
        return { id: dataId, schemaId, data: encodedData };
      })
    );
    
    const txHash = await sdk.streams.set(dataStreams);
    
    return { success: true, txHash: unwrapTxHash(txHash) };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Helper to infer Solidity type from JS value
function inferType(value: any): string {
  if (typeof value === 'bigint') return 'uint256';
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') return 'uint256';
  if (typeof value === 'string') {
    if (value.startsWith('0x') && value.length === 42) return 'address';
    if (value.startsWith('0x') && value.length === 66) return 'bytes32';
    return 'string';
  }
  return 'string';
}
