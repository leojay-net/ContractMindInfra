/**
 * Smart Contract ABIs and Addresses
 * Exports contract ABIs and configurations for use with wagmi/viem
 */

import { CONTRACTS } from '../config';
import AgentRegistryABI from './AgentRegistry.json';
import ContractMindHubV2ABI from './ContractMindHubV2.json';

export const AGENT_REGISTRY = {
    address: CONTRACTS.REGISTRY,
    abi: AgentRegistryABI,
} as const;

export const CONTRACT_MIND_HUB = {
    address: CONTRACTS.HUB,
    abi: ContractMindHubV2ABI,
} as const;

// Export ABIs separately if needed
export { AgentRegistryABI, ContractMindHubV2ABI };
