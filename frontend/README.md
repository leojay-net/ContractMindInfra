# ContractMind Frontend Infrastructure

Enterprise-grade frontend application for the ContractMind AI-powered smart contract interaction platform. Built with Next.js 14, TypeScript, and modern Web3 technologies.

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem
- **Wallet Connection**: Reown AppKit (WalletConnect v3)
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **UI Components**: Custom component library with Radix UI primitives

### Project Structure

```
frontend/
├── app/                        # Next.js App Router pages
│   ├── dashboard/             # Protected dashboard routes (wallet-gated)
│   │   ├── agents/            # Agent management
│   │   ├── analytics/         # Analytics dashboard
│   │   ├── chat/              # AI chat interface
│   │   └── create-agent/      # Agent creation
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Landing page
├── components/                # Reusable UI components
│   ├── auth/                  # Authentication components
│   ├── dashboard/             # Dashboard-specific components
│   ├── landing/               # Landing page components
│   └── ui/                    # Base UI primitives
├── lib/                       # Utility libraries
│   ├── api.ts                 # API client configuration
│   └── config.ts              # Application configuration
├── providers/                 # React context providers
│   └── Web3Provider.tsx       # Web3 wallet provider
├── types/                     # TypeScript type definitions
│   └── index.ts               # Shared interfaces and types
└── utils/                     # Utility functions

```

## Prerequisites

### Required Software

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Required Environment Variables

Create a `.env.local` file in the frontend directory:

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
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Obtaining WalletConnect Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the Project ID
4. Add to `.env.local` as `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd ContractMindInfra/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 4. Start Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:3000`

## Mock Mode (Demo Without Backend)

ContractMind frontend supports **mock mode** for demos and development without requiring the backend API or smart contracts to be running. This is perfect for presentations, UI testing, or working on frontend features independently.

### Enabling Mock Mode

Set the following environment variables in `.env.local`:

```env
# Enable mock mode (1 = use mocks, 0 = use real backend)
NEXT_PUBLIC_USE_MOCK=1

# Optional: Use real AI chat even when mocks are enabled (1 = real chat, 0 = mock replies)
NEXT_PUBLIC_USE_REAL_CHAT=0
```

### Mock Mode Features

When `NEXT_PUBLIC_USE_MOCK=1`, the frontend will:

✅ **Agent Management**: Create, read, update, and delete agents (stored in localStorage)  
✅ **ABI Parsing**: Paste contract address + ABI to create agent instances  
✅ **Chat Interface**: Interactive chat with rule-based mock responses  
✅ **Transaction Simulation**: Mock transaction preparation and execution  
✅ **Analytics**: Mock analytics data and metrics  
✅ **Persistence**: All mock data persists in localStorage across page reloads  

### Hybrid Mode: Real AI Chat with Mock Data

For the best demo experience, you can enable real AI chat while using mock agents:

```env
NEXT_PUBLIC_USE_MOCK=1
NEXT_PUBLIC_USE_REAL_CHAT=1
```

This configuration:
- Uses mock agents and transactions (no backend/contracts needed)
- Routes chat messages to the **real backend AI (Gemini/OpenAI/Claude)**
- Provides authentic AI responses while maintaining frontend-only demo capability

### Example Mock Chat Interactions

The mock chat includes simple rule-based responses:

- **"What's my balance?"** → Returns mock balance and APY data
- **"Stake 100 tokens"** → Prepares a mock stake transaction
- **"Withdraw 50"** → Prepares a mock withdrawal transaction  
- **"Hello"** → Greets and explains demo capabilities

### Sample Contract for Testing

When creating a mock agent, you can use this sample ERC-20 ABI and any contract address:

**Contract Address** (example): `0x1234567890123456789012345678901234567890`

**Sample ABI** (minimal ERC-20):
```json
[
  {
    "type": "function",
    "name": "balanceOf",
    "stateMutability": "view",
    "inputs": [{"name": "account", "type": "address"}],
    "outputs": [{"name": "", "type": "uint256"}]
  },
  {
    "type": "function",
    "name": "transfer",
    "stateMutability": "nonpayable",
    "inputs": [
      {"name": "recipient", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "outputs": [{"name": "", "type": "bool"}]
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {"indexed": true, "name": "from", "type": "address"},
      {"indexed": true, "name": "to", "type": "address"},
      {"indexed": false, "name": "value", "type": "uint256"}
    ]
  }
]
```

### Mock Data Storage

Mock data is stored in `localStorage` under the key `contractmind_frontend_mock_v1`:

```typescript
{
  agents: Agent[],           // Created agents
  chats: Record<string, ChatMessage[]>,  // Chat history per agent+user
  txs: any[]                 // Transaction history
}
```

To clear mock data: Open browser DevTools → Console → Run:
```javascript
localStorage.removeItem('contractmind_frontend_mock_v1')
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check
```

### Code Style Guidelines

