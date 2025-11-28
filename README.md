# ContractMind Infrastructure

Enterprise-grade blockchain infrastructure for AI-powered smart contract interaction and management, featuring real-time on-chain data streaming powered by Somnia Data Streams.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Data Flow](#data-flow)
- [Somnia Data Streams Integration](#somnia-data-streams-integration)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

ContractMind is a comprehensive platform that bridges artificial intelligence and blockchain technology, enabling natural language interaction with smart contracts. The system uses AI agents to interpret user intent, analyze contract ABIs, and execute blockchain transactions safely and efficiently.

### What is ContractMind?

ContractMind transforms how users interact with blockchain smart contracts by:

- **Natural Language Processing**: Users can interact with smart contracts using plain English instead of technical commands
- **AI-Driven Analysis**: Multiple LLM providers (Gemini, Claude, OpenAI) analyze contract structures and recommend optimal interaction patterns
- **Agent Orchestration**: Specialized AI agents handle different aspects of contract interaction (analysis, execution, validation)
- **Real-time Data Streams**: All agent activity, chat history, and analytics are published on-chain via Somnia Data Streams
- **Verifiable History**: On-chain data provides tamper-proof audit trails for all interactions
- **Security First**: Built-in rate limiting, authorization controls, and transaction validation

### Use Cases

1. **DeFi Interactions**: Simplified interaction with DeFi protocols without understanding complex parameters
2. **NFT Management**: Natural language commands for minting, transferring, and managing NFT collections
3. **DAO Governance**: Participate in governance through conversational interfaces
4. **Contract Analysis**: Analyze unknown contracts to understand their functionality before interaction
5. **Multi-Contract Operations**: Execute complex operations across multiple contracts with single commands
6. **Verifiable Agent Analytics**: Track agent performance with on-chain, tamper-proof metrics

## Architecture

ContractMind employs a four-tier architecture optimized for scalability, security, and real-time data streaming.

```
+-----------------------------------------------------------------------+
|                         FRONTEND LAYER                                 |
|  Next.js 16 | React 19 | TypeScript | TailwindCSS                     |
|  Wallet Integration | Real-time UI | 3D Visualizations                |
|  Somnia Streams SDK | React Hooks for Real-time Data                  |
+-----------------------------------------------------------------------+
                                |
                         HTTPS / WebSocket
                                |
+-----------------------------------------------------------------------+
|                         BACKEND LAYER                                  |
|  FastAPI | Python 3.12 | PostgreSQL | Redis                           |
|  AI Orchestration | Blockchain Services | Analytics                    |
|  Streams Publishing Service | Real-time Event Processing              |
+-----------------------------------------------------------------------+
                                |
                           Web3 RPC
                                |
+-----------------------------------------------------------------------+
|                      BLOCKCHAIN LAYER                                  |
|  Somnia Testnet (Chain ID: 50312) | Solidity 0.8.20                   |
|  Agent Registry | Hub Contract | Staking System                       |
+-----------------------------------------------------------------------+
                                |
                       Data Streams Protocol
                                |
+-----------------------------------------------------------------------+
|                    SOMNIA DATA STREAMS LAYER                           |
|  Real-time Publishing | WebSocket Subscriptions                        |
|  On-chain Analytics | Verifiable Chat History | Leaderboards          |
+-----------------------------------------------------------------------+
```

## Data Flow

### Traditional Architecture (Without Data Streams)

```
+----------+     HTTP      +----------+     SQL      +------------+
|          | ------------> |          | -----------> |            |
|  Client  |               |  Backend |              |  Database  |
|          | <------------ |          | <----------- |            |
+----------+    Response   +----------+    Query     +------------+
                                |
                                | Web3 RPC
                                v
                          +----------+
                          | Somnia   |
                          | Chain    |
                          +----------+

Data Characteristics:
- Centralized storage in PostgreSQL
- Data can be modified or deleted
- No verifiable history
- Polling required for updates
- Single point of failure for data
```

### With Somnia Data Streams

```
+----------+     HTTP      +----------+     SQL      +------------+
|          | ------------> |          | -----------> |            |
|  Client  |               |  Backend |              |  Database  |
|          | <------------ |          | <----------- |            |
+----------+    Response   +----------+    Query     +------------+
     |                          |                          
     |   WebSocket              | Publish                  
     |   Subscribe              v                          
     |                    +----------+                     
     +----------------->  |  Somnia  |                     
           Real-time      |  Data    |                     
           Updates        |  Streams |                     
                          +----------+                     
                               |
                               | On-chain Storage
                               v
                          +----------+
                          | Somnia   |
                          | Chain    |
                          +----------+

Data Characteristics:
- Decentralized on-chain storage
- Immutable and tamper-proof
- Verifiable history with timestamps
- Real-time WebSocket subscriptions
- No single point of failure
- Cross-application data portability
```

### Detailed Data Flow Diagram

```
User Action                    Backend Processing                 Data Streams
-----------                    ------------------                 ------------

1. User sends                  2. Backend receives
   chat message   --------->      and processes
                                      |
                               3. AI generates
                                  response
                                      |
                               4. Store in DB     
                                  (fast access)
                                      |
                               5. Publish to      --------->  6. On-chain storage
                                  Streams                        (verifiable)
                                      |
                               7. Return response                    |
       <-----------------------------|                               |
                                                                     |
8. Frontend                                                          |
   receives response                                                 |
       |                                                             |
9. Subscribe to               <--------------------------------------+
   real-time updates              WebSocket notifications
   (optional)
```

## Somnia Data Streams Integration

ContractMind leverages Somnia Data Streams for real-time, on-chain data publishing and subscriptions. This provides verifiable, decentralized storage for all platform activity.

### What Data is Streamed?

| Data Type           | Description                    | Use Case                           |
| ------------------- | ------------------------------ | ---------------------------------- |
| Agent Execution     | Every agent function call      | Performance tracking, audit trails |
| Chat Messages       | User and AI conversations      | Verifiable chat history            |
| Analytics Snapshots | Periodic performance metrics   | Dashboards, reporting              |
| Transaction Events  | Blockchain transaction details | Transaction history                |
| Activity Feed       | Platform-wide activity         | Real-time notifications            |
| Leaderboards        | Agent rankings and scores      | Competitive metrics                |

### Schema Definitions

Six on-chain schemas are used:

```
AGENT_EXECUTION:
  - timestamp (uint64)
  - agentId (bytes32)
  - executor (address)
  - functionSelector (bytes32)
  - success (bool)
  - gasUsed (uint256)
  - errorMessage (string)

CHAT_MESSAGE:
  - timestamp (uint64)
  - sessionId (bytes32)
  - sender (address)
  - agentId (bytes32)
  - role (string)
  - content (string)
  - intentAction (string)

ANALYTICS_SNAPSHOT:
  - timestamp (uint64)
  - agentId (bytes32)
  - totalCalls (uint256)
  - successCount (uint256)
  - totalGasUsed (uint256)
  - uniqueUsers (uint256)

TRANSACTION_EVENT:
  - timestamp (uint64)
  - txHash (bytes32)
  - user (address)
  - agentId (bytes32)
  - action (string)
  - status (string)
  - gasUsed (uint256)

ACTIVITY_FEED:
  - timestamp (uint64)
  - entityId (bytes32)
  - entityType (string)
  - action (string)
  - actor (address)
  - metadata (string)

LEADERBOARD:
  - timestamp (uint64)
  - agentId (bytes32)
  - agentName (string)
  - score (uint256)
  - totalExecutions (uint256)
  - successRate (uint256)
```

### Benefits of Data Streams

1. **Verifiability**: All data is stored on-chain with cryptographic proofs
2. **Real-time Updates**: WebSocket subscriptions for instant notifications
3. **Decentralization**: No single point of failure for critical data
4. **Portability**: Other applications can read and use the data
5. **Audit Trail**: Complete, immutable history of all activity
6. **Transparency**: Public data that can be independently verified

### API Endpoints

| Method | Endpoint                            | Description                        |
| ------ | ----------------------------------- | ---------------------------------- |
| GET    | /api/v1/streams/status              | Service status and connection info |
| GET    | /api/v1/streams/schemas             | Available schema definitions       |
| POST   | /api/v1/streams/publish/execution   | Publish agent execution event      |
| POST   | /api/v1/streams/publish/chat        | Publish chat message               |
| POST   | /api/v1/streams/publish/analytics   | Publish analytics snapshot         |
| POST   | /api/v1/streams/publish/transaction | Publish transaction event          |
| POST   | /api/v1/streams/publish/activity    | Publish activity feed item         |
| POST   | /api/v1/streams/publish/leaderboard | Update leaderboard entry           |
| POST   | /api/v1/streams/publish/batch       | Batch publish multiple items       |

### Frontend Integration

React hooks are provided for easy integration:

```typescript
import { 
  useChatMessages, 
  useTransactionEvents, 
  useAgentActivity,
  useAnalyticsData 
} from '@/lib/streams';

function Dashboard({ agentId }) {
  const { data: messages } = useChatMessages(sessionId);
  const { data: events } = useTransactionEvents(agentId);
  const { data: activity } = useAgentActivity(agentId);
  const { data: analytics } = useAnalyticsData(agentId);
  
  // Render with real-time data
}
```

## Core Features

### AI-Powered Intelligence

- **Multi-LLM Support**: Integrated support for Google Gemini, Anthropic Claude, and OpenAI GPT models
- **Intent Recognition**: Advanced NLP to understand user intentions and map them to contract functions
- **Smart Parameter Inference**: AI-driven parameter suggestions based on contract requirements
- **Error Prevention**: Predictive analysis to prevent failed transactions and optimize gas usage

### Somnia Data Streams

- **Real-time Publishing**: All agent activity published on-chain for verifiable history
- **WebSocket Subscriptions**: Real-time updates without polling
- **On-chain Analytics**: Tamper-proof performance metrics and leaderboards
- **Verifiable Chat History**: All conversations stored on-chain with timestamps
- **Activity Feeds**: Platform-wide real-time activity notifications
- **Cross-application Data**: Data accessible to any application on Somnia

### Blockchain Integration

- **Somnia Testnet**: Full integration with Somnia blockchain (Chain ID: 50312)
- **Web3 Infrastructure**: Built on web3.py 6.15.1 for reliable blockchain interaction
- **Contract Registry**: On-chain agent registry for decentralized agent management
- **Event Monitoring**: Real-time blockchain event tracking and processing

### Agent Management

- **Agent Registration**: On-chain registration system for AI agents
- **Capability Declaration**: Agents declare their supported contracts and functions
- **Performance Tracking**: Monitor agent success rates, gas efficiency, and execution speed
- **Dynamic Selection**: Automatic agent selection based on task requirements

### Real-time Communication

- **WebSocket API**: Real-time updates for transaction status and contract events
- **Chat Interface**: Conversational UI for natural language contract interaction
- **Live Analytics**: Real-time dashboard showing system metrics and performance
- **Stream Subscriptions**: Subscribe to on-chain data changes instantly

### Security and Compliance

- **Wallet Authentication**: Secure wallet-based user authentication
- **Rate Limiting**: Configurable rate limits per user and agent
- **Function Authorization**: Granular control over which functions agents can execute
- **Audit Trail**: Complete transaction history and execution logs on-chain

## Architecture

ContractMind employs a three-tier architecture optimized for scalability, security, and maintainability.

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                         │
│  Next.js 16 | React 19 | TypeScript | TailwindCSS          │
│  Wallet Integration | Real-time UI | 3D Visualizations     │
└─────────────────────────────────────────────────────────────┘
                            │
                     HTTPS/WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Backend Layer                          │
│  FastAPI | Python 3.12 | PostgreSQL | Redis                │
│  AI Orchestration | Blockchain Services | Analytics         │
└─────────────────────────────────────────────────────────────┘
                            │
                         Web3 RPC
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Blockchain Layer                          │
│  Somnia Testnet | Solidity 0.8.20 | OpenZeppelin          │
│  Agent Registry | Hub Contract | Staking System            │
└─────────────────────────────────────────────────────────────┘
```

### System Components

#### 1. Smart Contract Layer (`/contracts`)

The blockchain foundation implementing core protocol logic.

**Technology**:
- Solidity 0.8.20
- Foundry development framework
- OpenZeppelin security libraries
- Somnia Testnet (Chain ID: 50312)

**Contracts**:

1. **AgentRegistry.sol**: Manages agent registration and authorization
   - On-chain agent identity verification
   - Capability declaration and validation
   - Ownership and access control

2. **ContractMindHubV2.sol**: Core execution and coordination hub
   - Function execution with context preservation
   - Rate limiting and security controls
   - Analytics and execution history
   - Protocol fee management

3. **HubAwareStaking.sol**: Token staking mechanism
   - Stake tokens for agent operation
   - Reward distribution
   - Slashing for malicious behavior

**Key Features**:
- Reentrancy protection on all state-changing functions
- Pausable operations for emergency scenarios
- Role-based access control
- Comprehensive event logging
- Gas-optimized implementations

#### 2. Backend Services Layer (`/backend`)

Python-based API server handling business logic and AI orchestration.

**Technology**:
- FastAPI 0.115.14 (async web framework)
- Python 3.12 with type hints
- PostgreSQL for persistent storage
- web3.py 6.15.1 for blockchain interaction
- SQLAlchemy ORM with connection pooling

**Architecture Modules**:

1. **API Layer** (`app/api/`):
   - RESTful endpoints for CRUD operations
   - WebSocket endpoints for real-time updates
   - Request validation with Pydantic
   - Automatic OpenAPI documentation

2. **AI/LLM Layer** (`app/llm/`):
   - Multi-provider abstraction (Gemini, Claude, OpenAI)
   - Factory pattern for provider selection
   - Streaming response support
   - Error handling and retry logic

3. **Blockchain Layer** (`app/blockchain/`):
   - Web3 client management
   - Contract interaction utilities
   - Event listening and processing
   - Transaction signing and submission

4. **Services Layer** (`app/services/`):
   - `ai_service.py`: LLM interaction and prompt management
   - `intent_service.py`: Natural language intent parsing
   - `chat_service.py`: Conversational interface logic
   - `execution_service.py`: Transaction execution coordination
   - `analytics_service.py`: Metrics aggregation and reporting
   - `blockchain_service.py`: Contract interaction abstraction
   - `streams_service.py`: Somnia Data Streams publishing

5. **Streams API** (`app/api/v1/streams.py`):
   - REST endpoints for data publishing
   - Schema management and validation
   - Batch publishing support
   - Service status monitoring

6. **Database Layer** (`app/db/`):
   - Connection pooling for performance
   - Migration management with Alembic
   - Models for agents, transactions, chat history
   - Query optimization

**Key Features**:
- Asynchronous request handling
- Middleware for error handling and CORS
- Structured logging with Loguru
- Health check endpoints
- Graceful shutdown handling

#### 3. Frontend Application Layer (`/frontend`)

Modern web application providing intuitive user interface.

**Technology**:
- Next.js 16.0.1 with App Router
- React 19.2.0
- TypeScript 5
- TailwindCSS 4 for styling
- Wagmi + Viem for Web3 integration
- Reown AppKit for wallet connection

**Application Structure**:

1. **Landing Pages** (`app/`):
   - Marketing homepage with 3D animations
   - Feature showcases
   - Documentation portal

2. **Dashboard** (`app/dashboard/`):
   - Overview with key metrics
   - Agent management interface
   - Analytics visualizations
   - Settings and configuration

3. **Chat Interface** (`app/dashboard/chat/`):
   - Real-time conversational UI
   - Message history
   - Transaction status updates
   - Multi-agent conversation support

4. **Components** (`components/`):
   - Reusable UI components
   - Custom logo and branding
   - 3D visualizations with Three.js
   - Responsive layouts

5. **Blockchain Integration** (`lib/`):
   - Contract ABI management
   - Transaction preparation
   - Wallet state management
   - Network configuration

6. **Somnia Data Streams** (`lib/streams/`):
   - `config.ts`: Chain and schema configuration
   - `client.ts`: SDK initialization and utilities
   - `read.ts`: Query data from streams
   - `write.ts`: Publish data to streams
   - `subscribe.ts`: WebSocket subscriptions
   - `hooks.ts`: React hooks for components

**Key Features**:
- Server-side rendering (SSR) for performance
- Optimistic UI updates
- Real-time WebSocket integration
- Somnia Data Streams SDK integration
- Progressive Web App (PWA) capabilities
- Mobile-responsive design
- Dark mode support

## Technology Stack

### Backend Technologies

| Technology | Version  | Purpose                   |
| ---------- | -------- | ------------------------- |
| Python     | 3.12+    | Core programming language |
| FastAPI    | 0.115.14 | Async web framework       |
| PostgreSQL | 14+      | Primary database          |
| SQLAlchemy | 2.0+     | ORM and database toolkit  |
| web3.py    | 6.15.1   | Ethereum interaction      |
| Pydantic   | 2.0+     | Data validation           |
| Loguru     | 0.7+     | Structured logging        |
| pytest     | 7.4+     | Testing framework         |

### AI/LLM Integration

| Provider      | Model             | Use Case              |
| ------------- | ----------------- | --------------------- |
| Google Gemini | gemini-1.5-pro    | Primary LLM (default) |
| Anthropic     | claude-3-5-sonnet | Advanced reasoning    |
| OpenAI        | gpt-4-turbo       | Alternative provider  |

### Frontend Technologies

| Technology         | Version | Purpose                     |
| ------------------ | ------- | --------------------------- |
| Next.js            | 16.0.1  | React framework             |
| React              | 19.2.0  | UI library                  |
| TypeScript         | 5.0+    | Type safety                 |
| TailwindCSS        | 4.0     | Styling framework           |
| Wagmi              | 2.19.2  | React hooks for Ethereum    |
| Viem               | 2.38.6  | TypeScript Ethereum library |
| Reown AppKit       | 1.8.12  | Wallet connection           |
| Somnia Streams SDK | 0.11.0  | Data streams integration    |
| Three.js           | 0.181.0 | 3D visualizations           |
| Zustand            | 5.0.8   | State management            |
| React Query        | 5.90.5  | Data fetching               |

### Smart Contract Technologies

| Technology   | Version | Purpose                |
| ------------ | ------- | ---------------------- |
| Solidity     | 0.8.20  | Contract language      |
| Foundry      | Latest  | Development framework  |
| OpenZeppelin | 5.0+    | Security libraries     |
| Forge        | Latest  | Testing and deployment |

### Data Streams

| Technology              | Purpose                  |
| ----------------------- | ------------------------ |
| Somnia Data Streams     | On-chain data publishing |
| WebSocket Subscriptions | Real-time updates        |
| Schema Encoding         | Structured data storage  |

### Infrastructure

| Service             | Purpose              |
| ------------------- | -------------------- |
| Render.com          | Backend hosting      |
| Vercel              | Frontend hosting     |
| PostgreSQL          | Database hosting     |
| Somnia Testnet      | Blockchain network   |
| Somnia Data Streams | Real-time data layer |

## Prerequisites

### System Requirements

- **Operating System**: macOS, Linux, or Windows with WSL2
- **Node.js**: Version 18.0.0 or higher
- **Python**: Version 3.12 or higher
- **PostgreSQL**: Version 14 or higher
- **Git**: Version 2.30 or higher
- **Memory**: Minimum 8GB RAM (16GB recommended)
- **Storage**: Minimum 10GB free space

### Required Tools

**For Frontend Development**:
- npm (comes with Node.js) or yarn
- Modern web browser (Chrome, Firefox, or Edge)

**For Backend Development**:
- pip (Python package manager)
- PostgreSQL client tools
- curl or Postman for API testing

**For Smart Contract Development**:
- Foundry toolkit (forge, cast, anvil)
- Solidity compiler (included with Foundry)

### Required API Keys

You will need API keys from the following services:

1. **LLM Providers** (at least one required):
   - Google Gemini: [Get API Key](https://makersuite.google.com/app/apikey)
   - Anthropic Claude: [Get API Key](https://console.anthropic.com/)
   - OpenAI: [Get API Key](https://platform.openai.com/api-keys)

2. **Wallet Services**:
   - Reown (WalletConnect) Project ID: [Get Project ID](https://cloud.reown.com/)

3. **Blockchain RPC**:
   - Somnia Testnet RPC: `https://dream-rpc.somnia.network` (public)

### Wallet Setup

1. Install MetaMask or compatible Web3 wallet
2. Add Somnia Testnet network:
   - Network Name: Somnia Testnet
   - RPC URL: https://dream-rpc.somnia.network
   - Chain ID: 50312
   - Currency Symbol: STT
   - Block Explorer: https://somnia-testnet.socialscan.io

3. Get testnet tokens from Somnia faucet (if available)

## Installation

### Quick Start (All Components)

```bash
# Clone the repository
git clone https://github.com/yourusername/ContractMindInfra.git
cd ContractMindInfra

# Install all dependencies (run from root)
./scripts/setup-all.sh  # If script exists, otherwise follow individual setups below
```

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# Required: DATABASE_URL, GEMINI_API_KEY, SOMNIA_RPC_URL, contract addresses
nano .env  # or use your preferred editor

# Initialize database
python -m app.db.models

# Verify installation
python test_db_connection.py

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API will be available at `http://localhost:8000`
- Swagger Documentation: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local file with your configuration
# Required: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
nano .env.local  # or use your preferred editor

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Smart Contract Setup (Optional)

Smart contracts are already deployed on Somnia Testnet. This setup is only needed if you want to deploy your own instances.

```bash
cd contracts

# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install

# Copy environment template
cp .env.example .env

# Edit .env with your private key and RPC URL
nano .env

# Compile contracts
forge build

# Run tests
forge test

# Deploy to Somnia Testnet
forge script script/Deploy.s.sol \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key $PRIVATE_KEY \
  --broadcast

# Save deployed addresses to backend .env
```

### Verify Installation

1. **Backend Health Check**:
```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy", "database": "connected"}
```

2. **Frontend Access**:
   - Open `http://localhost:3000` in your browser
   - You should see the landing page

3. **API Documentation**:
   - Open `http://localhost:8000/docs`
   - You should see the Swagger UI with all endpoints

## Configuration

### Backend Configuration (`backend/.env`)

Complete configuration reference:

```env
# ===========================
# Database Configuration
# ===========================
DATABASE_URL=postgresql://username:password@localhost:5432/contractmind
# For local development:
# postgresql://postgres:postgres@localhost:5432/contractmind

# ===========================
# API Configuration
# ===========================
API_V1_STR=/api/v1
PROJECT_NAME=ContractMind Backend
DEBUG=false
ENVIRONMENT=development  # development, staging, production

# ===========================
# Server Configuration
# ===========================
HOST=0.0.0.0
PORT=8000
WORKERS=4

# ===========================
# CORS Configuration
# ===========================
# Comma-separated list of allowed origins
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:5173,https://your-frontend-domain.com

# ===========================
# Blockchain Configuration
# ===========================
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
CHAIN_ID=50312

# Deployed contract addresses (from deployment output)
AGENT_REGISTRY_ADDRESS=0x...
CONTRACT_MIND_HUB_ADDRESS=0x...

# ===========================
# AI/LLM Configuration
# ===========================
# Primary LLM provider: gemini, claude, or openai
DEFAULT_LLM_PROVIDER=gemini

# Google Gemini (Required if using as default)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-pro

# Anthropic Claude (Optional)
ANTHROPIC_API_KEY=your_claude_api_key
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview

# ===========================
# Logging Configuration
# ===========================
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
```

### Frontend Configuration (`frontend/.env.local`)

Complete configuration reference:

```env
# ===========================
# API Configuration
# ===========================
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# For production:
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com
# NEXT_PUBLIC_WS_URL=wss://your-backend-domain.com

# ===========================
# Blockchain Configuration
# ===========================
NEXT_PUBLIC_CHAIN_ID=50312
NEXT_PUBLIC_RPC_URL=https://dream-rpc.somnia.network

# Contract addresses (must match backend)
NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_HUB_ADDRESS=0x...

# ===========================
# Wallet Configuration
# ===========================
# Get from: https://cloud.reown.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# ===========================
# Application Configuration
# ===========================
NEXT_PUBLIC_APP_NAME=ContractMind
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Blockchain Infrastructure

# ===========================
# Feature Flags
# ===========================
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_3D_ANIMATIONS=true
```

### Smart Contract Configuration (`contracts/.env`)

```env
# ===========================
# Network Configuration
# ===========================
RPC_URL=https://dream-rpc.somnia.network
CHAIN_ID=50312

# ===========================
# Deployment Configuration
# ===========================
# NEVER commit this file with real private keys!
PRIVATE_KEY=your_private_key_here

# Etherscan API for verification (if supported)
ETHERSCAN_API_KEY=your_api_key

# ===========================
# Gas Configuration
# ===========================
GAS_LIMIT=8000000
GAS_PRICE=20000000000  # 20 Gwei
```

### Environment-Specific Configuration

**Development**:
- Use local database
- Enable debug logging
- Allow all CORS origins (localhost)
- Use testnet contracts

**Staging**:
- Use hosted database
- Standard logging
- Restrict CORS to staging domain
- Use testnet contracts

**Production**:
- Use production database with backups
- Error-level logging only
- Strict CORS policy
- Use mainnet contracts
- Enable rate limiting
- Use HTTPS only

## Development

### Development Workflow

1. **Create Feature Branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**: Edit code following style guidelines

3. **Test Changes**: Run appropriate test suites

4. **Commit Changes**:
```bash
git add .
git commit -m "feat(scope): description"
```

5. **Push and Create PR**:
```bash
git push origin feature/your-feature-name
```

### Backend Development

#### Running the Development Server

```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run with specific log level
LOG_LEVEL=DEBUG uvicorn app.main:app --reload
```

#### Running Tests

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_api_endpoints.py

# Run specific test function
pytest tests/test_api_endpoints.py::test_get_agents

# Run with verbose output
pytest -v

# Run and stop at first failure
pytest -x
```

#### Code Quality

```bash
# Type checking with mypy
mypy app/

# Linting with ruff
ruff check app/

# Auto-fix linting issues
ruff check --fix app/

# Format code
ruff format app/
```

#### Database Management

```bash
# Create new migration
alembic revision --autogenerate -m "add new table"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history

# View current revision
alembic current
```

#### Working with LLM Providers

```python
# Example: Adding a new LLM provider
# 1. Create provider class in app/llm/providers/

from app.llm.base import BaseLLMProvider

class NewProvider(BaseLLMProvider):
    async def generate(self, prompt: str, **kwargs):
        # Implementation
        pass

# 2. Register in factory (app/llm/factory.py)
# 3. Add configuration in app/config.py
# 4. Add tests in tests/test_llm_factory.py
```

### Frontend Development

#### Running the Development Server

```bash
cd frontend

# Start development server
npm run dev

# Start on different port
PORT=3001 npm run dev

# Build for production
npm run build

# Run production build locally
npm run build && npm start
```

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/components/Dashboard.test.tsx
```

#### Code Quality

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Type checking
npx tsc --noEmit

# Format code with Prettier
npx prettier --write .
```

#### Component Development

```tsx
// Example: Creating a new component
// components/ui/NewComponent.tsx

'use client';

import { FC } from 'react';

interface NewComponentProps {
  title: string;
  onAction: () => void;
}

export const NewComponent: FC<NewComponentProps> = ({ title, onAction }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <button onClick={onAction} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Action
      </button>
    </div>
  );
};
```

#### Working with Web3

```typescript
// Example: Interacting with smart contracts
import { useContractWrite } from 'wagmi';
import { AGENT_REGISTRY_ABI } from '@/lib/contracts';

export function useRegisterAgent() {
  const { write, data, isLoading } = useContractWrite({
    address: process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS,
    abi: AGENT_REGISTRY_ABI,
    functionName: 'registerAgent',
  });

  const registerAgent = async (agentData: AgentData) => {
    await write({
      args: [agentData.name, agentData.description, agentData.capabilities],
    });
  };

  return { registerAgent, transaction: data, isLoading };
}
```

### Smart Contract Development

#### Development Environment

```bash
cd contracts

# Start local blockchain
anvil

# In another terminal, deploy to local network
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# Watch for file changes and recompile
forge build --watch
```

#### Running Tests

```bash
# Run all tests
forge test

# Run with gas reporting
forge test --gas-report

# Run specific test contract
forge test --match-contract AgentRegistryTest

# Run specific test function
forge test --match-test testRegisterAgent

# Run with verbose output (stack traces)
forge test -vvv

# Run with extreme verbosity (includes traces for passing tests)
forge test -vvvv
```

#### Contract Interaction

```bash
# Call a view function
cast call $CONTRACT_ADDRESS "getAgent(bytes32)" $AGENT_ID --rpc-url $RPC_URL

# Send a transaction
cast send $CONTRACT_ADDRESS "registerAgent(string,string)" "AgentName" "Description" \
  --private-key $PRIVATE_KEY --rpc-url $RPC_URL

# Get contract code
cast code $CONTRACT_ADDRESS --rpc-url $RPC_URL

# Get storage slot
cast storage $CONTRACT_ADDRESS 0 --rpc-url $RPC_URL
```

#### Debugging

```solidity
// Add console logging in contracts
import "forge-std/console.sol";

contract MyContract {
    function myFunction() public {
        console.log("Debug value:", someValue);
        console.logAddress(msg.sender);
    }
}
```

```bash
# Run tests with console output
forge test -vv
```

### API Development

#### Adding New Endpoints

```python
# 1. Define schemas in app/models/schemas.py
from pydantic import BaseModel

class AgentCreate(BaseModel):
    name: str
    description: str
    capabilities: list[str]

# 2. Create endpoint in app/api/v1/agents.py
from fastapi import APIRouter, Depends
from app.services.agent_service import AgentService

router = APIRouter()

@router.post("/agents", response_model=AgentResponse)
async def create_agent(
    agent_data: AgentCreate,
    service: AgentService = Depends()
):
    return await service.create_agent(agent_data)

# 3. Add business logic in app/services/agent_service.py
# 4. Add tests in tests/test_api_endpoints.py
```

#### WebSocket Development

```python
# Example: Adding WebSocket endpoint
from fastapi import WebSocket

@router.websocket("/ws/chat/{agent_id}")
async def websocket_chat(websocket: WebSocket, agent_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            response = await process_message(data, agent_id)
            await websocket.send_json(response)
    except WebSocketDisconnect:
        logger.info(f"Client disconnected from agent {agent_id}")
```

### Debugging

#### Backend Debugging

```python
# Add breakpoint in code
import pdb; pdb.set_trace()

# Or use built-in breakpoint()
breakpoint()

# Run with debugger
python -m pdb app/main.py
```

#### Frontend Debugging

```typescript
// Add console logs
console.log('Debug:', data);
console.table(array);
console.dir(object);

// React DevTools
// Install React DevTools browser extension

// Network inspection
// Use browser DevTools Network tab to inspect API calls
```

#### Smart Contract Debugging

```bash
# Use forge debugger
forge test --debug testFunctionName

# Trace transaction
cast run $TX_HASH --rpc-url $RPC_URL --debug
```

### Performance Optimization

#### Backend

```python
# Use async database queries
async with db_session() as session:
    result = await session.execute(query)

# Implement caching
from functools import lru_cache

@lru_cache(maxsize=100)
def expensive_operation(param):
    # Cached result
    pass

# Use connection pooling (already configured)
```

#### Frontend

```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* render */}</div>;
});

