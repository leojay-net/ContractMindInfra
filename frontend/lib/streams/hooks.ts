/**
 * Somnia Data Streams - React Hooks
 * Custom React hooks for easy integration with components
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Address } from 'viem';
import { PUBLISHERS, STREAMS_CONFIG } from './config';
import type {
    AgentExecution,
    ChatMessageStream,
    AgentAnalytics,
    ActivityFeedItem,
    LeaderboardEntry,
} from './read';
import {
    getLatestAgentExecution,
    getAllAgentExecutions,
    getChatMessages,
    getLatestChatMessages,
    getAgentAnalytics,
    getActivityFeed,
    getLeaderboard,
    getRecordCount,
} from './read';
import {
    pollAgentExecutions,
    pollChatMessages,
    pollActivityFeed,
} from './subscribe';

// ============================================
// Hook Types
// ============================================

interface UseStreamDataOptions {
    publisher?: Address;
    pollingInterval?: number;
    enabled?: boolean;
}

interface UseStreamDataResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

interface UseChatMessagesOptions extends UseStreamDataOptions {
    sessionId?: string;
    realtime?: boolean;
}

interface UseActivityFeedOptions extends UseStreamDataOptions {
    limit?: number;
    realtime?: boolean;
}

// ============================================
// Generic Stream Data Hook
// ============================================

/**
 * Generic hook for fetching stream data with auto-refresh
 */
export function useStreamData<T>(
    fetcher: (publisher: Address) => Promise<T>,
    options: UseStreamDataOptions = {}
): UseStreamDataResult<T> {
    const {
        publisher = PUBLISHERS.ANALYTICS as Address,
        pollingInterval,
        enabled = true,
    } = options;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!publisher || !enabled) return;

        try {
            setLoading(true);
            setError(null);
            const result = await fetcher(publisher);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [fetcher, publisher, enabled]);

    useEffect(() => {
        fetchData();

        if (pollingInterval && pollingInterval > 0) {
            const interval = setInterval(fetchData, pollingInterval);
            return () => clearInterval(interval);
        }
    }, [fetchData, pollingInterval]);

    return { data, loading, error, refetch: fetchData };
}

// ============================================
// Agent Execution Hooks
// ============================================

/**
 * Hook for latest agent execution
 */
export function useLatestAgentExecution(
    options: UseStreamDataOptions = {}
): UseStreamDataResult<AgentExecution | null> {
    return useStreamData(getLatestAgentExecution, {
        ...options,
        pollingInterval: options.pollingInterval ?? STREAMS_CONFIG.POLLING_INTERVAL.ANALYTICS,
    });
}

/**
 * Hook for all agent executions
 */
export function useAgentExecutions(
    limit?: number,
    options: UseStreamDataOptions = {}
): UseStreamDataResult<AgentExecution[]> {
    const fetcher = useCallback(
        (publisher: Address) => getAllAgentExecutions(publisher, limit),
        [limit]
    );

    return useStreamData(fetcher, options);
}

/**
 * Hook for real-time agent executions with polling
 */