- Use TypeScript strict mode
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error boundaries
- Add JSDoc comments for complex functions
- Use proper TypeScript types (avoid `any`)

### Component Documentation Standards

All components must include:

```typescript
/**
 * Component Name
 * 
 * Brief description of component purpose and functionality.
 * Additional context about usage patterns or constraints.
 * 
 * @module path/to/component
 */
```

## Authentication & Authorization

### Wallet-Based Authentication

The application uses wallet connection as the primary authentication method:

1. **Public Routes**: Landing page accessible without wallet
2. **Protected Routes**: All `/dashboard/*` routes require wallet connection
3. **Authentication Guard**: `WalletGuard` component enforces wallet requirement
4. **Auto-Redirect**: Unauthenticated users redirected to landing page

### Implementation

```typescript
// Dashboard routes are automatically protected
// via WalletGuard in dashboard/layout.tsx
import WalletGuard from '@/components/auth/WalletGuard';

export default function DashboardLayout({ children }) {
  return (
    <WalletGuard>
      {children}
    </WalletGuard>
  );
}
```

## API Integration

### API Client Configuration

```typescript
// lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Making API Requests

```typescript
// GET request
const agents = await api.get('/api/agents');

// POST request with data
const newAgent = await api.post('/api/agents', {
  name: 'Agent Name',
  type: 'contract-analysis',
});

// Error handling
try {
  const response = await api.get('/api/endpoint');
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.data);
  }
}
```

## Web3 Integration

### Wallet Connection

The application uses Reown AppKit (formerly WalletConnect) for wallet connections:

```typescript
// Supported wallets:
// - MetaMask
// - WalletConnect v3 compatible wallets
// - Injected wallets
// - Mobile wallets via QR code
```

### Network Configuration

Currently configured for **Somnia Testnet**:

- Chain ID: 50312
- RPC: https://dream-rpc.somnia.network
- Currency: SOMI
- Explorer: https://somnia-devnet.socialscan.io

### Using Web3 Hooks

```typescript
import { useAccount, useBalance, useContractWrite } from 'wagmi';

function Component() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  
  // Component logic
}
```

## State Management

### React Query for Server State

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetching data
const { data, isLoading, error } = useQuery({
  queryKey: ['agents'],
  queryFn: () => api.get('/api/agents'),
});

// Mutations
const mutation = useMutation({
  mutationFn: (newAgent) => api.post('/api/agents', newAgent),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['agents'] });
  },
});
```

## Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Test production build locally
npm start
```

### Environment Configuration

Production deployment requires:

1. All environment variables configured
2. Valid WalletConnect Project ID
3. Backend API accessible from frontend domain
4. CORS configured on backend for frontend domain

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Docker

```dockerfile
# Production Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Performance Optimization

### Implemented Optimizations

- Next.js automatic code splitting
- Image optimization via next/image
- Font optimization via next/font
- React Query caching
- Lazy loading for heavy components
- Debounced search inputs
- Optimistic UI updates

### Best Practices

- Use dynamic imports for large dependencies
- Implement proper loading states
- Cache API responses appropriately
- Minimize client-side JavaScript
- Use proper image formats (WebP, AVIF)

## Security Considerations

### Implemented Security Measures

1. **Environment Variables**: Sensitive data in environment variables
2. **Wallet Validation**: Verify wallet signatures server-side
3. **Input Sanitization**: All user inputs sanitized
4. **HTTPS Only**: Enforce HTTPS in production
5. **CSP Headers**: Content Security Policy configured
6. **Rate Limiting**: API rate limiting on backend

### Security Checklist

- [ ] All API endpoints use HTTPS in production
- [ ] Environment variables properly configured
- [ ] No sensitive data in client-side code
- [ ] Wallet transactions require user confirmation
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies regularly updated for security patches

## Troubleshooting

### Common Issues

#### Wallet Connection Fails

```bash
# Check WalletConnect Project ID is set
echo $NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

# Verify network configuration
# Ensure RPC URL is accessible
curl https://dream-rpc.somnia.network
```

#### API Connection Issues

```bash
# Verify backend is running
curl http://localhost:8000/health

# Check CORS configuration on backend
# Verify NEXT_PUBLIC_API_URL is correct
```

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

## Testing

### Running Tests

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Testing Guidelines

- Write tests for utility functions
- Test component rendering
- Test user interactions
- Mock API calls
- Test error states
- Test loading states

## Contributing

### Development Workflow

1. Create feature branch from `main`
2. Implement changes with proper documentation
3. Run linter and type checking
4. Test locally
5. Submit pull request
6. Pass code review
7. Merge to main

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Support & Documentation

### Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [Reown AppKit Documentation](https://docs.reown.com/appkit)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Getting Help

- Check existing GitHub issues
- Review API documentation
- Consult team documentation
- Contact development team

## License

Proprietary - All rights reserved

