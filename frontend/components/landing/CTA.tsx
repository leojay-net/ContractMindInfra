/**
 * CTA Section
 * 
 * Call to action section for getting started with wallet connection requirement.
 * Validates wallet connection before allowing dashboard access.
 * 
 * @module components/landing/CTA
 */

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Github, FileText } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import Text3D from '@/components/ui/Text3D';

export default function CTA() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { isConnected } = useAccount();
    const router = useRouter();

    const handleLaunchDashboard = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
        <section ref={ref} className="relative py-32 bg-black/80 backdrop-blur-sm overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/0 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="text-center"
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Text3D intensity="strong" color="white" className="text-white">
                                Ready to Deploy Your
                            </Text3D>
                            <br />
                            <Text3D intensity="medium" color="gray" className="text-gray-400">
                                First Agent?
                            </Text3D>
                        </motion.h2>

                        <motion.p
                            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Join developers building the future of intelligent blockchain
                            automation. Get started in minutes.
                        </motion.p>

                        {/* Primary CTA */}
                        <motion.div
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <a
                                href="/dashboard"
                                onClick={handleLaunchDashboard}
                                className={`group px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg text-lg cursor-pointer ${isConnected
                                        ? 'bg-white hover:bg-gray-100 text-black hover:shadow-xl'
                                        : 'bg-white/10 text-white/50 border border-white/20 cursor-not-allowed'
                                    }`}
                            >
                                Launch Dashboard
                                <ArrowRight className={`w-5 h-5 transition-transform ${isConnected ? 'group-hover:translate-x-1' : ''}`} />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 text-lg"
                            >
                                <Github className="w-5 h-5" />
                                View on GitHub
                            </a>
                        </motion.div>

                        {/* Connection Notice */}
                        {!isConnected && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="text-sm text-gray-400 flex items-center justify-center gap-2 mb-8"
                            >
                                <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                Connect your wallet to access the dashboard
                            </motion.p>
                        )}

                        {/* Secondary Links */}
                        <motion.div
                            className="flex flex-wrap items-center justify-center gap-8 text-sm"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <Link
                                href="#features"
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                Documentation
                            </Link>
                            <Link
                                href="#features"
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                API Reference
                            </Link>
                            <Link
                                href="#features"
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                Example Projects
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ duration: 0.7, delay: 1, ease: "easeOut" }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                        className="mt-20 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300"
                        style={{
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { value: "99.9%", label: "SLA Guarantee" },
                                { value: "<100ms", label: "Response Time" },
                                { value: "24/7", label: "Support" },
                                { value: "SOC 2", label: "Compliant" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                                    style={{ transform: 'translateZ(20px)' }}
                                >
                                    <div className="text-3xl font-bold text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
