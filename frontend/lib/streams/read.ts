/**
 * Somnia Data Streams - Read Operations
 * All read-only operations for fetching data from streams
 */

import {
    getPublicSDK,
    getSchemaId,
    getSchemaEncoder,
    parseDecodedData,
    type DecodedField,
    type Hex,
    type Address,
} from './client';
import { SCHEMAS, PUBLISHERS, STREAMS_CONFIG } from './config';

// ============================================
// Helper Functions
// ============================================

/**
 * Unwrap SDK result that may be T | Error
 */
function unwrapResult<T>(result: T | Error | null | undefined): T | null {
    if (result instanceof Error) return null;
    return result ?? null;
}

/**
 * Unwrap bigint result from SDK
 */
function unwrapBigInt(result: bigint | Error | null | undefined): bigint {
    if (result instanceof Error) return 0n;
    return result ?? 0n;
}

// ============================================
// Type Definitions
// ============================================

export interface AgentExecution {
    timestamp: number;
    agentId: string;
    executor: string;
    functionSelector: string;
    success: boolean;
    gasUsed: bigint;
    errorMessage: string;
}

export interface ChatMessageStream {
    timestamp: number;
    sessionId: string;
    sender: string;
    agentId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    intentAction: string;
}

export interface AgentAnalytics {
    timestamp: number;
    agentId: string;
    totalCalls: bigint;
    successCount: bigint;
    totalGasUsed: bigint;
    uniqueUsers: bigint;
}

export interface TransactionEvent {
    timestamp: number;
    txHash: string;
    user: string;
    agentId: string;
    action: string;
    status: string;
    gasUsed: bigint;
}

export interface ActivityFeedItem {
    timestamp: number;
    entityId: string;
    entityType: 'agent' | 'transaction' | 'chat' | 'user';
    action: string;
    actor: string;
    metadata: Record<string, any>;
}

export interface LeaderboardEntry {
    timestamp: number;
    agentId: string;
    agentName: string;
    score: bigint;
    totalExecutions: bigint;
    successRate: bigint;
}

// ============================================
// Read Functions
// ============================================

/**
 * Get latest agent execution for a publisher
 */
export async function getLatestAgentExecution(
    publisher: Address
): Promise<AgentExecution | null> {
    try {
        const sdk = getPublicSDK();
        const schemaId = await getSchemaId(SCHEMAS.AGENT_EXECUTION);

        const data = await sdk.streams.getLastPublishedDataForSchema(schemaId, publisher);
        if (!data || !Array.isArray(data) || data.length === 0) return null;

        const fields = (data[0] as any)?.data ?? data[0];
        return parseAgentExecution(fields as DecodedField[]);
    } catch (error) {
        console.error('Error fetching latest agent execution:', error);
        return null;
    }
}

/**
 * Get all agent executions for a publisher
 */
export async function getAllAgentExecutions(
    publisher: Address,
    limit?: number
): Promise<AgentExecution[]> {
    try {
        const sdk = getPublicSDK();
        const schemaId = await getSchemaId(SCHEMAS.AGENT_EXECUTION);

        const data = await sdk.streams.getAllPublisherDataForSchema(schemaId, publisher);
        if (!data || !Array.isArray(data)) return [];

        const executions = data
            .map((item: any) => {
                const fields = item?.data ?? item;
                return parseAgentExecution(fields as DecodedField[]);
            })
            .filter((e): e is AgentExecution => e !== null);

        return limit ? executions.slice(0, limit) : executions;
    } catch (error) {
        console.error('Error fetching agent executions:', error);
        return [];
    }
}

/**
 * Get agent executions in a range (for pagination)
 */
export async function getAgentExecutionsInRange(
    publisher: Address,
    startIndex: bigint,
    endIndex: bigint
): Promise<AgentExecution[]> {
    try {
        const sdk = getPublicSDK();
        const schemaId = await getSchemaId(SCHEMAS.AGENT_EXECUTION);

        const data = await sdk.streams.getBetweenRange(schemaId, publisher, startIndex, endIndex);
        if (!data || data instanceof Error || !Array.isArray(data)) return [];

        return data
            .map((item: any) => {
                const fields = item?.data ?? item;
                return parseAgentExecution(fields as DecodedField[]);
            })
            .filter((e): e is AgentExecution => e !== null);
    } catch (error) {
        console.error('Error fetching agent executions in range:', error);
        return [];
    }
}

