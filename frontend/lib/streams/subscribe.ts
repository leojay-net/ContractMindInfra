/**
 * Somnia Data Streams - Real-time Subscriptions
 * WebSocket-based subscriptions for real-time data updates
 */

import {
    getWebSocketSDK,
    getSchemaId,
    toBytes32,
    type Hex,
    type Address,
} from './client';
import { SCHEMAS, EVENT_SCHEMAS, STREAMS_CONFIG } from './config';
import type {
    AgentExecution,
    ChatMessageStream,
    ActivityFeedItem
} from './read';

// ============================================
// Subscription Types
// ============================================

export interface SubscriptionHandle {
    subscriptionId: string;
    unsubscribe: () => void;
}

export interface SubscriptionOptions {
    onData: (data: any) => void;
    onError?: (error: Error) => void;
    onlyPushChanges?: boolean;
}

export interface AgentExecutionSubscriptionOptions extends SubscriptionOptions {
    agentId?: string;
    onData: (data: AgentExecution) => void;
}

export interface ChatMessageSubscriptionOptions extends SubscriptionOptions {
    sessionId?: string;
    onData: (data: ChatMessageStream) => void;
}

export interface ActivityFeedSubscriptionOptions extends SubscriptionOptions {
    entityType?: 'agent' | 'transaction' | 'chat' | 'user';
    onData: (data: ActivityFeedItem) => void;
}

// ============================================
// Active Subscriptions Registry
// ============================================

const activeSubscriptions: Map<string, SubscriptionHandle> = new Map();

/**
 * Get all active subscriptions
 */
export function getActiveSubscriptions(): string[] {
    return Array.from(activeSubscriptions.keys());
}

/**
 * Unsubscribe from all active subscriptions
 */
export function unsubscribeAll(): void {
    for (const handle of activeSubscriptions.values()) {
        handle.unsubscribe();
    }
    activeSubscriptions.clear();
}

// ============================================
// Subscription Functions
// ============================================

/**
 * Subscribe to agent execution events
 */
export async function subscribeToAgentExecutions(
    options: AgentExecutionSubscriptionOptions
): Promise<SubscriptionHandle | null> {
    try {
        const sdk = getWebSocketSDK();

        const result = await sdk.streams.subscribe({
            somniaStreamsEventId: EVENT_SCHEMAS.AGENT_EXECUTED.id,
            ethCalls: [],
            onData: (rawData: any) => {
                try {
                    const execution = parseAgentExecutionFromEvent(rawData);
                    if (execution) {
                        // Filter by agentId if specified
                        if (options.agentId && execution.agentId !== options.agentId) {
                            return;
                        }
                        options.onData(execution);
                    }
                } catch (error) {
                    options.onError?.(error as Error);
                }
            },
            onError: options.onError,
            onlyPushChanges: options.onlyPushChanges ?? true,
        });

        if (result && !(result instanceof Error)) {
            activeSubscriptions.set(result.subscriptionId, result);
            return result;
        }

        return null;
    } catch (error) {
        options.onError?.(error as Error);
        return null;
    }
}

/**
 * Subscribe to chat messages
 */
export async function subscribeToChatMessages(
    options: ChatMessageSubscriptionOptions
): Promise<SubscriptionHandle | null> {
    try {
        const sdk = getWebSocketSDK();

        const topicOverrides = options.sessionId
            ? [toBytes32(options.sessionId)]
            : undefined;

        const result = await sdk.streams.subscribe({
            somniaStreamsEventId: EVENT_SCHEMAS.CHAT_MESSAGE_SENT.id,
            ethCalls: [],
            topicOverrides,
            onData: (rawData: any) => {
                try {
                    const message = parseChatMessageFromEvent(rawData);
                    if (message) {
                        options.onData(message);
                    }
                } catch (error) {
                    options.onError?.(error as Error);
                }
            },
            onError: options.onError,
            onlyPushChanges: options.onlyPushChanges ?? true,
        });

        if (result && !(result instanceof Error)) {
            activeSubscriptions.set(result.subscriptionId, result);
            return result;
        }

        return null;
    } catch (error) {
        options.onError?.(error as Error);
        return null;
    }
}

