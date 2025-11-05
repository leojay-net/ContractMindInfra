# ContractMind Infrastructure

Enterprise blockchain infrastructure for AI-powered smart contract interaction and management platform.

## Overview

ContractMind is a comprehensive platform that enables intelligent interaction with blockchain smart contracts through AI agents. The infrastructure consists of three core components: smart contracts, backend API services, and frontend application.

### Key Features

- AI-powered smart contract analysis and interaction
- Multi-agent orchestration for complex blockchain operations
- Real-time transaction monitoring and analytics
- Wallet-based authentication and authorization
- WebSocket support for real-time updates
- Comprehensive analytics and reporting

## Architecture

```
ContractMindInfra/
├── contracts/          # Smart contract layer (Solidity/Foundry)
├── backend/           # API and services layer (Python/FastAPI)
└── frontend/          # User interface layer (Next.js/TypeScript)
```

### System Components

#### 1. Smart Contracts (`/contracts`)

Solidity-based smart contracts deployed on Somnia Testnet.

- **Framework**: Foundry
- **Language**: Solidity ^0.8.0
- **Network**: Somnia Testnet (Chain ID: 50312)
- **Components**:
  - Agent Registry: Agent registration and management
  - ContractMind Hub: Core platform functionality
  - Staking Contracts: Token staking mechanisms

#### 2. Backend Services (`/backend`)

Python-based API server handling business logic and AI operations.

- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI Integration**: OpenAI, Anthropic Claude, Google Gemini
- **Features**:
  - RESTful API endpoints
  - WebSocket support for real-time communication
  - AI agent orchestration
  - Blockchain interaction services
  - Analytics and reporting

#### 3. Frontend Application (`/frontend`)

Modern web application providing user interface.

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Web3**: Wagmi + Viem
- **Wallet**: Reown AppKit (WalletConnect v3)
- **Features**:
  - Wallet-based authentication
  - Agent management interface
  - AI chat interface
  - Analytics dashboard
  - Real-time updates

## Prerequisites

### System Requirements

- Node.js >= 18.0.0
- Python >= 3.11
- PostgreSQL >= 14
- Git

### Required Tools

- **Frontend**: npm, Node.js
- **Backend**: Poetry, Python
- **Contracts**: Foundry (forge, anvil, cast)

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd ContractMindInfra
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
poetry install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations
poetry run alembic upgrade head

# Start server
poetry run uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 4. Setup Smart Contracts (Optional)

```bash
cd contracts

# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test

# Deploy to testnet
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

## Configuration

### Environment Variables

#### Backend (`backend/.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/contractmind

# API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# Blockchain
WEB3_PROVIDER_URI=https://dream-rpc.somnia.network
CHAIN_ID=50312

# Server
DEBUG=false
ALLOWED_ORIGINS=http://localhost:3000
```

#### Frontend (`frontend/.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Blockchain
NEXT_PUBLIC_CHAIN_ID=50312
NEXT_PUBLIC_RPC_URL=https://dream-rpc.somnia.network

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

#### Contracts (`contracts/.env`)

```env
# RPC URLs
RPC_URL=https://dream-rpc.somnia.network

# Private Keys (never commit these)
PRIVATE_KEY=your_private_key

# Contract Addresses
AGENT_REGISTRY=0x...
HUB_ADDRESS=0x...
```

## Development Workflow

### 1. Backend Development

```bash
cd backend

# Install dependencies
poetry install

# Run tests
poetry run pytest

# Run with auto-reload
poetry run uvicorn app.main:app --reload

# Type checking
poetry run mypy app/

# Linting
poetry run ruff check app/
```

### 2. Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Development mode
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

### 3. Smart Contract Development

```bash
cd contracts

# Compile contracts
forge build

# Run tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Format code
forge fmt

# Deploy to local network
anvil  # In separate terminal
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

## Testing

### Backend Tests

```bash
cd backend
poetry run pytest                    # Run all tests
poetry run pytest --cov             # With coverage
poetry run pytest tests/unit/       # Unit tests only
poetry run pytest tests/integration/ # Integration tests only
```

### Frontend Tests

```bash
cd frontend
npm test                # Run tests
npm test -- --coverage  # With coverage
npm test -- --watch     # Watch mode
```

### Smart Contract Tests

```bash
cd contracts
forge test              # Run all tests
forge test -vvv         # Verbose output
forge test --match-contract TestName  # Specific contract
forge test --match-test testFunction  # Specific test
```

## Deployment

### Backend Deployment

```bash
cd backend

# Build Docker image
docker build -t contractmind-backend .

# Run container
docker run -p 8000:8000 --env-file .env contractmind-backend

# Or use docker-compose
docker-compose up -d
```

### Frontend Deployment

```bash
cd frontend

# Build production bundle
npm run build

# Deploy to Vercel
vercel --prod

# Or build Docker image
docker build -t contractmind-frontend .
docker run -p 3000:3000 contractmind-frontend
```

### Smart Contract Deployment

```bash
cd contracts

# Deploy to Somnia Testnet
forge script script/Deploy.s.sol \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify

# Verify contracts
forge verify-contract $CONTRACT_ADDRESS \
  ContractName \
  --chain-id 50312
```

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

### Best Practices

1. **Never commit sensitive data**
   - Use environment variables
   - Add `.env` files to `.gitignore`
   - Use secret management tools in production

2. **Wallet Security**
   - Never expose private keys
   - Use hardware wallets for production
   - Implement proper key rotation

3. **API Security**
   - Implement rate limiting
   - Use HTTPS in production
   - Validate all inputs
   - Implement proper CORS policies

4. **Smart Contract Security**
   - Conduct security audits
   - Use established patterns
   - Implement access controls
   - Test thoroughly before deployment

## Troubleshooting

### Common Issues

#### Backend won't start

```bash
# Check PostgreSQL is running
pg_isready

# Check dependencies
poetry install

# Check environment variables
cat .env
```

#### Frontend build fails

```bash
# Clear cache
rm -rf .next node_modules
npm install

# Check TypeScript errors
npm run type-check
```

#### Wallet connection fails

- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Check network configuration matches Somnia Testnet
- Ensure RPC endpoint is accessible

#### Contract deployment fails

```bash
# Check balance
cast balance $YOUR_ADDRESS --rpc-url $RPC_URL

# Verify network connection
cast chain-id --rpc-url $RPC_URL

# Check gas price
cast gas-price --rpc-url $RPC_URL
```

## Documentation

### Component Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Smart Contracts Documentation](./contracts/README.md)

### API Documentation

- Backend API: `http://localhost:8000/docs` (Swagger UI)
- Backend API (Alternative): `http://localhost:8000/redoc` (ReDoc)

### Additional Resources

- [Architecture Diagrams](./docs/architecture/)
- [API Specifications](./docs/api/)
- [Deployment Guides](./docs/deployment/)

## Contributing

### Development Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Ensure all tests pass
4. Update documentation
5. Submit pull request
6. Pass code review
7. Merge to main

### Code Standards

- Follow language-specific style guides
- Write comprehensive tests
- Document complex logic
- Use meaningful commit messages
- Keep pull requests focused

### Commit Message Format

```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## License

Proprietary - All rights reserved

## Support

For technical support and questions:

- Review documentation in `/docs`
- Check existing GitHub issues
- Contact development team