/**
 * Get chat messages for a session
 */
export async function getChatMessages(
    publisher: Address,
    sessionId?: string
): Promise<ChatMessageStream[]> {
    try {
        const sdk = getPublicSDK();
        const schemaId = await getSchemaId(SCHEMAS.CHAT_MESSAGE);

        const data = await sdk.streams.getAllPublisherDataForSchema(schemaId, publisher);
        if (!data || !Array.isArray(data)) return [];

        let messages = data
            .map((item: any) => {
                const fields = item?.data ?? item;
                return parseChatMessage(fields as DecodedField[]);
            })
            .filter((m): m is ChatMessageStream => m !== null);

        // Filter by session if provided
        if (sessionId) {
            const targetSessionId = sessionId.toLowerCase();
            messages = messages.filter(m =>
                m.sessionId.toLowerCase() === targetSessionId
            );
        }

        // Sort by timestamp
        return messages.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        return [];
    }
}

/**
 * Get latest chat messages (for real-time updates)
 */
export async function getLatestChatMessages(
    publisher: Address,
    limit: number = 10
): Promise<ChatMessageStream[]> {
    try {
        const sdk = getPublicSDK();
        const schemaId = await getSchemaId(SCHEMAS.CHAT_MESSAGE);

        const rawTotal = await sdk.streams.totalPublisherDataForSchema(schemaId, publisher);
        const total = unwrapBigInt(rawTotal);
        if (total === 0n) return [];

        const startIndex = total > BigInt(limit) ? total - BigInt(limit) : 0n;
        const data = await sdk.streams.getBetweenRange(schemaId, publisher, startIndex, total);

        if (!data || data instanceof Error || !Array.isArray(data)) return [];

        return data
            .map((item: any) => {
                const fields = item?.data ?? item;
                return parseChatMessage(fields as DecodedField[]);
            })
            .filter((m): m is ChatMessageStream => m !== null)
            .sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
        console.error('Error fetching latest chat messages:', error);
        return [];
    }
}

/**
 * Get agent analytics
 */
export async function getAgentAnalytics(
    publisher: Address,
    agentId?: string
): Promise<AgentAnalytics[]> {
    try {
        const sdk = getPublicSDK();
        const schemaId = await getSchemaId(SCHEMAS.AGENT_ANALYTICS);

        const data = await sdk.streams.getAllPublisherDataForSchema(schemaId, publisher);
        if (!data || !Array.isArray(data)) return [];

        let analytics = data
            .map((item: any) => {
                const fields = item?.data ?? item;
                return parseAgentAnalytics(fields as DecodedField[]);
            })
            .filter((a): a is AgentAnalytics => a !== null);

        // Filter by agent if provided
        if (agentId) {
            analytics = analytics.filter(a => a.agentId === agentId);
        }

        return analytics;
    } catch (error) {
        console.error('Error fetching agent analytics:', error);
        return [];
    }
}

/**
 * Get activity feed
 */
export async function getActivityFeed(
    publisher: Address,
    limit: number = 50
): Promise<ActivityFeedItem[]> {
    try {
        const sdk = getPublicSDK();
        const schemaId = await getSchemaId(SCHEMAS.ACTIVITY_FEED);

        const rawTotal = await sdk.streams.totalPublisherDataForSchema(schemaId, publisher);
        const total = unwrapBigInt(rawTotal);
        if (total === 0n) return [];

        const startIndex = total > BigInt(limit) ? total - BigInt(limit) : 0n;
        const data = await sdk.streams.getBetweenRange(schemaId, publisher, startIndex, total);

        if (!data || data instanceof Error || !Array.isArray(data)) return [];

        return data
            .map((item: any) => {
                const fields = item?.data ?? item;
                return parseActivityFeedItem(fields as DecodedField[]);
            })
            .filter((a): a is ActivityFeedItem => a !== null)
            .sort((a, b) => b.timestamp - a.timestamp); // Newest first
    } catch (error) {
        console.error('Error fetching activity feed:', error);
        return [];
    }
}

/**
 * Get leaderboard entries
 */
