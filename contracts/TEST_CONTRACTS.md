# Test Contracts on Somnia Testnet

## Deployed Contracts

All contracts are deployed on **Somnia Testnet** (Chain ID: 50312)

### Core Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| **AgentRegistry** | `0x318FFd8Fc398a3639Faa837307Ffdd0b9E1017c9` | Agent registration and management |
| **ContractMindHubV2** | `0x8244777FAe8F2f4AE50875405AFb34E10164C027` | Function authorization and execution hub |

### Test Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| **TestToken** | `0x4f692992b0e5FFF6C08A71fc39603954D986F6e7` | ERC20 token with faucet for testing |
| **HubAwareStaking** | `0x306f0f0DED2Eda539b6f768067CC36790Eb2180c` | Staking contract that works with ContractMind Hub |

### Deployer Address

`0x95621720663a0DDBF121329FB0884779Ab7780B6`

## Network Configuration

Add Somnia Testnet to MetaMask:

- **Network Name:** Somnia Testnet
- **RPC URL:** https://dream-rpc.somnia.network
- **Chain ID:** 50312
- **Currency Symbol:** SOMI
- **Block Explorer:** https://somnia-devnet.socialscan.io

## Testing Workflow

### 1. Get Testnet Tokens

You'll need SOMI tokens for gas fees. Get them from the Somnia testnet faucet (check Somnia Discord or docs).

### 2. Get Test Tokens

The TestToken contract has a public `faucet()` function that gives you 1000 tokens:

```typescript
// In your wallet or via frontend
// Call: TestToken.faucet()
// You'll receive: 1000 TEST tokens
```

### 3. Test Agent Registration

**Step 1: Register an Agent**

```typescript
// Target Contract: HubAwareStaking (0x306f0f0DED2Eda539b6f768067CC36790Eb2180c)
// Name: "Staking Agent"
// Config IPFS: "ipfs://QmExample..." (or any string for testing)

// This calls AgentRegistry.registerAgent()
```

**Expected Result:**
- Transaction confirmed
- Agent registered on-chain
- Agent ID (bytes32) returned
- AgentRegistered event emitted

### 4. Test Function Authorization

**Step 2: Authorize Functions**

```typescript
// Agent ID: (from step 1)
// Target Contract: HubAwareStaking
// Functions to authorize:
//   - stake(uint256)      → 0xXXXXXXXX (function selector)
//   - withdraw(uint256)   → 0xXXXXXXXX
//   - claimRewards()      → 0xXXXXXXXX
//   - getStakeInfo(address) → 0xXXXXXXXX

// This calls ContractMindHub.authorizeFunctions()
```

**Expected Result:**
- Functions authorized on-chain
- FunctionAuthorized events emitted
- Agent can now execute these functions

### 5. Test Chat & Transaction Execution

**Step 3: Chat with Agent**

```
User: "Stake 100 tokens"
Agent: [Prepares transaction]
       Function: stake(uint256)
       Amount: 100 tokens
       Gas Estimate: ~120,000
       
User: [Signs & executes transaction]
Result: 100 tokens staked successfully
```

**Step 4: Query Balance**

```
User: "What's my stake balance?"
Agent: "You have 100 TEST tokens staked, earning 12.5% APY"
```

**Step 5: Claim Rewards**

```
User: "Claim my rewards"
Agent: [Prepares transaction]
       Function: claimRewards()
       Estimated Rewards: 0.5 tokens
       
User: [Signs & executes]
Result: Rewards claimed successfully
```

## Contract Functions

### TestToken (ERC20)

**Read Functions:**
- `balanceOf(address)` - Get token balance
- `totalSupply()` - Get total supply
- `allowance(address, address)` - Get allowance

**Write Functions:**
- `faucet()` - Get 1000 free tokens (anyone can call)
- `transfer(address, uint256)` - Transfer tokens
- `approve(address, uint256)` - Approve spender
- `mint(address, uint256)` - Mint tokens (owner only)

### HubAwareStaking

**Read Functions:**
- `stakes(address)` - Get user's stake info
- `calculateRewards(address)` - Calculate pending rewards
- `totalStaked()` - Get total staked amount
- `APY()` - Get APY (12.5% = 1250 basis points)

**Write Functions:**
- `stake(uint256)` - Stake tokens
- `withdraw(uint256)` - Withdraw staked tokens
- `claimRewards()` - Claim earned rewards
- `getStakeInfo(address)` - Get detailed stake info

## Example Test Scenarios

### Scenario 1: Basic Staking Flow