// Lazy load components
const LazyComponent = lazy(() => import('./HeavyComponent'));

// Optimize images
import Image from 'next/image';
<Image src="/logo.png" width={200} height={100} alt="Logo" />
```

## API Documentation

### REST API Endpoints

Base URL: `https://your-backend.onrender.com/api/v1`

#### Agents

**List All Agents**
```http
GET /agents
```
Response:
```json
{
  "agents": [
    {
      "id": "agent-123",
      "name": "DeFi Agent",
      "description": "Specialized in DeFi operations",
      "capabilities": ["swap", "stake", "provide_liquidity"],
      "status": "active",
      "success_rate": 0.98
    }
  ]
}
```

**Get Agent Details**
```http
GET /agents/{agent_id}
```

**Register New Agent**
```http
POST /agents
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "capabilities": ["string"],
  "contract_address": "0x...",
  "abi": [...]
}
```

#### Chat

**Send Message**
```http
POST /chat/{agent_id}
Content-Type: application/json

{
  "message": "Swap 100 USDC for ETH",
  "session_id": "optional-session-id"
}
```

Response:
```json
{
  "response": "I'll help you swap 100 USDC for ETH...",
  "intent": "token_swap",
  "transaction": {
    "to": "0x...",
    "data": "0x...",
    "value": "0"
  }
}
```

