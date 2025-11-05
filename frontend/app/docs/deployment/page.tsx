import Link from 'next/link';
import { ArrowLeft, Cloud, Server, Container, Shield } from 'lucide-react';

export default function DeploymentPage() {
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
                    <h1 className="text-4xl font-bold text-white mb-4">Deployment Guide</h1>
                    <p className="text-xl text-gray-400">
                        Production deployment strategies for ContractMind infrastructure
                    </p>
                </div>

                {/* Deployment Options */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Deployment Options</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <Container className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Docker</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Containerized deployment with Docker Compose
                            </p>
                            <div className="text-sm text-gray-500">
                                Best for: Development, Testing, Self-hosted
                            </div>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <Cloud className="w-8 h-8 text-purple-400 mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">Vercel + Render</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Frontend on Vercel, Backend on Render
                            </p>
                            <div className="text-sm text-gray-500">
                                Best for: Quick deployment, Moderate scale
                            </div>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <Server className="w-8 h-8 text-green-400 mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">AWS</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Full AWS infrastructure with ECS & Amplify
                            </p>
                            <div className="text-sm text-gray-500">
                                Best for: Enterprise, High scale, Custom needs
                            </div>
                        </div>
                    </div>
                </section>

                {/* Docker Deployment */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Container className="w-6 h-6 mr-2 text-blue-400" />
                        Docker Deployment
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">1. Create Docker Compose File</h3>
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-sm text-green-400">
                                    {`version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: contractmind
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:your_password@postgres:5432/contractmind
      OPENAI_API_KEY: \${OPENAI_API_KEY}
      ANTHROPIC_API_KEY: \${ANTHROPIC_API_KEY}
    ports:
      - "8000:8000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
      NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: \${NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:`}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">2. Deploy</h3>
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                <code className="text-green-400">
                                    docker-compose up -d
                                </code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vercel + Render Deployment */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Cloud className="w-6 h-6 mr-2 text-purple-400" />
                        Vercel + Render Deployment
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Frontend on Vercel</h3>
                            <ol className="space-y-3 text-gray-300">
                                <li className="flex items-start">
                                    <span className="font-semibold text-white mr-2">1.</span>
                                    <span>Push your code to GitHub</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold text-white mr-2">2.</span>
                                    <span>Import project in Vercel dashboard</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold text-white mr-2">3.</span>
                                    <span>Set root directory to <code className="text-green-400">frontend</code></span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold text-white mr-2">4.</span>
                                    <span>Configure environment variables:</span>
                                </li>
                            </ol>
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mt-4">
                                <code className="text-green-400">
                                    NEXT_PUBLIC_API_URL=https://your-backend.onrender.com<br />
                                    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
                                </code>
                            </div>
                            <div className="mt-4">
                                <li className="flex items-start text-gray-300">
                                    <span className="font-semibold text-white mr-2">5.</span>
                                    <span>Deploy</span>
                                </li>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Backend on Render</h3>
                            <ol className="space-y-3 text-gray-300">
                                <li className="flex items-start">
                                    <span className="font-semibold text-white mr-2">1.</span>
                                    <span>Create new Web Service in Render</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold text-white mr-2">2.</span>
                                    <span>Connect your GitHub repository</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold text-white mr-2">3.</span>
                                    <span>Configure service:</span>
                                </li>
                            </ol>
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mt-4">
                                <code className="text-green-400">
                                    Root Directory: backend<br />
                                    Build Command: poetry install && poetry run alembic upgrade head<br />
                                    Start Command: poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000
                                </code>
                            </div>
                            <ol className="space-y-3 text-gray-300 mt-4" start={4}>
                                <li className="flex items-start">
                                    <span className="font-semibold text-white mr-2">4.</span>
                                    <span>Add PostgreSQL database in Render</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold text-white mr-2">5.</span>
                                    <span>Set environment variables (DATABASE_URL, API keys)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold text-white mr-2">6.</span>
                                    <span>Deploy</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>

                {/* AWS Deployment */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Server className="w-6 h-6 mr-2 text-green-400" />
                        AWS Deployment
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                            <p className="text-yellow-300">
                                AWS deployment requires AWS CLI and proper IAM credentials configured.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Architecture</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>• <strong className="text-white">Frontend:</strong> AWS Amplify</li>
                                <li>• <strong className="text-white">Backend:</strong> ECS Fargate</li>
                                <li>• <strong className="text-white">Database:</strong> RDS PostgreSQL</li>
                                <li>• <strong className="text-white">Load Balancer:</strong> Application Load Balancer</li>
                                <li>• <strong className="text-white">Monitoring:</strong> CloudWatch</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Deployment Steps</h3>
                            <ol className="space-y-4 text-gray-300">
                                <li>
                                    <div className="font-semibold text-white mb-2">1. Create RDS Database</div>
                                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                        <code className="text-green-400 text-sm">
                                            aws rds create-db-instance \<br />
                                            &nbsp;&nbsp;--db-instance-identifier contractmind-db \<br />
                                            &nbsp;&nbsp;--db-instance-class db.t3.micro \<br />
                                            &nbsp;&nbsp;--engine postgres \<br />
                                            &nbsp;&nbsp;--master-username postgres \<br />
                                            &nbsp;&nbsp;--master-user-password your_password \<br />
                                            &nbsp;&nbsp;--allocated-storage 20
                                        </code>
                                    </div>
                                </li>
                                <li>
                                    <div className="font-semibold text-white mb-2">2. Deploy Backend to ECS</div>
                                    <ul className="space-y-2 ml-4 mt-2">
                                        <li>• Build and push Docker image to ECR</li>
                                        <li>• Create ECS cluster and task definition</li>
                                        <li>• Configure Application Load Balancer</li>
                                        <li>• Create ECS service</li>
                                    </ul>
                                </li>
                                <li>
                                    <div className="font-semibold text-white mb-2">3. Deploy Frontend to Amplify</div>
                                    <ul className="space-y-2 ml-4 mt-2">
                                        <li>• Connect GitHub repository</li>
                                        <li>• Configure build settings</li>
                                        <li>• Set environment variables</li>
                                        <li>• Deploy</li>
                                    </ul>
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>

                {/* Smart Contracts Deployment */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Smart Contracts Deployment</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Deploy to Somnia Testnet</h3>
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                <pre className="text-sm text-green-400">
                                    {`# Set environment variables
export PRIVATE_KEY=your_private_key
export RPC_URL=https://dream-rpc.somnia.network

# Deploy contracts
cd contracts
forge script script/Deploy.s.sol:DeployScript \\
  --rpc-url $RPC_URL \\
  --private-key $PRIVATE_KEY \\
  --broadcast

# Verify contracts (if supported)
forge verify-contract <CONTRACT_ADDRESS> \\
  src/ContractMindHubV2.sol:ContractMindHubV2 \\
  --chain-id 50312`}
                                </pre>
                            </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                            <p className="text-blue-300">
                                <strong>Note:</strong> Get test tokens from the Somnia faucet before deploying.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Post-Deployment */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Shield className="w-6 h-6 mr-2 text-green-400" />
                        Post-Deployment Checklist
                    </h2>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start">
                                <input type="checkbox" className="mt-1 mr-3" />
                                <span>Run database migrations</span>
                            </li>
                            <li className="flex items-start">
                                <input type="checkbox" className="mt-1 mr-3" />
                                <span>Verify all API endpoints are working</span>
                            </li>
                            <li className="flex items-start">
                                <input type="checkbox" className="mt-1 mr-3" />
                                <span>Test wallet connection on frontend</span>
                            </li>
                            <li className="flex items-start">
                                <input type="checkbox" className="mt-1 mr-3" />
                                <span>Configure CORS for production domains</span>
                            </li>
                            <li className="flex items-start">
                                <input type="checkbox" className="mt-1 mr-3" />
                                <span>Set up monitoring and alerts</span>
                            </li>
                            <li className="flex items-start">
                                <input type="checkbox" className="mt-1 mr-3" />
                                <span>Configure SSL/TLS certificates</span>
                            </li>
                            <li className="flex items-start">
                                <input type="checkbox" className="mt-1 mr-3" />
                                <span>Set up backup strategy</span>
                            </li>
                            <li className="flex items-start">
                                <input type="checkbox" className="mt-1 mr-3" />
                                <span>Document deployment process</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Security Best Practices */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Security Best Practices</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Environment Variables</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li>• Never commit secrets to version control</li>
                                <li>• Use secrets managers (AWS Secrets Manager, etc.)</li>
                                <li>• Rotate API keys regularly</li>
                                <li>• Use different keys for each environment</li>
                            </ul>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Database Security</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li>• Enable SSL/TLS for connections</li>
                                <li>• Use strong passwords</li>
                                <li>• Restrict network access</li>
                                <li>• Enable automated backups</li>
                            </ul>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">API Security</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li>• Enable CORS with specific origins</li>
                                <li>• Implement rate limiting</li>
                                <li>• Use HTTPS only</li>
                                <li>• Validate all input data</li>
                            </ul>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Monitoring</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li>• Set up error tracking (Sentry, etc.)</li>
                                <li>• Monitor API response times</li>
                                <li>• Track database performance</li>
                                <li>• Set up uptime monitoring</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Next Steps */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Related Documentation</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Link
                            href="/docs/installation"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-white mb-2">Installation Guide</h3>
                            <p className="text-gray-400 text-sm">
                                Set up your development environment
                            </p>
                        </Link>

                        <Link
                            href="/docs/architecture"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-white mb-2">Architecture</h3>
                            <p className="text-gray-400 text-sm">
                                Understand the system design
                            </p>
                        </Link>

                        <Link
                            href="/docs/api"
                            className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
                            <p className="text-gray-400 text-sm">
                                Explore all available endpoints
                            </p>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
