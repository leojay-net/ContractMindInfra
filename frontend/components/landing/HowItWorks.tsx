/**
 * How It Works Section - Step-by-step process
 */

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Upload, Settings, MessageSquare, Rocket } from 'lucide-react';
import Text3D from '@/components/ui/Text3D';

const steps = [
    {
        number: '01',
        icon: Upload,
        title: 'Deploy Your Agent',
        description:
            'Upload your smart contract ABI. Our system automatically discovers available functions and prepares your agent.',
    },
    {
        number: '02',
        icon: Settings,
        title: 'Configure Permissions',
        description:
            'Set function-level authorization. Choose which contract functions your agent can access and execute.',
    },
    {
        number: '03',
        icon: MessageSquare,
        title: 'Chat & Interact',
        description:
            'Communicate with your agent using natural language. Request transactions, query state, or automate workflows.',
    },
    {
        number: '04',
        icon: Rocket,
        title: 'Execute & Monitor',
        description:
            'Agent prepares and executes transactions securely. Monitor all activity with real-time analytics and notifications.',
    },
];

export default function HowItWorks() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} id="how-it-works" className="relative py-24 px-6 bg-zinc-950/90 backdrop-blur-sm">
            <div className="container mx-auto max-w-6xl">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <Text3D intensity="medium" color="white" className="text-white">
                                How It Works
                            </Text3D>
                        </h2>
                        <p className="text-xl text-gray-400">
                            Get started in minutes. Deploy your first intelligent agent in
                            four simple steps.
                        </p>
                    </motion.div>
                </div>

                {/* Steps */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: -25 }}
                                    animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : { opacity: 0, y: 60, scale: 0.9, rotateX: -25 }}
                                    transition={{
                                        duration: 0.7,
                                        delay: 0.2 + index * 0.15,
                                        ease: "easeOut"
                                    }}
                                    whileHover={{
                                        y: -15,
                                        rotateX: 10,
                                        scale: 1.05,
                                        transition: { duration: 0.3 }
                                    }}
                                    className="relative"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px'
                                    }}
                                >
                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                                            transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
                                            className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-white/30 to-transparent -z-10 origin-left"
                                        />
                                    )}

                                    {/* Card with 3D effect */}
                                    <div
                                        className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 hover:bg-white/10 transition-all duration-300 h-full"
                                        style={{
                                            transformStyle: 'preserve-3d'
                                        }}
                                    >
                                        {/* 3D shadow */}
                                        <div
                                            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{
                                                transform: 'translateZ(-40px)',
                                                filter: 'blur(30px)'
                                            }}
                                        />

                                        {/* Step Number with 3D depth */}
                                        <div
                                            className="text-6xl font-bold text-white/10 mb-4 group-hover:text-white/20 transition-colors"
                                            style={{ transform: 'translateZ(5px)' }}
                                        >
                                            {step.number}
                                        </div>

                                        {/* Icon with 3D elevation */}
                                        <div
                                            className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300"
                                            style={{
                                                transform: 'translateZ(40px)',
                                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                                            }}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>

                                        {/* Content with depth */}
                                        <div style={{ transform: 'translateZ(20px)' }}>
                                            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-100">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Corner glow */}
                                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
