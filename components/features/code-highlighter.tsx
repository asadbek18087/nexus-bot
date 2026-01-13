"use client";

import { useState } from 'react';
import { Check, Copy, Code } from 'lucide-react';
import { QuantumCard } from '../quantum-effects';

interface CodeHighlighterProps {
  code: string;
  language: string;
  title?: string;
}

export default function CodeHighlighter({ code, language, title }: CodeHighlighterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting (mock implementation for demo)
  // In a real app, use prismjs or highlight.js
  const highlightCode = (code: string) => {
    return code.split('\n').map((line, i) => (
      <div key={i} className="table-row">
        <span className="table-cell text-slate-600 text-right pr-4 select-none w-8">{i + 1}</span>
        <span className="table-cell">
          {line.split(' ').map((word, j) => {
            if (['const', 'let', 'var', 'function', 'return', 'import', 'from', 'export', 'default'].includes(word)) 
              return <span key={j} className="text-purple-400 mr-1">{word}</span>;
            if (['String', 'Number', 'Boolean', 'console', 'log'].includes(word)) 
              return <span key={j} className="text-yellow-400 mr-1">{word}</span>;
            if (word.startsWith('"') || word.startsWith("'")) 
              return <span key={j} className="text-green-400 mr-1">{word}</span>;
            return <span key={j} className="text-slate-300 mr-1">{word}</span>;
          })}
        </span>
      </div>
    ));
  };

  return (
    <QuantumCard className="p-0 overflow-hidden border-slate-700">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono text-slate-400">{title || `${language} Snippet`}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 bg-[#0d1117] font-mono text-sm overflow-x-auto">
        {highlightCode(code)}
      </div>
    </QuantumCard>
  );
}
