# API Integration Guide

This document describes the backend API integration patterns used in the ContractMind frontend application.

## API Client Configuration

### Base Configuration

The API client is configured in `lib/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Environment Variables

Required environment variables for API connectivity:

- `NEXT_PUBLIC_API_URL`: Backend HTTP API base URL
- `NEXT_PUBLIC_WS_URL`: Backend WebSocket base URL

## API Endpoints

### Agents

#### List All Agents

```
GET /api/agents
```

Response:
```json
{
  "agents": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "description": "string",
      "status": "active|inactive",
      "created_at": "ISO8601 timestamp",
      "updated_at": "ISO8601 timestamp"
    }
  ]
}
```

#### Get Agent Details

```
GET /api/agents/{agent_id}
```

Response:
```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "description": "string",
  "status": "active|inactive",
  "capabilities": ["string"],
  "performance_metrics": {
    "success_rate": 0.95,
    "total_interactions": 100
  },
  "created_at": "ISO8601 timestamp",
  "updated_at": "ISO8601 timestamp"
}
```

#### Create Agent

```
POST /api/agents
```

Request Body:
```json
{
  "name": "string",
  "type": "contract-analysis|transaction-execution|data-query",
  "description": "string",
  "capabilities": ["string"]
}
```

#### Update Agent

```
PUT /api/agents/{agent_id}
```

Request Body:
```json
{
  "name": "string",
  "description": "string",
  "status": "active|inactive"
}
```

#### Delete Agent

```
DELETE /api/agents/{agent_id}
```

### Chat

#### Get Chat History

```
GET /api/chat/history?limit=50&offset=0
```

Query Parameters:
- `limit`: Number of messages to retrieve (default: 50)
- `offset`: Pagination offset (default: 0)

Response:
```json
{
  "messages": [
    {
      "id": "string",
      "role": "user|assistant",
      "content": "string",
      "timestamp": "ISO8601 timestamp",
      "metadata": {
        "agent_id": "string",
        "transaction_hash": "string"
      }
    }
  ],
  "total": 100,
  "has_more": true
}
```

#### Send Chat Message

```
POST /api/chat/message
```

Request Body:
```json
{
  "message": "string",
  "agent_id": "string",
  "context": {
    "wallet_address": "string",
    "chain_id": 50312
  }
}
```

Response:
```json
{
  "id": "string",
  "role": "assistant",
  "content": "string",
  "timestamp": "ISO8601 timestamp",
  "actions": [
    {
      "type": "transaction|query|analysis",
      "data": {}
    }
  ]
}
```

### Analytics

#### Get Dashboard Statistics

```
GET /api/analytics/stats
```

Response:
```json
{
  "total_agents": 10,
  "active_agents": 8,
  "total_interactions": 1000,
  "success_rate": 0.95,
  "total_transactions": 500,
  "period": "24h|7d|30d"
}
```

#### Get Agent Performance

```
GET /api/analytics/agents/performance
```

Response:
```json
{
  "agents": [
    {
      "agent_id": "string",
      "agent_name": "string",
      "interactions": 100,
      "success_rate": 0.98,
      "avg_response_time": 1.5
    }
  ]
}
```

#### Get Recent Activity

```
GET /api/analytics/activity?limit=10
```

Response:
```json
{
  "activities": [
    {
      "id": "string",
      "type": "agent_created|transaction_executed|analysis_completed",
      "description": "string",
      "timestamp": "ISO8601 timestamp",
      "metadata": {}
    }
  ]
}
```

### Transactions

#### Execute Transaction

```
POST /api/transactions/execute
```

Request Body:
```json
{
  "agent_id": "string",
  "contract_address": "string",
  "function_name": "string",
  "parameters": [],
  "value": "0",
  "from_address": "string"
}
```

Response:
```json
{
  "transaction_id": "string",
  "status": "pending|submitted|confirmed|failed",
  "transaction_hash": "string",
  "estimated_gas": "string"
}
```

#### Get Transaction Status

```
GET /api/transactions/{transaction_id}
```

Response:
```json
{
  "transaction_id": "string",
  "status": "pending|submitted|confirmed|failed",
  "transaction_hash": "string",
  "block_number": 12345,
  "gas_used": "string",
  "timestamp": "ISO8601 timestamp"
}
```

## WebSocket Integration

### Connection

```typescript
const ws = new WebSocket(
  `${process.env.NEXT_PUBLIC_WS_URL}/ws/chat`
);
```

### Message Format

#### Client to Server

```json
{
  "type": "message|typing|subscribe",
  "data": {
    "message": "string",
    "agent_id": "string"
  }
}
```

#### Server to Client

```json
{
  "type": "message|status|error",
  "data": {
    "id": "string",
    "role": "assistant",
    "content": "string",
    "timestamp": "ISO8601 timestamp"
  }
}
```

## Error Handling

### Error Response Format

All API errors follow this format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error
- `503`: Service Unavailable

### Error Handling Pattern

```typescript
try {
  const response = await api.get('/api/endpoint');
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      throw new Error('Network error. Please try again.');
    }
  }
  throw error;
}
```

## Authentication

### Wallet-Based Authentication

The API uses wallet signatures for authentication:

1. Frontend requests challenge from backend
2. User signs challenge with wallet
3. Frontend sends signature to backend
4. Backend verifies signature and issues session token

### Implementation Example

```typescript
import { useSignMessage } from 'wagmi';

