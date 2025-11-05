/**
 * Combined Agent Hooks
 * Integrates blockchain contract calls with backend API
 * Maintains mock/real data toggle functionality
 */

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useAgentsByOwner, useAgent as useAgentContract } from './useContracts';
import { apiClient } from '@/lib/api';
import { MOCK_CONFIG } from '@/lib/config';
import { Agent } from '@/types';

/**
 * Get all agents for the connected wallet
 * Combines on-chain registry data with backend API data
 */
export function useAgents() {
    const { address } = useAccount();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // On-chain data (only if not in mock mode)
    const { data: agentIds, isLoading: isLoadingChain } = useAgentsByOwner(
        !MOCK_CONFIG.USE_MOCK && address ? address : undefined
    );

    useEffect(() => {
        async function fetchAgents() {
            try {
                setLoading(true);
                setError(null);

                // If mock mode, use API client (which has mock implementation)
                if (MOCK_CONFIG.USE_MOCK) {
                    const mockAgents = await apiClient.getAgents();
                    setAgents(mockAgents);
                } else {
                    // Real mode: fetch from backend API which queries blockchain
                    const realAgents = await apiClient.getAgents();
                    setAgents(realAgents);
                }
            } catch (err) {
                console.error('Failed to fetch agents:', err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        if (address || MOCK_CONFIG.USE_MOCK) {
            fetchAgents();
        } else {
            setAgents([]);
            setLoading(false);
        }
    }, [address]);

    return {
        agents,
        loading: loading || isLoadingChain,
        error,
        refetch: () => {
            // Trigger re-fetch
            if (address || MOCK_CONFIG.USE_MOCK) {
                setLoading(true);
                apiClient.getAgents().then(setAgents).catch(setError).finally(() => setLoading(false));
            }
        },
    };
}

/**
 * Get a single agent by ID
 */
export function useAgent(agentId?: string) {
    const [agent, setAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchAgent() {
            if (!agentId) {
                setAgent(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const agentData = await apiClient.getAgent(agentId);
                setAgent(agentData);
            } catch (err) {
                console.error('Failed to fetch agent:', err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchAgent();
    }, [agentId]);

    return { agent, loading, error };
}

/**
 * Create a new agent
 * Handles both blockchain registration and backend sync
 */
export function useCreateAgent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [success, setSuccess] = useState(false);

    const createAgent = async (data: {
        name: string;
        description?: string;
        targetContract: string;
        abi: string;
        personality: string;
        domainKnowledge?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            // Call backend API which handles blockchain registration
            await apiClient.createAgent(data);

            setSuccess(true);
            return true;
        } catch (err) {
            console.error('Failed to create agent:', err);
            setError(err as Error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        createAgent,
        loading,
        error,
        success,
    };
}

/**
 * Update an existing agent
 */
export function useUpdateAgent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [success, setSuccess] = useState(false);

    const updateAgent = async (agentId: string, data: Partial<Agent>) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await apiClient.updateAgent(agentId, data);

            setSuccess(true);
            return true;
        } catch (err) {
            console.error('Failed to update agent:', err);
            setError(err as Error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateAgent,
        loading,
        error,
        success,
    };
}

/**
 * Delete/deactivate an agent
 */
export function useDeleteAgent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [success, setSuccess] = useState(false);

    const deleteAgent = async (agentId: string) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await apiClient.deleteAgent(agentId);

            setSuccess(true);
            return true;
        } catch (err) {
            console.error('Failed to delete agent:', err);
            setError(err as Error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteAgent,
        loading,
        error,
        success,
    };
}
