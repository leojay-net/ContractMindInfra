/**
 * Somnia Data Streams Configuration
 * Configuration and chain setup for data streams integration
 */

import { defineChain } from 'viem';

// Somnia Testnet Chain Configuration
export const somniaTestnet = defineChain({
    id: 50312,
    name: 'Somnia Testnet',
    network: 'somnia-testnet',
    nativeCurrency: {
        name: 'STT',
        symbol: 'STT',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ['https://dream-rpc.somnia.network'] },
        public: { http: ['https://dream-rpc.somnia.network'] },
    },
    blockExplorers: {
        default: {
            name: 'Somnia Explorer',
            url: 'https://somnia-testnet.socialscan.io',
        },
    },
});

// Data Streams Schema Definitions
export const SCHEMAS = {
    // Agent execution events
    AGENT_EXECUTION: 'uint64 timestamp, bytes32 agentId, address executor, bytes32 functionSelector, bool success, uint256 gasUsed, string errorMessage',

    // Chat messages for on-chain storage
    CHAT_MESSAGE: 'uint64 timestamp, bytes32 sessionId, address sender, bytes32 agentId, string role, string content, string intentAction',

    // Agent analytics stream
    AGENT_ANALYTICS: 'uint64 timestamp, bytes32 agentId, uint256 totalCalls, uint256 successCount, uint256 totalGasUsed, uint256 uniqueUsers',

    // Transaction events
    TRANSACTION_EVENT: 'uint64 timestamp, bytes32 txHash, address user, bytes32 agentId, string action, string status, uint256 gasUsed',

    // Real-time activity feed
    ACTIVITY_FEED: 'uint64 timestamp, bytes32 entityId, string entityType, string action, address actor, string metadata',

    // Leaderboard entries
    LEADERBOARD: 'uint64 timestamp, bytes32 agentId, string agentName, uint256 score, uint256 totalExecutions, uint256 successRate',
} as const;

// Event Schema Definitions (for real-time subscriptions)
export const EVENT_SCHEMAS = {
    // New agent execution event
    AGENT_EXECUTED: {
        id: 'AgentExecuted',
        params: [
            { name: 'agentId', paramType: 'bytes32', isIndexed: true },
            { name: 'executor', paramType: 'address', isIndexed: true },
            { name: 'success', paramType: 'bool', isIndexed: false },
        ],
        eventTopic: 'AgentExecuted(bytes32 indexed agentId, address indexed executor, bool success)',
    },

    // New chat message event
    CHAT_MESSAGE_SENT: {
        id: 'ChatMessageSent',
        params: [
            { name: 'sessionId', paramType: 'bytes32', isIndexed: true },
            { name: 'sender', paramType: 'address', isIndexed: true },
        ],
        eventTopic: 'ChatMessageSent(bytes32 indexed sessionId, address indexed sender)',
    },

    // Agent status update event
    AGENT_STATUS_UPDATED: {
        id: 'AgentStatusUpdated',
        params: [
            { name: 'agentId', paramType: 'bytes32', isIndexed: true },
            { name: 'status', paramType: 'string', isIndexed: false },
        ],
        eventTopic: 'AgentStatusUpdated(bytes32 indexed agentId, string status)',
    },
} as const;

// Publisher addresses (your backend service addresses)
export const PUBLISHERS = {
    // Main ContractMind publisher for analytics
    ANALYTICS: process.env.NEXT_PUBLIC_STREAMS_ANALYTICS_PUBLISHER || '',
    // Chat service publisher
    CHAT: process.env.NEXT_PUBLIC_STREAMS_CHAT_PUBLISHER || '',
    // Activity feed publisher
    ACTIVITY: process.env.NEXT_PUBLIC_STREAMS_ACTIVITY_PUBLISHER || '',
} as const;

// Configuration for data streams behavior
export const STREAMS_CONFIG = {
    // Polling intervals (in milliseconds)
    POLLING_INTERVAL: {
        ANALYTICS: 10000, // 10 seconds
        CHAT: 3000, // 3 seconds
        ACTIVITY: 5000, // 5 seconds
        LEADERBOARD: 30000, // 30 seconds
    },

    // Batch sizes for data fetching
    BATCH_SIZE: {
        CHAT_MESSAGES: 50,
        ACTIVITY_ITEMS: 100,
        ANALYTICS_ENTRIES: 1000,
    },

    // Cache TTL (in seconds)
    CACHE_TTL: {
        SCHEMA_INFO: 3600, // 1 hour
        ANALYTICS: 60, // 1 minute
        LEADERBOARD: 300, // 5 minutes
    },
} as const;

export type SchemaType = keyof typeof SCHEMAS;
export type EventSchemaType = keyof typeof EVENT_SCHEMAS;
