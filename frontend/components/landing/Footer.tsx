/**
 * Landing Page Footer
 */

'use client';

import Link from 'next/link';
import { Github, Twitter, MessageCircle } from 'lucide-react';
import { LogoMark } from '@/components/ui/Logo';

const footerSections = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Roadmap', href: '#roadmap' },
        ],
    },
    {
        title: 'Developers',
        links: [
            { label: 'Documentation', href: '/docs' },
            { label: 'API Reference', href: '/api' },
            { label: 'Examples', href: '/examples' },
            { label: 'GitHub', href: 'https://github.com' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Blog', href: '/blog' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact', href: '/contact' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Security', href: '/security' },
            { label: 'Compliance', href: '/compliance' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="relative bg-black/90 backdrop-blur-sm border-t border-white/10 py-12 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <LogoMark size={40} />
                            <span className="text-xl font-bold text-white">
                                ContractMind
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            Enterprise-grade infrastructure for deploying intelligent AI
                            agents on the blockchain.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://discord.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                aria-label="Discord"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors text-sm"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} ContractMind. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <span className="text-gray-400">Powered by Somnia Network</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-gray-400">All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
