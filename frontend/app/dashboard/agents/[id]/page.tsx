/**
 * Agent Detail Page
 * Comprehensive view of a single agent with analytics and management
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    MessageSquare,
    Settings,
    Power,
    Copy,
    ExternalLink,
    TrendingUp,
    TrendingDown,
    Activity,
    Zap,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    MoreVertical,
    Edit,
    Trash2,
    AlertCircle,
    ChevronDown,
    FileText,
    Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import type { Agent } from '@/types';

export default function AgentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const toast = useToast();

    const [agent, setAgent] = useState<Agent | null>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'functions' | 'transactions'>('overview');
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', description: '' });

    const agentId = params.id as string;

    useEffect(() => {
        const fetchAgentData = async () => {
            if (!agentId) return;

            setIsLoading(true);
            try {
                const [agentData, analyticsData, transactionsData] = await Promise.all([
                    apiClient.getAgent(agentId).catch(() => null),
                    apiClient.getAgentAnalytics(agentId).catch(() => null),
                    apiClient.getTransactionHistory(agentId).catch(() => []),
                ]);

                if (agentData) {
                    setAgent(agentData);
                } else {
                    toast.error('Agent not found');
                    router.push('/dashboard/agents');
                    return;
                }

                setAnalytics(analyticsData);
                setTransactions(transactionsData);
            } catch (error: any) {
                console.error('Error fetching agent data:', error);
                toast.error('Failed to load agent data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgentData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agentId]);

    const copyAddress = () => {
        if (agent?.targetContract) {
            navigator.clipboard.writeText(agent.targetContract);
            toast.success('Address copied to clipboard');
        }
    };

    const toggleFunction = async (functionName: string, currentState: boolean) => {
        try {
            if (currentState) {
                // Revoke function
                await apiClient.revokeFunctions(agentId, [functionName]);
                toast.success(`Function "${functionName}" revoked successfully`);
            } else {
                // Authorize function
                await apiClient.authorizeFunctions(agentId, [functionName]);
                toast.success(`Function "${functionName}" authorized successfully`);
            }

            // Refresh agent data
            const updatedAgent = await apiClient.getAgent(agentId);
            setAgent(updatedAgent);
        } catch (error: any) {
            console.error('Error toggling function:', error);
            toast.error(error.message || 'Failed to update function authorization');
        }
    };

    const handleToggleStatus = async () => {
        if (!agent) return;

        try {
            const newStatus = agent.active ? 'inactive' : 'active';
            await apiClient.toggleAgentStatus(agentId, newStatus);
            toast.success(`Agent ${agent.active ? 'deactivated' : 'activated'} successfully`);

            // Refresh agent data
            const updatedAgent = await apiClient.getAgent(agentId);
            setAgent(updatedAgent);
        } catch (error: any) {
            console.error('Error toggling agent status:', error);
            toast.error(error.message || 'Failed to update agent status');
        }
        setShowMenu(false);
    };

    const handleDelete = async () => {
        if (!agent) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${agent.name}"? This action cannot be undone.`
        );

        if (!confirmed) {
            setShowMenu(false);
            return;
        }

        try {
            await apiClient.deleteAgent(agentId);
            toast.success('Agent deleted successfully');
            router.push('/dashboard/agents');
        } catch (error: any) {
            console.error('Error deleting agent:', error);
            toast.error(error.message || 'Failed to delete agent');
            setShowMenu(false);
        }
    };

    const handleEditAgent = () => {
        if (!agent) return;
        setEditForm({
            name: agent.name || '',
            description: agent.description || '',
        });
        setShowEditModal(true);
        setShowMenu(false);
    };

    const handleUpdateAgent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agent) return;

        try {
            await apiClient.updateAgent(agentId, editForm);
            toast.success('Agent updated successfully');

            // Refresh agent data
            const updatedAgent = await apiClient.getAgent(agentId);
            setAgent(updatedAgent);
            setShowEditModal(false);
        } catch (error: any) {
            console.error('Error updating agent:', error);
            toast.error(error.message || 'Failed to update agent');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
        );
    }

    if (!agent) {
        return null;
    }

    const tabs = [
        { id: 'overview' as const, label: 'Overview', icon: Activity },
        { id: 'functions' as const, label: 'Functions', icon: FileText },
        { id: 'transactions' as const, label: 'Transactions', icon: Clock },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl flex-shrink-0">
                            <Bot className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{agent.name || 'Unknown Agent'}</h1>
                            <p className="text-gray-400 mb-3">Agent for contract {agent.targetContract?.slice(0, 10) || 'N/A'}...</p>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${agent.active
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-gray-500/20 text-gray-400'
                                        }`}
                                >
                                    {agent.active ? '● Active' : '● Inactive'}
                                </span>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span>Created {new Date(agent.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/dashboard/chat?agent=${agentId}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Start Chat
                        </Link>
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                            >
                                <MoreVertical className="w-5 h-5 text-white" />
                            </button>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl z-10"
                                >
                                    <button
                                        onClick={handleEditAgent}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-white hover:bg-white/10 transition-all"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Agent
                                    </button>
                                    <button
                                        onClick={handleToggleStatus}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-white hover:bg-white/10 transition-all border-t border-white/10"
                                    >
                                        <Power className="w-4 h-4" />
                                        {agent.active ? 'Deactivate' : 'Activate'} Agent
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-white/10 transition-all border-t border-white/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Agent
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contract Address */}
                <div className="flex items-center gap-2 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-1">Contract Address</p>
                        <p className="text-white font-mono text-sm">{agent.targetContract}</p>
                    </div>
                    <button
                        onClick={copyAddress}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        title="Copy address"
                    >
                        <Copy className="w-5 h-5 text-gray-400" />
                    </button>
                    <a
                        href={`https://explorer.somnia.network/address/${agent.targetContract}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        title="View on explorer"
                    >
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                    </a>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-400">Total Calls</p>
                        <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                        {analytics?.totalCalls?.toLocaleString() || '0'}
                    </p>
                    <p className="text-xs text-gray-500">All time</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-400">Success Rate</p>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                        {analytics?.successRate ? (analytics.successRate * 100).toFixed(1) : '0'}%
                    </p>
                    <p className="text-xs text-gray-500">Average</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-400">Gas Used</p>
                        <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                        {(analytics?.totalGasUsed || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Total gas units</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-400">Functions</p>
                        <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                        {agent.functions?.length || '0'}
                    </p>
                    <p className="text-xs text-gray-500">
                        {agent.functions?.filter(f => f.authorized).length || '0'} authorized
                    </p>
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex gap-2 border-b border-white/10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${activeTab === tab.id
                                ? 'text-white border-white'
                                : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Analytics Overview */}
                    {analytics && (
                        <>
                            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                                <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Total Calls</p>
                                        <p className="text-2xl font-bold text-white">{analytics.totalCalls || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Success Rate</p>
                                        <p className="text-2xl font-bold text-white">{analytics.successRate ? (analytics.successRate * 100).toFixed(1) : 0}%</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Total Gas Used</p>
                                        <p className="text-2xl font-bold text-white">{(analytics.totalGasUsed || 0).toLocaleString()} gas</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Average Response Time</p>
                                        <p className="text-2xl font-bold text-white">{analytics.avgResponseTime || 0}ms</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {!analytics && (
                        <div className="p-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-center">
                            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">No analytics data available yet</p>
                            <p className="text-sm text-gray-500 mt-2">Data will appear once the agent starts processing transactions</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'functions' && (
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-1">Authorized Functions</h3>
                            <p className="text-sm text-gray-400">
                                Control which functions the agent can execute on behalf of users
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {agent.functions && agent.functions.length > 0 ? (
                            agent.functions.map((func) => (
                                <div
                                    key={func.name}
                                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className="text-white font-medium font-mono">{func.name}()</p>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${func.authorized
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                                    }`}
                                            >
                                                {func.authorized ? 'Authorized' : 'Not Authorized'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-1">
                                            Inputs: {func.inputs.map(i => i.type).join(', ') || 'none'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {func.stateMutability} function
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleFunction(func.name, func.authorized)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${func.authorized
                                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                            }`}
                                    >
                                        {func.authorized ? 'Revoke' : 'Authorize'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center">
                                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400">No functions found</p>
                                <p className="text-sm text-gray-500 mt-2">Check the contract ABI configuration</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-yellow-400 mb-1">Important</p>
                                <p className="text-xs text-yellow-400/80">
                                    Only authorize functions that are safe for automated execution. Users will still need to approve transactions in their wallet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                        <Link
                            href={`/dashboard/analytics?agent=${agentId}`}
                            className="text-sm text-gray-400 hover:text-white transition-all"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {transactions && transactions.length > 0 ? (
                            transactions.slice(0, 10).map((tx: any) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div
                                            className={`p-2 rounded-lg ${tx.status === 'success' || tx.status === 'completed'
                                                ? 'bg-green-500/20'
                                                : 'bg-red-500/20'
                                                }`}
                                        >
                                            {tx.status === 'success' || tx.status === 'completed' ? (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-white font-medium font-mono">{tx.functionName || 'Unknown'}</p>
                                                <span className="text-sm text-gray-400">•</span>
                                                <p className="text-sm text-gray-400">Gas: {(tx.gasUsed || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="font-mono">{tx.userAddress?.slice(0, 10) || 'N/A'}...</span>
                                                <span>•</span>
                                                <span>{new Date(tx.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400 mb-1">Gas Used</p>
                                            <p className="text-sm text-white font-medium">{tx.gasUsed || '0'}</p>
                                        </div>
                                        {tx.transactionHash && (
                                            <a
                                                href={`https://explorer.somnia.network/tx/${tx.transactionHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                            >
                                                <ExternalLink className="w-5 h-5 text-gray-400" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                <p className="text-gray-400">No transactions yet</p>
                                <p className="text-sm text-gray-500 mt-2">Transactions will appear here after users interact with the agent</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Agent Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowEditModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-lg w-full"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Edit Agent</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <XCircle className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateAgent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Agent Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        placeholder="Enter agent name"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        placeholder="Enter agent description"
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