**Get Chat History**
```http
GET /chat/history?session_id={session_id}
```

#### Analytics

**Global Analytics**
```http
GET /analytics/global
```

Response:
```json
{
  "total_transactions": 1523,
  "total_agents": 12,
  "success_rate": 0.97,
  "total_gas_used": "15234567890",
  "period": "last_30_days"
}
```

**Agent Analytics**
```http
GET /analytics/agent/{agent_id}
```

#### Transactions

**List Transactions**
```http
GET /transactions?limit=20&offset=0&status=success
```

**Get Transaction Details**
```http
GET /transactions/{transaction_hash}
```

### WebSocket API

#### Chat WebSocket

**Connect**
```javascript
const ws = new WebSocket('wss://your-backend.onrender.com/ws/chat/{agent_id}');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'message',
    content: 'Hello, agent!'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Agent response:', data);
};
```

**Message Format**
```json
{
  "type": "message" | "transaction" | "status",
  "content": "string",
  "metadata": {}
}
```

#### Events WebSocket

**Connect**
```javascript
const ws = new WebSocket('wss://your-backend.onrender.com/ws/events');
```

**Event Types**:
- `agent_registered`: New agent registered
- `transaction_executed`: Transaction completed
- `intent_detected`: User intent identified
- `error`: Error occurred

