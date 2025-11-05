# Architecture Documentation

## System Architecture

ContractMind is a distributed infrastructure system consisting of three primary layers working in concert to provide AI-powered smart contract interaction capabilities.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │   Next.js Frontend (TypeScript)                     │     │
│  │   - Wallet Authentication (Reown AppKit)            │     │
│  │   - React Components (Dashboard, Chat, Analytics)   │     │
│  │   - Web3 Integration (Wagmi + Viem)                 │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌────────────────────────────────────────────────────┐     │
│  │   FastAPI Backend (Python)                          │     │
│  │   - RESTful API Endpoints                           │     │
│  │   - WebSocket Handlers                              │     │
│  │   - AI Agent Orchestration                          │     │
│  │   - Business Logic                                  │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐       │
│  │  PostgreSQL  │  │  Blockchain  │  │  AI Models  │       │
│  │   Database   │  │   Network    │  │   (APIs)    │       │
│  └──────────────┘  └──────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture

```
app/
├── (public routes)
│   └── page.tsx                    # Landing page
│
├── dashboard/ (protected)
│   ├── layout.tsx                  # WalletGuard wrapper
│   ├── page.tsx                    # Dashboard overview
│   ├── agents/
│   │   ├── page.tsx               # Agent list
│   │   ├── [id]/page.tsx          # Agent details
│   │   └── create/page.tsx        # Create agent
│   ├── analytics/
│   │   └── page.tsx               # Analytics dashboard
│   └── chat/
│       └── page.tsx               # Chat interface
│
├── layout.tsx                      # Root layout
└── providers.tsx                   # Provider configuration

components/
├── auth/
│   └── WalletGuard.tsx            # Authentication guard
├── dashboard/
│   ├── DashboardHeader.tsx        # Top navigation
│   ├── DashboardSidebar.tsx       # Side navigation
│   └── [feature-components]
├── landing/
│   └── [landing-components]
└── ui/
    └── [primitive-components]

lib/
├── api.ts                          # API client
├── config.ts                       # App configuration
└── utils.ts                        # Utility functions

providers/
└── Web3Provider.tsx                # Web3 configuration
```

### Backend Architecture

```
app/
├── main.py                         # Application entry point
├── config.py                       # Configuration management
│
├── api/                            # API endpoints
│   ├── agents.py                  # Agent CRUD operations
│   ├── chat.py                    # Chat endpoints
│   ├── analytics.py               # Analytics endpoints
│   ├── transactions.py            # Transaction handling
│   └── websocket.py               # WebSocket handlers
│
├── services/                       # Business logic
│   ├── ai_service.py              # AI model integration
│   ├── blockchain_service.py      # Blockchain interaction
│   ├── chat_service.py            # Chat orchestration
│   ├── intent_service.py          # Intent recognition
│   └── execution_service.py       # Transaction execution
│
├── models/                         # Data models
│   └── [sqlalchemy-models]
│
├── db/                             # Database layer
│   ├── session.py                 # Session management
│   └── [repository-pattern]
│
├── llm/                            # LLM integrations
│   ├── factory.py                 # Model factory
│   ├── openai.py                  # OpenAI integration
│   ├── claude.py                  # Anthropic integration
│   └── gemini.py                  # Google integration
│
└── middleware/                     # Request middleware
    └── error_handler.py           # Error handling
```

## Authentication Flow

### Wallet-Based Authentication

```
1. User visits dashboard route
   ↓
2. WalletGuard checks connection status
   ↓
3. If not connected → Redirect to landing page
   ↓
4. User clicks "Connect Wallet"
   ↓
5. Reown AppKit modal opens
   ↓
6. User selects wallet and approves connection
   ↓
7. Wallet address stored in wagmi state
   ↓
8. User redirected to dashboard
   ↓
9. Protected content rendered
```

### Session Management

```
Frontend (wagmi)         Backend (FastAPI)
      │                        │
      ├─── GET /api/auth/challenge
      │                        │
      │◄────── challenge ──────┤
      │                        │
      ├─── Sign message        │
      │                        │
      ├─── POST /api/auth/verify
      │    { address, signature }
      │                        │
      │                        ├─── Verify signature
      │                        │
      │◄────── session token ──┤
      │                        │
      ├─── Store token         │
      │                        │
      ├─── API requests with   │
      │    Authorization header │
      │                        │
```

## Data Flow

### Agent Creation Flow

```
User Input → Frontend Component → API Request → Backend Service
                                                      ↓
                                                 Validate Data
                                                      ↓
                                                 Store in DB
                                                      ↓
                                                 Return Agent
                                                      ↓
Frontend ← Update UI ← Response ←─────────────────────┘
```

### Chat Message Flow

```
User Message → Frontend Chat Component
                ↓
         WebSocket Connection
                ↓
         Backend WebSocket Handler
                ↓
         Intent Service (AI Analysis)
                ↓
         Agent Selection & Execution
                ↓
         Response Generation (LLM)
                ↓
         WebSocket Response
                ↓
         Frontend Update ← Display Message
```

### Transaction Execution Flow

```
User Action → Frontend Component → Sign Transaction
                                         ↓
                                   Wallet Approval
                                         ↓
                                   POST /api/transactions/execute
                                         ↓
                                   Backend Validation
                                         ↓
                                   Blockchain Service
                                         ↓
                                   Submit to Network
                                         ↓
                                   Monitor Status
                                         ↓
                                   Update Database
                                         ↓
                                   WebSocket Notification
                                         ↓
Frontend ← Update UI ← Transaction Confirmed ←──────┘
```

