/**
 * Documentation Layout
 * Modern documentation with sidebar navigation and table of contents
 */

'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Book,
  Home,
  Menu,
  X,
  Rocket,
  Code,
  Blocks,
  Server,
  Globe,
  Settings,
  FileText,
  Layers,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocSection {
  title: string;
  icon: any;
  items: {
    title: string;
    href: string;
  }[];
}

const docSections: DocSection[] = [
  {
    title: 'Getting Started',
    icon: Rocket,
    items: [
      { title: 'Introduction', href: '#introduction' },
      { title: 'Quick Start', href: '#quick-start' },
      { title: 'Installation', href: '#installation' },
    ],
  },
  {
    title: 'Core Concepts',
    icon: Book,
    items: [
      { title: 'Architecture', href: '#architecture' },
      { title: 'AI Agents', href: '#ai-agents' },
      { title: 'Smart Contracts', href: '#smart-contracts' },
      { title: 'Chat Interface', href: '#chat-interface' },
    ],
  },
  {
    title: 'Development',
    icon: Code,
    items: [
      { title: 'Frontend Guide', href: '#frontend' },
      { title: 'Backend Guide', href: '#backend' },
      { title: 'Smart Contracts', href: '#contracts' },
      { title: 'API Reference', href: '#api' },
    ],
  },
  {
    title: 'Deployment',
    icon: Server,
    items: [
      { title: 'Deployment Guide', href: '#deployment' },
      { title: 'Environment Setup', href: '#environment' },
      { title: 'Best Practices', href: '#best-practices' },
    ],
  },
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/docs') {
      return pathname === '/docs';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Zap className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-lg">ContractMind</span>
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">Documentation</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className="fixed top-16 left-0 bottom-0 w-72 bg-black/40 backdrop-blur-sm border-r border-white/10 overflow-y-auto z-40 lg:translate-x-0 transition-transform"
      >
        <div className="p-6 space-y-8">
          {docSections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                <section.icon className="w-4 h-4" />
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        if (item.href.startsWith('#')) {
                          e.preventDefault();
                          const element = document.querySelector(item.href);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                        setSidebarOpen(false);
                      }}
                      className="block px-3 py-2 rounded-lg text-sm transition-all text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="lg:pl-72 pt-16">
        <div className="min-h-screen">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400">
                © 2025 ContractMind. Built with Next.js, FastAPI, and Solidity.
              </p>
              <div className="flex items-center gap-6">
                <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Documentation
                </Link>
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
