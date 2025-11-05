/**
 * Hero Section
 * 
 * Main landing page hero with 3D background and wallet-gated CTA buttons.
 * Requires wallet connection to access dashboard and protected features.
 * 
 * @module components/landing/Hero
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api';
import Text3D from '../ui/Text3D';
import Floating3DShapes from './Floating3DShapes';
import ScrollIndicator from './ScrollIndicator';

export default function Hero() {
    const { isConnected } = useAccount();
    const router = useRouter();

    const handleGetStarted = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isConnected) {
            e.preventDefault();
            toast.error('Wallet connection required. Please connect your wallet to access the dashboard.', {
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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Floating 3D Geometric Shapes */}
            <Floating3DShapes />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 pointer-events-none" style={{ zIndex: 1 }} />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-32" style={{ zIndex: 10 }}>
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}


                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1]"
                    >
                        <Text3D intensity="strong" color="white" className="text-white">
                            Intelligent Agent
                        </Text3D>
                        <br />
                        <Text3D intensity="medium" color="gray" className="text-gray-400">
                            Infrastructure
                        </Text3D>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
                        style={{
                            color: '#FFFFFF',
                            textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8), 0 4px 15px rgba(0,0,0,1)',
                            WebkitFontSmoothing: 'antialiased'
                        }}
                    >
                        Deploy autonomous AI agents with blockchain-powered security and intelligence.
                        Build, manage, and scale your agent infrastructure with enterprise-grade reliability.
                    </motion.p>

                    {/* Key Features Pills */}
                    {/* Feature Pills */}
                    {/*  */}

                    {/* CTA Buttons */}
                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        <a
                            href="/dashboard"
                            onClick={handleGetStarted}
                            className={`group px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-2xl cursor-pointer ${isConnected
                                    ? 'bg-white text-black hover:bg-gray-200 hover:shadow-white/20'
                                    : 'bg-white/10 text-white/50 border border-white/20 cursor-not-allowed'
                                }`}
                        >
                            Get Started
                            <ArrowRight className={`w-5 h-5 transition-transform ${isConnected ? 'group-hover:translate-x-1' : ''}`} />
                        </a>
                        <Link
                            href="#how-it-works"
                            className="px-8 py-4 bg-black/60 backdrop-blur-sm text-white rounded-lg font-semibold border-2 border-white/20 hover:border-white/40 hover:bg-black/80 transition-all duration-200 shadow-lg"
                        >
                            Learn More
                        </Link>
                    </motion.div>

                    {/* Wallet Connection Notice */}
                    {!isConnected && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="mb-12 flex items-center justify-center gap-2 text-gray-400 text-sm"
                        >
                            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            Connect your wallet to access the dashboard
                        </motion.div>
                    )}

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        className="mt-24 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
                    >
                        <div className="text-center p-6 rounded-xl bg-black/60 backdrop-blur-sm border border-white/20 shadow-xl">
                            <Text3D intensity="medium" color="white" className="text-4xl md:text-5xl font-bold text-white mb-2">
                                10K+
                            </Text3D>
                            <div className="text-sm text-gray-300 font-medium">Agents Deployed</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-black/60 backdrop-blur-sm border border-white/20 shadow-xl">
                            <Text3D intensity="medium" color="white" className="text-4xl md:text-5xl font-bold text-white mb-2">
                                99.9%
                            </Text3D>
                            <div className="text-sm text-gray-300 font-medium">Uptime</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-black/60 backdrop-blur-sm border border-white/20 shadow-xl">
                            <Text3D intensity="medium" color="white" className="text-4xl md:text-5xl font-bold text-white mb-2">
                                1M+
                            </Text3D>
                            <div className="text-sm text-gray-300 font-medium">Transactions</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom fade for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

            {/* Scroll Indicator */}
            <ScrollIndicator />
        </section>
    );
}