## Security Architecture

### Defense in Depth

```
Layer 1: Frontend
├── Input validation
├── XSS prevention
├── CSRF tokens
└── Secure storage (no private keys)

Layer 2: Network
├── HTTPS only
├── CORS configuration
├── Rate limiting
└── Request signing

Layer 3: Backend
├── Authentication middleware
├── Authorization checks
├── Input sanitization
├── SQL injection prevention
└── Secure session management

Layer 4: Database
├── Encrypted connections
├── Access controls
├── Prepared statements
└── Audit logging

Layer 5: Blockchain
├── Transaction validation
├── Gas limit checks
├── Signature verification
└── Smart contract security
```

### Threat Mitigation

| Threat | Mitigation |
|--------|------------|
| MITM Attack | HTTPS/TLS encryption |
| XSS | Content Security Policy, input sanitization |
| CSRF | SameSite cookies, CSRF tokens |
| SQL Injection | Parameterized queries, ORM |
| Replay Attack | Nonce validation, timestamps |
| Rate Limiting | Token bucket algorithm |
| Private Key Exposure | Client-side signing only |
| Unauthorized Access | Wallet-based authentication |

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    ↓
┌───────────┬───────────┬───────────┐
│ Frontend  │ Frontend  │ Frontend  │
│ Instance 1│ Instance 2│ Instance 3│
└───────────┴───────────┴───────────┘
    ↓
API Gateway
    ↓
┌───────────┬───────────┬───────────┐
│ Backend   │ Backend   │ Backend   │
│ Instance 1│ Instance 2│ Instance 3│
└───────────┴───────────┴───────────┘
    ↓
┌───────────┬───────────┐
│ Database  │ Cache     │
│ (Primary) │ (Redis)   │
└───────────┴───────────┘
```

### Performance Optimization

1. **Frontend**
   - Code splitting
   - Image optimization
   - Lazy loading
   - Service workers
   - CDN distribution

2. **Backend**
   - Connection pooling
   - Query optimization
   - Caching strategy
   - Async processing
   - Background jobs

3. **Database**
   - Indexing
   - Query optimization
   - Read replicas
   - Partitioning
   - Connection pooling

## Monitoring & Observability

### Metrics Collection

```
Application Metrics
├── Request rate
├── Response time
├── Error rate
├── Active users
└── Transaction volume

Infrastructure Metrics
├── CPU usage
├── Memory usage
├── Disk I/O
├── Network throughput
└── Database connections

Business Metrics
├── Agent performance
├── User engagement
├── Transaction success rate
├── Revenue metrics
└── User retention
```

### Logging Strategy

```
Frontend Logs
├── User actions
├── API errors
├── Performance metrics
└── Console errors

Backend Logs
├── Request/response logs
├── Error traces
├── Database queries
├── External API calls
└── Security events

Infrastructure Logs
├── System logs
├── Network logs
├── Security logs
└── Audit trails
```

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────┐
│            CDN (CloudFlare)              │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         Load Balancer (AWS ALB)          │
└─────────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────┐
│  Frontend (Vercel / AWS ECS)             │
│  - Multiple instances                     │
│  - Auto-scaling                          │
└──────────────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────┐
│  Backend (AWS ECS / Kubernetes)          │
│  - Multiple instances                     │
│  - Auto-scaling                          │
│  - Health checks                         │
└──────────────────────────────────────────┘
                   ↓
┌───────────────┬────────────────┬─────────┐
│   PostgreSQL  │    Redis       │ Blockchain │
│   (RDS)       │    (ElastiCache│  Node    │
└───────────────┴────────────────┴─────────┘
```

### CI/CD Pipeline

```
Code Push → GitHub
    ↓
Run Tests (GitHub Actions)
    ↓
Build Docker Image
    ↓
Push to Container Registry
    ↓
Deploy to Staging
    ↓
Automated Tests
    ↓
Manual Approval
    ↓
Deploy to Production
    ↓
Health Checks
    ↓
Monitor Metrics
```

## Technology Decisions

### Frontend Stack Rationale

| Technology | Rationale |
|------------|-----------|
| Next.js 14 | App Router, SSR, optimal performance |
| TypeScript | Type safety, better DX, fewer bugs |
| Wagmi | Best-in-class Web3 React hooks |
| Reown AppKit | WalletConnect v3, multi-wallet support |
| Tailwind CSS | Rapid development, consistent styling |
| React Query | Server state management, caching |

### Backend Stack Rationale

| Technology | Rationale |
|------------|-----------|
| FastAPI | High performance, async support, auto docs |
| Python 3.11+ | Rich AI/ML ecosystem, readability |
| PostgreSQL | ACID compliance, JSON support, reliability |
| SQLAlchemy | Mature ORM, type hints support |
| Pydantic | Data validation, type safety |
| WebSocket | Real-time communication |

## Future Enhancements

### Planned Features

1. **Multi-chain Support**
   - Ethereum mainnet
   - Polygon
   - Arbitrum
   - Optimism

2. **Advanced Analytics**
   - Machine learning insights
   - Predictive analytics
   - Custom dashboards

3. **Enhanced Security**
   - Multi-signature support
   - Hardware wallet integration
   - Biometric authentication

4. **Performance**
   - GraphQL API
   - Real-time subscriptions
   - Edge computing

5. **Scalability**
   - Microservices architecture
   - Event-driven design
   - Service mesh
