"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SmartGreeterProps {
  username: string;
}

export default function SmartGreeter({ username }: SmartGreeterProps) {
  const [greeting, setGreeting] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    let text = '';
    
    if (hour < 6) text = 'Rest implies strength,';
    else if (hour < 12) text = 'Good morning,';
    else if (hour < 18) text = 'Good afternoon,';
    else if (hour < 22) text = 'Good evening,';
    else text = 'Late night inspiration,';

    setGreeting(`${text} ${username}.`);
  }, [username]);

  useEffect(() => {
    if (currentIndex < greeting.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + greeting[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100); // Typing speed

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, greeting]);

  return (
    <div className="font-mono text-sm text-slate-400 h-5">
      <span className="text-purple-400">{'>'}</span> {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-2 h-4 bg-purple-400 ml-1 align-middle"
      />
    </div>
  );
}
