import Link from 'next/link';
import { ArrowLeft, Layers, Database, Code, Users, Zap } from 'lucide-react';

export default function ArchitecturePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/docs"
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Documentation
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Title */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">System Architecture</h1>
                    <p className="text-xl text-gray-400">
                        Technical overview of ContractMind's infrastructure and design patterns
                    </p>
                </div>

                {/* System Overview */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Layers className="w-6 h-6 mr-2 text-blue-400" />
                        System Overview
                    </h2>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 mb-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
                                    <Code className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Frontend</h3>
                                <p className="text-gray-400 text-sm">Next.js 14 + TypeScript</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/10 rounded-full flex items-center justify-center">
                                    <Database className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Backend</h3>
                                <p className="text-gray-400 text-sm">FastAPI + FastMCP</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
                                    <Zap className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Blockchain</h3>
                                <p className="text-gray-400 text-sm">Solidity + Somnia</p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300">
                            ContractMind follows a modern three-tier architecture with clear separation of concerns:
                        </p>
                        <ul className="text-gray-300 space-y-2 mt-4">
                            <li><strong className="text-white">Presentation Layer:</strong> Next.js frontend with Server Components and Client Components</li>
                            <li><strong className="text-white">Application Layer:</strong> FastAPI backend with AI service integration</li>
                            <li><strong className="text-white">Data Layer:</strong> PostgreSQL database + Blockchain state</li>
                        </ul>
                    </div>
                </section>

                {/* Component Architecture */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Component Architecture</h2>

                    <div className="space-y-6">
                        {/* Frontend Components */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Code className="w-5 h-5 mr-2 text-blue-400" />
                                Frontend Components
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                                <div>
                                    <h4 className="font-medium text-white mb-2">Core Components</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li>• Web3Provider (Reown AppKit)</li>
                                        <li>• WalletGuard (Auth protection)</li>
                                        <li>• DashboardHeader (Navigation)</li>
                                        <li>• AgentCard (Agent display)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white mb-2">Features</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li>• Server-side rendering</li>
                                        <li>• Client-side routing</li>
                                        <li>• Real-time updates</li>
                                        <li>• Responsive design</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Backend Services */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Database className="w-5 h-5 mr-2 text-purple-400" />
                                Backend Services
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                                <div>
                                    <h4 className="font-medium text-white mb-2">Core Services</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li>• AI Service (Multi-provider)</li>
                                        <li>• Chat Service (Conversations)</li>
                                        <li>• Agent Service (CRUD)</li>
                                        <li>• Analytics Service (Metrics)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white mb-2">Infrastructure</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li>• FastMCP integration</li>
                                        <li>• WebSocket support</li>
                                        <li>• Database models (SQLAlchemy)</li>
                                        <li>• API routing</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Smart Contracts */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Zap className="w-5 h-5 mr-2 text-green-400" />
                                Smart Contracts
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                                <div>
                                    <h4 className="font-medium text-white mb-2">Core Contracts</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li>• ContractMindHubV2</li>
                                        <li>• AgentRegistry</li>
                                        <li>• HubAwareStaking</li>
                                        <li>• RegularStaking</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white mb-2">Features</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li>• Hub-Aware Architecture</li>
                                        <li>• Upgradeable contracts</li>
                                        <li>• Event emission</li>
                                        <li>• Access control</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Flow */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Data Flow</h2>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">1. User Interaction</h3>
                                <p className="text-gray-300 text-sm">
                                    User interacts with Next.js frontend → connects wallet via Reown AppKit
                                </p>
                            </div>

                            <div className="border-l-2 border-blue-500 pl-6">
                                <h3 className="text-lg font-semibold text-white mb-3">2. API Request</h3>
                                <p className="text-gray-300 text-sm">
                                    Frontend sends authenticated request → FastAPI backend validates and processes
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">3. Service Layer</h3>
                                <p className="text-gray-300 text-sm">
                                    Backend service layer processes business logic → interacts with AI providers or database
                                </p>
                            </div>

                            <div className="border-l-2 border-purple-500 pl-6">
                                <h3 className="text-lg font-semibold text-white mb-3">4. Data Storage</h3>
                                <p className="text-gray-300 text-sm">
                                    Data persisted to PostgreSQL → blockchain state updated via smart contracts
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">5. Response</h3>
                                <p className="text-gray-300 text-sm">
                                    Response returned to frontend → UI updated with new data
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hub-Aware Pattern */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Hub-Aware Architecture</h2>

                    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6">
                        <p className="text-gray-300 mb-4">
                            ContractMind implements a <strong className="text-white">Hub-Aware Architecture</strong> pattern for smart contracts,
                            enabling centralized coordination with decentralized execution.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <h4 className="font-semibold text-white mb-3">Benefits</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li className="flex items-start">
                                        <span className="text-green-400 mr-2">✓</span>
                                        Centralized state management
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-400 mr-2">✓</span>
                                        Simplified upgrades
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-400 mr-2">✓</span>
                                        Consistent access control
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-400 mr-2">✓</span>
                                        Cross-contract coordination
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-3">Pattern</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li>• Hub contract stores global state</li>
                                    <li>• Spoke contracts register with hub</li>
                                    <li>• Hub validates all operations</li>
                                    <li>• Events emitted through hub</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security Architecture */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Security Architecture</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Authentication</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>• Wallet-based auth</li>
                                <li>• Route protection</li>
                                <li>• Session management</li>
                            </ul>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">API Security</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>• CORS configuration</li>
                                <li>• Rate limiting</li>
                                <li>• Input validation</li>
                            </ul>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Smart Contracts</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>• Access control</li>
                                <li>• Reentrancy guards</li>
                                <li>• Upgrade patterns</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Technology Stack */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Users className="w-6 h-6 mr-2 text-yellow-400" />
                        Technology Stack
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Frontend</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>• <strong>Framework:</strong> Next.js 14</li>
                                <li>• <strong>Language:</strong> TypeScript</li>
                                <li>• <strong>Styling:</strong> Tailwind CSS</li>
                                <li>• <strong>Web3:</strong> Wagmi + Viem + Reown AppKit</li>
                                <li>• <strong>State:</strong> React Query</li>
                            </ul>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Backend</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>• <strong>Framework:</strong> FastAPI</li>
                                <li>• <strong>Language:</strong> Python 3.11+</li>
                                <li>• <strong>Database:</strong> PostgreSQL</li>
                                <li>• <strong>ORM:</strong> SQLAlchemy</li>
                                <li>• <strong>AI:</strong> OpenAI, Claude, Gemini</li>
                            </ul>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Blockchain</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>• <strong>Language:</strong> Solidity ^0.8.0</li>
                                <li>• <strong>Framework:</strong> Foundry</li>
                                <li>• <strong>Network:</strong> Somnia Testnet</li>
                                <li>• <strong>Libraries:</strong> OpenZeppelin</li>
                            </ul>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">DevOps</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>• <strong>Containers:</strong> Docker</li>
                                <li>• <strong>Hosting:</strong> Vercel, Render, AWS</li>
                                <li>• <strong>CI/CD:</strong> GitHub Actions</li>
                                <li>• <strong>Monitoring:</strong> CloudWatch</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
