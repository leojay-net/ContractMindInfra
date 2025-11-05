/**
 * Smart Contract Interaction Hooks
 * React hooks for interacting with AgentRegistry and ContractMindHub contracts
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { AGENT_REGISTRY, CONTRACT_MIND_HUB } from '@/lib/contracts';
import { useState } from 'react';

// ============================================================================
// AGENT REGISTRY HOOKS
// ============================================================================

/**
 * Get all agents owned by an address
 */
export function useAgentsByOwner(ownerAddress?: `0x${string}`) {
    return useReadContract({
        ...AGENT_REGISTRY,
        functionName: 'getAgentsByOwner',
        args: ownerAddress ? [ownerAddress] : undefined,
        query: {
            enabled: !!ownerAddress,
        },
    });
}

/**
 * Get agent details by ID
 */
export function useAgent(agentId?: `0x${string}`) {
    return useReadContract({
        ...AGENT_REGISTRY,
        functionName: 'getAgent',
        args: agentId ? [agentId] : undefined,
        query: {
            enabled: !!agentId,
        },
    });
}

/**
 * Get total agent count
 */
export function useAgentCount() {
    return useReadContract({
        ...AGENT_REGISTRY,
        functionName: 'agentCount',
    });
}

/**
 * Register a new agent
 */
export function useRegisterAgent() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const registerAgent = async (targetContract: `0x${string}`, name: string, configIPFS: string) => {
        writeContract({
            ...AGENT_REGISTRY,
            functionName: 'registerAgent',
            args: [targetContract, name, configIPFS],
        });
    };

    return {
        registerAgent,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

/**
 * Update agent configuration
 */
export function useUpdateAgent() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const updateAgent = async (agentId: `0x${string}`, configIPFS: string) => {
        writeContract({
            ...AGENT_REGISTRY,
            functionName: 'updateAgent',
            args: [agentId, configIPFS],
        });
    };

    return {
        updateAgent,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

/**
 * Deactivate an agent
 */
export function useDeactivateAgent() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const deactivateAgent = async (agentId: `0x${string}`) => {
        writeContract({
            ...AGENT_REGISTRY,
            functionName: 'deactivateAgent',
            args: [agentId],
        });
    };

    return {
        deactivateAgent,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

/**
 * Reactivate an agent
 */
export function useReactivateAgent() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const reactivateAgent = async (agentId: `0x${string}`) => {
        writeContract({
            ...AGENT_REGISTRY,
            functionName: 'reactivateAgent',
            args: [agentId],
        });
    };

    return {
        reactivateAgent,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

// ============================================================================
// CONTRACT MIND HUB HOOKS
// ============================================================================

/**
 * Check if a function is authorized for an agent
 */
export function useIsFunctionAuthorized(
    agentId?: `0x${string}`,
    targetContract?: `0x${string}`,
    functionSelector?: `0x${string}`
) {
    return useReadContract({
        ...CONTRACT_MIND_HUB,
        functionName: 'authorizedFunctions',
        args: agentId && targetContract && functionSelector ? [agentId, targetContract, functionSelector] : undefined,
        query: {
            enabled: !!agentId && !!targetContract && !!functionSelector,
        },
    });
}

/**
 * Get agent call count
 */
export function useAgentCallCount(agentId?: `0x${string}`) {
    return useReadContract({
        ...CONTRACT_MIND_HUB,
        functionName: 'agentCallCount',
        args: agentId ? [agentId] : undefined,
        query: {
            enabled: !!agentId,
        },
    });
}

/**
 * Get agent gas used
 */
export function useAgentGasUsed(agentId?: `0x${string}`) {
    return useReadContract({
        ...CONTRACT_MIND_HUB,
        functionName: 'agentGasUsed',
        args: agentId ? [agentId] : undefined,
        query: {
            enabled: !!agentId,
        },
    });
}

/**
 * Authorize functions for an agent
 */
export function useAuthorizeFunctions() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const authorizeFunctions = async (
        agentId: `0x${string}`,
        targetContract: `0x${string}`,
        functionSelectors: `0x${string}`[]
    ) => {
        writeContract({
            ...CONTRACT_MIND_HUB,
            functionName: 'authorizeFunctions',
            args: [agentId, targetContract, functionSelectors],
        });
    };

    return {
        authorizeFunctions,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

/**
 * Revoke functions for an agent
 */
export function useRevokeFunctions() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const revokeFunctions = async (
        agentId: `0x${string}`,
        targetContract: `0x${string}`,
        functionSelectors: `0x${string}`[]
    ) => {
        writeContract({
            ...CONTRACT_MIND_HUB,
            functionName: 'revokeFunctions',
            args: [agentId, targetContract, functionSelectors],
        });
    };

    return {
        revokeFunctions,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

/**
 * Execute a query (read-only call)
 */
export function useExecuteQuery() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const executeQuery = async (
        agentId: `0x${string}`,
        targetContract: `0x${string}`,
        callData: `0x${string}`
    ) => {
        writeContract({
            ...CONTRACT_MIND_HUB,
            functionName: 'executeQuery',
            args: [agentId, targetContract, callData],
        });
    };

    return {
        executeQuery,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

/**
 * Validate and execute a transaction
 */
export function useValidateAndExecute() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const validateAndExecute = async (
        agentId: `0x${string}`,
        targetContract: `0x${string}`,
        callData: `0x${string}`,
        value: bigint = BigInt(0)
    ) => {
        writeContract({
            ...CONTRACT_MIND_HUB,
            functionName: 'validateAndExecute',
            args: [agentId, targetContract, callData],
            value,
        });
    };

    return {
        validateAndExecute,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
