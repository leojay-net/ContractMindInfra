/**
 * Somnia Data Streams - Main Export
 * Public API for the streams integration
 */

// Configuration
export {
    somniaTestnet,
    SCHEMAS,
    EVENT_SCHEMAS,
    PUBLISHERS,
    STREAMS_CONFIG,
    type SchemaType,
    type EventSchemaType,
} from './config';

// Client utilities
export {
    getPublicSDK,
    getWalletSDK,
    getWebSocketSDK,
    getSchemaId,
    getSchemaEncoder,
    generateDataId,
    toBytes32,
    extractFieldValue,
    parseDecodedData,
    isSchemaRegistered,
    getSchemaInfo,
    SDK,
    SchemaEncoder,
    zeroBytes32,
    type Hex,
    type Address,
    type DecodedField,
} from './client';

// Read operations
export {
    getLatestAgentExecution,
    getAllAgentExecutions,
    getAgentExecutionsInRange,
    getChatMessages,
    getLatestChatMessages,
    getAgentAnalytics,
    getActivityFeed,
    getLeaderboard,
    getRecordCount,
    type AgentExecution,
    type ChatMessageStream,
    type AgentAnalytics,
    type TransactionEvent,
    type ActivityFeedItem,
    type LeaderboardEntry,
} from './read';

// Write operations
export {
    registerAllSchemas,
    registerEventSchemas,
    publishAgentExecution,
    publishChatMessage,
    publishAgentAnalytics,
    publishTransactionEvent,
    publishActivityFeedItem,
    publishLeaderboardEntry,
    batchPublish,
    type WriteResult,
    type AgentExecutionInput,
    type ChatMessageInput,
    type AgentAnalyticsInput,
    type TransactionEventInput,
    type ActivityFeedInput,
    type LeaderboardInput,
} from './write';

// Subscriptions
export {
    subscribeToAgentExecutions,
    subscribeToChatMessages,
    subscribeToAgentStatus,
    subscribeToContractEvents,
    subscribeWithEnrichment,
    pollAgentExecutions,
    pollChatMessages,
    pollActivityFeed,
    getActiveSubscriptions,
    unsubscribeAll,
    unsubscribeAllPolling,
    type SubscriptionHandle,
    type SubscriptionOptions,
    type AgentExecutionSubscriptionOptions,
    type ChatMessageSubscriptionOptions,
    type ActivityFeedSubscriptionOptions,
} from './subscribe';

// React hooks
export {
    useStreamData,
    useLatestAgentExecution,
    useAgentExecutions,
    useRealtimeAgentExecutions,
    useChatMessages,
    useLatestChatMessages,
    useAgentAnalytics,
    useAgentAnalyticsSummary,
    useActivityFeed,
    useLeaderboard,
    useRecordCount,
    useStreamConnectionStatus,
} from './hooks';
