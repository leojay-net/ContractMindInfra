# ContractMind Backend

Python-based backend for ContractMind AI-powered blockchain infrastructure.

## Technology Stack

- FastAPI - High-performance async web framework
- Web3.py 6.15.1 - Blockchain interaction with Somnia
- PostgreSQL - Analytics and agent configuration storage
- Somnia Data Streams - Real-time on-chain data publishing
- Multi-LLM Support - Gemini, Claude, OpenAI integration
- WebSockets - Real-time chat communication

## Architecture

```
+-----------------------------------------------------------------------+
|                           FRONTEND                                     |
+-----------------------------------------------------------------------+
                                |
                          HTTP / WebSocket
                                |
+-----------------------------------------------------------------------+
|                      BACKEND (FastAPI)                                 |
|                                                                        |
|  +------------------+  +------------------+  +------------------+      |
|  |   AI Service     |  |  Chat Service    |  | Streams Service  |      |
|  |  (Gemini/Claude) |  |  (Conversations) |  | (Data Streams)   |      |
|  +------------------+  +------------------+  +------------------+      |
|           |                    |                    |                  |
|  +------------------+  +------------------+  +------------------+      |
|  |  Intent Service  |  | Execution Svc    |  | Analytics Svc    |      |
|  |  (Parse Intent)  |  | (Prepare TX)     |  | (Metrics)        |      |
|  +------------------+  +------------------+  +------------------+      |
|           |                    |                    |                  |
|  +------------------+  +------------------+  +------------------+      |
|  | Blockchain Svc   |  |   Database       |  |  Streams API     |      |
|  | (Web3 + Somnia)  |  |  (PostgreSQL)    |  | (REST Endpoints) |      |
|  +------------------+  +------------------+  +------------------+      |
+-----------------------------------------------------------------------+
                                |
                           Web3 RPC
                                |
+-----------------------------------------------------------------------+
|                      SOMNIA BLOCKCHAIN                                 |
|  AgentRegistry | ContractMindHubV2 | Data Streams                      |
+-----------------------------------------------------------------------+
```

## Data Flow with Streams

```
User Request                Backend Processing              Data Streams
------------                ------------------              ------------

1. Chat message    ---->    2. AI processes
                                   |
                            3. Generate response
                                   |
                            4. Store in DB       ---->     5. Publish on-chain
                                   |                           (verifiable)
                            6. Return response
       <-----------------------+
                                                                |
7. Real-time       <------------------------------------------- +
   subscription         WebSocket notification
```

## Prerequisites

- Python 3.12+
- PostgreSQL 14+
- pip (Python package manager)
- Access to Somnia RPC
- At least one LLM API key (Gemini, Claude, or OpenAI)

## Quick Start

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
```env
# Blockchain
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
AGENT_REGISTRY_ADDRESS=0x318FFd8Fc398a3639Faa837307Ffdd0b9E1017c9
CONTRACT_MIND_HUB_ADDRESS=0x8244777FAe8F2f4AE50875405AFb34E10164C027

# Somnia Data Streams
SOMNIA_STREAMS_ENABLED=true
SOMNIA_PRIVATE_KEY=your_private_key_here

# AI (at least one required)
GEMINI_API_KEY=your-gemini-api-key
DEFAULT_LLM_PROVIDER=gemini

# Database
user=postgres
password=your_password
host=localhost
port=5432
dbname=contractmind
```

### 4. Initialize Database

```bash
python -m app.db.models
```

### 5. Run Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

Server will start at: http://localhost:8000

- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- Streams Status: http://localhost:8000/api/v1/streams/status

## Project Structure

