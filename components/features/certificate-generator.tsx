"use client";

import { useState } from 'react';
import { Award, Download, CheckCircle } from 'lucide-react';
import { QuantumCard, QuantumButton } from '../quantum-effects';

export default function CertificateGenerator() {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('Quantum Mechanics 101');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!name) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <QuantumCard className="p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-4 text-yellow-400">
        <Award className="w-8 h-8" />
        <h3 className="text-xl font-bold text-white">Certificate Center</h3>
      </div>

      {!generated ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white text-center focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <select 
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white text-center outline-none"
          >
            <option>Quantum Mechanics 101</option>
            <option>Advanced React Patterns</option>
            <option>Neural Networks Basics</option>
            <option>Cybersecurity Essentials</option>
          </select>
          <QuantumButton 
            onClick={handleGenerate} 
            disabled={!name || generating}
            className="w-full justify-center"
            variant="primary"
          >
            {generating ? 'Minting NFT Certificate...' : 'Generate Certificate'}
          </QuantumButton>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="relative p-8 border-4 border-double border-yellow-500/50 bg-slate-900/80 rounded-lg">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500 -mt-1 -ml-1" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500 -mt-1 -mr-1" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500 -mb-1 -ml-1" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500 -mb-1 -mr-1" />
            
            <h4 className="text-2xl font-serif text-yellow-400 mb-2">Certificate of Completion</h4>
            <p className="text-slate-400 text-sm mb-4">This certifies that</p>
            <p className="text-3xl font-bold text-white font-serif italic mb-4">{name}</p>
            <p className="text-slate-400 text-sm mb-2">has successfully completed</p>
            <p className="text-xl text-blue-400 font-bold mb-6">{course}</p>
            <div className="flex justify-between items-end text-xs text-slate-500 font-mono mt-8 border-t border-slate-800 pt-4">
              <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <QuantumButton onClick={() => setGenerated(false)} variant="secondary" className="flex-1">
              New
            </QuantumButton>
            <QuantumButton className="flex-1">
              <Download className="w-4 h-4 mr-2" /> PDF
            </QuantumButton>
          </div>
        </div>
      )}
    </QuantumCard>
  );
}
