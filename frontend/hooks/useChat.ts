/**
 * Chat Hooks
 * Real-time chat integration with WebSocket support
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount } from 'wagmi';
import { apiClient } from '@/lib/api';
import { MOCK_CONFIG } from '@/lib/config';
import type { ChatMessage } from '@/types';

interface UseChatOptions {
    agentId?: string;
    enableWebSocket?: boolean;
}

interface ChatState {
    messages: ChatMessage[];
    loading: boolean;
    error: Error | null;
    isConnected: boolean;
}

/**
 * Hook for managing chat with an agent
 * Supports both REST API and WebSocket for real-time updates
 */
export function useChat({ agentId, enableWebSocket = true }: UseChatOptions = {}) {
    const { address } = useAccount();
    const [state, setState] = useState<ChatState>({
        messages: [],
        loading: false,
        error: null,
        isConnected: false,
    });

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // Load chat history
    useEffect(() => {
        if (!agentId || !address) {
            setState(prev => ({ ...prev, messages: [] }));
            return;
        }

        const loadHistory = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: null }));
                const history = await apiClient.getChatHistory(agentId, address);
                setState(prev => ({ ...prev, messages: history, loading: false }));
            } catch (error) {
                console.error('Failed to load chat history:', error);
                setState(prev => ({
                    ...prev,
                    error: error as Error,
                    loading: false
                }));
            }
        };

        loadHistory();
    }, [agentId, address]);

    // Setup WebSocket connection (only in real mode)
    useEffect(() => {
        if (!agentId || !address || !enableWebSocket || MOCK_CONFIG.USE_MOCK) {
            return;
        }

        const connectWebSocket = () => {
            try {
                const ws = apiClient.connectWebSocket(agentId, address);

                ws.onopen = () => {
                    console.log('WebSocket connected');
                    setState(prev => ({ ...prev, isConnected: true, error: null }));
                };

                ws.onmessage = (event: MessageEvent) => {
                    try {
                        const message = JSON.parse(event.data);
                        setState(prev => ({
                            ...prev,
                            messages: [...prev.messages, message],
                        }));
                    } catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                };

                ws.onerror = (error: Event) => {
                    console.error('WebSocket error:', error);
                    setState(prev => ({
                        ...prev,
                        isConnected: false,
                        error: new Error('WebSocket connection error')
                    }));
                };

                ws.onclose = () => {
                    console.log('WebSocket disconnected');
                    setState(prev => ({ ...prev, isConnected: false }));

                    // Attempt to reconnect after 5 seconds
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log('Attempting to reconnect WebSocket...');
                        connectWebSocket();
                    }, 5000);
                };

                wsRef.current = ws;
            } catch (error) {
                console.error('Failed to create WebSocket connection:', error);
                setState(prev => ({
                    ...prev,
                    error: error as Error
                }));
            }
        };

        connectWebSocket();

        // Cleanup
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [agentId, address, enableWebSocket]);

    // Send message
    const sendMessage = useCallback(async (message: string) => {
        if (!agentId || !address) {
            throw new Error('Agent ID and wallet address are required');
        }

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));

            const response = await apiClient.sendMessage(agentId, message, address);

            // If not using WebSocket, manually add messages to state
            if (!enableWebSocket || MOCK_CONFIG.USE_MOCK || !state.isConnected) {
                const userMessage: ChatMessage = {
                    id: Date.now().toString(),
                    role: 'user',
                    content: message,
                    timestamp: new Date().toISOString(),
                };

                const agentMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'agent',
                    content: response.response,
                    timestamp: new Date().toISOString(),
                    transaction: response.preparedTransaction,
                };

                setState(prev => ({
                    ...prev,
                    messages: [...prev.messages, userMessage, agentMessage],
                    loading: false,
                }));
            } else {
                // WebSocket will handle adding messages
                setState(prev => ({ ...prev, loading: false }));
            }

            return response;
        } catch (error) {
            console.error('Failed to send message:', error);
            setState(prev => ({
                ...prev,
                error: error as Error,
                loading: false
            }));
            throw error;
        }
    }, [agentId, address, enableWebSocket, state.isConnected]);

    // Clear chat history
    const clearMessages = useCallback(() => {
        setState(prev => ({ ...prev, messages: [] }));
    }, []);

    return {
        messages: state.messages,
        loading: state.loading,
        error: state.error,
        isConnected: state.isConnected,
        sendMessage,
        clearMessages,
    };
}

/**
 * Hook for getting chat history without WebSocket
 */
export function useChatHistory(agentId?: string) {
    const { address } = useAccount();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!agentId || !address) {
            setMessages([]);
            return;
        }

        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError(null);
                const history = await apiClient.getChatHistory(agentId, address);
                setMessages(history);
            } catch (err) {
                console.error('Failed to fetch chat history:', err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [agentId, address]);

    return { messages, loading, error };
}
