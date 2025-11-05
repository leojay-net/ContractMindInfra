/**
 * Chat Interface Page
 * Natural language chat with AI agents for smart contract interactions
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Send,
    Bot,
    User,
    Loader2,
    XCircle,
    AlertCircle,
    ChevronDown,
    Sparkles,
    Info,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAccount, useWalletClient } from 'wagmi';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import type { Agent, ChatMessage as APIChatMessage } from '@/types';
import ReactMarkdown from 'react-markdown';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type MessageType = 'user' | 'agent' | 'system';
type MessageStatus = 'sending' | 'sent' | 'error';

interface Message {
    id: string;
    type: MessageType;
    content: string;
    timestamp: Date;
    status?: MessageStatus;
    transaction?: {
        function: string;
        params: any[];
        gasEstimate: string;
        preview: string;
    };
}

export default function ChatPage() {
    const searchParams = useSearchParams();
    const preselectedAgentId = searchParams?.get('agent');
    const toast = useToast();
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();

    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [showAgentDropdown, setShowAgentDropdown] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showTransactionPreview, setShowTransactionPreview] = useState(false);
    const [pendingTransaction, setPendingTransaction] = useState<any>(null);
    const [isLoadingAgents, setIsLoadingAgents] = useState(true);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [showParamModal, setShowParamModal] = useState(false);
    const [selectedFunction, setSelectedFunction] = useState<any>(null);
    const [functionParams, setFunctionParams] = useState<Record<string, string>>({});

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch agents on mount
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const fetchedAgents = await apiClient.getAgents();
                const activeAgents = fetchedAgents.filter(a => a.active);
                setAgents(activeAgents);

                // Set preselected agent if exists
                if (preselectedAgentId) {
                    const agent = activeAgents.find(a => a.id === preselectedAgentId);
                    if (agent) setSelectedAgent(agent);
                }
            } catch (error) {
                console.error('Error fetching agents:', error);
                toast.error('Failed to load agents');
            } finally {
                setIsLoadingAgents(false);
            }
        };

        fetchAgents();
    }, [preselectedAgentId, toast]);

    // Load chat history when agent is selected
    useEffect(() => {
        const loadChatHistory = async () => {
            if (!selectedAgent || !address) {
                // Show welcome message if no address
                if (selectedAgent && !address) {
                    const welcomeMessage: Message = {
                        id: '0',
                        type: 'agent',
                        content: `Hello! I'm ${selectedAgent.name}. Please connect your wallet to start chatting.`,
                        timestamp: new Date(),
                        status: 'sent',
                    };
                    setMessages([welcomeMessage]);
                }
                return;
            }

            try {
                const history = await apiClient.getChatHistory(selectedAgent.id, address);
                const formattedMessages: Message[] = history.map((msg: APIChatMessage) => ({
                    id: msg.id,
                    type: msg.role === 'user' ? 'user' : 'agent',
                    content: msg.content,
                    timestamp: new Date(msg.timestamp),
                    status: 'sent',
                    transaction: msg.transaction ? {
                        function: msg.transaction.functionName,
                        params: [],
                        gasEstimate: msg.transaction.gasEstimate,
                        preview: msg.transaction.explanation,
                    } : undefined,
                }));

                if (formattedMessages.length > 0) {
                    setMessages(formattedMessages);
                } else {
                    // Show welcome message if no history
                    const welcomeMessage: Message = {
                        id: '0',
                        type: 'agent',
                        content: `Hello! I'm ${selectedAgent.name}. I can help you interact with smart contracts using natural language. Try asking me to check your balance, stake tokens, or execute any contract function!`,
                        timestamp: new Date(),
                        status: 'sent',
                    };
                    setMessages([welcomeMessage]);
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
                // Show welcome message on error
                const welcomeMessage: Message = {
                    id: '0',
                    type: 'agent',
                    content: `Hello! I'm ${selectedAgent.name}. I can help you interact with smart contracts using natural language. Try asking me to check your balance, stake tokens, or execute any contract function!`,
                    timestamp: new Date(),
                    status: 'sent',
                };
                setMessages([welcomeMessage]);
            }
        };

        loadChatHistory();
    }, [selectedAgent, address]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !selectedAgent || !address) {
            if (!address) {
                toast.error('Please connect your wallet first');
            }
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date(),
            status: 'sending',
        };

        setMessages((prev) => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await apiClient.sendMessage(selectedAgent.id, currentInput, address);

            // Update user message status
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === userMessage.id ? { ...msg, status: 'sent' as MessageStatus } : msg
                )
            );

            // Add agent response
            const agentResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'agent',
                content: response.response,
                timestamp: new Date(),
                status: 'sent',
            };

            // Check if it's a prepared transaction
            if (response.isPreparedTransaction && response.preparedTransaction) {
                agentResponse.transaction = {
                    function: response.preparedTransaction.functionName,
                    params: [],
                    gasEstimate: response.preparedTransaction.gasEstimate,
                    preview: response.preparedTransaction.explanation,
                };
                setPendingTransaction(response.preparedTransaction);
                setShowTransactionPreview(true);
            }

            setMessages((prev) => [...prev, agentResponse]);
        } catch (error: any) {
            console.error('Error sending message:', error);

            // Update user message status to error
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === userMessage.id ? { ...msg, status: 'error' as MessageStatus } : msg
                )
            );

            // Add error message
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'system',
                content: error.message || 'Failed to send message. Please try again.',
                timestamp: new Date(),
                status: 'sent',
            };
            setMessages((prev) => [...prev, errorResponse]);
            toast.error('Failed to send message');
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickAction = (func: any) => {
        if (func.inputs && func.inputs.length > 0) {
            // Function has parameters - show modal
            setSelectedFunction(func);
            setFunctionParams({});
            setShowParamModal(true);
        } else {
            // No parameters - execute directly
            executeQuickAction(func, {});
        }
    };

    const executeQuickAction = async (func: any, params: Record<string, string>) => {
        if (!selectedAgent || !address) return;

        setShowParamModal(false);

        // Build a natural language message based on function and params
        let message = '';

        if (func.stateMutability === 'view' || func.stateMutability === 'pure') {
            // Read function
            message = `Get ${func.name}`;
            if (Object.keys(params).length > 0) {
                message += ` with parameters: ${Object.entries(params).map(([k, v]) => `${k}=${v}`).join(', ')}`;
            }
        } else {
            // Write function
            message = func.name;
            if (Object.keys(params).length > 0) {
                message += ` ${Object.values(params).join(' ')}`;
            }
        }

        // Create and send the message
        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: message,
            timestamp: new Date(),
            status: 'sending',
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        try {
            const response = await apiClient.sendMessage(selectedAgent.id, message, address);

            // Update user message status
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === userMessage.id ? { ...msg, status: 'sent' as MessageStatus } : msg
                )
            );

            // Add agent response
            const agentResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'agent',
                content: response.response,
                timestamp: new Date(),
                status: 'sent',
            };

            // Check if it's a prepared transaction
            if (response.isPreparedTransaction && response.preparedTransaction) {
                agentResponse.transaction = {
                    function: response.preparedTransaction.functionName,
                    params: [],
                    gasEstimate: response.preparedTransaction.gasEstimate,
                    preview: response.preparedTransaction.explanation,
                };
                setPendingTransaction(response.preparedTransaction);
                setShowTransactionPreview(true);
            }

            setMessages((prev) => [...prev, agentResponse]);
        } catch (error: any) {
            console.error('Error sending message:', error);

            // Update user message status to error
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === userMessage.id ? { ...msg, status: 'error' as MessageStatus } : msg
                )
            );

            // Add error message
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'system',
                content: error.message || 'Failed to send message. Please try again.',
                timestamp: new Date(),
                status: 'sent',
            };
            setMessages((prev) => [...prev, errorResponse]);
            toast.error('Failed to send message');
        } finally {
            setIsTyping(false);
        }
    };

    const handleExecuteTransaction = async () => {
        if (!pendingTransaction || !address || !walletClient) {
            toast.error('Wallet not connected');
            return;
        }

        try {
            // Show pending state
            const pendingMessage: Message = {
                id: Date.now().toString(),
                type: 'system',
                content: '🔐 Requesting wallet signature...',
                timestamp: new Date(),
                status: 'sent',
            };
            setMessages((prev) => [...prev, pendingMessage]);

            try {
                // Send transaction via wallet - this will open MetaMask/WalletConnect popup
                const hash = await walletClient.sendTransaction({
                    account: address as `0x${string}`,
                    to: pendingTransaction.to as `0x${string}`,
                    data: pendingTransaction.data as `0x${string}`,
                    value: BigInt(pendingTransaction.value || '0'),
                });

                // Remove pending message
                setMessages((prev) => prev.filter(msg => !msg.content.includes('Requesting wallet signature')));

                setShowTransactionPreview(false);
                const functionName = pendingTransaction.functionName;
                const targetAddress = pendingTransaction.to;
                setPendingTransaction(null);

                // Show initial success message
                const initialMessage: Message = {
                    id: Date.now().toString(),
                    type: 'system',
                    content: `✅ Transaction submitted! Waiting for confirmation...\n\n**Hash:** \`${hash}\``,
                    timestamp: new Date(),
                    status: 'sent',
                };
                setMessages((prev) => [...prev, initialMessage]);
                toast.success('Transaction submitted!');

                // Report transaction to backend for AI-generated receipt
                try {
                    const resultResponse = await fetch(`${API_BASE_URL}/api/v1/chat/transaction-result`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            agentId: selectedAgent?.id,
                            txHash: hash,
                            userAddress: address,
                            functionName: functionName,
                            targetAddress: targetAddress,
                        }),
                    });

                    if (resultResponse.ok) {
                        const result = await resultResponse.json();

                        // Remove initial message
                        setMessages((prev) => prev.filter(msg => !msg.content.includes('Waiting for confirmation')));

                        // Add AI-generated receipt
                        const receiptMessage: Message = {
                            id: Date.now().toString(),
                            type: 'agent',
                            content: result.response,
                            timestamp: new Date(),
                            status: 'sent',
                        };
                        setMessages((prev) => [...prev, receiptMessage]);
                    } else {
                        console.error('Failed to get transaction result from backend');
                    }
                } catch (backendError) {
                    console.error('Error reporting transaction to backend:', backendError);
                    // Keep the initial success message if backend fails
                }

            } catch (walletError: any) {
                console.error('Wallet error:', walletError);

                // Remove pending message
                setMessages((prev) => prev.filter(msg => !msg.content.includes('Requesting wallet signature')));

                // Check for user rejection
                const isUserRejection =
                    walletError.code === 4001 ||
                    walletError.code === 'ACTION_REJECTED' ||
                    walletError.message?.toLowerCase().includes('user rejected') ||
                    walletError.message?.toLowerCase().includes('user denied') ||
                    walletError.message?.toLowerCase().includes('user cancelled') ||
                    walletError.shortMessage?.toLowerCase().includes('rejected');

                if (isUserRejection) {
                    setShowTransactionPreview(false);
                    setPendingTransaction(null);

                    const rejectedMessage: Message = {
                        id: Date.now().toString(),
                        type: 'system',
                        content: '❌ Transaction rejected by user.',
                        timestamp: new Date(),
                        status: 'sent',
                    };
                    setMessages((prev) => [...prev, rejectedMessage]);
                    toast.error('Transaction rejected');
                } else {
                    // Transaction failed
                    setShowTransactionPreview(false);
                    setPendingTransaction(null);

                    const errorMessage: Message = {
                        id: Date.now().toString(),
                        type: 'system',
                        content: `❌ **Transaction failed**\n\n${walletError.message || 'Unknown error'}\n\nPlease try again or check your wallet.`,
                        timestamp: new Date(),
                        status: 'sent',
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                    toast.error('Transaction failed');
                }
            }
        } catch (error: any) {
            console.error('Error executing transaction:', error);
            toast.error(error.message || 'Failed to execute transaction');

            setShowTransactionPreview(false);
            setPendingTransaction(null);

            const errorMessage: Message = {
                id: Date.now().toString(),
                type: 'system',
                content: `❌ Transaction failed: ${error.message || 'Unknown error'}`,
                timestamp: new Date(),
                status: 'sent',
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    if (isLoadingAgents) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
        );
    }

    if (agents.length === 0) {
        return (
            <div className="p-6">
                <div className="p-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-center">
                    <Bot className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Active Agents</h3>
                    <p className="text-gray-400 mb-6">Create an agent first to start chatting</p>
                    <Link
                        href="/dashboard/agents/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
                    >
                        <Bot className="w-5 h-5" />
                        Create Your First Agent
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl" />
                            <div className="absolute inset-[2px] bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                                <MessageSquare className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {selectedAgent ? selectedAgent.name : 'AI Chat'}
                            </h1>
                            <p className="text-sm text-gray-400">
                                {selectedAgent ? selectedAgent.description : 'Natural language interface for smart contract interactions'}
                            </p>
                        </div>
                    </div>

                    {/* Agent Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                            className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                        >
                            {selectedAgent ? (
                                <>
                                    <Bot className="w-5 h-5 text-blue-400" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-white">{selectedAgent.name}</p>
                                        <p className="text-xs text-gray-400">Active</p>
                                    </div>
                                </>
                            ) : (
                                <span className="text-white">Select Agent</span>
                            )}
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {showAgentDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-2 w-72 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl z-10 max-h-96 overflow-y-auto"
                            >
                                {agents.map((agent) => (
                                    <button
                                        key={agent.id}
                                        onClick={() => {
                                            setSelectedAgent(agent);
                                            setShowAgentDropdown(false);
                                            setMessages([]);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all ${selectedAgent?.id === agent.id ? 'bg-white/5' : ''
                                            }`}
                                    >
                                        <Bot className="w-5 h-5 text-blue-400" />
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-medium text-white">{agent.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {agent.targetContract.slice(0, 10)}...
                                            </p>
                                        </div>
                                        {agent.active && (
                                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                Active
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {!selectedAgent ? (
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                        <Bot className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Select an Agent</h3>
                        <p className="text-gray-400">Choose an agent from the dropdown to start chatting</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    {message.type !== 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                            {message.type === 'agent' ? (
                                                <Bot className="w-4 h-4 text-white" />
                                            ) : (
                                                <Info className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[70%] ${message.type === 'user'
                                            ? 'bg-white text-black'
                                            : message.type === 'system'
                                                ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-100'
                                                : 'bg-white/5 backdrop-blur-sm border border-white/10 text-white'
                                            } rounded-2xl p-4`}
                                    >
                                        <div className="text-sm prose prose-invert prose-sm max-w-none
                                            prose-p:my-1 prose-p:leading-relaxed
                                            prose-headings:mt-3 prose-headings:mb-2 prose-headings:font-semibold
                                            prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
                                            prose-li:my-0.5
                                            prose-strong:font-bold prose-strong:text-white
                                            prose-code:bg-black/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                                            prose-pre:bg-black/50 prose-pre:p-2 prose-pre:rounded
                                            prose-a:text-blue-400 prose-a:underline">
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>

                                        {message.transaction && (
                                            <div className="mt-3 p-3 bg-black/20 rounded-lg border border-white/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                                    <p className="text-xs font-semibold text-blue-400">
                                                        Transaction Preview
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-400 mb-2">{message.transaction.preview}</p>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500">Gas Estimate:</span>
                                                    <span className="text-white">{message.transaction.gasEstimate}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 mt-2">
                                            <p className="text-xs text-gray-400">
                                                {message.timestamp.toLocaleTimeString()}
                                            </p>
                                            {message.status === 'sending' && (
                                                <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                                            )}
                                            {message.status === 'error' && (
                                                <XCircle className="w-3 h-3 text-red-400" />
                                            )}
                                        </div>
                                    </div>

                                    {message.type === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-black" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100" />
                                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-sm">
                        {!address && (
                            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                <p className="text-sm text-yellow-400">
                                    Please connect your wallet to send messages
                                </p>
                            </div>
                        )}

                        {/* Quick Action Buttons */}
                        {selectedAgent && selectedAgent.functions && selectedAgent.functions.filter((f: any) => f.authorized).length > 0 && (
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-400">Quick Actions</h3>
                                    <button
                                        onClick={() => setShowQuickActions(!showQuickActions)}
                                        className="text-xs text-blue-400 hover:text-blue-300"
                                    >
                                        {showQuickActions ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {showQuickActions && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAgent.functions
                                            .filter((f: any) => f.authorized)
                                            .map((func: any, idx: number) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleQuickAction(func)}
                                                    disabled={!address}
                                                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Sparkles className="w-3 h-3 text-blue-400" />
                                                    {func.name}
                                                    {func.inputs && func.inputs.length > 0 && (
                                                        <span className="text-gray-400">({func.inputs.length})</span>
                                                    )}
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={
                                    address
                                        ? "Ask me anything about the contract..."
                                        : "Connect wallet to start chatting..."
                                }
                                disabled={!address || isTyping}
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 disabled:opacity-50"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || !address || isTyping}
                                className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Send
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            AI agents can make mistakes. Verify important information.
                        </p>
                    </div>
                </>
            )}

            {/* Transaction Preview Modal */}
            <AnimatePresence>
                {showTransactionPreview && pendingTransaction && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                        onClick={() => setShowTransactionPreview(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black/90 border border-white/10 rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Confirm Transaction</h3>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <p className="text-sm text-gray-400 mb-1">Function</p>
                                    <p className="text-white font-mono">{pendingTransaction.functionName}()</p>
                                </div>

                                <div className="p-4 bg-white/5 rounded-lg">
                                    <p className="text-sm text-gray-400 mb-1">Description</p>
                                    <p className="text-white text-sm">{pendingTransaction.explanation}</p>
                                </div>

                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-400">Gas Estimate</p>
                                        <p className="text-white font-semibold">{pendingTransaction.gasEstimate}</p>
                                    </div>
                                </div>

                                {pendingTransaction.warnings && pendingTransaction.warnings.length > 0 && (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                                            <p className="text-sm font-semibold text-yellow-400">Warnings</p>
                                        </div>
                                        {pendingTransaction.warnings.map((warning: string, i: number) => (
                                            <p key={i} className="text-xs text-yellow-400 ml-6">
                                                • {warning}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowTransactionPreview(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExecuteTransaction}
                                    className="flex-1 px-4 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
                                >
                                    Execute
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Parameter Input Modal */}
            <AnimatePresence>
                {showParamModal && selectedFunction && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                        onClick={() => setShowParamModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black/90 border border-white/10 rounded-2xl p-6 max-w-md w-full"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">
                                {selectedFunction.name}
                            </h3>

                            <div className="space-y-4 mb-6">
                                {selectedFunction.inputs.map((input: any, idx: number) => (
                                    <div key={idx}>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            {input.name || `param${idx}`}
                                            <span className="text-xs text-gray-500 ml-2">({input.type})</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={functionParams[input.name || `param${idx}`] || ''}
                                            onChange={(e) => setFunctionParams({
                                                ...functionParams,
                                                [input.name || `param${idx}`]: e.target.value
                                            })}
                                            placeholder={`Enter ${input.type}`}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowParamModal(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => executeQuickAction(selectedFunction, functionParams)}
                                    disabled={selectedFunction.inputs.some((input: any) => !functionParams[input.name || `param${selectedFunction.inputs.indexOf(input)}`])}
                                    className="flex-1 px-4 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Execute
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
