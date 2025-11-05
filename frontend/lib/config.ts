/**
 * Application configuration
 * Centralized config for blockchain, API, and feature flags
 */

import { ChainConfig } from '@/types';

// ============================================================================
// SOMNIA NETWORK CONFIGURATION
// ============================================================================

export const SOMNIA_TESTNET: ChainConfig = {
    id: parseInt(process.env.NEXT_PUBLIC_SOMNIA_CHAIN_ID || '50312'),
    name: 'Somnia Testnet',
    rpcUrl: process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || 'https://dream-rpc.somnia.network',
    rpcUrls: {
        default: {
            http: [process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || 'https://dream-rpc.somnia.network'],
        },
    },
    blockExplorer: 'https://somnia-devnet.socialscan.io',
    blockExplorers: {
        default: {
            name: 'Somnia Explorer',
            url: 'https://somnia-devnet.socialscan.io',
        },
    },
    nativeCurrency: {
        name: 'SOMI',
        symbol: 'SOMI',
        decimals: 18,
    },
};

// ============================================================================
// SMART CONTRACT ADDRESSES
// ============================================================================

export const CONTRACTS = {
    HUB: (process.env.NEXT_PUBLIC_HUB_CONTRACT_ADDRESS || '0x8244777FAe8F2f4AE50875405AFb34E10164C027') as `0x${string}`,
    REGISTRY: (process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS || '0x318FFd8Fc398a3639Faa837307Ffdd0b9E1017c9') as `0x${string}`,
    // Test contracts for demo/testing
    TEST_TOKEN: '0x4f692992b0e5FFF6C08A71fc39603954D986F6e7' as `0x${string}`,
    HUB_AWARE_STAKING: '0x306f0f0DED2Eda539b6f768067CC36790Eb2180c' as `0x${string}`,
};

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000',
    TIMEOUT: 30000, // 30 seconds
};

// ============================================================================
// MOCK/REAL DATA TOGGLE
// ============================================================================

/**
 * Mock Mode Configuration
 * - NEXT_PUBLIC_USE_MOCK=1: Use client-side mocks (localStorage-backed fake data)
 * - NEXT_PUBLIC_USE_MOCK=0: Use real backend APIs and smart contracts
 * - NEXT_PUBLIC_USE_REAL_CHAT=1: Use real backend LLM even when mock mode is enabled
 * - NEXT_PUBLIC_USE_REAL_CHAT=0: Use mock chat responses
 */
export const MOCK_CONFIG = {
    USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK === '1' || process.env.NEXT_PUBLIC_USE_MOCK === 'true',
    USE_REAL_CHAT: process.env.NEXT_PUBLIC_USE_REAL_CHAT === '1' || process.env.NEXT_PUBLIC_USE_REAL_CHAT === 'true',
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    ENABLE_3D: process.env.NEXT_PUBLIC_ENABLE_3D !== 'false', // enabled by default
};

// ============================================================================
// RATE LIMITS
// ============================================================================

export const RATE_LIMITS = {
    CHAT_MESSAGES_PER_MINUTE: 20,
    QUERIES_PER_15_MINUTES: 100,
    AGENT_REGISTRATIONS_PER_HOUR: 10,
};

// ============================================================================
// APP METADATA
// ============================================================================

export const APP_METADATA = {
    name: 'ContractMind',
    title: 'ContractMind - AI-Powered Smart Contract Platform',
    description: 'Deploy conversational AI agents for your Somnia smart contracts in minutes. No code required.',
    url: 'https://contractmind.io',
    ogImage: '/og-image.png',
    twitterHandle: '@contractmind',
};

// ============================================================================
// NAVIGATION
// ============================================================================

export const NAV_ITEMS = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Pricing', href: '#pricing' },
];

export const DASHBOARD_NAV = [
    { label: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Agents', href: '/dashboard/agents', icon: 'Bot' },
    { label: 'Analytics', href: '/dashboard/analytics', icon: 'BarChart3' },
    { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
];
