import Link from 'next/link';
import { ArrowLeft, Database } from 'lucide-react';

export default function BackendPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
            <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href="/docs" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Documentation
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Backend Documentation</h1>
                    <p className="text-xl text-gray-400">
                        FastAPI and AI service integration
                    </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
                    <Database className="w-12 h-12 text-orange-400 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Backend Services</h2>
                    <p className="text-gray-300 mb-6">
                        For detailed backend documentation, API services, and database schema,
                        please refer to the backend README in the repository.
                    </p>
                    <Link
                        href="/docs/api"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        View API Reference
                    </Link>
                </div>
            </main>
        </div>
    );
}
