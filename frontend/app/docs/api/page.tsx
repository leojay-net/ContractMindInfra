import Link from 'next/link';
import { ArrowLeft, Code, ExternalLink } from 'lucide-react';

export default function APIPage() {
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
                    <h1 className="text-4xl font-bold text-white mb-4">API Reference</h1>
                    <p className="text-xl text-gray-400">
                        Complete API documentation for ContractMind backend services
                    </p>
                </div>

                {/* Interactive API Docs */}
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-8 mb-12">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Interactive API Documentation</h2>
                            <p className="text-gray-300 mb-6">
                                Access the full interactive API documentation with live testing capabilities.
                            </p>
                            <div className="space-y-3">
                                <a
                                    href="http://localhost:8000/docs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mr-4"
                                >
                                    <Code className="w-5 h-5 mr-2" />
                                    Open Swagger UI
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                                <a
                                    href="http://localhost:8000/redoc"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    ReDoc Documentation
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        </div>
                        <Code className="w-16 h-16 text-blue-400 opacity-20" />
                    </div>
                </div>

                {/* API Overview */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">API Overview</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Base URL</h3>
                            <code className="text-green-400 bg-gray-900 px-3 py-2 rounded block">
                                http://localhost:8000/api/v1
                            </code>
                            <p className="text-gray-400 text-sm mt-2">
                                Production: https://your-api-domain.com/api/v1
                            </p>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Authentication</h3>
                            <p className="text-gray-300 text-sm">
                                Wallet-based authentication using signed messages. Include wallet address in headers.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Endpoints */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">API Endpoints</h2>

                    <div className="space-y-4">
                        {/* Agents */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Agents API</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-mono rounded mr-3">GET</span>
                                        <code className="text-gray-300">/agents</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">List all agents</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-mono rounded mr-3">POST</span>
                                        <code className="text-gray-300">/agents</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">Create new agent</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-mono rounded mr-3">GET</span>
                                        <code className="text-gray-300">/agents/:id</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">Get agent details</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-yellow-600 text-white text-xs font-mono rounded mr-3">PUT</span>
                                        <code className="text-gray-300">/agents/:id</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">Update agent</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-mono rounded mr-3">DEL</span>
                                        <code className="text-gray-300">/agents/:id</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">Delete agent</span>
                                </div>
                            </div>
                        </div>

                        {/* Chat */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Chat API</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-mono rounded mr-3">POST</span>
                                        <code className="text-gray-300">/chat/message</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">Send chat message</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-mono rounded mr-3">GET</span>
                                        <code className="text-gray-300">/chat/conversations</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">List conversations</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-mono rounded mr-3">GET</span>
                                        <code className="text-gray-300">/chat/conversations/:id</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">Get conversation</span>
                                </div>
                            </div>
                        </div>

                        {/* Transactions */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Transactions API</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-mono rounded mr-3">GET</span>
                                        <code className="text-gray-300">/transactions</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">List transactions</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-mono rounded mr-3">POST</span>
                                        <code className="text-gray-300">/transactions/execute</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">Execute transaction</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-mono rounded mr-3">GET</span>
                                        <code className="text-gray-300">/transactions/:hash</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">Get transaction status</span>
                                </div>
                            </div>
                        </div>

                        {/* Analytics */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Analytics API</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-mono rounded mr-3">GET</span>
                                        <code className="text-gray-300">/analytics/overview</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">Get overview metrics</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-mono rounded mr-3">GET</span>
                                        <code className="text-gray-300">/analytics/agents</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">Get agent analytics</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-mono rounded mr-3">GET</span>
                                        <code className="text-gray-300">/analytics/performance</code>
                                    </div>
                                    <span className="text-gray-400 text-sm">Get performance data</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Example Request */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Example Request</h2>

                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                        <pre className="text-sm text-green-400 overflow-x-auto">
                            {`// Create a new agent
const response = await fetch('http://localhost:8000/api/v1/agents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Wallet-Address': '0x...'
  },
  body: JSON.stringify({
    name: 'Trading Agent',
    type: 'trader',
    description: 'Automated trading agent',
    config: {
      model: 'gpt-4',
      temperature: 0.7
    }
  })
});

const agent = await response.json();
console.log(agent);`}
                        </pre>
                    </div>
                </section>

                {/* Response Format */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Response Format</h2>

                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                        <pre className="text-sm text-green-400 overflow-x-auto">
                            {`{
  "id": "agent_123",
  "name": "Trading Agent",
  "type": "trader",
  "status": "active",
  "description": "Automated trading agent",
  "config": {
    "model": "gpt-4",
    "temperature": 0.7
  },
  "created_at": "2025-11-01T12:00:00Z",
  "updated_at": "2025-11-01T12:00:00Z"
}`}
                        </pre>
                    </div>
                </section>
            </main>
        </div>
    );
}
