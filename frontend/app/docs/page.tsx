/**
 * Documentation Home Page
 * Modern, comprehensive documentation for ContractMind platform
 */

'use client';

import {
  Rocket,
  Code,
  Book,
  Zap,
  Shield,
  MessageSquare,
  Brain,
  Blocks,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { DocSection, Callout, FeatureCard, TableOfContents } from '@/components/docs/DocComponents';
import { CodeBlock, InlineCode } from '@/components/docs/CodeBlock';

const tocSections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'quick-start', title: 'Quick Start' },
  { id: 'installation', title: 'Installation' },
  { id: 'architecture', title: 'Architecture' },
  { id: 'ai-agents', title: 'AI Agents' },
  { id: 'smart-contracts', title: 'Smart Contracts' },
  { id: 'chat-interface', title: 'Chat Interface' },
  { id: 'frontend', title: 'Frontend Guide' },
  { id: 'backend', title: 'Backend Guide' },
  { id: 'contracts', title: 'Contract Development' },
  { id: 'api', title: 'API Reference' },
  { id: 'deployment', title: 'Deployment' },
  { id: 'environment', title: 'Environment Setup' },
  { id: 'best-practices', title: 'Best Practices' },
];

export default function DocsHomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-6">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Blockchain Interaction</span>
            </div> */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              ContractMind Documentation
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl">
              Build intelligent AI agents that interact with smart contracts using natural language.
              No complex blockchain knowledge required.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/docs/quick-start"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
              >
                <Rocket className="w-5 h-5" />
                Quick Start Guide
              </Link>
              <Link
                href="/docs/architecture"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
              >
                <Book className="w-5 h-5" />
                Learn Architecture
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Left Content */}
          <div className="flex-1 max-w-4xl">
            {/* INTRODUCTION */}
            <DocSection id="introduction" title="What is ContractMind?" level={1}>
              <p className="text-gray-300 mb-4">
                ContractMind is an enterprise-grade platform that enables anyone to interact with blockchain
                smart contracts through AI-powered agents. Instead of writing code or understanding complex
                blockchain APIs, you simply chat with an AI agent that handles all the technical complexity for you.
              </p>
              <p className="text-gray-300 mb-4">
                The platform combines three core technologies:
              </p>
              <ul className="space-y-2 text-gray-300 ml-6">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span><strong>AI Language Models</strong> - Understands your intent and translates it to blockchain actions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Smart Contracts</strong> - Manages permissions and agent authorization on-chain</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Web3 Interface</strong> - Beautiful, intuitive UI for wallet connection and agent management</span>
                </li>
              </ul>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <FeatureCard
                  icon={<Brain className="w-6 h-6 text-white" />}
                  title="Natural Language AI"
                  description="Chat with smart contracts using plain English. No coding required."
                />
                <FeatureCard
                  icon={<Shield className="w-6 h-6 text-white" />}
                  title="Function Authorization"
                  description="Granular control over which functions agents can access and execute."
                />
                <FeatureCard
                  icon={<Zap className="w-6 h-6 text-white" />}
                  title="Real-Time Execution"
                  description="Instant transaction preparation with gas estimates and previews."
                />
                <FeatureCard
                  icon={<MessageSquare className="w-6 h-6 text-white" />}
                  title="Context-Aware Chat"
                  description="AI understands your contract's ABI and provides relevant suggestions."
                />
              </div>
            </DocSection>

            {/* QUICK START */}
            <DocSection id="quick-start" title="Quick Start" level={1}>
              <p className="text-gray-300 mb-6">
                Get ContractMind up and running in just a few minutes with this step-by-step guide.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Create an Agent</h4>
                    <p className="text-gray-400 text-sm mb-3">
                      Connect a smart contract by providing its address and ABI. The platform automatically
                      parses all available functions.
                    </p>
                    <CodeBlock
                      code={`// Example: Create agent for a staking contract
Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Contract: ERC20 Token with Staking
Functions: stake(), unstake(), getRewards(), balanceOf()`}
                      language="text"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Authorize Functions</h4>
                    <p className="text-gray-400 text-sm mb-3">
                      Choose which contract functions the AI agent can access. This provides granular
                      security control.
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-sm text-gray-300 mb-2">Authorized Functions:</p>
                      <div className="flex flex-wrap gap-2">
                        {['stake()', 'unstake()', 'balanceOf()', 'getRewards()'].map(func => (
                          <span key={func} className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-sm text-white">
                            {func}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Chat & Interact</h4>
                    <p className="text-gray-400 text-sm">
                      Use natural language to interact with the contract. The AI prepares transactions automatically.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Execute with Wallet</h4>
                    <p className="text-gray-400 text-sm">
                      Review and confirm transactions in your Web3 wallet. Full transparency and security.
                    </p>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* INSTALLATION */}
            <DocSection id="installation" title="Installation" level={1}>
              <p className="text-gray-300 mb-4">
                Set up your development environment to work with ContractMind.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3">Prerequisites</h3>
              <ul className="space-y-2 text-gray-300 ml-6 mb-6">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Node.js 18+ and npm</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Python 3.11+ and Poetry</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>PostgreSQL 14+</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Foundry (for smart contracts)</span>
                </li>
              </ul>

              <CodeBlock
                filename="Clone Repository"
                code={`git clone <repository-url>
cd ContractMindInfra

# Install Frontend
cd frontend
npm install

# Install Backend
cd ../backend
poetry install

# Install Smart Contracts
cd ../contracts
forge install`}
                language="bash"
              />
            </DocSection>

            {/* ARCHITECTURE */}
            <DocSection id="architecture" title="Architecture" level={1}>
              <p className="text-gray-300 mb-6">
                ContractMind consists of three main components working together to provide a seamless experience.
              </p>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                  <h4 className="font-semibold text-white mb-2">Frontend (Next.js)</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Modern React application built with Next.js 14, TypeScript, and Tailwind CSS. Handles wallet
                    connections, agent management, and chat interface.
                  </p>
                  <div className="text-xs text-gray-500">
                    Technologies: Next.js, TypeScript, Wagmi, Viem, Framer Motion
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                  <h4 className="font-semibold text-white mb-2">Backend (FastAPI)</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Python-based API server handling AI orchestration, database management, and blockchain
                    interactions. Integrates with OpenAI, Anthropic Claude, and Google Gemini.
                  </p>
                  <div className="text-xs text-gray-500">
                    Technologies: FastAPI, PostgreSQL, SQLAlchemy, Web3.py
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                  <h4 className="font-semibold text-white mb-2">Smart Contracts (Solidity)</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    On-chain permission management and agent registry. Deployed on Somnia Testnet with
                    Foundry for development and testing.
                  </p>
                  <div className="text-xs text-gray-500">
                    Technologies: Solidity, Foundry, OpenZeppelin
                  </div>
                </div>
              </div>
            </DocSection>

            {/* AI AGENTS */}
            <DocSection id="ai-agents" title="AI Agents" level={1}>
              <p className="text-gray-300 mb-4">
                AI agents are the core of ContractMind, translating natural language into smart contract interactions.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400 my-6">
                <p className="text-lg font-semibold text-white mb-2">Coming Soon</p>
                <p className="text-sm">Detailed documentation on AI agent architecture and customization.</p>
              </div>
            </DocSection>

            {/* SMART CONTRACTS */}
            <DocSection id="smart-contracts" title="Smart Contracts" level={1}>
              <p className="text-gray-300 mb-4">
                Learn about the on-chain components that power ContractMind's permission system.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400 my-6">
                <p className="text-lg font-semibold text-white mb-2">Coming Soon</p>
                <p className="text-sm">Smart contract API reference and deployment guides.</p>
              </div>
            </DocSection>

            {/* CHAT INTERFACE */}
            <DocSection id="chat-interface" title="Chat Interface" level={1}>
              <p className="text-gray-300 mb-4">
                Interact with smart contracts using natural language through the intuitive chat interface.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400 my-6">
                <p className="text-lg font-semibold text-white mb-2">Coming Soon</p>
                <p className="text-sm">Chat interface features, commands, and best practices.</p>
              </div>
            </DocSection>

            {/* FRONTEND */}
            <DocSection id="frontend" title="Frontend Development" level={1}>
              <p className="text-gray-300 mb-4">
                Build and customize the ContractMind frontend application.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400 my-6">
                <p className="text-lg font-semibold text-white mb-2">Coming Soon</p>
                <p className="text-sm">Frontend architecture, components, and customization guides.</p>
              </div>
            </DocSection>

            {/* BACKEND */}
            <DocSection id="backend" title="Backend Development" level={1}>
              <p className="text-gray-300 mb-4">
                Understand the backend architecture and API implementation.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400 my-6">
                <p className="text-lg font-semibold text-white mb-2">Coming Soon</p>
                <p className="text-sm">Backend services, database schema, and AI integration.</p>
              </div>
            </DocSection>

            {/* CONTRACTS */}
            <DocSection id="contracts" title="Contract Development" level={1}>
              <p className="text-gray-300 mb-4">
                Develop and test Solidity smart contracts for ContractMind.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400 my-6">
                <p className="text-lg font-semibold text-white mb-2">Coming Soon</p>
                <p className="text-sm">Smart contract development, testing, and deployment.</p>
              </div>
            </DocSection>

            {/* API */}
            <DocSection id="api" title="API Reference" level={1}>
              <p className="text-gray-300 mb-4">
                Complete API documentation for integrating with ContractMind.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400 my-6">
                <p className="text-lg font-semibold text-white mb-2">Coming Soon</p>
                <p className="text-sm">REST API endpoints, WebSocket events, and authentication.</p>
              </div>
            </DocSection>

            {/* DEPLOYMENT */}
            <DocSection id="deployment" title="Deployment" level={1}>
              <p className="text-gray-300 mb-4">
                Deploy ContractMind to production environments.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400 my-6">
                <p className="text-lg font-semibold text-white mb-2">Coming Soon</p>
                <p className="text-sm">Production deployment guides for all components.</p>
              </div>
            </DocSection>

            {/* ENVIRONMENT */}
            <DocSection id="environment" title="Environment Setup" level={1}>
              <p className="text-gray-300 mb-4">
                Configure environment variables and system requirements.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400 my-6">
                <p className="text-lg font-semibold text-white mb-2">Coming Soon</p>
                <p className="text-sm">Environment configuration and system requirements.</p>
              </div>
            </DocSection>

            {/* BEST PRACTICES */}
            <DocSection id="best-practices" title="Best Practices" level={1}>
              <p className="text-gray-300 mb-4">
                Learn best practices for building with ContractMind.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-400 my-6">
                <p className="text-lg font-semibold text-white mb-2">Coming Soon</p>
                <p className="text-sm">Security, performance, and development best practices.</p>
              </div>
            </DocSection>
          </div>
          {/* Right Sidebar - Table of Contents */}
          <div className="hidden xl:block w-64">
            <TableOfContents sections={tocSections} />
          </div>
        </div>
      </div>
    </div>
  );
}