### Interactive Documentation

- **Swagger UI**: `https://your-backend.onrender.com/docs`
- **ReDoc**: `https://your-backend.onrender.com/redoc`
- **OpenAPI JSON**: `https://your-backend.onrender.com/api/v1/openapi.json`

### Rate Limiting

- Default: 100 requests per hour per IP
- WebSocket: 1000 messages per hour per connection
- Exceeded: HTTP 429 Too Many Requests

### Error Responses

```json
{
  "error": {
    "code": "INVALID_AGENT",
    "message": "Agent not found",
    "details": {}
  }
}
```

Common Error Codes:
- `INVALID_AGENT`: Agent ID not found
- `INVALID_REQUEST`: Malformed request
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `BLOCKCHAIN_ERROR`: Blockchain interaction failed
- `LLM_ERROR`: AI service error

## Testing

### Backend Testing

#### Unit Tests

```bash
cd backend

# Run all unit tests
pytest tests/unit/

# Run specific test file
pytest tests/unit/test_ai_service.py

# Run with coverage
pytest tests/unit/ --cov=app --cov-report=html

# View coverage report
open htmlcov/index.html
```

#### Integration Tests

```bash
# Run integration tests (requires database)
pytest tests/integration/

# Run API endpoint tests
pytest tests/test_api_endpoints.py

# Run with real blockchain (caution: uses gas)
pytest tests/test_onchain_smoke.py --run-onchain
```

