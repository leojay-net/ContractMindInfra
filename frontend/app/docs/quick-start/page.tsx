/**
 * Quick Start Documentation
 * 
 * Simplified getting started guide for new users.
 * 
 * @module app/docs/quick-start/page
 */

import Link from 'next/link';
import { CheckCircle, Terminal, Wallet, Rocket } from 'lucide-react';

export default function QuickStartPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/docs" className="text-xl font-bold hover:text-gray-300 transition-colors">
                            ← Documentation
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Launch App
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl font-bold mb-6">Quick Start Guide</h1>
                        <p className="text-xl text-gray-400 mb-12">
                            Get started with ContractMind in 5 minutes
                        </p>

                        {/* Steps */}
                        <div className="space-y-12">

                            {/* Step 1 */}
                            <div className="border-l-4 border-white/20 pl-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                        1
                                    </div>
                                    <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
                                </div>
                                <p className="text-gray-400 mb-4">
                                    ContractMind uses wallet-based authentication. Connect your Web3 wallet to get started.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-500">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        Click the "Connect Wallet" button in the header
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        Select your wallet provider (MetaMask, WalletConnect, etc.)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        Approve the connection request
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        Make sure you're connected to Somnia Testnet (Chain ID: 50312)
                                    </li>
                                </ul>
                            </div>

                            {/* Step 2 */}
                            <div className="border-l-4 border-white/20 pl-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                        2
                                    </div>
                                    <h2 className="text-2xl font-bold">Access Dashboard</h2>
                                </div>
                                <p className="text-gray-400 mb-4">
                                    Once connected, navigate to the dashboard to manage your AI agents.
                                </p>
                                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                    <code className="text-sm text-green-400">
                                        https://contractmind.io/dashboard
                                    </code>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="border-l-4 border-white/20 pl-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                        3
                                    </div>
                                    <h2 className="text-2xl font-bold">Create Your First Agent</h2>
                                </div>
                                <p className="text-gray-400 mb-4">
                                    Deploy an AI agent to interact with your smart contracts.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-500 mb-4">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        Navigate to Agents page
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        Click "Create Agent"
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        Choose agent type (Contract Analysis, Transaction Execution, etc.)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        Configure agent settings
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        Deploy and activate
                                    </li>
                                </ul>
                            </div>

                            {/* Step 4 */}
                            <div className="border-l-4 border-white/20 pl-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                        4
                                    </div>
                                    <h2 className="text-2xl font-bold">Interact with Your Agent</h2>
                                </div>
                                <p className="text-gray-400 mb-4">
                                    Use the chat interface to communicate with your AI agent.
                                </p>
                                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-sm text-gray-400 mb-2">Example commands:</p>
                                    <code className="text-sm text-green-400 block mb-1">
                                        "Analyze contract 0x1234..."
                                    </code>
                                    <code className="text-sm text-green-400 block mb-1">
                                        "Execute transaction on MyContract"
                                    </code>
                                    <code className="text-sm text-green-400 block">
                                        "Get balance of 0x5678..."
                                    </code>
                                </div>
                            </div>

                        </div>

                        {/* Next Steps */}
                        <div className="mt-16 p-8 rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/10">
                            <h3 className="text-2xl font-bold mb-4">Next Steps</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Link
                                    href="/docs/ARCHITECTURE.md"
                                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                                >
                                    <h4 className="font-semibold mb-1">Architecture Guide</h4>
                                    <p className="text-sm text-gray-400">Learn about system design</p>
                                </Link>
                                <Link
                                    href="/docs/API.md"
                                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                                >
                                    <h4 className="font-semibold mb-1">API Reference</h4>
                                    <p className="text-sm text-gray-400">Explore API endpoints</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
