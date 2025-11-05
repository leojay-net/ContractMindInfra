/**
 * Dashboard Header - Top navigation bar with wallet connection
 * Professional infrastructure-style header
 */

'use client';

import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardHeader() {
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: '1', title: 'New agent created', message: 'DeFi Staking Agent is now active', time: '5 min ago', unread: true },
        { id: '2', title: 'Transaction completed', message: 'Stake function executed successfully', time: '1 hour ago', unread: false },
    ];

    return (
        <header className="sticky top-0 z-20 h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl">
            <div className="flex items-center justify-between h-full px-6">
                {/* Search Bar */}
                <div className="flex-1 max-w-lg">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search agents, transactions..."
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                            <Bell className="w-5 h-5" />
                            {notifications.some(n => n.unread) && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                >
                                    <div className="p-4 border-b border-white/10">
                                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${notification.unread ? 'bg-white/[0.02]' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-white">{notification.title}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                                                    </div>
                                                    {notification.unread && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 bg-white/5 text-center">
                                        <button className="text-xs font-medium text-gray-400 hover:text-white transition-colors">
                                            View all notifications
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Wallet Connection with Reown AppKit */}
                    <appkit-button />
                </div>
            </div>
        </header>
    );
}
