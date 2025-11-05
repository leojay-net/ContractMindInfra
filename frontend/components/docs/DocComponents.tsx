/**
 * Documentation Components
 * Reusable components for consistent documentation styling
 */

'use client';

import { ReactNode } from 'react';
import { AlertCircle, Info, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface DocSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
  level?: 1 | 2 | 3;
}

export function DocSection({ id, title, children, level = 1 }: DocSectionProps) {
  const sizes = {
    1: 'text-3xl md:text-4xl',
    2: 'text-2xl md:text-3xl',
    3: 'text-xl md:text-2xl',
  };

  return (
    <section id={id} className="mb-12 scroll-mt-20">
      {level === 1 && (
        <h2 className={`${sizes[level]} font-bold text-white mb-4`}>{title}</h2>
      )}
      {level === 2 && (
        <h3 className={`${sizes[level]} font-bold text-white mb-4`}>{title}</h3>
      )}
      {level === 3 && (
        <h4 className={`${sizes[level]} font-bold text-white mb-4`}>{title}</h4>
      )}
      <div className="prose prose-invert max-w-none">
        {children}
      </div>
    </section>
  );
}

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = {
    info: {
      border: 'border-blue-500/20',
      bg: 'bg-blue-500/10',
      icon: Info,
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-300',
    },
    warning: {
      border: 'border-yellow-500/20',
      bg: 'bg-yellow-500/10',
      icon: AlertTriangle,
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-300',
    },
    success: {
      border: 'border-green-500/20',
      bg: 'bg-green-500/10',
      icon: CheckCircle,
      iconColor: 'text-green-400',
      titleColor: 'text-green-300',
    },
    error: {
      border: 'border-red-500/20',
      bg: 'bg-red-500/10',
      icon: AlertCircle,
      iconColor: 'text-red-400',
      titleColor: 'text-red-300',
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 my-6`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold ${style.titleColor} mb-2`}>{title}</h4>
          )}
          <div className="text-sm text-gray-300">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface StepListProps {
  children: ReactNode;
}

export function StepList({ children }: StepListProps) {
  return (
    <ol className="space-y-6 my-8">
      {children}
    </ol>
  );
}

interface StepProps {
  number: number;
  title: string;
  children: ReactNode;
}

export function Step({ number, title, children }: StepProps) {
  return (
    <li className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <div className="flex-1 pt-0.5">
        <h4 className="font-semibold text-white mb-2">{title}</h4>
        <div className="text-gray-300 text-sm space-y-2">{children}</div>
      </div>
    </li>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

interface TableOfContentsProps {
  sections: { id: string; title: string; level?: number }[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  return (
    <nav className="sticky top-24 bg-white/5 border border-white/10 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
        On This Page
      </h4>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id} className={section.level === 2 ? 'pl-4' : ''}>
            <a
              href={`#${section.id}`}
              className="text-sm text-gray-400 hover:text-white transition-colors block py-1"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
}

export function ExternalLinkComponent({ href, children }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
    >
      {children}
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}
