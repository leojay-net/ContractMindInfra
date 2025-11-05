import Link from 'next/link';
import { ArrowLeft, CheckCircle, Terminal, Database, Code } from 'lucide-react';

export default function InstallationPage() {
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
                    <h1 className="text-4xl font-bold text-white mb-4">Installation Guide</h1>
                    <p className="text-xl text-gray-400">
                        Complete installation instructions for ContractMind infrastructure
                    </p>
                </div>

                {/* System Requirements */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <CheckCircle className="w-6 h-6 mr-2 text-blue-400" />
                        System Requirements
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Hardware</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>• CPU: 2+ cores (4+ recommended)</li>
                                <li>• RAM: 4GB minimum (8GB+ recommended)</li>
                                <li>• Storage: 10GB free space</li>
                                <li>• Network: Stable internet connection</li>
                            </ul>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Software</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>• Node.js 18+ and npm 9+</li>
                                <li>• Python 3.11+</li>
                                <li>• PostgreSQL 14+</li>
                                <li>• Git</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Installation Steps */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Terminal className="w-6 h-6 mr-2 text-blue-400" />
                        Installation Steps
                    </h2>

                    {/* Step 1: Clone Repository */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">1. Clone Repository</h3>
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
                            <code className="text-green-400">
                                git clone https://github.com/yourusername/ContractMindInfra.git<br />
                                cd ContractMindInfra
                            </code>
                        </div>
                    </div>

                    {/* Step 2: Backend Setup */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <Database className="w-5 h-5 mr-2 text-purple-400" />
                            2. Backend Setup
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">Install Poetry</h4>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        curl -sSL https://install.python-poetry.org | python3 -
                                    </code>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">Install Dependencies</h4>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        cd backend<br />
                                        poetry install
                                    </code>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">Configure Environment</h4>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        cp .env.example .env<br />
                                        # Edit .env with your configuration
                                    </code>
                                </div>
                                <div className="mt-2 text-sm text-gray-400">
                                    Required variables: DATABASE_URL, OPENAI_API_KEY, ANTHROPIC_API_KEY
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">Setup Database</h4>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        # Create PostgreSQL database<br />
                                        createdb contractmind<br />
                                        <br />
                                        # Run migrations<br />
                                        poetry run alembic upgrade head
                                    </code>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">Start Backend</h4>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        poetry run uvicorn app.main:app --reload
                                    </code>
                                </div>
                                <div className="mt-2 text-sm text-gray-400">
                                    Backend will run at http://localhost:8000
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Frontend Setup */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <Code className="w-5 h-5 mr-2 text-blue-400" />
                            3. Frontend Setup
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">Install Dependencies</h4>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        cd frontend<br />
                                        npm install
                                    </code>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">Configure Environment</h4>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        cp .env.example .env.local<br />
                                        # Edit .env.local with your WalletConnect Project ID
                                    </code>
                                </div>
                                <div className="mt-2 text-sm text-gray-400">
                                    Get Project ID from: <a href="https://cloud.walletconnect.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">cloud.walletconnect.com</a>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">Start Frontend</h4>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        npm run dev
                                    </code>
                                </div>
                                <div className="mt-2 text-sm text-gray-400">
                                    Frontend will run at http://localhost:3000
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Smart Contracts */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">4. Smart Contracts Setup</h3>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">Install Foundry</h4>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        curl -L https://foundry.paradigm.xyz | bash<br />
                                        foundryup
                                    </code>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">Install Dependencies & Compile</h4>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        cd contracts<br />
                                        forge install<br />
                                        forge build
                                    </code>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-white mb-2">Run Tests</h4>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        forge test
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Verification */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Verification</h2>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Check that everything is working:</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                                <span><strong>Backend:</strong> Visit http://localhost:8000/docs for API documentation</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                                <span><strong>Frontend:</strong> Visit http://localhost:3000 to see the app</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                                <span><strong>Database:</strong> Check tables exist with <code className="text-green-400">psql contractmind -c "\dt"</code></span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                                <span><strong>Contracts:</strong> All tests should pass with <code className="text-green-400">forge test</code></span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Troubleshooting */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Common Issues</h2>

                    <div className="space-y-4">
                        <details className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <summary className="text-lg font-semibold text-white cursor-pointer">
                                Port already in use
                            </summary>
                            <div className="mt-4 text-gray-300">
                                <p className="mb-2">Kill the process using the port:</p>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        # For port 8000 (backend)<br />
                                        lsof -ti:8000 | xargs kill -9<br />
                                        <br />
                                        # For port 3000 (frontend)<br />
                                        lsof -ti:3000 | xargs kill -9
                                    </code>
                                </div>
                            </div>
                        </details>

                        <details className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <summary className="text-lg font-semibold text-white cursor-pointer">
                                Database connection failed
                            </summary>
                            <div className="mt-4 text-gray-300">
                                <p className="mb-2">Ensure PostgreSQL is running and credentials are correct:</p>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        # Start PostgreSQL (macOS)<br />
                                        brew services start postgresql<br />
                                        <br />
                                        # Check DATABASE_URL in .env matches your setup<br />
                                        DATABASE_URL=postgresql://user:password@localhost:5432/contractmind
                                    </code>
                                </div>
                            </div>
                        </details>

                        <details className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <summary className="text-lg font-semibold text-white cursor-pointer">
                                Module not found errors
                            </summary>
                            <div className="mt-4 text-gray-300">
                                <p className="mb-2">Reinstall dependencies:</p>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                    <code className="text-green-400">
                                        # Backend<br />
                                        cd backend && poetry install<br />
                                        <br />
                                        # Frontend<br />
                                        cd frontend && rm -rf node_modules && npm install
                                    </code>
                                </div>
                            </div>
                        </details>
                    </div>
                </section>

                {/* Next Steps */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Link
                            href="/docs/quick-start"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-white mb-2">Quick Start Guide</h3>
                            <p className="text-gray-400 text-sm">
                                Learn the basics and create your first agent
                            </p>
                        </Link>

                        <Link
                            href="/docs/deployment"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-white mb-2">Deployment Guide</h3>
                            <p className="text-gray-400 text-sm">
                                Deploy to production environments
                            </p>
                        </Link>

                        <Link
                            href="/docs/api"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
                            <p className="text-gray-400 text-sm">
                                Explore all available API endpoints
                            </p>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