export function useRealtimeAgentExecutions(
    options: UseStreamDataOptions = {}
): {
    executions: AgentExecution[];
    loading: boolean;
    error: Error | null;
} {
    const publisher = (options.publisher || PUBLISHERS.ANALYTICS) as Address;
    const [executions, setExecutions] = useState<AgentExecution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

    useEffect(() => {
        if (!publisher || options.enabled === false) return;

        setLoading(true);

        subscriptionRef.current = pollAgentExecutions(
            publisher,
            options.pollingInterval ?? STREAMS_CONFIG.POLLING_INTERVAL.ANALYTICS,
            (newExecutions) => {
                setExecutions((prev) => [...newExecutions, ...prev].slice(0, 100));
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => {
            subscriptionRef.current?.unsubscribe();
        };
    }, [publisher, options.enabled, options.pollingInterval]);

    return { executions, loading, error };
}

// ============================================
// Chat Message Hooks
// ============================================

/**
 * Hook for chat messages in a session
 */
export function useChatMessages(
    options: UseChatMessagesOptions = {}
): UseStreamDataResult<ChatMessageStream[]> & { addMessage: (msg: ChatMessageStream) => void } {
    const { sessionId, realtime = false, ...restOptions } = options;
    const publisher = (restOptions.publisher || PUBLISHERS.CHAT) as Address;

    const [messages, setMessages] = useState<ChatMessageStream[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

    const fetchMessages = useCallback(async () => {
        if (!publisher || restOptions.enabled === false) return;

        try {
            setLoading(true);
            setError(null);
            const result = await getChatMessages(publisher, sessionId);
            setMessages(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [publisher, sessionId, restOptions.enabled]);

    useEffect(() => {
        fetchMessages();

        if (realtime && sessionId && publisher) {
            subscriptionRef.current = pollChatMessages(
                publisher,
                sessionId,
                restOptions.pollingInterval ?? STREAMS_CONFIG.POLLING_INTERVAL.CHAT,
                (newMessages) => {
                    setMessages((prev) => [...prev, ...newMessages]);
                },
                (err) => setError(err)
            );
        }

        return () => {
            subscriptionRef.current?.unsubscribe();
        };
    }, [fetchMessages, realtime, sessionId, publisher, restOptions.pollingInterval]);

    const addMessage = useCallback((msg: ChatMessageStream) => {
        setMessages((prev) => [...prev, msg]);
    }, []);

    return { data: messages, loading, error, refetch: fetchMessages, addMessage };
}

/**
 * Hook for latest chat messages
 */
export function useLatestChatMessages(
    limit: number = 10,
    options: UseStreamDataOptions = {}
): UseStreamDataResult<ChatMessageStream[]> {
    const fetcher = useCallback(
        (publisher: Address) => getLatestChatMessages(publisher, limit),
        [limit]
    );

    return useStreamData(fetcher, {
        ...options,
        publisher: options.publisher || (PUBLISHERS.CHAT as Address),
        pollingInterval: options.pollingInterval ?? STREAMS_CONFIG.POLLING_INTERVAL.CHAT,
    });
}

// ============================================
// Analytics Hooks
// ============================================

/**
 * Hook for agent analytics
 */
export function useAgentAnalytics(
    agentId?: string,
    options: UseStreamDataOptions = {}
): UseStreamDataResult<AgentAnalytics[]> {
    const fetcher = useCallback(
        (publisher: Address) => getAgentAnalytics(publisher, agentId),
        [agentId]
    );

    return useStreamData(fetcher, {
        ...options,
        pollingInterval: options.pollingInterval ?? STREAMS_CONFIG.POLLING_INTERVAL.ANALYTICS,
    });
}

/**
 * Hook for aggregated analytics for a specific agent
 */
export function useAgentAnalyticsSummary(
    agentId: string,
    options: UseStreamDataOptions = {}
): UseStreamDataResult<{
    totalCalls: number;
    successRate: number;
    totalGasUsed: bigint;
    uniqueUsers: number;
}> {
    const { data, loading, error, refetch } = useAgentAnalytics(agentId, options);

    const summary = data && data.length > 0
        ? {
            totalCalls: Number(data[data.length - 1].totalCalls),
            successRate: data[data.length - 1].successCount > 0n
                ? Number((data[data.length - 1].successCount * 100n) / data[data.length - 1].totalCalls)
                : 0,
            totalGasUsed: data[data.length - 1].totalGasUsed,
            uniqueUsers: Number(data[data.length - 1].uniqueUsers),
        }
        : null;

    return { data: summary, loading, error, refetch };
}

// ============================================
// Activity Feed Hooks
// ============================================

/**
 * Hook for activity feed
 */
export function useActivityFeed(
    options: UseActivityFeedOptions = {}
): UseStreamDataResult<ActivityFeedItem[]> & { items: ActivityFeedItem[] } {
    const { limit = 50, realtime = false, ...restOptions } = options;
    const publisher = (restOptions.publisher || PUBLISHERS.ACTIVITY) as Address;

    const [items, setItems] = useState<ActivityFeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

    const fetchFeed = useCallback(async () => {
        if (!publisher || restOptions.enabled === false) return;

        try {
            setLoading(true);
            setError(null);
            const result = await getActivityFeed(publisher, limit);
            setItems(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [publisher, limit, restOptions.enabled]);

    useEffect(() => {
        fetchFeed();

        if (realtime && publisher) {
            subscriptionRef.current = pollActivityFeed(
                publisher,
                restOptions.pollingInterval ?? STREAMS_CONFIG.POLLING_INTERVAL.ACTIVITY,
                (newItems) => {
                    setItems((prev) => [...newItems, ...prev].slice(0, limit));
                },
                (err) => setError(err)
            );
        }

        return () => {
            subscriptionRef.current?.unsubscribe();
        };
    }, [fetchFeed, realtime, publisher, limit, restOptions.pollingInterval]);

    return { data: items, items, loading, error, refetch: fetchFeed };
}

// ============================================
// Leaderboard Hook
// ============================================

/**
 * Hook for agent leaderboard
 */
export function useLeaderboard(
    limit: number = 10,
    options: UseStreamDataOptions = {}
): UseStreamDataResult<LeaderboardEntry[]> {
    const fetcher = useCallback(
        (publisher: Address) => getLeaderboard(publisher, limit),
        [limit]
    );

    return useStreamData(fetcher, {
        ...options,
        pollingInterval: options.pollingInterval ?? STREAMS_CONFIG.POLLING_INTERVAL.LEADERBOARD,
    });
}

// ============================================
// Record Count Hook
// ============================================

/**
 * Hook for getting record counts
 */
export function useRecordCount(
    schema: 'AGENT_EXECUTION' | 'CHAT_MESSAGE' | 'AGENT_ANALYTICS' | 'TRANSACTION_EVENT' | 'ACTIVITY_FEED' | 'LEADERBOARD',
    options: UseStreamDataOptions = {}
): UseStreamDataResult<number> {
    const fetcher = useCallback(
        (publisher: Address) => getRecordCount(schema, publisher),
        [schema]
    );

    return useStreamData(fetcher, options);
}

// ============================================
// Connection Status Hook
// ============================================

/**
 * Hook for monitoring stream connection status
 */
export function useStreamConnectionStatus(): {
    isConnected: boolean;
    lastUpdate: Date | null;
    error: Error | null;
} {
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const { getPublicSDK } = await import('./client');
                const sdk = getPublicSDK();
                // Try a simple read to verify connection
                await sdk.streams.getAllSchemas();
                setIsConnected(true);
                setLastUpdate(new Date());
                setError(null);
            } catch (err) {
                setIsConnected(false);
                setError(err instanceof Error ? err : new Error(String(err)));
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 30000); // Check every 30s

        return () => clearInterval(interval);
    }, []);

    return { isConnected, lastUpdate, error };
}