#### Test Structure

```python
# tests/test_example.py
import pytest
from app.services.agent_service import AgentService

@pytest.fixture
def agent_service():
    return AgentService()

def test_create_agent(agent_service):
    agent = agent_service.create_agent(
        name="Test Agent",
        description="Test description"
    )
    assert agent.name == "Test Agent"
    assert agent.status == "active"

@pytest.mark.asyncio
async def test_async_function():
    result = await async_operation()
    assert result is not None
```

### Frontend Testing

#### Component Tests

```bash
cd frontend

# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

#### Example Test

```typescript
// components/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays agent count', () => {
    render(<Dashboard agents={mockAgents} />);
    expect(screen.getByText('12 Active Agents')).toBeInTheDocument();
  });
});
```

#### E2E Tests (Optional)

```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test

# Run with UI
npx playwright test --ui
```

### Smart Contract Testing

#### Unit Tests

```bash
cd contracts

# Run all tests
forge test

# Run specific test
forge test --match-test testRegisterAgent

# Run with gas reporting
forge test --gas-report

# Run with coverage
forge coverage
```

#### Test Structure

```solidity
// test/AgentRegistry.t.sol
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AgentRegistry.sol";

contract AgentRegistryTest is Test {
    AgentRegistry public registry;
    address public owner = address(1);
    address public user = address(2);

    function setUp() public {
        registry = new AgentRegistry();
    }

    function testRegisterAgent() public {
        vm.prank(user);
        bytes32 agentId = registry.registerAgent("Test Agent", "Description");
        
        (string memory name, , , bool active) = registry.getAgent(agentId);
        assertEq(name, "Test Agent");
        assertTrue(active);
    }

    function testCannotRegisterWithEmptyName() public {
        vm.expectRevert("Name cannot be empty");
        registry.registerAgent("", "Description");
    }
}
```

#### Fuzz Testing

```solidity
function testFuzz_RegisterAgent(string memory name) public {
    vm.assume(bytes(name).length > 0 && bytes(name).length < 100);
    bytes32 agentId = registry.registerAgent(name, "Description");
    assertTrue(agentId != bytes32(0));
}
```

### Test Coverage Goals

- Backend: Minimum 80% coverage
- Frontend: Minimum 70% coverage
- Smart Contracts: Minimum 90% coverage

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - run: cd backend && pip install -r requirements.txt
      - run: cd backend && pytest --cov

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm test

  contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: foundry-rs/foundry-toolchain@v1
      - run: cd contracts && forge test
```

## Deployment

### Production Deployment Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Vercel         │────▶│   Render.com     │────▶│  Somnia Testnet  │
│   (Frontend)     │     │   (Backend)      │     │  (Blockchain)    │
│   Next.js SSR    │     │   FastAPI+Gunicorn│    │  Smart Contracts │
└──────────────────┘     └──────────────────┘     └──────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
   Static Assets          PostgreSQL DB            Event Logs
```

### Backend Deployment (Render.com)

#### Prerequisites
- Render.com account
- PostgreSQL database (Render provides this)
- Environment variables configured

#### Deployment Steps

1. **Create Render Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory as root

2. **Configure Build Settings**:
   ```yaml
   # render.yaml (already in project)
   services:
     - type: web
       name: contractmind-backend
       env: python
       region: oregon
       plan: free  # or paid plan
       buildCommand: "pip install --upgrade pip && pip install -r requirements.txt"
       startCommand: "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
       envVars:
         - key: PYTHON_VERSION
           value: 3.12.0
   ```

3. **Set Environment Variables** in Render Dashboard:
   ```env
   DATABASE_URL=postgresql://...  # Auto-provided by Render
   BACKEND_CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
   GEMINI_API_KEY=your_key
   SOMNIA_RPC_URL=https://dream-rpc.somnia.network
   AGENT_REGISTRY_ADDRESS=0x...
   CONTRACT_MIND_HUB_ADDRESS=0x...
   DEFAULT_LLM_PROVIDER=gemini
   ENVIRONMENT=production
   DEBUG=false
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Monitor logs for any errors