```
backend/
├── app/
│   ├── api/v1/              # API endpoints
│   │   ├── agents.py        # Agent management
│   │   ├── chat.py          # Chat (REST)
│   │   ├── transactions.py  # Transaction handling
│   │   ├── analytics.py     # Analytics queries
│   │   ├── websocket.py     # WebSocket chat
│   │   └── streams.py       # Somnia Data Streams API
│   │
│   ├── services/            # Business logic
│   │   ├── ai_service.py    # LLM interaction
│   │   ├── intent_service.py
│   │   ├── chat_service.py  # Chat processing
│   │   ├── execution_service.py
│   │   ├── blockchain_service.py
│   │   ├── analytics_service.py
│   │   └── streams_service.py  # Data Streams publishing
│   │
│   ├── blockchain/          # Web3 layer
│   │   ├── client.py
│   │   └── events.py
│   │
│   ├── llm/                 # LLM providers
│   │   ├── base.py
│   │   ├── factory.py
│   │   ├── gemini.py
│   │   ├── claude.py
│   │   └── openai.py
│   │
│   ├── models/              # Data models
│   │   └── schemas.py
│   │
│   ├── db/                  # Database
│   │   ├── session.py
│   │   └── models.py
│   │
│   └── middleware/          # Middleware
│       └── error_handler.py
│
├── tests/                   # Tests
├── scripts/                 # Utility scripts
└── contracts/               # Contract ABIs
```

## Somnia Data Streams

The backend includes full integration with Somnia Data Streams for publishing verifiable on-chain data.

### Streams API Endpoints

| Method | Endpoint                            | Description             |
| ------ | ----------------------------------- | ----------------------- |
| GET    | /api/v1/streams/status              | Service status          |
| GET    | /api/v1/streams/schemas             | Schema definitions      |
| POST   | /api/v1/streams/publish/execution   | Publish agent execution |
| POST   | /api/v1/streams/publish/chat        | Publish chat message    |
| POST   | /api/v1/streams/publish/analytics   | Publish analytics       |
| POST   | /api/v1/streams/publish/transaction | Publish transaction     |
| POST   | /api/v1/streams/publish/activity    | Publish activity        |
| POST   | /api/v1/streams/publish/leaderboard | Update leaderboard      |
| POST   | /api/v1/streams/publish/batch       | Batch publish           |

### Streams Service Usage

```python
from app.services.streams_service import get_streams_service

streams = get_streams_service()

# Check if enabled
if streams.enabled:
    # Publish agent execution
    result = await streams.publish_agent_execution(
        agent_id="agent-123",
        executor="0x...",
        function_selector="0x12345678",
        success=True,
        gas_used=50000
    )
    
    if result.success:
        print(f"Published: {result.tx_hash}")
```

## API Endpoints

### REST Endpoints

| Method | Endpoint                     | Description        |
| ------ | ---------------------------- | ------------------ |
| GET    | /health                      | Health check       |
| GET    | /api/v1/agents               | List agents        |
| GET    | /api/v1/agents/{id}          | Get agent details  |
| POST   | /api/v1/agents/register      | Register new agent |
| POST   | /api/v1/chat/message         | Send chat message  |
| GET    | /api/v1/chat/history         | Get chat history   |
| GET    | /api/v1/analytics/global     | Global analytics   |
| GET    | /api/v1/analytics/agent/{id} | Agent analytics    |

### WebSocket

```
WS /api/v1/ws/chat/{agent_id}?user_address={address}
```

Message types:
```json
// Send
{
  "type": "chat",
  "message": "Stake 1000 tokens"
}

// Receive
{
  "type": "transaction_ready",
  "transaction": {
    "to": "0x...",
    "data": "0x...",
    "gas": 370000,
    "description": "Stake 1000 SOMI"
  }
}
```

### REST API

```
GET  /api/v1/agents              # List agents
GET  /api/v1/agents/{id}         # Get agent
POST /api/v1/chat/message        # Process message (REST)
POST /api/v1/transactions/status # Get tx status
POST /api/v1/transactions/validate
GET  /api/v1/analytics/user/{address}
GET  /api/v1/analytics/agent/{id}
GET  /api/v1/analytics/global
```

## Configuration

### Key Settings

```python
# app/config.py
class Settings:
   # Blockchain
   SOMNIA_RPC_URL: str
   CHAIN_ID: int = 50312
    
   # Contracts
   AGENT_REGISTRY_ADDRESS: str
   CONTRACT_MIND_HUB_ADDRESS: str
    
   # AI
   ANTHROPIC_API_KEY: str
    
   # Database
   DATABASE_URL: str
    
   # Redis
   REDIS_URL: str
    
   # Somnia Data Streams
   SOMNIA_STREAMS_ENABLED: bool = True
   SOMNIA_PRIVATE_KEY: str
    
   # Rate Limiting
   RATE_LIMIT_PER_MINUTE: int = 60
```

