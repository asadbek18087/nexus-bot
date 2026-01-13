"use client";

import { useState } from 'react';
import { FileText, Sparkles, MessageSquare } from 'lucide-react';
import { QuantumCard, QuantumButton } from '../quantum-effects';

export default function AISummarizer() {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [isDebating, setIsDebating] = useState(false);
  const [debateLog, setDebateLog] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [debateInput, setDebateInput] = useState('');

  const handleSummarize = () => {
    if (!input) return;
    // Mock AI summary
    setTimeout(() => {
      setSummary("This text explores the fundamental principles of quantum mechanics, focusing on superposition and entanglement. It argues that future computing paradigms will shift from binary states to probabilistic qubits, enabling exponential processing power for specific algorithms.");
    }, 1000);
  };

  const handleDebateSend = () => {
    if (!debateInput) return;
    setDebateLog(prev => [...prev, { role: 'user', text: debateInput }]);
    setDebateInput('');
    
    // Mock AI response
    setTimeout(() => {
      setDebateLog(prev => [...prev, { 
        role: 'ai', 
        text: "That's an interesting perspective, but have you considered the implications of decoherence in noisy intermediate-scale quantum (NISQ) devices? The error rates might negate the theoretical advantages you mentioned." 
      }]);
    }, 1500);
  };

  return (
    <QuantumCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-white font-bold">AI Companion</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setIsDebating(false)}
          className={`flex-1 py-2 text-sm rounded-lg transition-colors ${!isDebating ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          Summarizer
        </button>
        <button 
          onClick={() => setIsDebating(true)}
          className={`flex-1 py-2 text-sm rounded-lg transition-colors ${isDebating ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          Debate Partner
        </button>
      </div>

      {!isDebating ? (
        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste article or text here..."
            className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-slate-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          />
          <QuantumButton onClick={handleSummarize} className="w-full justify-center">
            <FileText className="w-4 h-4 mr-2" /> Summarize
          </QuantumButton>
          {summary && (
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Summary</h4>
              <p className="text-sm text-slate-200 leading-relaxed">{summary}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-48 overflow-y-auto bg-slate-900/50 border border-slate-700 rounded-xl p-3 space-y-3 custom-scrollbar">
            {debateLog.length === 0 && (
              <p className="text-center text-slate-500 text-xs mt-4">Start a debate about any topic!</p>
            )}
            {debateLog.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg text-xs ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={debateInput}
              onChange={(e) => setDebateInput(e.target.value)}
              placeholder="Challenge an idea..."
              className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleDebateSend()}
            />
            <button 
              onClick={handleDebateSend}
              className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </QuantumCard>
  );
}
