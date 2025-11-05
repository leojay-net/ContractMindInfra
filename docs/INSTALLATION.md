# Installation Guide

Complete installation guide for ContractMind infrastructure platform.

## System Requirements

### Hardware Requirements

**Development Environment:**
- CPU: 2+ cores
- RAM: 8GB minimum, 16GB recommended
- Storage: 20GB available space
- Network: Stable internet connection

**Production Environment:**
- CPU: 4+ cores
- RAM: 16GB minimum, 32GB recommended
- Storage: 100GB SSD
- Network: High-speed internet with static IP

### Software Requirements

**Required:**
- Node.js >= 18.0.0 LTS
- Python >= 3.11
- PostgreSQL >= 14
- Git >= 2.30

**Optional:**
- Docker >= 20.10
- Redis >= 7.0 (for caching)
- Foundry (for smart contract development)

## Installation Steps

### 1. System Preparation

#### macOS

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install required packages
brew install node python@3.11 postgresql git

# Start PostgreSQL
brew services start postgresql
```

#### Ubuntu/Debian

```bash
# Update package list
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Git
sudo apt install -y git

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows

```powershell
# Install using Chocolatey (run PowerShell as Administrator)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install packages
choco install nodejs python postgresql git -y
```

### 2. Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/ContractMindInfra.git
cd ContractMindInfra
```

### 3. Backend Setup

#### Install Poetry

```bash
# macOS/Linux
curl -sSL https://install.python-poetry.org | python3 -

# Windows (PowerShell)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

#### Configure Backend

```bash
cd backend

# Install dependencies
poetry install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

#### Required Environment Variables

Edit `backend/.env`:

```env
# Database Configuration
DATABASE_URL=postgresql://contractmind:password@localhost:5432/contractmind
POSTGRES_USER=contractmind
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=contractmind

# API Keys
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GEMINI_API_KEY=your-gemini-key

# Blockchain Configuration
WEB3_PROVIDER_URI=https://dream-rpc.somnia.network
CHAIN_ID=50312
HUB_CONTRACT_ADDRESS=0x...
REGISTRY_CONTRACT_ADDRESS=0x...

# Server Configuration
DEBUG=false
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Redis (Optional)
REDIS_URL=redis://localhost:6379
```

#### Setup Database

```bash
# Create PostgreSQL database
createdb contractmind

# Or using psql
psql -U postgres
CREATE DATABASE contractmind;
CREATE USER contractmind WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE contractmind TO contractmind;
\q

# Run migrations
poetry run alembic upgrade head
```

#### Verify Backend Installation

```bash
# Run tests
poetry run pytest

# Start development server
poetry run uvicorn app.main:app --reload

# Server should be running at http://localhost:8000
# API docs available at http://localhost:8000/docs
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local
```

#### Required Environment Variables

Edit `frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=50312
NEXT_PUBLIC_CHAIN_NAME=Somnia Testnet
NEXT_PUBLIC_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_BLOCK_EXPLORER=https://somnia-devnet.socialscan.io

# WalletConnect Configuration (Required)
# Get your project ID from https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Contract Addresses
NEXT_PUBLIC_HUB_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS=0x...
```

#### Get WalletConnect Project ID

1. Visit https://cloud.walletconnect.com
2. Create a new project
3. Copy the Project ID
4. Paste into `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

#### Verify Frontend Installation

```bash
# Build the application
npm run build

# Start development server
npm run dev

# Application should be running at http://localhost:3000
```

### 5. Smart Contracts Setup (Optional)

```bash
cd ../contracts

# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install

# Create environment file
cp .env.example .env

# Edit .env
nano .env
```

#### Configure Contracts

Edit `contracts/.env`:

```env
# Network Configuration
RPC_URL=https://dream-rpc.somnia.network
CHAIN_ID=50312

# Deployment
PRIVATE_KEY=your_deployer_private_key
DEPLOYER_ADDRESS=0x...

# Explorer Verification
ETHERSCAN_API_KEY=your_api_key  # If applicable
```

#### Compile and Test

```bash
# Compile contracts
forge build

# Run tests
forge test

# Run tests with gas report
forge test --gas-report
```

## Post-Installation Setup

### 1. Create Admin User

```bash
cd backend
poetry run python scripts/create_admin.py
```

### 2. Fund Test Wallet

Get test SOMI tokens from the Somnia faucet:
- Visit: https://faucet.somnia.network
- Connect your wallet
- Request test tokens

### 3. Deploy Contracts (if needed)

```bash
cd contracts

# Deploy to local network (Anvil)
anvil  # In separate terminal

forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast

# Deploy to Somnia Testnet
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### 4. Update Contract Addresses

After deployment, update the contract addresses in:
- `backend/.env`
- `frontend/.env.local`

### 5. Restart Services

```bash
# Backend
cd backend
poetry run uvicorn app.main:app --reload

# Frontend (in new terminal)
cd frontend
npm run dev
```

## Verification

### Backend Verification

```bash
# Check health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","version":"1.0.0"}

# Check API documentation
open http://localhost:8000/docs
```

### Frontend Verification

```bash
# Open in browser
open http://localhost:3000

# Verify wallet connection
# 1. Click "Connect Wallet"
# 2. Connect MetaMask or other wallet
# 3. Switch to Somnia Testnet
# 4. Access dashboard
```

### Database Verification

```bash
# Connect to database
psql -U contractmind -d contractmind

# Check tables
\dt

# Expected tables:
# - agents
# - users
# - transactions
# - analytics
# etc.

\q
```

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

**Database connection failed:**
```bash
# Check PostgreSQL status
pg_isready

# Restart PostgreSQL
# macOS
brew services restart postgresql

# Linux
sudo systemctl restart postgresql
```

**Module not found:**
```bash
# Reinstall dependencies
poetry install --no-cache
```

### Frontend Issues

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Wallet connection fails:**
- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Check network configuration matches Somnia Testnet
- Ensure wallet is on correct network (Chain ID: 50312)

### Contract Issues

**Deployment fails:**
```bash
# Check account balance
cast balance $DEPLOYER_ADDRESS --rpc-url $RPC_URL

# Verify network connection
cast chain-id --rpc-url $RPC_URL
```

## Next Steps

After successful installation:

1. Read the [Architecture Documentation](../docs/ARCHITECTURE.md)
2. Review the [API Documentation](../docs/API.md)
3. Follow the [Quick Start Guide](../docs/quick-start/page.tsx)
4. Deploy your first agent
5. Test the chat interface

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs in `backend/logs/`
3. Check browser console for frontend errors
4. Review existing GitHub issues
5. Contact the development team

## Security Notes

- Never commit `.env` files to version control
- Use strong passwords for database
- Keep API keys secure
- Use environment variables for all secrets
- Enable HTTPS in production
- Regularly update dependencies
