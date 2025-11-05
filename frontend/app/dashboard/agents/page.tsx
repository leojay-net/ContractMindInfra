/**
 * Agents Listing Page
 * Browse, search, and filter all deployed agents
 */

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Search,
  Filter,
  Plus,
  MessageSquare,
  ExternalLink,
  MoreVertical,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle,
  Loader2,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useAgents } from '@/hooks/useAgents';
import { useToast } from '@/hooks/useToast';
import type { Agent } from '@/types';

export default function AgentsPage() {
  const toast = useToast();
  const { address } = useAccount();
  const { agents, loading: isLoading, error, refetch } = useAgents();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [ownerFilter, setOwnerFilter] = useState<'all' | 'mine'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'calls' | 'success'>('recent');

  // Calculate stats from agents data
  const stats = useMemo(() => {
    const activeCount = agents.filter((a: Agent) => a.active).length;
    const totalCalls = agents.reduce((sum: number, a: any) => sum + (a.analytics?.totalCalls || 0), 0);
    const avgSuccess = agents.length > 0
      ? agents.reduce((sum: number, a: any) => sum + (a.analytics?.successRate || 0), 0) / agents.length
      : 0;

    return {
      total: agents.length,
      active: activeCount,
      totalCalls,
      avgSuccessRate: Number((avgSuccess * 100).toFixed(1)), // Convert to percentage
    };
  }, [agents]);

  // Show error toast if fetch failed
  if (error) {
    toast.error('Failed to load agents');
  }

  // Filter and sort agents
  const filteredAgents = agents
    .filter((agent) => {
      const matchesSearch =
        agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.targetContract?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && agent.active) ||
        (statusFilter === 'inactive' && !agent.active);
      const matchesOwner =
        ownerFilter === 'all' ||
        (ownerFilter === 'mine' && address && agent.owner?.toLowerCase() === address.toLowerCase());
      return matchesSearch && matchesStatus && matchesOwner;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'calls') return (b.analytics?.totalCalls || 0) - (a.analytics?.totalCalls || 0);
      if (sortBy === 'success') return (b.analytics?.successRate || 0) - (a.analytics?.successRate || 0);
      return 0;
    });

  const myAgentsCount = agents.filter(a => address && a.owner?.toLowerCase() === address.toLowerCase()).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">Agents</h1>
          <Link
            href="/dashboard/agents/create"
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Agent
          </Link>
        </div>
        <p className="text-gray-400">Manage your AI agents and monitor their performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Total Agents</p>
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{isLoading ? '-' : stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Active</p>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">{isLoading ? '-' : stats.active}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Total Calls</p>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{isLoading ? '-' : stats.totalCalls.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Avg Success Rate</p>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">{isLoading ? '-' : `${stats.avgSuccessRate}%`}</p>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or contract address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>

        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value as any)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
        >
          <option value="all">All Agents ({agents.length})</option>
          <option value="mine">My Agents ({myAgentsCount})</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
        >
          <option value="recent">Most Recent</option>
          <option value="calls">Most Used</option>
          <option value="success">Highest Success Rate</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {/* Agent Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl" />
                    <div className="absolute inset-[2px] bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                      <Bot className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/agents/${agent.id}`}
                        className="text-lg font-semibold text-white hover:text-gray-300 transition-colors"
                      >
                        {agent.name}
                      </Link>
                      {address && agent.owner?.toLowerCase() === address.toLowerCase() && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Mine
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${agent.active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                          }`}
                      >
                        {agent.active ? '● Active' : '● Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Contract Address</p>
                <p className="text-sm text-gray-400 font-mono truncate">{agent.targetContract || 'N/A'}</p>
              </div>

              <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                <span>Created {new Date(agent.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Updated {new Date(agent.updatedAt).toLocaleDateString()}</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Calls</p>
                  <p className="text-sm font-semibold text-white">{(agent.analytics?.totalCalls || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                  <p className="text-sm font-semibold text-green-400">
                    {agent.analytics?.successRate ? (agent.analytics.successRate * 100).toFixed(0) : '0'}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Gas Used</p>
                  <p className="text-sm font-semibold text-white">{(agent.analytics?.totalGasUsed || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/chat?agent=${agent.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-medium text-white transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </Link>
                <Link
                  href={`/dashboard/agents/${agent.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-medium text-white transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Details
                </Link>
                <button className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all">
                  <MoreVertical className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No agents found</p>
          <p className="text-sm text-gray-500">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first agent to get started'}
          </p>
        </div>
      )}
    </div>
  );
}
