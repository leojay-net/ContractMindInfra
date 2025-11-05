/**
 * Settings Page
 * User account and application settings
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Wallet,
    Bell,
    Shield,
    Key,
    Globe,
    Moon,
    Sun,
    Save,
    Trash2,
    Copy,
    Check,
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/useToast';

export default function SettingsPage() {
    const { address } = useAccount();
    const toast = useToast();
    const [copied, setCopied] = useState(false);
    const [notifications, setNotifications] = useState({
        transactions: true,
        agentUpdates: true,
        systemAlerts: false,
    });

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            toast.success('Address copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSave = () => {
        toast.success('Settings saved successfully');
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">
                    Manage your account preferences and application settings
                </p>
            </div>

            {/* Account Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white rounded-lg">
                            <User className="w-5 h-5 text-black" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Account</h2>
                    </div>
                    <p className="text-sm text-gray-400">
                        Your wallet information and account details
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Wallet Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Wallet Address
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-lg">
                                <p className="text-white font-mono text-sm break-all">
                                    {address || 'Not connected'}
                                </p>
                            </div>
                            <button
                                onClick={copyAddress}
                                className="p-3 bg-black hover:bg-zinc-800 border border-white/10 rounded-lg transition-colors"
                            >
                                {copied ? (
                                    <Check className="w-5 h-5 text-green-400" />
                                ) : (
                                    <Copy className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Network */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Network
                        </label>
                        <div className="px-4 py-3 bg-black border border-white/10 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-white font-medium">Somnia Testnet</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Notifications Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white rounded-lg">
                            <Bell className="w-5 h-5 text-black" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Notifications</h2>
                    </div>
                    <p className="text-sm text-gray-400">
                        Configure how you receive notifications
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Transaction Notifications */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">Transaction Updates</p>
                            <p className="text-sm text-gray-400">
                                Get notified when transactions complete
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                setNotifications((prev) => ({
                                    ...prev,
                                    transactions: !prev.transactions,
                                }))
                            }
                            className={`relative w-12 h-6 rounded-full transition-colors ${notifications.transactions ? 'bg-white' : 'bg-zinc-700'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform ${notifications.transactions ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Agent Updates */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">Agent Updates</p>
                            <p className="text-sm text-gray-400">
                                Get notified about agent activity
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                setNotifications((prev) => ({
                                    ...prev,
                                    agentUpdates: !prev.agentUpdates,
                                }))
                            }
                            className={`relative w-12 h-6 rounded-full transition-colors ${notifications.agentUpdates ? 'bg-white' : 'bg-zinc-700'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform ${notifications.agentUpdates ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* System Alerts */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">System Alerts</p>
                            <p className="text-sm text-gray-400">
                                Important system announcements
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                setNotifications((prev) => ({
                                    ...prev,
                                    systemAlerts: !prev.systemAlerts,
                                }))
                            }
                            className={`relative w-12 h-6 rounded-full transition-colors ${notifications.systemAlerts ? 'bg-white' : 'bg-zinc-700'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform ${notifications.systemAlerts ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Security Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white rounded-lg">
                            <Shield className="w-5 h-5 text-black" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Security</h2>
                    </div>
                    <p className="text-sm text-gray-400">
                        Manage your security preferences
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {/* API Keys */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            API Keys
                        </label>
                        <div className="px-4 py-3 bg-black border border-white/10 rounded-lg">
                            <p className="text-white text-sm">
                                API keys are managed by your wallet connection
                            </p>
                        </div>
                    </div>

                    {/* Session Management */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Session
                        </label>
                        <button className="w-full px-4 py-3 bg-black hover:bg-zinc-800 border border-white/10 rounded-lg transition-colors text-left">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Active Session</p>
                                    <p className="text-sm text-gray-400">Connected via wallet</p>
                                </div>
                                <Key className="w-5 h-5 text-gray-400" />
                            </div>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Preferences Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white rounded-lg">
                            <Globe className="w-5 h-5 text-black" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Preferences</h2>
                    </div>
                    <p className="text-sm text-gray-400">
                        Customize your application experience
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Language */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Language
                        </label>
                        <select className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                        </select>
                    </div>

                    {/* Theme (currently locked to dark) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Theme
                        </label>
                        <div className="px-4 py-3 bg-black border border-white/10 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Moon className="w-5 h-5 text-white" />
                                <span className="text-white font-medium">Dark Mode</span>
                                <span className="ml-auto text-xs text-gray-400">(Default)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-lg transition-colors"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-medium rounded-lg transition-colors">
                    Cancel
                </button>
            </div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-900 border border-red-500/20 rounded-xl overflow-hidden"
            >
                <div className="p-6 border-b border-red-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <Trash2 className="w-5 h-5 text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
                    </div>
                    <p className="text-sm text-gray-400">
                        Irreversible and destructive actions
                    </p>
                </div>

                <div className="p-6">
                    <button className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium rounded-lg transition-colors">
                        Clear All Data
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
