/**
 * Dashboard Sidebar - Main navigation for dashboard
 * Clean, professional design following Vercel/Netlify pattern
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Bot,
    MessageSquare,
    BarChart3,
    Settings,
    X,
    Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoMark } from '@/components/ui/Logo';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Agents', href: '/dashboard/agents', icon: Bot },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-white/10 rounded-lg text-white hover:bg-zinc-800 transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="lg:hidden fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-white/10 z-50"
                        >
                            <SidebarContent
                                pathname={pathname}
                                onClose={() => setMobileMenuOpen(false)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop sidebar */}
            <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-white/10 z-30">
                <SidebarContent pathname={pathname} />
            </div>
        </>
    );
}

interface SidebarContentProps {
    pathname: string;
    onClose?: () => void;
}

function SidebarContent({ pathname, onClose }: SidebarContentProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
                <Link href="/" className="flex items-center gap-3">
                    <LogoMark size={32} />
                    <span className="text-white font-semibold text-lg">ContractMind</span>
                </Link>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/dashboard' && pathname?.startsWith(item.href));

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                                    ? 'bg-white text-black'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }
              `}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="px-3 py-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-white">Connected</span>
                    </div>
                    <p className="text-xs text-gray-400">Somnia Testnet</p>
                </div>
            </div>
        </div>
    );
}
