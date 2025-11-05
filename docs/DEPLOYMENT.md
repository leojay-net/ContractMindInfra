# Deployment Guide

Complete deployment guide for ContractMind infrastructure in production environments.

## Deployment Overview

ContractMind consists of three main components that can be deployed independently or together:

1. **Frontend** - Next.js application
2. **Backend** - FastAPI server
3. **Smart Contracts** - Solidity contracts on Somnia

## Pre-Deployment Checklist

### Infrastructure Requirements

- [ ] Domain name configured
- [ ] SSL/TLS certificates obtained
- [ ] PostgreSQL database provisioned
- [ ] Redis instance available (optional)
- [ ] Cloud storage configured (for logs, backups)
- [ ] Monitoring tools set up
- [ ] CI/CD pipeline configured

### Security Requirements

- [ ] All API keys secured in environment variables
- [ ] Database passwords rotated
- [ ] Firewall rules configured
- [ ] CORS settings reviewed
- [ ] Rate limiting enabled
- [ ] Backup strategy implemented
- [ ] Disaster recovery plan documented

### API Keys and Credentials

Required credentials:
- OpenAI API key
- Anthropic API key
- Google Gemini API key
- WalletConnect Project ID
- Database credentials
- Private keys for contract deployment

## Deployment Methods

### Method 1: Docker Deployment (Recommended)

#### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy dependency files
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ARG NEXT_PUBLIC_CHAIN_ID
ARG NEXT_PUBLIC_RPC_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ENV NEXT_PUBLIC_CHAIN_ID=$NEXT_PUBLIC_CHAIN_ID
ENV NEXT_PUBLIC_RPC_URL=$NEXT_PUBLIC_RPC_URL

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: contractmind
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: contractmind
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U contractmind"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://contractmind:${POSTGRES_PASSWORD}@postgres:5432/contractmind
      REDIS_URL: redis://redis:6379
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      WEB3_PROVIDER_URI: ${WEB3_PROVIDER_URI}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_WS_URL: ${NEXT_PUBLIC_WS_URL}
        NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: ${NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}
        NEXT_PUBLIC_CHAIN_ID: ${NEXT_PUBLIC_CHAIN_ID}
        NEXT_PUBLIC_RPC_URL: ${NEXT_PUBLIC_RPC_URL}
    ports:
      - "3000:3000"
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:
```

#### Deploy with Docker Compose

```bash
# Create .env file with all required variables
cp .env.example .env

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Method 2: Vercel + Render Deployment

#### Frontend on Vercel

1. **Connect Repository:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` directory

2. **Configure Build Settings:**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Environment Variables:**
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_CHAIN_ID=50312
   NEXT_PUBLIC_RPC_URL=https://dream-rpc.somnia.network
   NEXT_PUBLIC_BLOCK_EXPLORER=https://somnia-devnet.socialscan.io
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will auto-deploy on every push to main branch

#### Backend on Render

1. **Create Web Service:**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your repository
   - Select the `backend` directory

2. **Configure Service:**
   ```
   Name: contractmind-backend
   Environment: Python 3.11
   Build Command: pip install poetry && poetry install
   Start Command: poetry run uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

3. **Environment Variables:**
   Add in Render dashboard:
   ```
   DATABASE_URL=your_postgresql_url
   REDIS_URL=your_redis_url
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   GEMINI_API_KEY=...
   WEB3_PROVIDER_URI=https://dream-rpc.somnia.network
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

4. **Add PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Note the Internal Database URL
   - Add to backend environment variables

### Method 3: AWS Deployment

#### Backend on AWS ECS

1. **Build and Push Docker Image:**
   ```bash
   # Authenticate with ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com
   
   # Build image
   cd backend
   docker build -t contractmind-backend .
   
   # Tag image
   docker tag contractmind-backend:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/contractmind-backend:latest
   
   # Push to ECR
   docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/contractmind-backend:latest
   ```

2. **Create ECS Task Definition:**
   ```json
   {
     "family": "contractmind-backend",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [
       {
         "name": "backend",
         "image": "your-account-id.dkr.ecr.us-east-1.amazonaws.com/contractmind-backend:latest",
         "portMappings": [
           {
             "containerPort": 8000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "DATABASE_URL",
             "value": "postgresql://..."
           }
         ],
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/contractmind-backend",
             "awslogs-region": "us-east-1",
             "awslogs-stream-prefix": "ecs"
           }
         }
       }
     ]
   }
   ```

3. **Create ECS Service:**
   ```bash
   aws ecs create-service \
     --cluster contractmind-cluster \
     --service-name backend \
     --task-definition contractmind-backend \
     --desired-count 2 \
     --launch-type FARGATE \
     --load-balancers targetGroupArn=arn:aws:...,containerName=backend,containerPort=8000
   ```

#### Frontend on AWS Amplify

1. **Connect Repository:**
   - Open AWS Amplify console
   - Click "New app" → "Host web app"
   - Connect GitHub repository
   - Select `frontend` directory

2. **Build Settings:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/.next
       files:
         - '**/*'
     cache:
       paths:
         - frontend/node_modules/**/*
   ```

