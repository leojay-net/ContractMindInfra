/**
 * Transaction Execution Hooks
 * Handles transaction signing and execution with smart contracts
 */

import { useState } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { encodeFunctionData, parseAbi } from 'viem';
import type { PreparedTransaction } from '@/types';

interface UseTransactionExecutionResult {
    execute: (transaction: PreparedTransaction, abi?: any[]) => Promise<string>;
    isExecuting: boolean;
    error: Error | null;
    txHash: string | null;
}

/**
 * Hook for executing prepared transactions
 * Handles wallet signing and transaction submission
 */
export function useTransactionExecution(): UseTransactionExecutionResult {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    const [isExecuting, setIsExecuting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);

    const execute = async (transaction: PreparedTransaction, abi?: any[]): Promise<string> => {
        if (!address || !walletClient) {
            throw new Error('Wallet not connected');
        }

        try {
            setIsExecuting(true);
            setError(null);

            // Send transaction
            const hash = await walletClient.sendTransaction({
                account: address,
                to: transaction.to as `0x${string}`,
                data: transaction.data as `0x${string}`,
                value: BigInt(transaction.value || '0'),
                gas: BigInt(transaction.gasEstimate || '100000'),
            });

            setTxHash(hash);

            // Wait for confirmation
            if (publicClient) {
                await publicClient.waitForTransactionReceipt({ hash });
            }

            return hash;
        } catch (err) {
            console.error('Transaction execution failed:', err);
            const error = err as Error;
            setError(error);
            throw error;
        } finally {
            setIsExecuting(false);
        }
    };

    return {
        execute,
        isExecuting,
        error,
        txHash,
    };
}

/**
 * Hook for building transaction data from function calls
 */
export function useTransactionBuilder() {
    const buildTransaction = (
        contractAddress: string,
        functionName: string,
        args: any[],
        abi: any[]
    ): { to: string; data: string } => {
        try {
            const data = encodeFunctionData({
                abi,
                functionName,
                args,
            });

            return {
                to: contractAddress,
                data,
            };
        } catch (error) {
            console.error('Failed to build transaction:', error);
            throw error;
        }
    };

    return { buildTransaction };
}

/**
 * Hook for estimating gas for transactions
 */
export function useGasEstimation() {
    const publicClient = usePublicClient();
    const { address } = useAccount();

    const estimateGas = async (
        to: string,
        data: string,
        value: string = '0'
    ): Promise<bigint> => {
        if (!publicClient || !address) {
            throw new Error('Client not available');
        }

        try {
            const gas = await publicClient.estimateGas({
                account: address,
                to: to as `0x${string}`,
                data: data as `0x${string}`,
                value: BigInt(value),
            });

            // Add 20% buffer
            return (gas * BigInt(120)) / BigInt(100);
        } catch (error) {
            console.error('Gas estimation failed:', error);
            // Return default gas limit on error
            return BigInt(500000);
        }
    };

    return { estimateGas };
}

/**
 * Combined hook for full transaction flow
 * Builds, estimates, and executes transactions
 */
export function useContractTransaction() {
    const { buildTransaction } = useTransactionBuilder();
    const { estimateGas } = useGasEstimation();
    const { execute, isExecuting, error, txHash } = useTransactionExecution();

    const executeContractCall = async (
        contractAddress: string,
        functionName: string,
        args: any[],
        abi: any[],
        value: string = '0'
    ): Promise<string> => {
        // Build transaction
        const { to, data } = buildTransaction(contractAddress, functionName, args, abi);

        // Estimate gas
        const gasEstimate = await estimateGas(to, data, value);

        // Prepare transaction
        const preparedTx: PreparedTransaction = {
            to,
            data,
            value,
            gasEstimate: gasEstimate.toString(),
            explanation: `Execute ${functionName}`,
            functionName,
        };

        // Execute
        return await execute(preparedTx, abi);
    };

    return {
        executeContractCall,
        isExecuting,
        error,
        txHash,
    };
}
