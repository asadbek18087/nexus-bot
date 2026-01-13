"use client";

import { useState, useEffect } from 'react';
import { Mic, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantumButton } from '../quantum-effects';

export default function VoiceSearch() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsSupported(true);
    }
  }, []);

  const toggleListening = () => {
    if (!isSupported) {
      alert("Voice search not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm overflow-hidden">
        <Search className="w-5 h-5 text-slate-400 ml-4" />
        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Search movies, books, courses..."
          className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-slate-500"
        />
        <button
          onClick={toggleListening}
          className={`p-3 transition-colors ${
            isListening ? 'bg-red-500/20 text-red-400' : 'hover:bg-slate-700 text-slate-400'
          }`}
        >
          <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-900/90 rounded-xl border border-slate-700 backdrop-blur-md z-50 text-center"
          >
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [10, 24, 10] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
                />
              ))}
            </div>
            <p className="text-sm text-slate-300">Listening...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