5. **Verify Deployment**:
   ```bash
   curl https://your-backend.onrender.com/health
   curl https://your-backend.onrender.com/api/v1/agents
   ```

#### Manual Deployment (Alternative)

```bash
cd backend

# Build Docker image
docker build -t contractmind-backend .

# Tag for registry
docker tag contractmind-backend registry.render.com/your-app/backend

# Push to Render
docker push registry.render.com/your-app/backend
```

### Frontend Deployment (Vercel)

#### Prerequisites
- Vercel account
- GitHub repository connected

#### Deployment Steps

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select `frontend` as root directory

2. **Configure Project Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_WS_URL=wss://your-backend.onrender.com
   NEXT_PUBLIC_CHAIN_ID=50312
   NEXT_PUBLIC_RPC_URL=https://dream-rpc.somnia.network
   NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x...
   NEXT_PUBLIC_HUB_ADDRESS=0x...
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a production URL (e.g., `your-app.vercel.app`)

5. **Configure Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

6. **Verify Deployment**:
   - Visit your Vercel URL
   - Check browser console for errors
   - Test wallet connection
   - Test API communication

#### Vercel CLI Deployment (Alternative)

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Smart Contract Deployment

Contracts are already deployed on Somnia Testnet. For new deployments:

```bash
cd contracts

# Ensure .env is configured with PRIVATE_KEY and RPC_URL

# Dry run (simulate deployment)
forge script script/Deploy.s.sol --rpc-url $RPC_URL

# Deploy to testnet
forge script script/Deploy.s.sol \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify  # if verification is supported

# Save deployed addresses
# Update backend/.env and frontend/.env.local with new addresses
```

#### Deployed Contract Addresses (Somnia Testnet)

```
Agent Registry: 0x[address-from-deployment]
ContractMind Hub: 0x[address-from-deployment]
Staking Contract: 0x[address-from-deployment]
```

### Database Migration

#### Initial Setup

```bash
# On Render, database is auto-provisioned
# Get DATABASE_URL from Render dashboard

# Run migrations (automatically done on deployment)
# If manual migration needed:
python -m alembic upgrade head
```

#### Backup and Restore

```bash
# Backup production database
pg_dump $DATABASE_URL > backup.sql

# Restore to local database
psql $LOCAL_DATABASE_URL < backup.sql

# Backup before major changes
# Render provides automatic daily backups on paid plans
```

### Environment-Specific Deployments

#### Staging Environment

```bash
# Use Render preview deployments or separate service
# Set ENVIRONMENT=staging
# Use separate database
# Deploy from staging branch
```

#### Production Environment

```bash
# Deploy from main branch only
# Set ENVIRONMENT=production
# Enable all security features
# Use production database with backups
# Enable monitoring and logging
```

### Continuous Deployment

Both Render and Vercel support automatic deployment on git push:

1. **Automatic Deployments**:
   - Push to `main` branch → Production deployment
   - Push to other branches → Preview deployment

2. **Rollback**:
   - Vercel: Click "Rollback" in deployment history
   - Render: Redeploy previous successful deployment

3. **Deploy Hooks**:
   ```bash
   # Trigger deployment via webhook
   curl -X POST https://api.render.com/deploy/[your-hook-id]
   ```

### Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Wallet connection works
- [ ] API requests succeed (check CORS)
- [ ] WebSocket connections establish
- [ ] Database queries execute correctly
- [ ] Contract interactions work
- [ ] Analytics data displays
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Performance monitoring enabled
- [ ] SSL/TLS certificates valid
- [ ] Environment variables secured
- [ ] Backup strategy in place

### Monitoring and Logging

#### Backend Monitoring

```python
# Health check endpoint (already implemented)
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

# Add monitoring service (e.g., Sentry)
import sentry_sdk
sentry_sdk.init(dsn="your-sentry-dsn")
```

#### Frontend Monitoring

```typescript
// Add error boundary
// Add analytics (e.g., Google Analytics, Vercel Analytics)
// Monitor Core Web Vitals

// Vercel Analytics (built-in)
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Troubleshooting Deployment Issues

#### Backend Issues

```bash
# Check Render logs
# Go to Render Dashboard → Your Service → Logs

# Common issues:
# 1. Missing environment variables
# 2. Database connection failed
# 3. Port binding issues (use $PORT from Render)
# 4. Dependencies not installed
```

#### Frontend Issues

```bash
# Check Vercel logs
# Go to Vercel Dashboard → Your Project → Deployments → Logs

# Common issues:
# 1. Environment variables not set
# 2. Build errors (TypeScript/ESLint)
# 3. API URL incorrect
# 4. CORS errors (check backend CORS_ORIGINS)
```

#### CORS Issues

If frontend can't communicate with backend:

1. Add frontend URL to backend `BACKEND_CORS_ORIGINS`
2. Format: `https://your-app.vercel.app`
3. Include protocol (https://)
4. No trailing slash
5. Redeploy backend after updating environment variable

## Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Frontend
curl http://localhost:3000/api/health
```

### Logs

```bash
# Backend logs
tail -f backend/logs/app.log

# Docker logs
docker logs contractmind-backend -f
```

### Database Maintenance

```bash
cd backend

# Create migration
poetry run alembic revision --autogenerate -m "description"

# Apply migrations
poetry run alembic upgrade head

# Rollback migration
poetry run alembic downgrade -1
```

## Security

### Security Principles

1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Minimum necessary permissions
3. **Secure by Default**: Security enabled from the start
4. **Zero Trust**: Verify every request
5. **Fail Securely**: Graceful degradation on errors

### Smart Contract Security

#### Access Control

```solidity
// Role-based access control
contract AgentRegistry is Ownable {
    mapping(address => bool) public authorizedOperators;
    
    modifier onlyAuthorized() {
        require(authorizedOperators[msg.sender] || msg.sender == owner(), 
                "Not authorized");
        _;
    }
}
```

#### Reentrancy Protection

```solidity
// All state-changing functions protected
contract ContractMindHub is ReentrancyGuard {
    function executeFunction(...) external nonReentrant {
        // Safe from reentrancy attacks
    }
}
```

#### Input Validation

```solidity
function registerAgent(string memory name, string memory description) external {
    require(bytes(name).length > 0, "Name cannot be empty");
    require(bytes(name).length <= 100, "Name too long");
    require(bytes(description).length <= 500, "Description too long");
    // ...
}
```

#### Emergency Controls

```solidity
// Pausable for emergency scenarios
contract ContractMindHub is Pausable {
    function executeFunction(...) external whenNotPaused {
        // Operations can be paused in emergencies
    }
}
```

#### Audit Checklist

- [ ] All external functions have access control
- [ ] All state changes are protected from reentrancy
- [ ] Input validation on all user-provided data
- [ ] Integer overflow/underflow prevented (Solidity 0.8+)
- [ ] No delegatecall to untrusted contracts
- [ ] Events emitted for all important state changes
- [ ] Gas optimization without sacrificing security
- [ ] Emergency pause mechanism implemented

### Backend Security

#### Authentication & Authorization

```python
# Wallet-based authentication
from app.middleware.auth import verify_signature

@router.post("/protected-endpoint")
async def protected_route(
    signature: str = Header(...),
    message: str = Header(...),
    address: str = Header(...)
):
    if not verify_signature(message, signature, address):
        raise HTTPException(status_code=401, detail="Invalid signature")
    # Proceed with authenticated request
```

#### Rate Limiting

```python
# Implemented in middleware
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/v1/agents")
@limiter.limit("100/hour")
async def get_agents():
    # Rate limited endpoint
    pass
```

#### Input Validation

```python
# Pydantic models for validation
from pydantic import BaseModel, Field, field_validator

class AgentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., max_length=500)
    
    @field_validator('name')
    def name_must_be_alphanumeric(cls, v):
        if not v.replace(' ', '').isalnum():
            raise ValueError('Name must be alphanumeric')
        return v
