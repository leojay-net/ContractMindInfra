# Somnia Data Streams Integration

This document describes the Somnia Data Streams integration for ContractMind, enabling real-time on-chain data publishing and subscriptions.

## Table of Contents

- [Overview](#overview)
- [Why Data Streams](#why-data-streams)
- [Architecture](#architecture)
- [Data Flow Comparison](#data-flow-comparison)
- [Schemas](#schemas)
- [Frontend Usage](#frontend-usage)
- [Backend Usage](#backend-usage)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Overview

Somnia Data Streams provides a high-throughput, low-latency data streaming layer on the Somnia blockchain. ContractMind uses this to:

- Publish Agent Execution Events: Record every agent interaction on-chain
- Store Chat History: Persist chat messages for verifiable conversation history
- Track Analytics: Publish real-time analytics snapshots
- Activity Feeds: Enable real-time activity subscriptions
- Leaderboards: Maintain agent performance rankings

## Why Data Streams

### Problem: Centralized Data

Traditional applications store all data in centralized databases:
- Data can be modified or deleted without audit trail
- Single point of failure
- Users must trust the platform operator
- No way to verify historical data

### Solution: On-chain Data Streams

Somnia Data Streams provides:
- Immutable, append-only data storage
- Cryptographic verification of all records
- Real-time WebSocket subscriptions
- Decentralized data that survives platform changes
- Cross-application data portability

## Data Flow Comparison

### Before: Traditional Architecture

```
+----------+                    +----------+                    +------------+
|          |     HTTP POST      |          |     SQL INSERT     |            |
|  Client  | -----------------> |  Backend | -----------------> |  Database  |
|          |                    |          |                    |            |
+----------+                    +----------+                    +------------+
     |                               |                               |
     |     HTTP GET (polling)        |      SQL SELECT               |
     | <---------------------------- | <---------------------------- |
     |                               |                               |

Issues:
[x] Data stored only in PostgreSQL (centralized)
[x] Must poll for updates (inefficient)
[x] No verifiable history
[x] Data can be modified/deleted
[x] Single point of failure
```

### After: With Data Streams

```
+----------+                    +----------+                    +------------+
|          |     HTTP POST      |          |     SQL INSERT     |            |
|  Client  | -----------------> |  Backend | -----------------> |  Database  |
|          |                    |          |                    | (cache)    |
+----------+                    +----------+                    +------------+
     |                               |
     |                               | Publish
     |                               v
     |                         +----------+
     |   WebSocket Subscribe   |  Somnia  |
     | <---------------------- |  Data    |
     |   (real-time updates)   |  Streams |
     |                         +----------+
     |                               |
     |                               | On-chain Storage
     |                               v
     |                         +----------+
     |                         |  Somnia  |
     |                         |  Chain   |
     |                         +----------+

Benefits:
[+] Data published on-chain (decentralized)
[+] Real-time WebSocket updates (efficient)
[+] Verifiable history with timestamps
[+] Immutable records
[+] No single point of failure
[+] Cross-application data access
```

### Detailed Request Flow

```
Step  Client                    Backend                     Data Streams
----  ------                    -------                     ------------

1     User sends message
      via HTTP POST
           |
           +------------------>

2                               Validate request
                                Process with AI
                                Generate response
                                      |
3                               Store in PostgreSQL
                                (for fast queries)
                                      |
4                               Publish to Streams  ------->  Store on-chain
                                      |                       (permanent record)
5                               Return HTTP response
           <------------------+
           |
6     Display response
      to user
           |
7     Subscribe to             <---------------------------- WebSocket event
      real-time updates                                      (new data notification)
```

## Architecture

```
+-----------------------------------------------------------------------+
|                           FRONTEND                                     |
|  lib/streams/                                                          |
|    config.ts      - Chain and schema configuration                     |
|    client.ts      - SDK initialization and utilities                   |
|    read.ts        - Query data from streams                            |
|    write.ts       - Publish data to streams                            |
|    subscribe.ts   - Real-time WebSocket subscriptions                  |
|    hooks.ts       - React hooks for components                         |
+-----------------------------------------------------------------------+
                                |
                          HTTP / WebSocket
                                |
+-----------------------------------------------------------------------+
|                           BACKEND                                      |
|  app/services/streams_service.py  - Server-side publishing service     |
|  app/api/v1/streams.py            - REST API endpoints                 |
+-----------------------------------------------------------------------+
                                |
                           Web3 RPC
                                |
+-----------------------------------------------------------------------+
|                      SOMNIA DATA STREAMS                               |
|  Chain ID: 50312                                                       |
|  RPC: https://dream-rpc.somnia.network                                 |
|  WebSocket: wss://dream-ws.somnia.network                              |
+-----------------------------------------------------------------------+
```

## Schemas

Six data schemas are defined for different use cases:

### 1. Agent Execution

Records every agent function execution.

```solidity
(
    uint64 timestamp,
    bytes32 agentId,
    address executor,
    bytes4 functionSelector,
    bool success,
    uint256 gasUsed,
    string errorMessage
)
```

### 2. Chat Message

Stores chat messages for history and analytics.

```solidity
(
    uint64 timestamp,
    bytes32 sessionId,
    address sender,
    bytes32 agentId,
    string role,
    string content,
    string intentAction
)
```

### 3. Analytics Snapshot

Periodic snapshots of agent performance metrics.

```solidity
(
    uint64 timestamp,
    bytes32 agentId,
    uint256 totalCalls,
    uint256 successCount,
    uint256 totalGasUsed,
    uint256 uniqueUsers
)
```

### 4. Transaction Event

Records blockchain transaction details.

```solidity
(
    uint64 timestamp,
    bytes32 txHash,
    address user,
    bytes32 agentId,
    string action,
    string status,
    uint256 gasUsed
)
```

### 5. Activity Feed

General activity feed for real-time updates.

```solidity
(
    uint64 timestamp,
    bytes32 entityId,
    string entityType,
    string action,
    address actor,
    string metadata
)
```

### 6. Leaderboard

Agent performance rankings.

```solidity
(
    uint64 timestamp,
    bytes32 agentId,
    string agentName,
    uint256 score,
    uint256 totalExecutions,
    uint256 successRate
)
```

## Frontend Usage

### Installation

```bash
cd frontend
npm install @somnia-chain/streams viem
```

### Configuration

The streams module is pre-configured for Somnia Testnet. Update `lib/streams/config.ts` if connecting to a different network.

### Using React Hooks

```typescript
import { 
  useChatMessages, 
  useTransactionEvents, 
  useAgentActivity,
  useAnalyticsData 
} from '@/lib/streams';

// In your component
function AgentDashboard({ agentId }: { agentId: string }) {
  // Fetch chat messages with real-time subscription
  const { 
    messages, 
    loading, 
    error 
  } = useChatMessages(sessionId, { subscribe: true });

  // Fetch transaction events
  const { 
    events, 
    refetch 
  } = useTransactionEvents(agentId);

  // Activity feed
  const { 
    activities 
  } = useAgentActivity(agentId, { limit: 50 });

  // Analytics with auto-refresh
  const { 
    analytics 
  } = useAnalyticsData(agentId, { refreshInterval: 30000 });

  return (
    <div>
      {/* Render your UI */}
    </div>
  );
}
```

### Publishing Data (Client-Side)

```typescript
import { 
  publishChatMessage, 
  publishTransactionEvent 
} from '@/lib/streams';

// Publish a chat message
await publishChatMessage({
  sessionId: 'session-123',
  sender: '0x...',
  agentId: 'agent-456',
  role: 'user',
  content: 'Hello, agent!',
  intentAction: 'query'
});

// Publish a transaction event
await publishTransactionEvent({
  txHash: '0x...',
  user: '0x...',
  agentId: 'agent-456',
  action: 'transfer',
  status: 'success',
  gasUsed: 50000
});
```

### Real-Time Subscriptions

```typescript
import { 
  subscribeToChat, 
  subscribeToTransactions 
} from '@/lib/streams';

// Subscribe to chat messages
const unsubscribe = subscribeToChat(sessionId, (message) => {
  console.log('New message:', message);
});

// Later: cleanup
unsubscribe();
```

## Backend Usage

### Configuration

Add to your `.env`:

```env
SOMNIA_STREAMS_ENABLED=true
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
SOMNIA_PRIVATE_KEY=your_private_key_here
```

### Service Integration

```python
from app.services.streams_service import get_streams_service

# Get the singleton service
streams = get_streams_service()

# Check if enabled
if streams.enabled:
    # Publish agent execution
    result = await streams.publish_agent_execution(
        agent_id="agent-123",
        executor="0x...",
        function_selector="0x12345678",
        success=True,
        gas_used=50000,
        error_message=""
    )
    
    if result.success:
        print(f"Published! TX: {result.tx_hash}")
    else:
        print(f"Failed: {result.error}")
```

### REST API Endpoints

| Method | Endpoint                              | Description                  |
| ------ | ------------------------------------- | ---------------------------- |
| GET    | `/api/v1/streams/status`              | Get service status           |
| GET    | `/api/v1/streams/schemas`             | Get schema definitions       |
| POST   | `/api/v1/streams/publish/execution`   | Publish agent execution      |
| POST   | `/api/v1/streams/publish/chat`        | Publish chat message         |
| POST   | `/api/v1/streams/publish/analytics`   | Publish analytics snapshot   |
| POST   | `/api/v1/streams/publish/transaction` | Publish transaction event    |
| POST   | `/api/v1/streams/publish/activity`    | Publish activity item        |
| POST   | `/api/v1/streams/publish/leaderboard` | Update leaderboard entry     |
| POST   | `/api/v1/streams/publish/batch`       | Batch publish multiple items |

### Example API Request

```bash
curl -X POST https://your-api.com/api/v1/streams/publish/execution \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent-123",
    "executor": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "function_selector": "0xa9059cbb",
    "success": true,
    "gas_used": 65000,
    "error_message": ""
  }'
```

Response:

```json
{
  "success": true,
  "tx_hash": "0x...",
  "data_id": "0x...",
  "error": null
}
```

## Integration Points

### Chat Service

The chat service publishes messages to streams for verifiable history:

```python
# In chat_service.py
async def process_message(self, message: str, agent_id: str, user: str):
    response = await self.ai_service.generate_response(message)
    
    # Publish to streams
    await self.streams_service.publish_chat_message(
        session_id=self.session_id,
        sender=user,
        agent_id=agent_id,
        role="user",
        content=message,
        intent_action=detected_intent
    )
    
    return response
```

### Analytics Service

Periodic analytics snapshots are published:

```python
# In analytics_service.py (background task)
async def publish_analytics_snapshot(self, agent_id: str):
    stats = await self.get_agent_stats(agent_id)
    
    await self.streams_service.publish_analytics_snapshot(
        agent_id=agent_id,
        total_calls=stats.total_calls,
        success_count=stats.success_count,
        total_gas_used=stats.total_gas_used,
        unique_users=stats.unique_users
    )
```

### Transaction Service

Transaction completions are recorded:

```python
# In execution_service.py
async def on_transaction_complete(self, tx_hash: str, result: ExecutionResult):
    await self.streams_service.publish_transaction_event(
        tx_hash=tx_hash,
        user=result.user,
        agent_id=result.agent_id,
        action=result.function_name,
        status="success" if result.success else "failed",
        gas_used=result.gas_used
    )
```

## Somnia Testnet Details

| Property       | Value                            |
| -------------- | -------------------------------- |
| Chain ID       | 50312                            |
| RPC URL        | https://dream-rpc.somnia.network |
| WebSocket      | wss://dream-ws.somnia.network    |
| Block Explorer | https://somnia.explorers.guru    |
| Native Token   | STT (Somnia Test Token)          |

## Getting Testnet Tokens

To publish data to Somnia streams, you need STT for gas:

1. Join the Somnia Discord
2. Go to the faucet channel
3. Request testnet tokens with your wallet address

## Troubleshooting

### Service Not Enabled

If `SOMNIA_STREAMS_ENABLED` is not set or `false`, the service returns mock responses. Check:

```bash
echo $SOMNIA_STREAMS_ENABLED
```

### Connection Errors

Verify RPC connectivity:

```bash
curl https://dream-rpc.somnia.network \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

Expected response: `{"result":"0xc498"}` (50312 in hex)

### Schema Registration Failed

Schemas must be registered before use. The service auto-registers on startup. If manual registration is needed:

```python
from app.services.streams_service import get_streams_service

service = get_streams_service()
await service._register_schemas()
```

### WebSocket Disconnections

The subscription hooks automatically reconnect. If issues persist, check:

- Network connectivity
- WebSocket URL configuration
- Browser console for errors

## Resources

- [Somnia Documentation](https://docs.somnia.network)
- [Somnia Data Streams SDK](https://github.com/somnia-chain/streams-sdk)
- [Somnia Discord](https://discord.gg/somnia)
- [Somnia Block Explorer](https://somnia.explorers.guru)
