/**
 * Web3 Provider Configuration
 * 
 * Configures and initializes Web3 wallet connection infrastructure using
 * Reown AppKit (WalletConnect v3) and Wagmi for Ethereum interactions.
 * 
 * Features:
 * - Multi-wallet support (MetaMask, WalletConnect, injected wallets)
 * - Somnia Testnet network configuration
 * - Dark theme with customizable variables
 * - React Query integration for state management
 * 
 * @module providers/Web3Provider
 * @requires @reown/appkit
 * @requires wagmi
 * @requires @tanstack/react-query
 */

'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SOMNIA_TESTNET } from '@/lib/config';
import type { AppKitNetwork } from '@reown/appkit/networks';

// Get WalletConnect project ID from environment
// Required for wallet connection functionality
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
    console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

// Convert chain configuration to AppKit network format
const somniaNetwork: AppKitNetwork = {
    ...SOMNIA_TESTNET,
    chainNamespace: 'eip155',
} as AppKitNetwork;

// Initialize Wagmi adapter with network configuration
const wagmiAdapter = new WagmiAdapter({
    networks: [somniaNetwork],
    projectId,
});

// Application metadata for wallet connection UI
const metadata = {
    name: 'ContractMind',
    description: 'AI-powered smart contract interaction platform',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://contractmind.io',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Initialize Reown AppKit modal
createAppKit({
    adapters: [wagmiAdapter],
    networks: [somniaNetwork],
    metadata,
    projectId,
    features: {
        analytics: true,
    },
    themeMode: 'dark',
    themeVariables: {
        '--w3m-accent': '#ffffff',
        '--w3m-color-mix': '#000000',
        '--w3m-color-mix-strength': 10,
        '--w3m-border-radius-master': '8px',
    },
});

// Initialize React Query client for state management
const queryClient = new QueryClient();

/**
 * Web3Provider Component
 * 
 * Root provider component that wraps the application with Web3 functionality.
 * Must be placed at the root level of the application tree.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Provider wrapper component
 */
export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