3. **Environment Variables:**
   Add in Amplify console

4. **Deploy:**
   - Amplify will auto-deploy on push

## Smart Contract Deployment

### Deploy to Somnia Testnet

```bash
cd contracts

# Load environment variables
source .env

# Deploy contracts
forge script script/Deploy.s.sol \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --verifier-url https://somnia-devnet.socialscan.io/api \
  -vvvv

# Save deployment addresses
echo "HUB_ADDRESS=0x..." >> ../backend/.env
echo "REGISTRY_ADDRESS=0x..." >> ../backend/.env
echo "NEXT_PUBLIC_HUB_CONTRACT_ADDRESS=0x..." >> ../frontend/.env.local
echo "NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS=0x..." >> ../frontend/.env.local
```

### Verify Contracts

```bash
forge verify-contract \
  --chain-id 50312 \
  --num-of-optimizations 200 \
  --watch \
  --constructor-args $(cast abi-encode "constructor(address)" $REGISTRY_ADDRESS) \
  --compiler-version v0.8.20 \
  $CONTRACT_ADDRESS \
  src/ContractMindHubV2.sol:ContractMindHubV2
```

## Post-Deployment Steps

### 1. Database Migration

```bash
# Run migrations on production database
DATABASE_URL="postgresql://..." poetry run alembic upgrade head
```

### 2. Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/health

# Frontend health
curl https://yourdomain.com
```

### 3. Monitoring Setup

Configure monitoring tools:
- **Application Performance**: New Relic, Datadog
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Log Aggregation**: CloudWatch, Loggly

### 4. Backup Configuration

```bash
# PostgreSQL backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Upload to S3
aws s3 cp backup_*.sql s3://your-backup-bucket/
```

### 5. SSL/TLS Configuration

Ensure HTTPS is enabled:
- Frontend: Automatic with Vercel/Amplify
- Backend: Configure ALB/Load Balancer with ACM certificate
- WebSocket: WSS protocol

## Maintenance

### Updates and Patches

```bash
# Update dependencies
cd backend
poetry update

cd ../frontend
npm update

# Test updates
npm test
poetry run pytest

# Deploy updates
git push origin main
```

### Scaling

**Horizontal Scaling:**
- Increase ECS task count
- Add more Vercel instances (automatic)
- Scale database read replicas

**Vertical Scaling:**
- Increase ECS task CPU/memory
- Upgrade database instance size

### Monitoring Metrics

Key metrics to monitor:
- API response times
- Database query performance
- Error rates
- User concurrency
- Transaction success rates
- Blockchain sync status

## Troubleshooting

### Backend Issues

**High Memory Usage:**
```bash
# Check memory in container
docker stats

# Increase memory limits in ECS task definition
```

**Database Connection Pool Exhausted:**
```python
# Update database pool settings
SQLALCHEMY_POOL_SIZE=20
SQLALCHEMY_MAX_OVERFLOW=10
```

### Frontend Issues

**Build Failures:**
```bash
# Clear Vercel cache
vercel --prod --force

# Check build logs in Vercel dashboard
```

**High Response Times:**
- Enable Next.js caching
- Use CDN for static assets
- Implement Redis caching

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous version
git revert HEAD
git push origin main

# Or redeploy specific commit
vercel --prod --force
```

## Security Best Practices

1. **API Keys**: Use AWS Secrets Manager or similar
2. **Database**: Enable SSL connections
3. **CORS**: Whitelist specific domains only
4. **Rate Limiting**: Implement at API gateway level
5. **DDoS Protection**: Use CloudFlare or AWS Shield
6. **Audit Logs**: Enable and monitor access logs
7. **Dependency Scanning**: Use Dependabot or Snyk

## Cost Optimization

- Use reserved instances for predictable workloads
- Implement auto-scaling policies
- Archive old logs to cheaper storage
- Use spot instances for non-critical workloads
- Monitor and optimize database queries
- Implement caching strategies

## Support

For deployment issues:
- Check logs in CloudWatch/Vercel
- Review error tracking in Sentry
- Contact DevOps team
- Review deployment documentation
