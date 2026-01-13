"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Eye, EyeOff, Timer } from 'lucide-react';
import { QuantumCard, QuantumButton } from '../quantum-effects';

interface Message {
  id: string;
  sender: string;
  content: string;
  expiresAt: number; // timestamp
}

export default function SelfDestructMessages() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Agent 47', content: ' The package has been delivered to the safe house.', expiresAt: Date.now() + 60000 },
    { id: '2', sender: 'Unknown', content: 'Meet me at the coordinates 41.2995° N, 69.2401° E.', expiresAt: Date.now() + 120000 },
  ]);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newTimeLeft: Record<string, number> = {};
      
      setMessages(prev => prev.filter(msg => {
        const left = Math.max(0, Math.ceil((msg.expiresAt - now) / 1000));
        newTimeLeft[msg.id] = left;
        return left > 0;
      }));
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleView = (id: string) => {
    setViewingId(id);
    // Destruct immediately after viewing (5s)
    setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== id));
        setViewingId(null);
    }, 5000);
  };

  return (
    <QuantumCard className="p-4 border-red-500/30">
      <div className="flex items-center gap-2 mb-4 text-red-400">
        <Bomb className="w-5 h-5 animate-pulse" />
        <h3 className="font-bold">Secure Comms</h3>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              className="bg-slate-900/80 border border-slate-700 p-3 rounded-lg flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-300">{msg.sender}</span>
                  <span className="text-[10px] text-red-400 flex items-center gap-1 bg-red-900/20 px-1.5 py-0.5 rounded">
                    <Timer className="w-3 h-3" /> {timeLeft[msg.id]}s
                  </span>
                </div>
                
                {viewingId === msg.id ? (
                  <motion.p 
                    initial={{ filter: 'blur(5px)' }}
                    animate={{ filter: 'blur(0px)' }}
                    className="text-sm text-red-200 font-mono"
                  >
                    {msg.content}
                  </motion.p>
                ) : (
                  <div className="h-5 w-full bg-slate-800 rounded animate-pulse" />
                )}
              </div>

              <button
                onClick={() => handleView(msg.id)}
                disabled={viewingId === msg.id}
                className={`ml-3 p-2 rounded-full transition-colors ${
                  viewingId === msg.id ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {viewingId === msg.id ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-4">
            No active secure messages.
          </div>
        )}
      </div>
    </QuantumCard>
  );
}
