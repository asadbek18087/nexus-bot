"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Check, X, GraduationCap } from 'lucide-react';
import { QuantumCard, QuantumButton } from '../quantum-effects';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FlashcardsSystem() {
  const [cards] = useState<Flashcard[]>([
    { id: '1', question: 'What is Quantum Entanglement?', answer: 'A phenomenon where particles become correlated and share states regardless of distance.', category: 'Physics' },
    { id: '2', question: 'Define "Closure" in JavaScript', answer: 'A function bundled together with references to its surrounding state (lexical environment).', category: 'Coding' },
    { id: '3', question: 'Capital of Uzbekistan?', answer: 'Tashkent', category: 'Geography' },
    { id: '4', question: 'Value of PI (approx)?', answer: '3.14159', category: 'Math' },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const handleNext = (result: 'correct' | 'wrong') => {
    setDirection(result === 'correct' ? 1 : -1);
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentIndex((prev) => (prev + 1) % cards.length);
      setDirection(0);
    }, 300);
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          Brain Training
        </h3>
        <span className="text-slate-400 text-sm">{currentIndex + 1} / {cards.length}</span>
      </div>

      <div className="relative h-64 w-full cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          className="w-full h-full relative preserve-3d transition-all duration-500"
          animate={{ rotateY: isFlipped ? 180 : 0, x: direction * 50, opacity: direction !== 0 ? 0 : 1 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden">
            <QuantumCard className="h-full flex flex-col items-center justify-center p-6 text-center border-blue-500/30">
              <span className="text-xs text-blue-400 mb-4 px-2 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                {cards[currentIndex].category}
              </span>
              <h4 className="text-xl font-bold text-white">{cards[currentIndex].question}</h4>
              <p className="text-slate-500 text-sm mt-4 absolute bottom-6">Tap to flip</p>
            </QuantumCard>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <QuantumCard className="h-full flex flex-col items-center justify-center p-6 text-center border-green-500/30 bg-slate-900/90">
              <h4 className="text-lg text-slate-300 mb-2">Answer:</h4>
              <p className="text-xl font-bold text-white">{cards[currentIndex].answer}</p>
            </QuantumCard>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-4 mt-6">
        <QuantumButton 
          variant="secondary" 
          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
          onClick={(e) => { e.stopPropagation(); handleNext('wrong'); }}
        >
          <X className="w-4 h-4 mr-2" /> Hard
        </QuantumButton>
        <QuantumButton 
          variant="secondary" 
          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
          onClick={(e) => { e.stopPropagation(); handleNext('correct'); }}
        >
          <Check className="w-4 h-4 mr-2" /> Easy
        </QuantumButton>
      </div>
    </div>
  );
}
