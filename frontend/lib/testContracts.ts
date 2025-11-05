/**
 * Test Contract Interaction Examples
 * Quick examples for testing deployed contracts on Somnia Testnet
 */

import { CONTRACTS } from './config';

// ============================================================================
// CONTRACT ADDRESSES (Somnia Testnet)
// ============================================================================

export const TEST_CONTRACTS = {
    // Core ContractMind contracts
    AGENT_REGISTRY: CONTRACTS.REGISTRY,
    CONTRACT_MIND_HUB: CONTRACTS.HUB,

    // Test contracts for demos
    TEST_TOKEN: CONTRACTS.TEST_TOKEN,
    HUB_AWARE_STAKING: CONTRACTS.HUB_AWARE_STAKING,
} as const;

// ============================================================================
// SAMPLE AGENT CONFIGURATIONS
// ============================================================================

export const SAMPLE_AGENTS = [
    {
        name: 'Staking Agent',
        targetContract: TEST_CONTRACTS.HUB_AWARE_STAKING,
        description: 'Manages your token staking and rewards',
        configIPFS: 'ipfs://staking-agent-config',
        authorizedFunctions: [
            'stake(uint256)',
            'withdraw(uint256)',
            'claimRewards()',
            'stakes(address)',
            'calculateRewards(address)',
        ],
        sampleQueries: [
            'Stake 100 tokens',
            'What is my current stake?',
            'How much rewards have I earned?',
            'Withdraw 50 tokens',
            'Claim my rewards',
        ],
    },
    {
        name: 'Token Manager',
        targetContract: TEST_CONTRACTS.TEST_TOKEN,
        description: 'Manages your ERC20 token operations',
        configIPFS: 'ipfs://token-agent-config',
        authorizedFunctions: [
            'transfer(address,uint256)',
            'approve(address,uint256)',
            'balanceOf(address)',
            'allowance(address,address)',
            'faucet()',
        ],
        sampleQueries: [
            'What is my token balance?',
            'Get free tokens from faucet',
            'Transfer 50 tokens to 0x...',
            'Approve staking contract to spend 100 tokens',
            'Check my allowance for the staking contract',
        ],
    },
];

// ============================================================================
// QUICK SETUP FUNCTIONS
// ============================================================================

/**
 * Get test tokens from the faucet
 * Anyone can call this to receive 1000 TEST tokens
 */
export const getTestTokensFromFaucet = {
    contract: TEST_CONTRACTS.TEST_TOKEN,
    function: 'faucet()',
    params: [],
    description: 'Get 1000 free TEST tokens',
};

/**
 * Approve staking contract to spend your tokens
 * Required before staking
 */
export const approveStakingContract = (amount: string = '1000000000000000000000') => ({
    contract: TEST_CONTRACTS.TEST_TOKEN,
    function: 'approve(address,uint256)',
    params: [TEST_CONTRACTS.HUB_AWARE_STAKING, amount],
    description: `Approve staking contract to spend ${amount} tokens`,
});

/**
 * Check your token balance
 */
export const checkTokenBalance = (address: string) => ({
    contract: TEST_CONTRACTS.TEST_TOKEN,
    function: 'balanceOf(address)',
    params: [address],
    description: 'Check your TEST token balance',
});

/**
 * Check your staking info
 */
export const checkStakingInfo = (address: string) => ({
    contract: TEST_CONTRACTS.HUB_AWARE_STAKING,
    function: 'stakes(address)',
    params: [address],
    description: 'Check your staking information',
});

// ============================================================================
// TESTING WORKFLOW
// ============================================================================

export const TEST_WORKFLOW = {
    STEP_1_GET_TOKENS: {
        title: '1. Get Test Tokens',
        description: 'Get 1000 TEST tokens from the faucet',
        contract: TEST_CONTRACTS.TEST_TOKEN,
        function: 'faucet()',
        expectedResult: 'Receive 1000 TEST tokens',
    },

    STEP_2_APPROVE_STAKING: {
        title: '2. Approve Staking Contract',
        description: 'Allow staking contract to transfer your tokens',
        contract: TEST_CONTRACTS.TEST_TOKEN,
        function: 'approve(address,uint256)',
        params: (amount: string) => [TEST_CONTRACTS.HUB_AWARE_STAKING, amount],
        expectedResult: 'Staking contract approved',
    },

    STEP_3_REGISTER_AGENT: {
        title: '3. Register Staking Agent',
        description: 'Register an agent for the staking contract',
        contract: TEST_CONTRACTS.AGENT_REGISTRY,
        function: 'registerAgent(address,string,string)',
        params: {
            targetContract: TEST_CONTRACTS.HUB_AWARE_STAKING,
            name: 'Staking Agent',
            configIPFS: 'ipfs://staking-agent',
        },
        expectedResult: 'Agent registered, get agent ID',
    },

    STEP_4_AUTHORIZE_FUNCTIONS: {
        title: '4. Authorize Functions',
        description: 'Authorize staking functions for the agent',
        contract: TEST_CONTRACTS.CONTRACT_MIND_HUB,
        function: 'authorizeFunctions(bytes32,address,bytes4[])',
        params: (agentId: string) => ({
            agentId,
            targetContract: TEST_CONTRACTS.HUB_AWARE_STAKING,
            functionSelectors: [
                '0xa694fc3a', // stake(uint256)
                '0x2e1a7d4d', // withdraw(uint256)
                '0x372500ab', // claimRewards()
                '0x16934fc4', // stakes(address)
            ],
        }),
        expectedResult: 'Functions authorized for agent',
    },

    STEP_5_CHAT_AND_STAKE: {
        title: '5. Chat with Agent to Stake',
        description: 'Use natural language to stake tokens',
        action: 'chat',
        message: 'Stake 100 tokens',
        expectedResult: 'Agent prepares stake transaction',
    },

    STEP_6_CHECK_REWARDS: {
        title: '6. Check Rewards',
        description: 'Ask agent about your rewards',
        action: 'chat',
        message: 'How much rewards have I earned?',
        expectedResult: 'Agent shows your pending rewards',
    },

    STEP_7_CLAIM_REWARDS: {
        title: '7. Claim Rewards',
        description: 'Claim your staking rewards',
        action: 'chat',
        message: 'Claim my rewards',
        expectedResult: 'Agent prepares claim transaction',
    },
};

// ============================================================================
// NETWORK INFO
// ============================================================================

export const SOMNIA_TESTNET_INFO = {
    chainId: 50312,
    name: 'Somnia Testnet',
    rpcUrl: 'https://dream-rpc.somnia.network',
    blockExplorer: 'https://somnia-devnet.socialscan.io',
    nativeCurrency: {
        name: 'SOMI',
        symbol: 'SOMI',
        decimals: 18,
    },
    faucet: 'Ask in Somnia Discord for testnet SOMI',
};

// ============================================================================
// USEFUL LINKS
// ============================================================================

export const EXPLORER_LINKS = {
    AGENT_REGISTRY: `${SOMNIA_TESTNET_INFO.blockExplorer}/address/${TEST_CONTRACTS.AGENT_REGISTRY}`,
    CONTRACT_MIND_HUB: `${SOMNIA_TESTNET_INFO.blockExplorer}/address/${TEST_CONTRACTS.CONTRACT_MIND_HUB}`,
    TEST_TOKEN: `${SOMNIA_TESTNET_INFO.blockExplorer}/address/${TEST_CONTRACTS.TEST_TOKEN}`,
    HUB_AWARE_STAKING: `${SOMNIA_TESTNET_INFO.blockExplorer}/address/${TEST_CONTRACTS.HUB_AWARE_STAKING}`,
};