```

#### SQL Injection Prevention

```python
# Use parameterized queries (SQLAlchemy handles this)
from sqlalchemy import select

# Safe: SQLAlchemy uses parameterized queries
query = select(Agent).where(Agent.name == user_input)

# Never do this:
# query = f"SELECT * FROM agents WHERE name = '{user_input}'"
```

#### CORS Configuration

```python
# Strict CORS policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "http://localhost:3000"  # Development only
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

#### Environment Variables

```python
# Never hardcode secrets
from app.config import settings

# Good
api_key = settings.GEMINI_API_KEY

# Never do this:
# api_key = "hardcoded-api-key-abc123"
```

#### Logging Security

```python
from loguru import logger

# Don't log sensitive data
logger.info(f"User {user_address[:6]}... performed action")

# Never log:
# logger.info(f"API Key: {api_key}")
# logger.info(f"Private Key: {private_key}")
```

### Frontend Security

#### Wallet Security

```typescript
// Never expose private keys
// Always use wallet providers (MetaMask, etc.)

import { useAccount } from 'wagmi';

export function SecureComponent() {
  const { address } = useAccount();
  
  // Use address, never store or transmit private keys
  return <div>Connected: {address}</div>;
}
```

#### XSS Prevention

```typescript
// React automatically escapes content
// Be careful with dangerouslySetInnerHTML

// Safe
<div>{userInput}</div>

// Unsafe - only use with sanitized content
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

#### CSRF Protection

```typescript
// Use SameSite cookies and CSRF tokens
// Wagmi/Viem handle this for wallet signatures

const signMessage = async () => {
  // Message includes nonce/timestamp to prevent replay attacks
  const message = `Sign this message to authenticate: ${Date.now()}`;
  const signature = await signMessageAsync({ message });
  return { message, signature };
};
```

#### Secure Communication

```typescript
// Always use HTTPS in production
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Check for HTTPS in production
if (process.env.NODE_ENV === 'production' && !API_URL.startsWith('https://')) {
  console.error('API URL must use HTTPS in production');
}
```

#### Content Security Policy

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
];

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Secrets Management

#### Development

```bash
# Use .env files (never commit)
echo ".env" >> .gitignore

# backend/.env
GEMINI_API_KEY=your_key_here

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Production

```bash
# Use platform secret management
# Render.com: Environment Variables in dashboard
# Vercel: Environment Variables in project settings

# Never hardcode secrets in code
# Never commit .env files
# Rotate secrets regularly
```

### Security Best Practices

#### For Developers

1. **Never commit secrets**: Use `.gitignore` for `.env` files
2. **Validate all inputs**: Client-side and server-side
3. **Use HTTPS**: Always in production
4. **Keep dependencies updated**: `npm audit`, `pip audit`
5. **Code review**: All security-critical changes
6. **Principle of least privilege**: Minimal permissions
7. **Sanitize outputs**: Prevent XSS attacks
8. **Use prepared statements**: Prevent SQL injection
9. **Implement rate limiting**: Prevent abuse
10. **Log security events**: Monitor for suspicious activity

#### For Users

1. **Verify transactions**: Always check before signing
2. **Use hardware wallets**: For large amounts
3. **Check contract addresses**: Verify before interacting
4. **Review permissions**: Understand what you're approving
5. **Keep seed phrases secure**: Never share or enter on websites
6. **Use official links**: Avoid phishing sites
7. **Enable 2FA**: On wallet providers that support it
8. **Regular security updates**: Keep wallet software updated

### Incident Response

#### Security Issue Discovered

1. **Don't panic**: Document the issue carefully
2. **Assess severity**: Critical, High, Medium, Low
3. **Contain the issue**: Pause affected services if necessary
4. **Notify team**: Alert relevant stakeholders
5. **Develop fix**: Create patch or workaround
6. **Test thoroughly**: Ensure fix doesn't break functionality
7. **Deploy fix**: Roll out to all environments
8. **Post-mortem**: Document incident and prevention measures

#### Emergency Contacts

- Security Team: security@contractmind.io
- On-call Engineer: +1-XXX-XXX-XXXX
- Pause Contracts: Use owner account on Multisig

### Vulnerability Disclosure

If you discover a security vulnerability:

1. **Do not publicly disclose** the issue
2. **Email security@contractmind.io** with:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. **Allow time** for team to respond and fix
4. **Responsible disclosure**: We aim to fix within 30 days

### Security Audits

#### Smart Contracts

- Recommended: Full audit before mainnet deployment
- Audit firms: Trail of Bits, ConsenSys Diligence, OpenZeppelin
- Budget: $20,000 - $100,000 depending on complexity

#### Backend/Frontend

- Regular security scanning with tools:
  - Snyk: Dependency scanning
  - SonarQube: Code quality and security
  - OWASP ZAP: Web application scanning

## Troubleshooting

### Common Issues

#### Backend Issues

**Issue: Database Connection Failed**

```bash
Error: Could not connect to database
```

Solutions:
1. Check PostgreSQL is running:
   ```bash
   pg_isready
   # or
   sudo systemctl status postgresql
   ```

2. Verify DATABASE_URL format:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   ```

3. Test connection:
   ```bash
   psql $DATABASE_URL
   ```

4. Check firewall rules allow port 5432

**Issue: Import Error (web3 lru)**

```bash
ImportError: cannot import name 'lru' from 'web3.utils'
```

Solution: Ensure web3.py version 6.15.1 is installed
```bash
pip install web3==6.15.1
pip install lru-dict==1.2.0
```

**Issue: LLM API Key Invalid**

```bash
Error: Invalid API key
```

Solutions:
1. Verify API key is correct in `.env`
2. Check key hasn't expired
3. Ensure no extra spaces or quotes:
   ```env
   GEMINI_API_KEY=your_key  # Correct
   GEMINI_API_KEY="your_key"  # May cause issues
   ```

**Issue: Port Already in Use**

```bash
Error: Port 8000 is already in use
```

Solutions:
1. Find and kill process using port:
   ```bash
   lsof -i :8000
   kill -9 <PID>
   ```

2. Or use different port:
   ```bash
   uvicorn app.main:app --port 8001
   ```

#### Frontend Issues

**Issue: Build Fails**

```bash
Error: Build failed with X errors
```

Solutions:
1. Clear cache and rebuild:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. Check TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

3. Fix linting errors:
   ```bash
   npm run lint -- --fix
   ```

**Issue: Wallet Won't Connect**

Solutions:
1. Verify WALLETCONNECT_PROJECT_ID is set:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

2. Check network configuration matches:
   ```typescript
   chainId: 50312,  // Somnia Testnet
   ```

3. Clear browser cache and wallet cache

4. Try different wallet provider

**Issue: API Requests Failing (CORS)**

```bash
Error: Access blocked by CORS policy
```

Solutions:
1. Add frontend URL to backend CORS origins:
   ```env
   # Backend .env
   BACKEND_CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
   ```

2. Ensure proper format (no trailing slash):
   ```env
   # Correct
   BACKEND_CORS_ORIGINS=https://app.example.com
   
   # Wrong
   BACKEND_CORS_ORIGINS=https://app.example.com/
   ```

3. Restart backend after changing CORS settings

4. Check API URL in frontend:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com  # Include https://
   ```

**Issue: Environment Variables Not Loading**

```bash
Error: Cannot read env variable
```

Solutions:
1. Ensure file is named `.env.local` (frontend) or `.env` (backend)

2. Variables must start with `NEXT_PUBLIC_` in frontend:
   ```env
   # Accessible in browser
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # Not accessible (server-side only)
   API_SECRET=secret123
   ```

