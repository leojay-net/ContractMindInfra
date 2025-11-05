/**
 * Wallet Connection Banner
 * 
 * Prominent banner that appears on landing page to inform users
 * about wallet connection requirement for accessing the dashboard.
 * Shows clear visual feedback about connection status.
 * 
 * @module components/landing/WalletConnectionBanner
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Lock, Check, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';

export default function WalletConnectionBanner() {
    const { isConnected, address } = useAccount();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={isConnected ? 'connected' : 'disconnected'}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="fixed top-20 right-6 z-40 max-w-sm"
            >
                <div
                    className={`px-6 py-4 rounded-xl backdrop-blur-md border-2 shadow-2xl transition-all duration-300 ${isConnected
                            ? 'bg-green-500/20 border-green-500/50 shadow-green-500/20'
                            : 'bg-yellow-500/10 border-yellow-500/30 shadow-yellow-500/10 animate-pulse-slow'
                        }`}
                >
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-500/20' : 'bg-yellow-500/20'
                            }`}>
                            {isConnected ? (
                                <Check className="w-5 h-5 text-green-400" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-yellow-400" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3
                                className={`text-sm font-bold mb-1 flex items-center gap-2 ${isConnected ? 'text-green-400' : 'text-yellow-400'
                                    }`}
                            >
                                {isConnected ? (
                                    <>
                                        <Wallet className="w-4 h-4" />
                                        Wallet Connected
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Connection Required
                                    </>
                                )}
                            </h3>
                            <p className="text-xs text-white/80 leading-relaxed mb-2">
                                {isConnected ? (
                                    <>
                                        <span className="font-mono text-white/60">
                                            {address?.slice(0, 6)}...{address?.slice(-4)}
                                        </span>
                                        <br />
                                        <span className="text-green-400/90 font-semibold">
                                            Dashboard access granted
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-semibold text-white">
                                            Click "Connect Wallet" button above
                                        </span>
                                        <br />
                                        <span className="text-white/60">
                                            Required to access dashboard features
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
