"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PanicButton() {
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  // Triple tap logic
  const handleTap = () => {
    setTapCount(prev => prev + 1);
    setTimeout(() => setTapCount(0), 1000); // Reset after 1s
  };

  useEffect(() => {
    if (tapCount >= 3) {
      setIsPanicMode(true);
      setTapCount(0);
    }
  }, [tapCount]);

  if (!isPanicMode) {
    return (
      <div 
        className="fixed top-0 right-0 w-16 h-16 z-[100] opacity-0"
        onClick={handleTap}
      />
    );
  }

  // Fake Calculator UI
  return (
    <div className="fixed inset-0 z-[9999] bg-black text-white font-mono flex flex-col p-4">
      <div className="flex-1 flex items-end justify-end text-6xl mb-8 p-4 border-b border-gray-800">
        0
      </div>
      <div className="grid grid-cols-4 gap-4 flex-1">
        {['AC', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '=', ''].map((btn, i) => (
          <button 
            key={i}
            className={`rounded-full text-2xl font-bold flex items-center justify-center
              ${['÷', '×', '-', '+', '='].includes(btn) ? 'bg-orange-500' : 
                ['AC', '±', '%'].includes(btn) ? 'bg-gray-400 text-black' : 'bg-gray-800'}
              ${btn === '0' ? 'col-span-2 items-start pl-8' : ''}
            `}
            onClick={() => {
              if (btn === 'AC') setIsPanicMode(false); // Secret exit
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
