"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TerminalMode({ isOpen, onClose }: TerminalModeProps) {
  const [history, setHistory] = useState<string[]>(['Welcome to Nexus CLI v1.0.0', 'Type "help" for commands.']);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();

    let output = '';

    switch (command) {
      case 'help':
        output = 'Available commands: help, clear, status, stats, exit, matrix, date';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'status':
        output = 'System Status: OPTIMAL\nNexus Core: ONLINE\nShields: 100%';
        break;
      case 'stats':
        output = 'User Level: 24\nXP: 8,420\nRank: Gold'; // Mock data
        break;
      case 'exit':
        onClose();
        return;
      case 'matrix':
        output = 'Wake up, Neo...';
        break;
      case 'date':
        output = new Date().toLocaleString();
        break;
      default:
        output = `Command not found: ${command}`;
    }

    setHistory(prev => [...prev, `> ${cmd}`, output]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (input.trim()) {
        handleCommand(input);
        setInput('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-[200] font-mono p-4 text-green-500 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">{line}</div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center mt-2 border-t border-green-900 pt-2">
        <span className="mr-2">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-green-500 placeholder-green-900"
          placeholder="Enter command..."
          autoFocus
        />
      </div>
    </div>
  );
}
