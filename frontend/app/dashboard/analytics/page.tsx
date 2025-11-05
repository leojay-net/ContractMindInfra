/**
 * Analytics Dashboard Page
 * Comprehensive analytics with charts and performance metrics
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Activity,
    Zap,
    Users,
    Calendar,
    Download,
    Filter,
    BarChart3,
    PieChart,
    LineChart,
    CheckCircle,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Clock,
    ExternalLink,
} from 'lucide-react';
import {
    LineChart as RechartsLine,
    BarChart as RechartsBar,
    PieChart as RechartsPie,
    Line,
    Bar,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import type { Agent } from '@/types';

// Mock data
const usageOverTimeData = [
    { date: 'Oct 1', calls: 145, success: 142, failed: 3 },
    { date: 'Oct 5', calls: 189, success: 185, failed: 4 },
    { date: 'Oct 10', calls: 234, success: 230, failed: 4 },
    { date: 'Oct 15', calls: 298, success: 293, failed: 5 },
    { date: 'Oct 20', calls: 267, success: 262, failed: 5 },
    { date: 'Oct 25', calls: 312, success: 308, failed: 4 },
    { date: 'Oct 30', calls: 356, success: 351, failed: 5 },
];

const functionBreakdownData = [
    { name: 'stake', value: 524, color: '#3b82f6' },
    { name: 'unstake', value: 312, color: '#8b5cf6' },
    { name: 'claimRewards', value: 249, color: '#ec4899' },
    { name: 'getBalance', value: 162, color: '#f59e0b' },
    { name: 'compound', value: 98, color: '#10b981' },
];

const gasUsageData = [
    { date: 'Week 1', gas: 0.45 },
    { date: 'Week 2', gas: 0.52 },
    { date: 'Week 3', gas: 0.48 },
    { date: 'Week 4', gas: 0.41 },
];

const topAgentsData = [
    {
        id: '1',
        name: 'DeFi Staking Agent',
        calls: 1247,
        successRate: 98.5,
        gasUsed: '2.4 ETH',
        trend: 'up' as const,
        change: 18,
    },
    {
        id: '2',
        name: 'NFT Marketplace Agent',
        calls: 892,
        successRate: 97.2,
        gasUsed: '1.8 ETH',
        trend: 'up' as const,
        change: 12,
    },
    {
        id: '3',
        name: 'DAO Governance Agent',
        calls: 654,
        successRate: 99.1,
        gasUsed: '1.2 ETH',
        trend: 'down' as const,
        change: 5,
    },
    {
        id: '4',
        name: 'Token Swap Agent',
        calls: 423,
        successRate: 96.8,
        gasUsed: '0.9 ETH',
        trend: 'up' as const,
        change: 8,
    },
];

const recentActivityData = [
    {
        id: '1',
        agent: 'DeFi Staking Agent',
        function: 'stake',
        user: '0x1234...5678',
        status: 'success' as const,
        timestamp: '2 min ago',
    },
    {
        id: '2',
        agent: 'NFT Marketplace Agent',
        function: 'listNFT',
        user: '0x8765...4321',
        status: 'success' as const,
        timestamp: '5 min ago',
    },
    {
        id: '3',
        agent: 'DeFi Staking Agent',
        function: 'unstake',
        user: '0x9999...1111',
        status: 'failed' as const,
        timestamp: '12 min ago',
    },
    {
        id: '4',
        agent: 'DAO Governance Agent',
        function: 'vote',
        user: '0x5555...3333',
        status: 'success' as const,
        timestamp: '18 min ago',
    },
    {
        id: '5',
        agent: 'Token Swap Agent',
        function: 'swap',
        user: '0x7777...9999',
        status: 'success' as const,
        timestamp: '25 min ago',
    },
];

export default function AnalyticsPage() {
    const toast = useToast();
    const [dateRange, setDateRange] = useState('30d');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [showTxModal, setShowTxModal] = useState(false);

    const [analytics, setAnalytics] = useState<any>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            try {
                const [analyticsData, agentsData, transactionsData] = await Promise.all([
                    apiClient.getOverallAnalytics().catch(() => null),
                    apiClient.getAgents().catch(() => []),
                    apiClient.getTransactionHistory().catch(() => []),
                ]);

                setAnalytics(analyticsData);
                setAgents(agentsData);
                setTransactions(transactionsData.slice(0, 10)); // Latest 10
            } catch (error) {
                console.error('Error fetching analytics:', error);
                toast.error('Failed to load analytics data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [dateRange, toast]);

    const stats = analytics ? [
        {
            label: 'Total Calls',
            value: analytics.totalTransactions?.toLocaleString() || '0',
            change: '+18%',
            trend: 'up' as const,
            icon: Activity,
            color: 'blue',
        },
        {
            label: 'Success Rate',
            value: `${analytics.successRate ? (analytics.successRate * 100).toFixed(1) : '0'}%`,
            change: '+2.1%',
            trend: 'up' as const,
            icon: CheckCircle,
            color: 'green',
        },
        {
            label: 'Total Gas Used',
            value: `${(analytics.totalGasUsed || 0).toLocaleString()}`,
            change: 'gas units',
            trend: 'up' as const,
            icon: Zap,
            color: 'yellow',
        },
        {
            label: 'Active Agents',
            value: (analytics.totalAgents || agents.filter(a => a.active).length).toString(),
            change: `${agents.length} total`,
            trend: 'up' as const,
            icon: Users,
            color: 'purple',
        },
    ] : [];

    // Calculate top agents from real data
    const topAgentsData = agents
        .filter(a => a.analytics)
        .sort((a, b) => (b.analytics?.totalCalls || 0) - (a.analytics?.totalCalls || 0))
        .slice(0, 5)
        .map(agent => ({
            id: agent.id,
            name: agent.name,
            calls: agent.analytics?.totalCalls || 0,
            successRate: ((agent.analytics?.successRate || 0) * 100).toFixed(1),
            gasUsed: `${(agent.analytics?.totalGasUsed || 0).toLocaleString()}`,
            trend: 'up' as const,
            change: 0,
        }));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
        );
    }

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Export data');
        toast.info('Export feature coming soon');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                    <p className="text-gray-400">Track performance and usage across all agents</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Date Range Selector */}
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all"
                    >
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
                    >
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-400">{stat.label}</p>
                            <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p
                            className={`text-xs flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                }`}
                        >
                            {stat.trend === 'up' ? (
                                <ArrowUpRight className="w-3 h-3" />
                            ) : (
                                <ArrowDownRight className="w-3 h-3" />
                            )}
                            {stat.change} from last period
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Usage Over Time */}
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <LineChart className="w-5 h-5" />
                            Usage Over Time
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={usageOverTimeData}>
                            <defs>
                                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="date" stroke="#999999" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#999999" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#000000',
                                    border: '1px solid #ffffff20',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="calls"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorCalls)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Function Breakdown */}
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <PieChart className="w-5 h-5" />
                            Function Breakdown
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <RechartsPie>
                            <Pie
                                data={functionBreakdownData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {functionBreakdownData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#000000',
                                    border: '1px solid #ffffff20',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                }}
                            />
                        </RechartsPie>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Success Rate Trend */}
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Success vs Failed Calls
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <RechartsBar data={usageOverTimeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="date" stroke="#999999" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#999999" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#000000',
                                    border: '1px solid #ffffff20',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="success" fill="#10b981" name="Success" />
                            <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                        </RechartsBar>
                    </ResponsiveContainer>
                </div>

                {/* Gas Usage */}
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Gas Usage Trend
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <RechartsLine data={gasUsageData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="date" stroke="#999999" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#999999" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#000000',
                                    border: '1px solid #ffffff20',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="gas"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                dot={{ fill: '#f59e0b', r: 4 }}
                            />
                        </RechartsLine>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Agents Table */}
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Performing Agents</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left text-sm font-semibold text-gray-400 pb-3">Agent</th>
                                <th className="text-left text-sm font-semibold text-gray-400 pb-3">Total Calls</th>
                                <th className="text-left text-sm font-semibold text-gray-400 pb-3">Success Rate</th>
                                <th className="text-left text-sm font-semibold text-gray-400 pb-3">Gas Used</th>
                                <th className="text-left text-sm font-semibold text-gray-400 pb-3">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topAgentsData.map((agent, index) => (
                                <motion.tr
                                    key={agent.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-all"
                                >
                                    <td className="py-4 text-white font-medium">{agent.name}</td>
                                    <td className="py-4 text-gray-400">{agent.calls.toLocaleString()}</td>
                                    <td className="py-4">
                                        <span className="text-green-400">{agent.successRate}%</span>
                                    </td>
                                    <td className="py-4 text-gray-400">{agent.gasUsed}</td>
                                    <td className="py-4">
                                        <span
                                            className={`flex items-center gap-1 ${agent.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                                }`}
                                        >
                                            {agent.trend === 'up' ? (
                                                <TrendingUp className="w-4 h-4" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4" />
                                            )}
                                            {agent.change}%
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {transactions && transactions.length > 0 ? (
                        transactions.map((tx: any, index: number) => (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => {
                                    setSelectedTransaction(tx);
                                    setShowTxModal(true);
                                }}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-2 rounded-lg ${tx.status === 'completed' || tx.status === 'success'
                                            ? 'bg-green-500/20'
                                            : 'bg-red-500/20'
                                            }`}
                                    >
                                        {tx.status === 'completed' || tx.status === 'success' ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">
                                            {tx.functionName || 'Transaction'}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="font-mono">{tx.userAddress?.slice(0, 10)}...</span>
                                            <span>•</span>
                                            <span>
                                                {tx.createdAt
                                                    ? new Date(tx.createdAt).toLocaleString()
                                                    : 'Unknown date'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'completed' || tx.status === 'success'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                        }`}
                                >
                                    {tx.status}
                                </span>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">No recent activity</p>
                            <p className="text-sm text-gray-500 mt-2">Transactions will appear here</p>
                        </div>
                    )}
                </div>
            </div>

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
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${selectedTransaction.status === 'completed' || selectedTransaction.status === 'success'
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : selectedTransaction.status === 'failed'
                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}
                                >
                                    {selectedTransaction.status === 'completed' || selectedTransaction.status === 'success' ? (
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

                                {/* Function Name */}
                                <div className="p-4 bg-black border border-white/10 rounded-lg">
                                    <label className="text-sm text-gray-400 block mb-2">Function</label>
                                    <p className="text-white font-medium">
                                        {selectedTransaction.functionName || 'N/A'}
                                    </p>
                                </div>

                                {/* User Address */}
                                <div className="p-4 bg-black border border-white/10 rounded-lg">
                                    <label className="text-sm text-gray-400 block mb-2">User Address</label>
                                    <p className="text-white font-mono text-sm break-all">
                                        {selectedTransaction.userAddress}
                                    </p>
                                </div>

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
                                                : 'N/A'}
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
                                        <p className="text-white font-mono text-sm">
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