## AI Integration

Multiple LLM providers for intent parsing:

```python
from app.llm.factory import get_llm_provider

# Get configured provider (Claude, Gemini, or OpenAI)
llm = await get_llm_provider()

# Parse user intent
result = await llm.parse_intent(
    message="Stake 1000 tokens",
    context=agent_context
)
```

### Supported Providers

| Provider | Model             | Description            |
| -------- | ----------------- | ---------------------- |
| Claude   | claude-3-5-sonnet | Primary, best accuracy |
| Gemini   | gemini-1.5-pro    | Fallback option        |
| OpenAI   | gpt-4-turbo       | Alternative option     |

## Database Models

```python
# app/models/schemas.py

class Transaction:
    id: int
    tx_hash: str
    user_address: str
    agent_id: str
    target_contract: str
    function_selector: str
    success: bool
    gas_used: int
    created_at: datetime

class AgentAnalytics:
    id: int
    agent_id: str
    total_calls: int
    total_gas_used: int
    success_rate: float
    updated_at: datetime
```

## Testing

```bash
# Run all tests
pip install pytest pytest-asyncio pytest-cov
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_services/test_intent_service.py
```

### On-chain (Somnia) Checks

We keep unit tests fast and offline by default. For a quick live-network sanity check:

```bash
# Smoke script: verifies RPC connectivity and that deployed addresses have bytecode
python scripts/smoke_onchain.py

# Optional pytest on-chain test (opt-in)
RUN_ONCHAIN_TESTS=1 pytest -m onchain -q
```

Current Somnia Testnet deployments:

- AgentRegistry: `0x318FFd8Fc398a3639Faa837307Ffdd0b9E1017c9`
- ContractMindHubV2: `0x8244777FAe8F2f4AE50875405AFb34E10164C027`
- Chain ID: `50312`
- RPC: `https://dream-rpc.somnia.network`

## Docker Deployment

```bash
# Build image
docker build -t contractmind-backend .

# Run with docker-compose
docker-compose up -d
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: contractmind
      POSTGRES_USER: contractmind
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## Monitoring

### Health Check

```bash
curl http://localhost:8000/health
```

### Streams Status

```bash
curl http://localhost:8000/api/v1/streams/status
```

### Metrics

```bash
# Database connection pool stats
curl http://localhost:8000/api/v1/analytics/global
```

## Security

- WebSocket connection validation
- Rate limiting (Redis-based)
- Transaction validation before execution
- Somnia Data Streams verification
- API key authentication (configurable)

## Development

### Add New Endpoint

1. Create route in `app/api/v1/`
2. Add service logic in `app/services/`
3. Update schema in `app/models/schemas.py`
4. Add tests in `tests/`

### Add New Contract

1. Copy ABI to `contracts/abis/`
2. Create interface in `app/blockchain/contracts/`
3. Register in blockchain service
4. Update AI prompts for intent parsing

### Add Data Stream Schema

1. Define schema in `streams_service.py`
2. Add publish method
3. Create API endpoint in `api/v1/streams.py`
4. Update frontend StreamsClient

## Environment Variables

See `.env.example` for all configuration options.

Critical variables:
- `SOMNIA_RPC_URL` - Blockchain RPC endpoint
- `AGENT_REGISTRY_ADDRESS` - Deployed registry
- `CONTRACT_MIND_HUB_ADDRESS` - Deployed hub
- `ANTHROPIC_API_KEY` - Claude API key
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `SOMNIA_STREAMS_ENABLED` - Enable Data Streams
- `SOMNIA_PRIVATE_KEY` - Streams signing key

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests
4. Run linting: `pip install black isort && black . && isort .`
5. Submit pull request

## License

MIT License

## Links

- Frontend: `../frontend`
- Contracts: `../contracts`
- Documentation: `../docs`
- API Docs: http://localhost:8000/docs
- Somnia Data Streams: https://docs.somnia.network/data-streams