```bash
# 1. Get test tokens
→ Call TestToken.faucet()
→ Receive 1000 TEST tokens

# 2. Approve staking contract
→ Call TestToken.approve(HubAwareStaking, 1000)
→ Staking contract can now transfer your tokens

# 3. Create agent for staking contract
→ Register agent with AgentRegistry
→ Target: HubAwareStaking address
→ Get agent ID

# 4. Authorize staking functions
→ Authorize stake(), withdraw(), claimRewards()
→ Via ContractMindHub

# 5. Chat with agent to stake
→ "Stake 100 tokens"
→ Agent prepares transaction
→ Sign & execute
→ 100 tokens staked ✓

# 6. Wait some time, then claim rewards
→ "Claim my rewards"
→ Agent prepares transaction
→ Sign & execute
→ Rewards received ✓
```

### Scenario 2: Multiple Agents

```bash
# Create multiple agents for different contracts
1. Staking Agent → HubAwareStaking
2. Token Agent → TestToken
3. Custom Agent → Your own contract

# Each agent can have different authorized functions
# Chat with each agent separately
```

### Scenario 3: Analytics Testing

```bash
# After executing transactions:
1. Check agent analytics
   → Total calls
   → Success rate
   → Gas used

2. View transaction history
   → All executed transactions
   → Status and timestamps
   → Function calls

3. Monitor agent performance
   → Response times
   → Error rates
```

## Verification

### Check Contracts on Explorer

Visit: https://somnia-devnet.socialscan.io

**Verify AgentRegistry:**
- https://somnia-devnet.socialscan.io/address/0x318FFd8Fc398a3639Faa837307Ffdd0b9E1017c9

**Verify ContractMindHub:**
- https://somnia-devnet.socialscan.io/address/0x8244777FAe8F2f4AE50875405AFb34E10164C027

**Verify TestToken:**
- https://somnia-devnet.socialscan.io/address/0x4f692992b0e5FFF6C08A71fc39603954D986F6e7

**Verify HubAwareStaking:**
- https://somnia-devnet.socialscan.io/address/0x306f0f0DED2Eda539b6f768067CC36790Eb2180c

### Check Events

Look for these events after transactions:

**AgentRegistry Events:**
- `AgentRegistered(bytes32 agentId, address owner, address targetContract, string name)`
- `AgentUpdated(bytes32 agentId, string configIPFS)`
- `AgentDeactivated(bytes32 agentId)`

**ContractMindHub Events:**
- `FunctionAuthorized(bytes32 agentId, address targetContract, bytes4 functionSelector)`
- `FunctionExecuted(bytes32 agentId, address user, address targetContract, bytes4 functionSelector, bool success, bytes returnData)`

## Frontend Testing

### Mock Mode Testing (No Blockchain)

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=1

npm run dev
# Visit http://localhost:3000
# Create agents, chat, execute - all in localStorage
```

### Production Mode Testing (Real Blockchain)

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=0
NEXT_PUBLIC_HUB_CONTRACT_ADDRESS=0x8244777FAe8F2f4AE50875405AFb34E10164C027
NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS=0x318FFd8Fc398a3639Faa837307Ffdd0b9E1017c9

# Start backend
cd backend && poetry run uvicorn app.main:app --reload

# Start frontend
cd frontend && npm run dev

# 1. Connect MetaMask to Somnia Testnet
# 2. Get SOMI from faucet
# 3. Get TEST tokens from TestToken.faucet()
# 4. Create agent for HubAwareStaking
# 5. Authorize functions
# 6. Chat and execute transactions!
```

## Troubleshooting

### "Insufficient funds" error
→ Get SOMI from Somnia faucet for gas fees

### "ERC20: insufficient allowance"
→ Approve staking contract: `TestToken.approve(HubAwareStaking, amount)`

### "Function not authorized"
→ Authorize functions via ContractMindHub first

### Transaction fails
→ Check gas limits (increase if needed)
→ Verify you have enough tokens
→ Check function is authorized

### Agent not found
→ Ensure agent is registered on AgentRegistry
→ Check agent is active
→ Verify correct agent ID

## Next Steps

1. **Get Testnet Tokens**
   - SOMI for gas fees
   - TEST tokens via faucet

2. **Test Basic Flow**
   - Register agent
   - Authorize functions
   - Execute transactions

3. **Test Advanced Features**
   - Multiple agents
   - Complex queries
   - Analytics

4. **Monitor Performance**
   - Transaction success rates
   - Gas costs
   - Response times

## Resources

- **Somnia Docs:** https://docs.somnia.network
- **Somnia Explorer:** https://somnia-devnet.socialscan.io
- **ContractMind Docs:** `/docs` on your frontend
- **Discord:** Ask in Somnia or ContractMind Discord for testnet tokens

---

**Happy Testing! 🚀**

All contracts are deployed and ready to use on Somnia Testnet!
