"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Game2048 from '@/components/game-2048';
import { QuantumButton } from '@/components/quantum-effects';

export default function Game2048Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 left-4 z-50">
        <QuantumButton onClick={() => router.back()} size="sm" variant="secondary">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Nexus
        </QuantumButton>
      </div>

      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Quantum 2048
          </h1>
          <p className="text-slate-400">Merge blocks to reach singularity</p>
        </div>
        
        <Game2048 
          onScoreChange={() => {}} 
          onGameOver={() => {}} 
        />
      </div>
    </div>
  );
}