/**
 * Subscribe to agent status updates
 */
export async function subscribeToAgentStatus(
    agentId: string,
    options: SubscriptionOptions
): Promise<SubscriptionHandle | null> {
    try {
        const sdk = getWebSocketSDK();

        const result = await sdk.streams.subscribe({
            somniaStreamsEventId: EVENT_SCHEMAS.AGENT_STATUS_UPDATED.id,
            ethCalls: [],
            topicOverrides: [toBytes32(agentId)],
            onData: options.onData,
            onError: options.onError,
            onlyPushChanges: options.onlyPushChanges ?? true,
        });

        if (result && !(result instanceof Error)) {
            activeSubscriptions.set(result.subscriptionId, result);
            return result;
        }

        return null;
    } catch (error) {
        options.onError?.(error as Error);
        return null;
    }
}

/**
 * Subscribe to custom contract events
 * Useful for monitoring ContractMind Hub events
 */
export async function subscribeToContractEvents(
    contractAddress: Address,
    eventTopics: Hex[],
    options: SubscriptionOptions
): Promise<SubscriptionHandle | null> {
    try {
        const sdk = getWebSocketSDK();

        const result = await sdk.streams.subscribe({
            ethCalls: [],
            eventContractSources: [contractAddress],
            topicOverrides: eventTopics,
            onData: options.onData,
            onError: options.onError,
            onlyPushChanges: options.onlyPushChanges ?? false,
        });

        if (result && !(result instanceof Error)) {
            activeSubscriptions.set(result.subscriptionId, result);
            return result;
        }

        return null;
    } catch (error) {
        options.onError?.(error as Error);
        return null;
    }
}

/**
 * Subscribe with enriched data from on-chain calls
 * Executes eth_calls when events are triggered
 */
export async function subscribeWithEnrichment(
    eventId: string,
    ethCalls: Array<{ to: Address; data: Hex }>,
    options: SubscriptionOptions
): Promise<SubscriptionHandle | null> {
    try {
        const sdk = getWebSocketSDK();

        const result = await sdk.streams.subscribe({
            somniaStreamsEventId: eventId,
            ethCalls,
            onData: options.onData,
            onError: options.onError,
            onlyPushChanges: options.onlyPushChanges ?? true,
        });

        if (result && !(result instanceof Error)) {
            activeSubscriptions.set(result.subscriptionId, result);
            return result;
        }

        return null;
    } catch (error) {
        options.onError?.(error as Error);
        return null;
    }
}

// ============================================
// Polling-based Subscriptions (Fallback)
// ============================================

interface PollingSubscription {
    intervalId: NodeJS.Timeout;
    unsubscribe: () => void;
}

const pollingSubscriptions: Map<string, PollingSubscription> = new Map();

/**
 * Poll for latest agent executions (fallback when WebSocket unavailable)
 */
export function pollAgentExecutions(
    publisher: Address,
    interval: number = STREAMS_CONFIG.POLLING_INTERVAL.ANALYTICS,
    onData: (executions: AgentExecution[]) => void,
    onError?: (error: Error) => void
): PollingSubscription {
    let lastCount = 0;

    const poll = async () => {
        try {
            const { getAllAgentExecutions, getRecordCount } = await import('./read');
            const currentCount = await getRecordCount('AGENT_EXECUTION', publisher);

            if (currentCount > lastCount) {
                const newExecutions = await getAllAgentExecutions(publisher, currentCount - lastCount);
                onData(newExecutions);
                lastCount = currentCount;
            }
        } catch (error) {
            onError?.(error as Error);
        }
    };

    // Initial poll
    poll();

    const intervalId = setInterval(poll, interval);
    const subscriptionId = `poll-exec-${Date.now()}`;

    const subscription: PollingSubscription = {
        intervalId,
        unsubscribe: () => {
            clearInterval(intervalId);
            pollingSubscriptions.delete(subscriptionId);
        },
    };

    pollingSubscriptions.set(subscriptionId, subscription);
    return subscription;
}

