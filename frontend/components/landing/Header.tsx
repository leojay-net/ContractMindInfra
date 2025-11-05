/**
 * Landing Page Header
 * 
 * Navigation header with wallet connection requirement for dashboard access.
 * Displays wallet connect button and validates connection before allowing
 * navigation to protected routes.
 * 
 * @module components/landing/Header
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAccount } from 'wagmi';
import { NAV_ITEMS } from '@/lib/config';
import { toast } from 'react-hot-toast';
import { LogoMark } from '@/components/ui/Logo';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isConnected } = useAccount();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLaunchApp = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isConnected) {
            e.preventDefault();
            toast.error('Please connect your wallet to access the dashboard', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#1f2937',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
            });
            return;
        }
        router.push('/dashboard');
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-black/80 backdrop-blur-lg border-b border-white/10'
                : 'bg-transparent'
                }`}
        >
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <LogoMark size={40} className="group-hover:scale-105 transition-transform" />
                        <span className="text-xl font-bold text-white">ContractMind</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Wallet Connect Button with Custom Styling */}
                        <div className="wallet-button-container">
                            <appkit-button />
                        </div>

                        <a
                            href="/dashboard"
                            onClick={handleLaunchApp}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${isConnected
                                ? 'bg-white hover:bg-gray-100 text-black'
                                : 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                                }`}
                        >
                            Launch App
                        </a>
                    </div>

                    <style jsx>{`
                        .wallet-button-container :global(appkit-button) {
                            --w3m-color-mix: #000000;
                            --w3m-accent: #ffffff;
                            --w3m-border-radius-master: 8px;
                        }
                    `}</style>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-4">
                                {NAV_ITEMS.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block text-gray-300 hover:text-white transition-colors py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                {/* Mobile Wallet Connect */}
                                <div className="py-2">
                                    <appkit-button />
                                </div>

                                <a
                                    href="/dashboard"
                                    onClick={(e) => {
                                        handleLaunchApp(e);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`block w-full px-6 py-2 rounded-lg font-semibold transition-all duration-200 text-center cursor-pointer flex items-center justify-center gap-2 ${isConnected
                                        ? 'bg-white hover:bg-gray-100 text-black'
                                        : 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                                        }`}
                                >
                                    Launch App
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
