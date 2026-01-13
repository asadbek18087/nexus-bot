"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Bot, MessageSquare, Mic, Sparkles } from 'lucide-react';
import { QuantumButton, QuantumCard } from '@/components/quantum-effects';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAI } from '@/actions/ai'; // We'll create this

export default function MentorPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Greetings, Operative. I am your Neural Link Mentor. How can I assist you with your mission today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithAI(userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Connection interrupted. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-20 md:pb-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 pt-4 shrink-0">
        <QuantumButton onClick={() => router.back()} size="sm" variant="secondary">
          <ChevronLeft className="w-5 h-5" />
        </QuantumButton>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center border border-purple-500/50">
            <Bot className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Mentor</h1>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <QuantumCard className="flex-1 mb-4 overflow-hidden flex flex-col bg-slate-900/50 border-slate-800">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none flex gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75" />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800">
          <div className="flex gap-2">
            <button className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for guidance..."
              className="flex-1 bg-slate-800 border-none rounded-xl px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </QuantumCard>
    </div>
  );
}
