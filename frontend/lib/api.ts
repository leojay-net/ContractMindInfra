/**
 * API Client Service
 * Centralized HTTP client for all backend API calls — with a mock client option
 * Toggle client-side mocks with the NEXT_PUBLIC_USE_MOCK env var (1 = use mocks).
 */

import { Agent, ChatMessage, PreparedTransaction, ExecutionResult } from '@/types';
import { API_CONFIG, MOCK_CONFIG } from './config';

const API_BASE_URL = API_CONFIG.BASE_URL;
const USE_MOCK = MOCK_CONFIG.USE_MOCK;
const USE_REAL_CHAT = MOCK_CONFIG.USE_REAL_CHAT;

function safeParseJSON<T = any>(s: string | undefined, fallback: T): T {
    if (!s) return fallback;
    try {
        return JSON.parse(s) as T;
    } catch (e) {
        return fallback;
    }
}

// -----------------------
// Real ApiClient (unchanged behavior)
// -----------------------
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Agent Management
    async getAgents(owner?: string): Promise<Agent[]> {
        const params = owner ? `?owner=${owner}` : '';
        const response = await this.request<{ agents: Agent[]; total: number }>(`/api/v1/agents${params}`);
        return response.agents;
    }

    async getAgent(id: string): Promise<Agent> {
        return this.request<Agent>(`/api/v1/agents/${id}`);
    }

    async prepareAgentRegistration(data: {
        ownerAddress: string;
        targetContract: string;
        name: string;
        configIPFS: string;
        abi?: any[]; // Optional ABI for the target contract
    }): Promise<{
        success: boolean;
        requiresTransaction: boolean;
        transaction: {
            to: string;
            data: string;
            value: string;
            gasEstimate: string;
            explanation: string;
            functionName: string;
            warnings?: string[];
        };
    }> {
        return this.request('/api/v1/agents/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async confirmAgentRegistration(txHash: string, abi?: any[]): Promise<{
        success: boolean;
        agentId?: string;
        txHash: string;
        agent?: any;
        error?: string;
    }> {
        return this.request('/api/v1/agents/confirm', {
            method: 'POST',
            body: JSON.stringify({ txHash, abi }),
        });
    }

    // Legacy method - kept for backward compatibility but should use prepare/confirm flow
    async createAgent(data: {
        name: string;
        description?: string;
        targetContract: string;
        abi: string;
        personality: string;
        domainKnowledge?: string;
    }): Promise<Agent> {
        // This should not be used anymore - use prepareAgentRegistration + confirmAgentRegistration
        throw new Error('Direct agent creation not supported. Use prepareAgentRegistration + wallet signing + confirmAgentRegistration flow');
    }

    async updateAgent(id: string, data: { name?: string; description?: string }): Promise<void> {
        return this.request<void>(`/api/v1/agents/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteAgent(id: string): Promise<void> {
        return this.request<void>(`/api/v1/agents/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleAgentStatus(id: string, status: 'active' | 'inactive'): Promise<void> {
        const active = status === 'active';
        return this.request<void>(`/api/v1/agents/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ active }),
        });
    }

    // Function Authorization
    async authorizeFunctions(agentId: string, functions: string[]): Promise<void> {
        return this.request<void>(`/api/v1/agents/${agentId}/authorize`, {
            method: 'POST',
            body: JSON.stringify({ functions }),
        });
    }

    async revokeFunctions(agentId: string, functions: string[]): Promise<void> {
        return this.request<void>(`/api/v1/agents/${agentId}/revoke`, {
            method: 'POST',
            body: JSON.stringify({ functions }),
        });
    }

    // Chat
    async sendMessage(agentId: string, message: string, userAddress: string): Promise<{
        response: string;
        isPreparedTransaction: boolean;
        preparedTransaction?: PreparedTransaction;
    }> {
        return this.request('/api/v1/chat', {
            method: 'POST',
            body: JSON.stringify({ agentId, message, userAddress }),
        });
    }

    async getChatHistory(agentId: string, userAddress: string): Promise<ChatMessage[]> {
        return this.request<ChatMessage[]>(`/api/v1/chat/history?agent_id=${agentId}&user_address=${userAddress}`);
    }

    // Transaction Execution
    async executeTransaction(agentId: string, transactionData: PreparedTransaction, userAddress: string): Promise<ExecutionResult> {
        return this.request<ExecutionResult>('/api/v1/transactions/execute', {
            method: 'POST',
            body: JSON.stringify({ agent_id: agentId, transaction_data: transactionData, user_address: userAddress }),
        });
    }

    // Analytics
    async getAgentAnalytics(agentId: string, timeRange?: string): Promise<any> {
        const params = timeRange ? `?days=${timeRange}` : '';
        return this.request(`/api/v1/analytics/agent/${agentId}${params}`);
    }

    async getOverallAnalytics(timeRange?: string): Promise<any> {
        const params = timeRange ? `?days=${timeRange}` : '';
        return this.request(`/api/v1/analytics/global${params}`);
    }

    async getTransactionHistory(agentId?: string, limit?: number): Promise<any[]> {
        const params = new URLSearchParams();
        if (agentId) params.append('agent_id', agentId);
        if (limit) params.append('limit', limit.toString());
        const query = params.toString() ? `?${params.toString()}` : '';
        const response = await this.request<{ transactions: any[]; total: number }>(`/api/v1/transactions${query}`);
        return response.transactions;
    }

    // WebSocket connection for real-time updates
    connectWebSocket(agentId: string, userAddress: string): WebSocket {
        const wsUrl = this.baseUrl.replace('http', 'ws');
        const ws = new WebSocket(`${wsUrl}/api/v1/ws/chat/${agentId}?user_address=${userAddress}`);
        return ws;
    }
}

// -----------------------
// Mock Client Implementation
// -----------------------

type Stored = {
    agents: Agent[];
    chats: Record<string, ChatMessage[]>; // key = `${agentId}:${userAddress}`
    txs: any[];
};

const STORAGE_KEY = 'contractmind_frontend_mock_v1';

function readStorage(): Stored {
    const raw = localStorage.getItem(STORAGE_KEY) || undefined;
    return safeParseJSON<Stored>(raw, { agents: [], chats: {}, txs: [] });
}

function writeStorage(state: Stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function parseAbiToSummary(abiRaw: string | any) {
    try {
        // Handle both string and already-parsed JSON
        const parsed = typeof abiRaw === 'string' ? JSON.parse(abiRaw) : abiRaw;
        const functions = (Array.isArray(parsed) ? parsed : [])
            .filter((item: any) => item.type === 'function')
            .map((f: any) => ({
                name: f.name,
                stateMutability: f.stateMutability || 'nonpayable',
                inputs: (f.inputs || []).map((inp: any) => ({
                    name: inp.name || '',
                    type: inp.type,
                    internalType: inp.internalType,
                })),
                outputs: (f.outputs || []).map((out: any) => ({
                    name: out.name || '',
                    type: out.type,
                    internalType: out.internalType,
                })),
                authorized: false, // Default: not authorized
            }));
        const events = (Array.isArray(parsed) ? parsed : [])
            .filter((item: any) => item.type === 'event')
            .map((e: any) => ({ name: e.name, inputs: e.inputs || [] }));
        return { functions, events };
    } catch (e) {
        console.error('[parseAbiToSummary] Error parsing ABI:', e);
        return { functions: [], events: [] };
    }
}

class MockWebSocket {
    onmessage: ((ev: { data: string }) => void) | null = null;
    onopen: (() => void) | null = null;
    onclose: (() => void) | null = null;

    constructor() {
        setTimeout(() => this.onopen && this.onopen(), 20);
    }

    send(_data: string) {
        // no-op for demo; optionally echo back
        setTimeout(() => this.onmessage && this.onmessage({ data: JSON.stringify({ type: 'mock', payload: 'ok' }) }), 200);
    }

    close() {
        setTimeout(() => this.onclose && this.onclose(), 10);
    }
}

class MockApiClient {
    constructor(private baseUrl: string) {
        // ensure storage init
        const s = readStorage();
        writeStorage(s);
    }

    private async simulateDelay<T>(result: T, ms = 120): Promise<T> {
        return new Promise((res) => setTimeout(() => res(result), ms));
    }

    async getAgents(): Promise<Agent[]> {
        const s = readStorage();
        return this.simulateDelay(s.agents);
    }

    async getAgent(id: string): Promise<Agent> {
        const s = readStorage();
        const a = s.agents.find((x) => x.id === id);
        if (!a) throw new Error('Agent not found (mock)');
        console.log('[MockApiClient] getAgent returning:', a);
        console.log('[MockApiClient] Agent functions:', a.functions);
        return this.simulateDelay(a);
    }

    async prepareAgentRegistration(data: {
        ownerAddress: string;
        targetContract: string;
        name: string;
        configIPFS: string;
        abi?: any[]; // Optional ABI for the target contract
    }): Promise<{
        success: boolean;
        requiresTransaction: boolean;
        transaction: any;
    }> {
        // Mock: return a fake transaction to sign
        return this.simulateDelay({
            success: true,
            requiresTransaction: true,
            transaction: {
                to: '0x318FFd8Fc398a3639Faa837307Ffdd0b9E1017c9', // Mock AgentRegistry address
                data: '0x' + 'a'.repeat(128), // Mock calldata
                value: '0',
                gasEstimate: '500000',
                explanation: `Register agent '${data.name}'`,
                functionName: 'registerAgent',
                warnings: ['Gas fees will apply', 'You will grant your agent configuration on-chain'],
            },
        }, 300);
    }

    async confirmAgentRegistration(txHash: string, abi?: any[]): Promise<{
        success: boolean;
        agentId?: string;
        txHash: string;
        agent?: any;
        error?: string;
    }> {
        // Mock: simulate successful confirmation
        const agentId = `mock-agent-${Date.now().toString(36)}`;
        return this.simulateDelay({
            success: true,
            agentId,
            txHash,
            agent: {
                id: agentId,
                owner: '0x0000000000000000000000000000000000000000',
                targetContract: '0x0000000000000000000000000000000000000000',
                name: 'Mock Agent',
                active: true,
            },
        }, 500);
    }

    // Legacy createAgent - now implemented using the new flow
    async createAgent(data: {
        name: string;
        description?: string;
        targetContract: string;
        abi: string | any;
        personality: string;
        domainKnowledge?: string;
    }): Promise<Agent> {
        const s = readStorage();
        const id = `mock-${Date.now().toString(36)}`;
        const parsedAbi = parseAbiToSummary(data.abi);
        console.log('[MockApiClient] Parsed ABI:', parsedAbi);
        console.log('[MockApiClient] Functions count:', parsedAbi.functions.length);
        const now = new Date().toISOString();
        const agent: Agent = {
            id,
            owner: '0x0000000000000000000000000000000000000000',
            name: data.name,
            targetContract: data.targetContract,
            configIPFS: '',
            active: true,
            createdAt: now,
            updatedAt: now,
            functions: parsedAbi.functions, // Add parsed functions with authorized: false
        };
        console.log('[MockApiClient] Created agent:', agent);
        console.log('[MockApiClient] Agent functions:', agent.functions);
        s.agents.push(agent);
        writeStorage(s);
        return this.simulateDelay(agent);
    }

    async updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
        const s = readStorage();
        const idx = s.agents.findIndex((x) => x.id === id);
        if (idx === -1) throw new Error('Agent not found (mock)');
        s.agents[idx] = { ...s.agents[idx], ...data } as Agent;
        writeStorage(s);
        return this.simulateDelay(s.agents[idx]);
    }

    async deleteAgent(id: string): Promise<void> {
        const s = readStorage();
        s.agents = s.agents.filter((x) => x.id !== id);
        writeStorage(s);
        return this.simulateDelay(undefined);
    }

    async toggleAgentStatus(id: string, status: 'active' | 'inactive'): Promise<Agent> {
        return this.updateAgent(id, { status } as Partial<Agent>);
    }

    async authorizeFunctions(agentId: string, functionNames: string[]): Promise<void> {
        const s = readStorage();
        const agent = s.agents.find((x) => x.id === agentId);
        if (!agent) throw new Error('Agent not found (mock)');

        if (agent.functions) {
            agent.functions = agent.functions.map(fn =>
                functionNames.includes(fn.name) ? { ...fn, authorized: true } : fn
            );
        }
        writeStorage(s);
        return this.simulateDelay(undefined);
    }

    async revokeFunctions(agentId: string, functionNames: string[]): Promise<void> {
        const s = readStorage();
        const agent = s.agents.find((x) => x.id === agentId);
        if (!agent) throw new Error('Agent not found (mock)');

        if (agent.functions) {
            agent.functions = agent.functions.map(fn =>
                functionNames.includes(fn.name) ? { ...fn, authorized: false } : fn
            );
        }
        writeStorage(s);
        return this.simulateDelay(undefined);
    }

    // Chat: if USE_REAL_CHAT is true we forward to real backend; otherwise return deterministic mock replies
    async sendMessage(agentId: string, message: string, userAddress: string): Promise<{
        response: string;
        isPreparedTransaction: boolean;
        preparedTransaction?: PreparedTransaction;
    }> {
        if (USE_REAL_CHAT && API_BASE_URL) {
            // forward to the real backend chat endpoint
            const res = await fetch(`${API_BASE_URL}/api/v1/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agentId, message, userAddress }),
            });
            if (!res.ok) throw new Error('Real chat call failed');
            return res.json();
        }

        const key = `${agentId}:${userAddress}`;
        const s = readStorage();
        const agent = s.agents.find((x) => x.id === agentId);
        const history = s.chats[key] || [];
        const userMsg: ChatMessage = { id: `m-${Date.now()}`, role: 'user', content: message, timestamp: new Date().toISOString() };
        history.push(userMsg);

        // Get agent's functions for context-aware responses
        const functions = agent?.functions || [];
        const authorizedFunctions = functions.filter(f => f.authorized);
        const writeFunctions = functions.filter(f => f.stateMutability === 'nonpayable' || f.stateMutability === 'payable');
        const readFunctions = functions.filter(f => f.stateMutability === 'view' || f.stateMutability === 'pure');

        let reply = '';
        let isPrepared = false;
        let preparedTx: PreparedTransaction | undefined = undefined;

        const lc = message.toLowerCase();

        // Help / capabilities
        if (lc.includes('help') || lc.includes('what can you do') || lc.includes('capabilities')) {
            reply = `I'm your AI agent for the **${agent?.name || 'smart contract'}**!\n\n`;
            reply += `**Available Functions:**\n`;
            if (readFunctions.length > 0) {
                reply += `\n**Read Functions (Query data):**\n`;
                readFunctions.slice(0, 5).forEach(f => {
                    reply += `• ${f.name}(${f.inputs.map(i => i.type).join(', ')})\n`;
                });
                if (readFunctions.length > 5) reply += `• ...and ${readFunctions.length - 5} more\n`;
            }
            if (writeFunctions.length > 0) {
                reply += `\n**Write Functions (Transactions):**\n`;
                writeFunctions.slice(0, 5).forEach(f => {
                    const status = f.authorized ? '[Authorized]' : '[Not Authorized]';
                    reply += `${status} ${f.name}(${f.inputs.map(i => i.type).join(', ')})\n`;
                });
                if (writeFunctions.length > 5) reply += `• ...and ${writeFunctions.length - 5} more\n`;
            }
            reply += `\n**Try asking:**\n`;
            reply += `• "What's my balance?"\n`;
            reply += `• "Show me contract info"\n`;
            if (writeFunctions.some(f => f.name.toLowerCase().includes('stake'))) {
                reply += `• "Stake 100 tokens"\n`;
            }
            if (writeFunctions.some(f => f.name.toLowerCase().includes('transfer'))) {
                reply += `• "Transfer 50 tokens to 0x..."\n`;
            }
        }
        // List functions
        else if (lc.includes('list function') || lc.includes('show function') || lc.includes('available function')) {
            reply = `**Contract Functions:**\n\n`;
            reply += `**Read Functions (${readFunctions.length}):**\n`;
            readFunctions.forEach(f => {
                reply += `• ${f.name}(${f.inputs.map(i => i.type).join(', ')})\n`;
            });
            reply += `\n**Write Functions (${writeFunctions.length}):**\n`;
            writeFunctions.forEach(f => {
                const status = f.authorized ? '[Authorized]' : '[Not Authorized]';
                reply += `${status} ${f.name}(${f.inputs.map(i => i.type).join(', ')})\n`;
            });
        }
        // Balance queries
        else if (lc.includes('balance') || lc.includes('how much') || lc.includes('how many')) {
            const balanceFunc = readFunctions.find(f => f.name.toLowerCase().includes('balance'));
            if (balanceFunc) {
                reply = `**Your Balance:**\n\n`;
                reply += `**Token Balance:** 1,250.50 tokens\n`;
                reply += `**Value (USD):** $2,501.00\n\n`;
                reply += `*Called function: ${balanceFunc.name}(${userAddress})*`;
            } else {
                reply = `I can check balances, but the contract doesn't have a balance function in its ABI.`;
            }
        }
        // Staking info
        else if ((lc.includes('stake') || lc.includes('staking')) && (lc.includes('info') || lc.includes('how much') || lc.includes('status') || lc.includes('?'))) {
            const stakeFunc = readFunctions.find(f => f.name.toLowerCase().includes('stake') || f.name.toLowerCase().includes('staked'));
            if (stakeFunc) {
                reply = `**Your Staking Info:**\n\n`;
                reply += `**Staked Amount:** 500 tokens\n`;
                reply += `**Current APY:** 12.5%\n`;
                reply += `**Rewards Earned:** 15.2 tokens\n`;
                reply += `**Staking Duration:** 30 days\n\n`;
                reply += `*Called function: ${stakeFunc.name}(${userAddress})*`;
            } else {
                reply = `This contract doesn't appear to have staking functionality.`;
            }
        }
        // Stake action (write)
        else if ((lc.includes('stake') || lc.includes('deposit')) && !lc.includes('?') && !lc.includes('info')) {
            const stakeFunc = writeFunctions.find(f => f.name.toLowerCase() === 'stake' || f.name.toLowerCase() === 'deposit');
            if (stakeFunc) {
                if (stakeFunc.authorized) {
                    const amount = lc.match(/\d+/) ? lc.match(/\d+/)![0] : '100';
                    reply = `**Stake Transaction Prepared**\n\n`;
                    reply += `**Function:** ${stakeFunc.name}\n`;
                    reply += `**Amount:** ${amount} tokens\n`;
                    reply += `**Estimated Gas:** 100,000\n\n`;
                    reply += `Please confirm this transaction in your wallet.`;
                    isPrepared = true;
                    preparedTx = {
                        to: agent?.targetContract || '0x0000000000000000000000000000000000000000',
                        data: '0xa694fc3a' + '0'.repeat(56) + amount, // mock calldata
                        value: '0',
                        gasEstimate: '100000',
                        explanation: `Stake ${amount} tokens`,
                        functionName: stakeFunc.name,
                    };
                } else {
                    reply = `The **${stakeFunc.name}** function is not authorized. Please authorize it in the agent settings first.`;
                }
            } else {
                reply = `This contract doesn't have a stake function.`;
            }
        }
        // Unstake/withdraw
        else if (lc.includes('unstake') || lc.includes('withdraw')) {
            const unstakeFunc = writeFunctions.find(f => f.name.toLowerCase().includes('unstake') || f.name.toLowerCase().includes('withdraw'));
            if (unstakeFunc) {
                if (unstakeFunc.authorized) {
                    const amount = lc.match(/\d+/) ? lc.match(/\d+/)![0] : '50';
                    reply = `**Withdrawal Transaction Prepared**\n\n`;
                    reply += `**Function:** ${unstakeFunc.name}\n`;
                    reply += `**Amount:** ${amount} tokens\n`;
                    reply += `**Estimated Gas:** 80,000\n\n`;
                    reply += `Please confirm this transaction in your wallet.`;
                    isPrepared = true;
                    preparedTx = {
                        to: agent?.targetContract || '0x1111111111111111111111111111111111111111',
                        data: '0x2e1a7d4d' + '0'.repeat(56) + amount,
                        value: '0',
                        gasEstimate: '80000',
                        explanation: `Unstake ${amount} tokens`,
                        functionName: unstakeFunc.name,
                    };
                } else {
                    reply = `The **${unstakeFunc.name}** function is not authorized. Please authorize it in the agent settings first.`;
                }
            } else {
                reply = `This contract doesn't have an unstake/withdraw function.`;
            }
        }
        // Transfer
        else if (lc.includes('transfer') || lc.includes('send')) {
            const transferFunc = writeFunctions.find(f => f.name.toLowerCase() === 'transfer');
            if (transferFunc) {
                if (transferFunc.authorized) {
                    const amount = lc.match(/\d+/) ? lc.match(/\d+/)![0] : '10';
                    reply = `**Transfer Transaction Prepared**\n\n`;
                    reply += `**Function:** ${transferFunc.name}\n`;
                    reply += `**Amount:** ${amount} tokens\n`;
                    reply += `**To:** 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\n`;
                    reply += `**Estimated Gas:** 65,000\n\n`;
                    reply += `Please confirm this transaction in your wallet.`;
                    isPrepared = true;
                    preparedTx = {
                        to: agent?.targetContract || '0x2222222222222222222222222222222222222222',
                        data: '0xa9059cbb' + '0'.repeat(56),
                        value: '0',
                        gasEstimate: '65000',
                        explanation: `Transfer ${amount} tokens`,
                        functionName: transferFunc.name,
                    };
                } else {
                    reply = `The **transfer** function is not authorized. Please authorize it in the agent settings first.`;
                }
            } else {
                reply = `This contract doesn't have a transfer function.`;
            }
        }
        // APY / rewards
        else if (lc.includes('apy') || lc.includes('reward') || lc.includes('earning')) {
            reply = `**Rewards & APY:**\n\n`;
            reply += `**Current APY:** 12.5%\n`;
            reply += `**Your Rewards:** 15.2 tokens\n`;
            reply += `**Total Value Locked:** 1.2M tokens\n`;
            reply += `**Last Reward:** 2 hours ago\n\n`;
            reply += `You can claim your rewards anytime!`;
        }
        // Contract info
        else if (lc.includes('contract') || lc.includes('info') || lc.includes('detail') || lc.includes('about')) {
            reply = `**Contract Information:**\n\n`;
            reply += `**Name:** ${agent?.name || 'Smart Contract'}\n`;
            reply += `**Address:** ${agent?.targetContract}\n`;
            reply += `**Functions:** ${functions.length} total (${readFunctions.length} read, ${writeFunctions.length} write)\n`;
            reply += `**Authorized:** ${authorizedFunctions.length} functions\n\n`;
            reply += `Ask me "list functions" to see all available functions!`;
        }
        // Greeting
        else if (lc.includes('hello') || lc.includes('hi') || lc.includes('hey')) {
            reply = `Hello! I'm your AI agent for **${agent?.name || 'this smart contract'}**.\n\n`;
            reply += `I can help you:\n`;
            reply += `• Query contract data (balance, info, etc.)\n`;
            reply += `• Execute transactions (${authorizedFunctions.length} functions authorized)\n`;
            reply += `• Explain contract functions\n\n`;
            reply += `Try asking "help" to see what I can do!`;
        }
        // Default fallback
        else {
            reply = `I received your message: "${message}"\n\n`;
            reply += `**I can help you with:**\n`;
            reply += `• Check balances and contract info\n`;
            reply += `• Execute authorized functions (${authorizedFunctions.length}/${writeFunctions.length} authorized)\n`;
            reply += `• Answer questions about this contract\n\n`;
            reply += `Try: "help", "list functions", or "what's my balance?"`;
        }

        const botMsg: ChatMessage = { id: `m-${Date.now() + 1}`, role: 'agent', content: reply, timestamp: new Date().toISOString() };
        history.push(botMsg);
        s.chats[key] = history;
        writeStorage(s);

        return this.simulateDelay({ response: reply, isPreparedTransaction: isPrepared, preparedTransaction: preparedTx }, 250 + Math.random() * 200);
    }

    async getChatHistory(agentId: string, userAddress: string): Promise<ChatMessage[]> {
        const s = readStorage();
        return this.simulateDelay(s.chats[`${agentId}:${userAddress}`] || []);
    }

    async executeTransaction(agentId: string, transactionData: PreparedTransaction, userAddress: string): Promise<ExecutionResult> {
        const s = readStorage();
        const tx = { id: `tx-${Date.now()}`, agentId, transactionData, userAddress, status: 'submitted', timestamp: new Date().toISOString() };
        s.txs.push(tx);
        writeStorage(s);
        return this.simulateDelay({ success: true, txHash: `0x${Math.random().toString(16).slice(2, 10)}` } as ExecutionResult, 400);
    }

    async getAgentAnalytics(agentId: string, _timeRange?: string): Promise<any> {
        // return simple aggregate counts
        const s = readStorage();
        const interactions = (s.txs.filter((t) => t.agentId === agentId) || []).length;
        return this.simulateDelay({ interactions, createdAgents: s.agents.length });
    }

    async getOverallAnalytics(_timeRange?: string): Promise<any> {
        const s = readStorage();
        return this.simulateDelay({ agents: s.agents.length, transactions: s.txs.length });
    }

    async getTransactionHistory(agentId?: string, limit?: number): Promise<any[]> {
        const s = readStorage();
        let res = s.txs.slice().reverse();
        if (agentId) res = res.filter((t) => t.agentId === agentId);
        if (limit) res = res.slice(0, limit);
        return this.simulateDelay(res);
    }

    connectWebSocket(_agentId: string, _userAddress: string): any {
        // Return a very small mock socket-like object used in the UI for events
        return new MockWebSocket();
    }
}

// -----------------------
// Export chosen client
// -----------------------

export const apiClient = USE_MOCK ? new MockApiClient(API_BASE_URL) : new ApiClient(API_BASE_URL);