/**
 * Poll for chat messages (fallback when WebSocket unavailable)
 */
export function pollChatMessages(
    publisher: Address,
    sessionId: string,
    interval: number = STREAMS_CONFIG.POLLING_INTERVAL.CHAT,
    onData: (messages: ChatMessageStream[]) => void,
    onError?: (error: Error) => void
): PollingSubscription {
    let lastMessageTime = 0;

    const poll = async () => {
        try {
            const { getChatMessages } = await import('./read');
            const messages = await getChatMessages(publisher, sessionId);

            const newMessages = messages.filter(m => m.timestamp > lastMessageTime);
            if (newMessages.length > 0) {
                onData(newMessages);
                lastMessageTime = Math.max(...newMessages.map(m => m.timestamp));
            }
        } catch (error) {
            onError?.(error as Error);
        }
    };

    // Initial poll
    poll();

    const intervalId = setInterval(poll, interval);
    const subscriptionId = `poll-chat-${sessionId}-${Date.now()}`;

    const subscription: PollingSubscription = {
        intervalId,
        unsubscribe: () => {
            clearInterval(intervalId);
            pollingSubscriptions.delete(subscriptionId);
        },
    };

    pollingSubscriptions.set(subscriptionId, subscription);
    return subscription;
}

/**
 * Poll for activity feed updates
 */
export function pollActivityFeed(
    publisher: Address,
    interval: number = STREAMS_CONFIG.POLLING_INTERVAL.ACTIVITY,
    onData: (items: ActivityFeedItem[]) => void,
    onError?: (error: Error) => void
): PollingSubscription {
    let lastTimestamp = 0;

    const poll = async () => {
        try {
            const { getActivityFeed } = await import('./read');
            const items = await getActivityFeed(publisher, 20);

            const newItems = items.filter(i => i.timestamp > lastTimestamp);
            if (newItems.length > 0) {
                onData(newItems);
                lastTimestamp = Math.max(...newItems.map(i => i.timestamp));
            }
        } catch (error) {
            onError?.(error as Error);
        }
    };

    // Initial poll
    poll();

    const intervalId = setInterval(poll, interval);
    const subscriptionId = `poll-activity-${Date.now()}`;

    const subscription: PollingSubscription = {
        intervalId,
        unsubscribe: () => {
            clearInterval(intervalId);
            pollingSubscriptions.delete(subscriptionId);
        },
    };

    pollingSubscriptions.set(subscriptionId, subscription);
    return subscription;
}

/**
 * Unsubscribe from all polling subscriptions
 */
export function unsubscribeAllPolling(): void {
    for (const sub of pollingSubscriptions.values()) {
        sub.unsubscribe();
    }
    pollingSubscriptions.clear();
}

// ============================================
// Event Parsers
// ============================================

function parseAgentExecutionFromEvent(rawData: any): AgentExecution | null {
    try {
        // Extract from event data structure
        const data = rawData?.data || rawData;

        return {
            timestamp: Number(data.timestamp || Date.now()),
            agentId: String(data.agentId || ''),
            executor: String(data.executor || ''),
            functionSelector: String(data.functionSelector || ''),
            success: Boolean(data.success),
            gasUsed: BigInt(data.gasUsed || 0),
            errorMessage: String(data.errorMessage || ''),
        };
    } catch {
        return null;
    }
}

function parseChatMessageFromEvent(rawData: any): ChatMessageStream | null {
    try {
        const data = rawData?.data || rawData;

        return {
            timestamp: Number(data.timestamp || Date.now()),
            sessionId: String(data.sessionId || ''),
            sender: String(data.sender || ''),
            agentId: String(data.agentId || ''),
            role: (data.role || 'user') as 'user' | 'assistant' | 'system',
            content: String(data.content || ''),
            intentAction: String(data.intentAction || ''),
        };
    } catch {
        return null;
    }
}
