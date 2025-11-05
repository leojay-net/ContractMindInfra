/**
 * Code Block Component
 * Syntax-highlighted code blocks for documentation
 */

'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'bash', filename, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      {filename && (
        <div className="bg-white/5 border border-white/10 border-b-0 rounded-t-lg px-4 py-2 text-sm text-gray-400 font-mono">
          {filename}
        </div>
      )}
      <div className={`relative bg-white/5 border border-white/10 ${filename ? 'rounded-b-lg' : 'rounded-lg'} overflow-hidden`}>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
        <pre className="p-4 overflow-x-auto">
          <code className={`text-sm font-mono text-gray-200 language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}

interface InlineCodeProps {
  children: string;
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded text-sm font-mono text-blue-400">
      {children}
    </code>
  );
}
