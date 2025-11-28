/**
 * Features Section - Key platform capabilities
 */

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    Bot,
    Lock,
    Zap,
    MessageSquare,
    BarChart3,
    Code,
    Shield,
    Layers,
    Workflow,
    Radio,
    Activity,
} from 'lucide-react';
import Text3D from '@/components/ui/Text3D';

// Featured/highlighted feature (Somnia Data Streams)
const highlightedFeature = {
    icon: Radio,
    title: 'Somnia Data Streams',
    description:
        'Real-time on-chain data publishing and subscriptions. Stream agent activity, chat history, analytics, and leaderboards directly to the Somnia blockchain for verifiable, decentralized data.',
    badges: ['Real-Time', 'On-Chain', 'Verifiable'],
};

const features = [
    {
        icon: Bot,
        title: 'AI-Powered Agents',
        description:
            'Deploy autonomous agents powered by Claude, GPT-4, and Gemini. Intelligent contract interaction with natural language understanding.',
    },
    {
        icon: Lock,
        title: 'Secure Authorization',
        description:
            'Granular function-level permissions. Agents can only execute explicitly authorized smart contract functions.',
    },
    {
        icon: Activity,
        title: 'Live Activity Feeds',
        description:
            'Subscribe to real-time WebSocket streams of agent executions, transactions, and platform activity. Powered by Somnia Data Streams.',
    },
    {
        icon: MessageSquare,
        title: 'Conversational Interface',
        description:
            'Chat with your agents using natural language. All conversations stored on-chain for verifiable history.',
    },
    {
        icon: BarChart3,
        title: 'On-Chain Analytics',
        description:
            'Track agent performance with tamper-proof analytics. Leaderboards and metrics published directly to Somnia streams.',
    },
    {
        icon: Code,
        title: 'Developer-Friendly',
        description:
            'Simple ABI integration. Deploy agents in minutes with automatic function discovery and validation.',
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description:
            'Multi-layer validation, transaction simulation, and fail-safe mechanisms. Built for production deployments.',
    },
    {
        icon: Layers,
        title: 'Somnia Native',
        description:
            'Built exclusively for Somnia Network. Leveraging high-throughput, low-latency blockchain for optimal agent performance.',
    },
    {
        icon: Workflow,
        title: 'Automation Workflows',
        description:
            'Create complex multi-step workflows. Agents can orchestrate multiple contract interactions intelligently.',
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const HighlightIcon = highlightedFeature.icon;

    return (
        <section ref={ref} id="features" className="relative py-24 px-6 bg-black/80 backdrop-blur-sm">
            <div className="container mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <Text3D intensity="medium" color="white" className="text-white">
                                Enterprise-Grade Infrastructure
                            </Text3D>
                        </h2>
                        <p className="text-xl text-gray-400">
                            Everything you need to deploy, manage, and scale intelligent
                            blockchain agents in production.
                        </p>
                    </motion.div>
                </div>

                {/* Highlighted Feature - Somnia Data Streams */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="relative p-8 md:p-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden group hover:border-white/40 hover:bg-white/10 transition-all duration-500">
                        {/* Subtle glow effect */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />

                        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                            {/* Icon */}
                            <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                                <HighlightIcon className="w-10 h-10 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                                        {highlightedFeature.title}
                                    </h3>
                                    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-gray-300 text-sm font-medium">
                                        Powered by Somnia
                                    </span>
                                </div>
                                <p className="text-lg text-gray-400 mb-4 max-w-3xl">
                                    {highlightedFeature.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {highlightedFeature.badges.map((badge, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-sm"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -20 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.2 + index * 0.1,
                                    ease: "easeOut"
                                }}
                                whileHover={{
                                    y: -12,
                                    rotateX: 8,
                                    rotateY: 5,
                                    scale: 1.03,
                                    transition: { duration: 0.3 }
                                }}
                                className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 hover:bg-white/10"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px'
                                }}
                            >
                                {/* 3D depth shadow */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        transform: 'translateZ(-30px)',
                                        filter: 'blur(25px)'
                                    }}
                                />

                                {/* Icon with 3D elevation */}
                                <div
                                    className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110"
                                    style={{
                                        transform: 'translateZ(30px)',
                                        boxShadow: '0 15px 40px rgba(0,0,0,0.4)'
                                    }}
                                >
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Content with depth */}
                                <div style={{ transform: 'translateZ(15px)' }}>
                                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-100">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Top-right accent glow */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