export async function getLeaderboard(
    publisher: Address,
    limit: number = 10
): Promise<LeaderboardEntry[]> {
    try {
        const sdk = getPublicSDK();
        const schemaId = await getSchemaId(SCHEMAS.LEADERBOARD);

        const data = await sdk.streams.getAllPublisherDataForSchema(schemaId, publisher);
        if (!data || !Array.isArray(data)) return [];

        const entries = data
            .map((item: any) => {
                const fields = item?.data ?? item;
                return parseLeaderboardEntry(fields as DecodedField[]);
            })
            .filter((e): e is LeaderboardEntry => e !== null);

        // Sort by score descending and limit
        return entries
            .sort((a, b) => Number(b.score - a.score))
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

/**
 * Get total record count for a schema
 */
export async function getRecordCount(
    schema: keyof typeof SCHEMAS,
    publisher: Address
): Promise<number> {
    try {
        const sdk = getPublicSDK();
        const schemaId = await getSchemaId(SCHEMAS[schema]);
        const rawTotal = await sdk.streams.totalPublisherDataForSchema(schemaId, publisher);
        const total = unwrapBigInt(rawTotal);
        return Number(total);
    } catch (error) {
        console.error('Error fetching record count:', error);
        return 0;
    }
}

// ============================================
// Parser Functions
// ============================================

function parseAgentExecution(fields: DecodedField[]): AgentExecution | null {
    if (!fields || fields.length === 0) return null;

    try {
        const getValue = (name: string) => {
            const field = fields.find(f => f.name === name);
            return field?.value?.value ?? field?.value;
        };

        return {
            timestamp: Number(getValue('timestamp')),
            agentId: String(getValue('agentId')),
            executor: String(getValue('executor')),
            functionSelector: String(getValue('functionSelector')),
            success: Boolean(getValue('success')),
            gasUsed: BigInt(getValue('gasUsed') || 0),
            errorMessage: String(getValue('errorMessage') || ''),
        };
    } catch {
        return null;
    }
}

function parseChatMessage(fields: DecodedField[]): ChatMessageStream | null {
    if (!fields || fields.length === 0) return null;

    try {
        const getValue = (name: string) => {
            const field = fields.find(f => f.name === name);
            return field?.value?.value ?? field?.value;
        };

        return {
            timestamp: Number(getValue('timestamp')),
            sessionId: String(getValue('sessionId')),
            sender: String(getValue('sender')),
            agentId: String(getValue('agentId')),
            role: getValue('role') as 'user' | 'assistant' | 'system',
            content: String(getValue('content')),
            intentAction: String(getValue('intentAction') || ''),
        };
    } catch {
        return null;
    }
}

function parseAgentAnalytics(fields: DecodedField[]): AgentAnalytics | null {
    if (!fields || fields.length === 0) return null;

    try {
        const getValue = (name: string) => {
            const field = fields.find(f => f.name === name);
            return field?.value?.value ?? field?.value;
        };

        return {
            timestamp: Number(getValue('timestamp')),
            agentId: String(getValue('agentId')),
            totalCalls: BigInt(getValue('totalCalls') || 0),
            successCount: BigInt(getValue('successCount') || 0),
            totalGasUsed: BigInt(getValue('totalGasUsed') || 0),
            uniqueUsers: BigInt(getValue('uniqueUsers') || 0),
        };
    } catch {
        return null;
    }
}

function parseActivityFeedItem(fields: DecodedField[]): ActivityFeedItem | null {
    if (!fields || fields.length === 0) return null;

    try {
        const getValue = (name: string) => {
            const field = fields.find(f => f.name === name);
            return field?.value?.value ?? field?.value;
        };

        let metadata: Record<string, any> = {};
        try {
            metadata = JSON.parse(String(getValue('metadata') || '{}'));
        } catch {
            metadata = {};
        }

        return {
            timestamp: Number(getValue('timestamp')),
            entityId: String(getValue('entityId')),
            entityType: getValue('entityType') as 'agent' | 'transaction' | 'chat' | 'user',
            action: String(getValue('action')),
            actor: String(getValue('actor')),
            metadata,
        };
    } catch {
        return null;
    }
}

function parseLeaderboardEntry(fields: DecodedField[]): LeaderboardEntry | null {
    if (!fields || fields.length === 0) return null;

    try {
        const getValue = (name: string) => {
            const field = fields.find(f => f.name === name);
            return field?.value?.value ?? field?.value;
        };

        return {
            timestamp: Number(getValue('timestamp')),
            agentId: String(getValue('agentId')),
            agentName: String(getValue('agentName')),
            score: BigInt(getValue('score') || 0),
            totalExecutions: BigInt(getValue('totalExecutions') || 0),
            successRate: BigInt(getValue('successRate') || 0),
        };
    } catch {
        return null;
    }
}
