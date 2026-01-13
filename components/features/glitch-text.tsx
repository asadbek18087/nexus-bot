"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) { // 10% chance to glitch every 3s
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isGlitching) {
    return <span className={className}>{text}</span>;
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -ml-0.5 text-red-500 opacity-70 animate-pulse z-0">{text}</span>
      <span className="absolute top-0 left-0 ml-0.5 text-cyan-500 opacity-70 animate-pulse z-0">{text}</span>
    </div>
  );
}
