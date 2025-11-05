/**
 * Dashboard Overview Page
 * Main dashboard with stats, recent activity, and quick actions
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    MessageSquare,
    Zap,
    Activity,
    CheckCircle,
    XCircle,
    ArrowUpRight,
    Plus,
    Clock,
    AlertCircle,
    ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/useToast';

export default function DashboardPage() {
    const { isLoading } = useLoading();
    const toast = useToast();

    const [stats, setStats] = useState([
        { label: 'Total Agents', value: '0', change: 'Loading...', icon: Bot, trend: 'up' as const },
        { label: 'Interactions', value: '0', change: 'Loading...', icon: Activity, trend: 'up' as const },
        { label: 'Success Rate', value: '0%', change: 'Loading...', icon: CheckCircle, trend: 'up' as const },
        { label: 'Gas Saved', value: '0 ETH', change: 'Loading...', icon: Zap, trend: 'up' as const },
    ]);

    const [recentAgents, setRecentAgents] = useState<any[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [showTxModal, setShowTxModal] = useState(false);
    const [_agentsMap, _setAgentsMap] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [analytics, agents, transactions] = await Promise.all([
                    apiClient.getOverallAnalytics().catch(() => ({})),
                    apiClient.getAgents().catch(() => []),
                    apiClient.getTransactionHistory(undefined, 3).catch(() => []),
                ]);

                // Create agent ID to name mapping
                const agentMap: Record<string, string> = {};
                agents.forEach((agent: any) => {
                    agentMap[agent.id] = agent.name;
                });
                _setAgentsMap(agentMap);

                // Update stats
                setStats([
                    {
                        label: 'Total Agents',
                        value: analytics.totalAgents?.toString() || agents.length.toString() || '0',
                        change: `+${analytics.newAgentsThisWeek || 0} this week`,
                        icon: Bot,
                        trend: 'up' as const
                    },
                    {
                        label: 'Interactions',
                        value: analytics.totalTransactions?.toLocaleString() || '0',
                        change: `+${analytics.callsGrowthPercent || 0}% from last month`,
                        icon: Activity,
                        trend: 'up' as const
                    },
                    {
                        label: 'Success Rate',
                        value: `${((analytics.successRate || 0) * 100).toFixed(1)}%`,
                        change: `+${analytics.successRateGrowth || 0}% from last month`,
                        icon: CheckCircle,
                        trend: 'up' as const
                    },
                    {
                        label: 'Gas Saved',
                        value: `${(analytics.totalGasUsed || 0).toLocaleString()} ETH`,
                        change: `+${analytics.gasGrowth || '0'} ETH this week`,
                        icon: Zap,
                        trend: 'up' as const
                    },
                ]);

                // Update recent agents (top 3 most active) - agents is already an array
                const sortedAgents = (Array.isArray(agents) ? agents : [])
                    .filter((a: any) => a.active)
                    .sort((a: any, b: any) => (b.analytics?.totalCalls || 0) - (a.analytics?.totalCalls || 0))
                    .slice(0, 3);

                setRecentAgents(sortedAgents.map((agent: any) => ({
                    id: agent.id,
                    name: agent.name,
                    status: agent.active ? 'active' : 'inactive',
                    interactions: agent.analytics?.totalCalls || 0,
                    lastActive: agent.updatedAt || agent.createdAt || 'Unknown',
                })));

                // Update recent transactions
                setRecentTransactions((Array.isArray(transactions) ? transactions : []).slice(0, 3).map((tx: any) => ({
                    ...tx,
                    id: tx.id || tx.txHash || `tx-${crypto.randomUUID()}`,
                    type: tx.functionName || 'Transaction',
                    agentName: agentMap[tx.agentId] || tx.agentId || 'Unknown Agent',
                    status: tx.status === 'confirmed' || tx.status === 'success' ? 'success' : tx.status === 'pending' ? 'pending' : 'failed',
                    txHash: tx.txHash || `0x${Math.random().toString(16).slice(2)}`,
                    action: tx.functionName || 'Unknown',
                    time: tx.createdAt ? new Date(tx.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'Unknown time',
                })));
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                toast.error('Failed to load dashboard data');
            }
        };

        fetchDashboardData();
    }, [toast]);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Welcome back! Here's what's happening with your agents.</p>
                </div>

                <Link
                    href="/dashboard/agents/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    Create Agent
                </Link>
            </div>

            {/* Stats Grid */}
            {!isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Agents */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Recent Agents</h2>
                            <Link
                                href="/dashboard/agents"
                                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                            >
                                View all
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {recentAgents.map((agent) => (
                            <Link
                                key={agent.id}
                                href={`/dashboard/agents/${agent.id}`}
                                className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative w-10 h-10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg" />
                                        <div className="absolute inset-[2px] bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
                                            <Bot className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white group-hover:text-gray-100">{agent.name}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${agent.status === 'active' ? 'text-green-400' : 'text-gray-500'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-green-400' : 'bg-gray-500'
                                                    }`} />
                                                {agent.status}
                                            </span>
                                            <span className="text-xs text-gray-500">·</span>
                                            <span className="text-xs text-gray-500">{agent.interactions} interactions</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-gray-500">{agent.lastActive}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                            <Link
                                href="/dashboard/analytics"
                                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                            >
                                View all
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    onClick={() => {
                                        setSelectedTransaction(tx);
                                        setShowTxModal(true);
                                    }}
                                    className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.status === 'success'
                                            ? 'bg-green-500/20'
                                            : tx.status === 'pending'
                                                ? 'bg-yellow-500/20'
                                                : 'bg-red-500/20'
                                            }`}>
                                            {tx.status === 'success' ? (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            ) : tx.status === 'pending' ? (
                                                <Clock className="w-5 h-5 text-yellow-400" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-red-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{tx.agentName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">{tx.action}</span>
                                                <span className="text-xs text-gray-600">·</span>
                                                <span className="text-xs text-gray-400 font-mono">
                                                    {tx.txHash?.slice(0, 10)}...
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">{tx.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400">No recent transactions</p>
                                <p className="text-sm text-gray-500 mt-2">Activity will appear here</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/dashboard/agents/create"
                        className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
                    >
                        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white group-hover:text-gray-100">Create Agent</p>
                            <p className="text-xs text-gray-500">Deploy new agent</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/chat"
                        className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
                    >
                        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white group-hover:text-gray-100">Start Chat</p>
                            <p className="text-xs text-gray-500">Interact with agents</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/analytics"
                        className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
                    >
                        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white group-hover:text-gray-100">View Analytics</p>
                            <p className="text-xs text-gray-500">Performance metrics</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/docs"
                        className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
                    >
                        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white group-hover:text-gray-100">Documentation</p>
                            <p className="text-xs text-gray-500">Learn more</p>
                        </div>
                    </Link>
                </div>
            </motion.div>

            {/* Transaction Detail Modal */}
            <AnimatePresence>
                {showTxModal && selectedTransaction && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowTxModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
                                <button
                                    onClick={() => setShowTxModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <XCircle className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            {/* Status Badge */}
                            <div className="mb-6">
                                <span
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${selectedTransaction.status === 'success'
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : selectedTransaction.status === 'failed'
                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}
                                >
                                    {selectedTransaction.status === 'success' ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : selectedTransaction.status === 'failed' ? (
                                        <XCircle className="w-4 h-4" />
                                    ) : (
                                        <Clock className="w-4 h-4" />
                                    )}
                                    {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                                </span>
                            </div>

                            {/* Transaction Info */}
                            <div className="space-y-4">
                                {/* Transaction Hash */}
                                <div className="p-4 bg-black border border-white/10 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm text-gray-400">Transaction Hash</label>
                                        <a
                                            href={`https://explorer.somnia.network/tx/${selectedTransaction.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:text-gray-300 text-sm flex items-center gap-1 font-medium"
                                        >
                                            View on Explorer
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <p className="text-white font-mono text-sm break-all">
                                        {selectedTransaction.txHash}
                                    </p>
                                </div>

                                {/* Agent Name */}
                                <div className="p-4 bg-black border border-white/10 rounded-lg">
                                    <label className="text-sm text-gray-400 block mb-2">Agent</label>
                                    <p className="text-white font-medium">
                                        {selectedTransaction.agentName}
                                    </p>
                                </div>

                                {/* Function Name */}
                                <div className="p-4 bg-black border border-white/10 rounded-lg">
                                    <label className="text-sm text-gray-400 block mb-2">Function</label>
                                    <p className="text-white font-medium">
                                        {selectedTransaction.functionName || selectedTransaction.action || 'N/A'}
                                    </p>
                                </div>

                                {/* User Address */}
                                {selectedTransaction.userAddress && (
                                    <div className="p-4 bg-black border border-white/10 rounded-lg">
                                        <label className="text-sm text-gray-400 block mb-2">User Address</label>
                                        <p className="text-white font-mono text-sm break-all">
                                            {selectedTransaction.userAddress}
                                        </p>
                                    </div>
                                )}

                                {/* Block Number */}
                                {selectedTransaction.blockNumber && (
                                    <div className="p-4 bg-black border border-white/10 rounded-lg">
                                        <label className="text-sm text-gray-400 block mb-2">Block Number</label>
                                        <p className="text-white font-medium">
                                            {selectedTransaction.blockNumber.toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                {/* Gas Used */}
                                {selectedTransaction.gasUsed && (
                                    <div className="p-4 bg-black border border-white/10 rounded-lg">
                                        <label className="text-sm text-gray-400 block mb-2">Gas Used</label>
                                        <p className="text-white font-medium">
                                            {selectedTransaction.gasUsed.toLocaleString()} gas units
                                        </p>
                                    </div>
                                )}

                                {/* Timestamps */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-black border border-white/10 rounded-lg">
                                        <label className="text-sm text-gray-400 block mb-2">Created At</label>
                                        <p className="text-white text-sm">
                                            {selectedTransaction.createdAt
                                                ? new Date(selectedTransaction.createdAt).toLocaleString()
                                                : selectedTransaction.time || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-black border border-white/10 rounded-lg">
                                        <label className="text-sm text-gray-400 block mb-2">Confirmed At</label>
                                        <p className="text-white text-sm">
                                            {selectedTransaction.confirmedAt
                                                ? new Date(selectedTransaction.confirmedAt).toLocaleString()
                                                : 'Pending'}
                                        </p>
                                    </div>
                                </div>

                                {/* Agent ID */}
                                {selectedTransaction.agentId && (
                                    <div className="p-4 bg-black border border-white/10 rounded-lg">
                                        <label className="text-sm text-gray-400 block mb-2">Agent ID</label>
                                        <p className="text-white font-mono text-sm break-all">
                                            {selectedTransaction.agentId}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Close Button */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowTxModal(false)}
                                    className="px-6 py-2 bg-white hover:bg-gray-200 text-black font-medium rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
