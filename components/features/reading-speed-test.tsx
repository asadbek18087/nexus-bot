"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, BookOpen, RotateCcw } from 'lucide-react';
import { QuantumCard, QuantumButton } from '../quantum-effects';

export default function ReadingSpeedTest() {
  const [step, setStep] = useState<'intro' | 'reading' | 'result'>('intro');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);

  const text = `Quantum computing is a type of computation whose operations can harness the phenomena of quantum mechanics, such as superposition, interference, and entanglement. Devices that perform quantum computations are known as quantum computers. Though current quantum computers are too small to outperform usual (classical) computers for practical applications, they are believed to be capable of solving certain computational problems, such as integer factorization (which underlies RSA encryption), substantially faster than classical computers. The study of quantum computing is a subfield of quantum information science.`;

  const wordCount = text.split(' ').length;

  const startTest = () => {
    setStep('reading');
    setStartTime(Date.now());
  };

  const finishTest = () => {
    if (!startTime) return;
    const end = Date.now();
    setEndTime(end);
    const durationInMinutes = (end - startTime) / 60000;
    const calculatedWpm = Math.round(wordCount / durationInMinutes);
    setWpm(calculatedWpm);
    setStep('result');
  };

  const resetTest = () => {
    setStep('intro');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
  };

  return (
    <QuantumCard className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Reading Speed Test</h3>
      </div>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <p className="text-slate-300 mb-6">
              Measure your reading speed (WPM) to optimize your learning experience.
              Read the text at your normal pace and click &quot;Done&quot; when finished.
            </p>
            <QuantumButton onClick={startTest} size="lg">
              Start Test
            </QuantumButton>
          </motion.div>
        )}

        {step === 'reading' && (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 mb-6 text-lg leading-relaxed text-slate-200 font-serif">
              {text}
            </div>
            <QuantumButton onClick={finishTest} className="w-full justify-center">
              I&apos;m Done Reading
            </QuantumButton>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center mx-auto mb-6 bg-slate-900">
              <div>
                <span className="text-4xl font-bold text-white block">{wpm}</span>
                <span className="text-xs text-blue-400 uppercase tracking-wider">WPM</span>
              </div>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">
              {wpm > 300 ? "Speed Reader! 🚀" : wpm > 200 ? "Average Reader 📚" : "Careful Reader 🐢"}
            </h4>
            <p className="text-slate-400 mb-6">
              We&apos;ve adjusted your content density settings based on this result.
            </p>
            <QuantumButton onClick={resetTest} variant="secondary">
              <RotateCcw className="w-4 h-4 mr-2" /> Retake Test
            </QuantumButton>
          </motion.div>
        )}
      </AnimatePresence>
    </QuantumCard>
  );
}