const { signMessage } = useSignMessage();

async function authenticate() {
  // Get challenge
  const { data: challenge } = await api.get('/api/auth/challenge');
  
  // Sign challenge
  const signature = await signMessage({ message: challenge.message });
  
  // Submit signature
  const { data: session } = await api.post('/api/auth/verify', {
    address: account.address,
    signature,
  });
  
  // Store session token
  localStorage.setItem('session_token', session.token);
}
```

## Rate Limiting

### Limits

- Anonymous: 10 requests per minute
- Authenticated: 100 requests per minute
- WebSocket: 50 messages per minute

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1633024800
```

## Caching

### Cache Headers

The API uses standard HTTP caching headers:

```
Cache-Control: public, max-age=300
ETag: "abc123"
```

### Client-Side Caching

Use React Query for automatic caching:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['agents'],
  queryFn: () => api.get('/api/agents'),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

## Best Practices

### 1. Error Handling

Always implement proper error handling:

```typescript
const [error, setError] = useState<string | null>(null);

try {
  await api.post('/api/endpoint', data);
} catch (err) {
  setError('Failed to process request. Please try again.');
  console.error(err);
}
```

### 2. Loading States

Show loading indicators during API calls:

```typescript
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const data = await api.get('/api/endpoint');
    setData(data);
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Optimistic Updates

Implement optimistic UI updates:

```typescript
const mutation = useMutation({
  mutationFn: updateAgent,
  onMutate: async (newAgent) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['agents'] });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['agents']);
    
    // Optimistically update
    queryClient.setQueryData(['agents'], (old) => [...old, newAgent]);
    
    return { previous };
  },
  onError: (err, newAgent, context) => {
    // Rollback on error
    queryClient.setQueryData(['agents'], context.previous);
  },
});
```

### 4. Request Cancellation

Cancel requests on component unmount:

```typescript
useEffect(() => {
  const controller = new AbortController();
  
  api.get('/api/endpoint', {
    signal: controller.signal,
  });
  
  return () => controller.abort();
}, []);
```

## Testing

### Mock API Responses

```typescript
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/agents', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        agents: [
          { id: '1', name: 'Test Agent', type: 'analysis' }
        ]
      })
    );
  }),
];
```

### Integration Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react';

test('loads and displays agents', async () => {
  render(<AgentList />);
  
  await waitFor(() => {
    expect(screen.getByText('Test Agent')).toBeInTheDocument();
  });
});
```
