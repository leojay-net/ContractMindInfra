/**
 * Application-wide TypeScript type definitions
 * Matches backend API schemas from ContractMind documentation
 */

// ============================================================================
// BLOCKCHAIN TYPES
// ============================================================================

export interface ChainConfig {
    id: number;
    name: string;
    rpcUrl: string;
    rpcUrls: {
        default: {
            http: string[];
        };
    };
    blockExplorer: string;
    blockExplorers?: {
        default: {
            name: string;
            url: string;
        };
    };
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
}

// ============================================================================
// AGENT TYPES
// ============================================================================

export interface Agent {
    id: string; // bytes32 agentId
    owner: string; // address
    targetContract: string; // address
    name: string;
    description?: string; // Optional description
    configIPFS: string;
    active: boolean;
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
    functions?: AgentFunction[];
    analytics?: AgentAnalytics;
}

export interface AgentFunction {
    name: string;
    inputs: FunctionInput[];
    outputs: FunctionOutput[];
    stateMutability: 'view' | 'pure' | 'nonpayable' | 'payable';
    authorized: boolean;
}

export interface FunctionInput {
    name: string;
    type: string;
    internalType?: string;
}

export interface FunctionOutput {
    name: string;
    type: string;
    internalType?: string;
}

export interface AgentAnalytics {
    totalCalls: number;
    uniqueUsers: number;
    totalGasUsed: string;
    avgGasPerCall: string;
    successRate: number;
    topFunctions?: {
        name: string;
        calls: number;
        percentage: number;
    }[];
    usageOverTime?: {
        date: string;
        calls: number;
        uniqueUsers: number;
    }[];
    userRetention?: {
        day1: number;
        day7: number;
        day30: number;
    };
}

export interface CreateAgentRequest {
    ownerAddress: string;
    targetContract: string;
    name: string;
    abi: any[]; // JSON ABI
    personality?: string;
    domainKnowledge?: string;
}

//============================================================================
// CHAT TYPES
// ============================================================================

export interface ChatMessage {
    id: string;
    role: 'user' | 'agent' | 'system';
    content: string;
    timestamp: string;
    requiresTransaction?: boolean;
    transaction?: PreparedTransaction;
    data?: Record<string, any>;
}

export interface PreparedTransaction {
    to: string;
    data: string;
    value: string;
    gasEstimate: string;
    explanation: string;
    functionName: string;
    warnings?: string[];
}

export interface SendMessageRequest {
    message: string;
    userAddress: string;
}

export interface SendMessageResponse {
    success: boolean;
    response: string;
    requiresTransaction: boolean;
    transaction?: PreparedTransaction;
    data?: Record<string, any>;
}

export interface ConfirmTransactionRequest {
    txHash: string;
    userAddress: string;
}

export interface ConfirmTransactionResponse {
    success: boolean;
    response: string;
    txHash: string;
    blockNumber: string;
    gasUsed: string;
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export interface Transaction {
    hash: string;
    agentId: string;
    user: string;
    targetContract: string;
    functionName: string;
    success: boolean;
    gasUsed: string;
    timestamp: string;
    blockNumber: string;
}

export interface ExecutionResult {
    success: boolean;
    txHash?: string;
    blockNumber?: string;
    gasUsed?: string;
    error?: string;
    data?: any;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
    details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
    address: string;
    agents: Agent[];
    createdAt: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface DashboardStats {
    totalAgents: number;
    activeAgents: number;
    totalCalls: number;
    totalUsers: number;
    avgResponseTime: number;
}

export interface UsageMetrics {
    period: 'day' | 'week' | 'month';
    data: {
        date: string;
        calls: number;
        users: number;
        gasUsed: string;
    }[];
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface AgentFormData {
    name: string;
    targetContract: string;
    abiFile?: File;
    abiJson?: string;
    personality: string;
    domainKnowledge: string;
    functions: string[]; // selected function names to authorize
}