3. Restart development server after changing env vars

4. Check file is in correct directory

#### Smart Contract Issues

**Issue: Deployment Failed**

```bash
Error: Transaction reverted
```

Solutions:
1. Check account has sufficient balance:
   ```bash
   cast balance $YOUR_ADDRESS --rpc-url $RPC_URL
   ```

2. Increase gas limit in foundry.toml:
   ```toml
   [default]
   gas_limit = 10000000
   ```

3. Verify RPC URL is correct:
   ```bash
   cast chain-id --rpc-url $RPC_URL
   # Should return: 50312 for Somnia Testnet
   ```

**Issue: Contract Interaction Fails**

```bash
Error: Execution reverted
```

Solutions:
1. Verify contract address is correct
2. Check function signature matches ABI
3. Ensure caller has necessary permissions
4. Check function isn't paused
5. Verify input parameters are valid

**Issue: Gas Estimation Failed**

Solutions:
1. Ensure contract is deployed at address
2. Check function isn't view/pure
3. Try with explicit gas limit:
   ```bash
   cast send $CONTRACT "function()" --gas-limit 500000
   ```

### Debugging Tips

#### Backend Debugging

```python
# Add detailed logging
from loguru import logger

logger.debug(f"Variable value: {variable}")
logger.info(f"Processing request: {request_data}")
logger.error(f"Error occurred: {error}", exc_info=True)

# Use breakpoint for interactive debugging
breakpoint()  # Python 3.7+

# Check database queries
from app.db.session import get_db_connection

with get_db_connection() as conn:
    result = conn.execute("SELECT * FROM agents")
    print(result.fetchall())
```

#### Frontend Debugging

```typescript
// Browser console debugging
console.log('Data:', data);
console.table(arrayData);
console.dir(objectData);

// React DevTools
// Install React DevTools browser extension

// Network debugging
// Open Browser DevTools → Network tab
// Check API requests and responses

// State debugging with Zustand
import { useStore } from '@/stores/useStore';

const Debug = () => {
  const state = useStore();
  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
```

#### Contract Debugging

```bash
# Detailed error traces
forge test -vvvv

# Debug specific transaction
cast run $TX_HASH --rpc-url $RPC_URL --debug

# Check contract storage
cast storage $CONTRACT_ADDRESS 0 --rpc-url $RPC_URL

# Call view function
cast call $CONTRACT_ADDRESS "getAgent(bytes32)" $AGENT_ID --rpc-url $RPC_URL
```

### Performance Issues

**Backend Slow Response**

Solutions:
1. Check database queries (add indexes):
   ```sql
   CREATE INDEX idx_agents_status ON agents(status);
   ```

2. Enable query caching

3. Use connection pooling (already configured)

4. Monitor with profiling:
   ```python
   import cProfile
   cProfile.run('function_to_profile()')
   ```

**Frontend Slow Loading**

Solutions:
1. Optimize images:
   ```typescript
   import Image from 'next/image';
   <Image src="/logo.png" width={200} height={100} priority />
   ```

2. Code splitting:
   ```typescript
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

3. Reduce bundle size:
   ```bash
   npm run build
   # Check .next/analyze output
   ```

### Getting Help

#### Log Files

```bash
# Backend logs
tail -f backend/logs/app.log

# Frontend logs
# Check browser console (F12)

# Render logs
# Go to Render Dashboard → Service → Logs

# Vercel logs
# Go to Vercel Dashboard → Project → Logs
```

#### Diagnostic Commands

```bash
# Check system info
python --version
node --version
npm --version
forge --version

# Check dependencies
pip list | grep web3
npm list next

# Check running processes
ps aux | grep uvicorn
lsof -i :8000
```

#### Community Support

- GitHub Issues: [Repository Issues](https://github.com/yourusername/ContractMindInfra/issues)
- Discord: [Community Discord](#)
- Documentation: [Full Docs](#)
- Stack Overflow: Tag with `contractmind`

#### Reporting Bugs

When reporting bugs, include:

1. **Environment**:
   - OS and version
   - Python/Node.js version
   - Browser (if frontend issue)

2. **Steps to reproduce**:
   - Exact commands run
   - Configuration used
   - Input data

3. **Expected vs Actual behavior**:
   - What should happen
   - What actually happens

4. **Logs and errors**:
   - Full error messages
   - Stack traces
   - Relevant log excerpts

5. **Screenshots** (if applicable)

### Known Issues

1. **Web3.py version compatibility**:
   - Use exactly version 6.15.1
   - Later versions have lru import issues

2. **Next.js 16 with React 19**:
   - Some third-party libraries may show warnings
   - Wait for library updates or pin versions

3. **Wallet connection on mobile**:
   - Some wallets require specific app versions
   - Use WalletConnect for better compatibility

4. **Rate limiting on free tier**:
   - Render.com free tier may spin down after inactivity
   - First request after spin-down will be slow

## Contributing

### How to Contribute

We welcome contributions from the community! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow coding standards
4. **Add tests**: Ensure your changes are tested
5. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes

### Development Guidelines

#### Code Style

**Python (Backend)**:
- Follow PEP 8 style guide
- Use type hints
- Maximum line length: 100 characters
- Use Black for formatting
- Use Ruff for linting

**TypeScript (Frontend)**:
- Follow TypeScript best practices
- Use functional components
- Prefer hooks over class components
- Use meaningful variable names
- Use ESLint configuration provided

**Solidity (Contracts)**:
- Follow Solidity style guide
- Use NatSpec comments
- Explicit visibility modifiers
- Use latest stable compiler version

#### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```bash
feat(backend): add new agent analytics endpoint
fix(frontend): resolve wallet connection issue
docs(readme): update installation instructions
test(contracts): add fuzz tests for agent registration
```

#### Pull Request Process

1. **Update documentation**: If adding features
2. **Add tests**: For new functionality
3. **Update CHANGELOG**: Document changes
4. **Pass CI checks**: All tests must pass
5. **Code review**: Address reviewer feedback
6. **Squash commits**: Before merging (if requested)

#### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] No security vulnerabilities introduced
- [ ] Performance impact considered
- [ ] Backwards compatibility maintained
- [ ] Error handling implemented
- [ ] Logging added where appropriate

### Areas for Contribution

**High Priority**:
- Bug fixes
- Documentation improvements
- Test coverage improvements
- Performance optimizations

**Feature Requests**:
- New AI agent capabilities
- Additional LLM provider support
- Enhanced analytics features
- UI/UX improvements

**Good First Issues**:
- Look for issues labeled `good-first-issue`
- Documentation typos
- Adding examples
- Improving error messages

### Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Featured on project website (if significant contributions)

## License

Copyright (c) 2025 ContractMind

All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

For licensing inquiries, contact: licensing@contractmind.io

---

## Project Status

**Current Version**: 1.0.0  
**Status**: Active Development  
**Network**: Somnia Testnet  
**Last Updated**: November 2025

### Roadmap

**Phase 1** (Current):
- Core platform functionality
- Multi-LLM integration
- Basic analytics
- Testnet deployment

**Phase 2** (Q1 2026):
- Advanced agent capabilities
- Enhanced security features
- Mainnet deployment preparation
- Comprehensive audit

**Phase 3** (Q2 2026):
- Mainnet launch
- Additional blockchain networks
- Enterprise features
- Mobile application

### Contact

- Website: https://contractmind.io
- Email: contact@contractmind.io
- Twitter: @ContractMind
- Discord: [Join Community](#)
- GitHub: https://github.com/yourusername/ContractMindInfra

### Acknowledgments

Built with:
- FastAPI
- Next.js
- Foundry
- OpenZeppelin
- And many other amazing open-source projects

Special thanks to:
- The Ethereum community
- Somnia Network team
- Our contributors and testers

---

**Note**: This project is under active development. Features and APIs may change. Always refer to the latest documentation for up-to-date information.
