"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KonamiCodeProps {
  onUnlock: () => void;
}

export default function KonamiCode({ onUnlock }: KonamiCodeProps) {
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    const handleKeyDown = (e: KeyboardEvent) => {
      setSequence((prev) => {
        const newSequence = [...prev, e.key];
        if (newSequence.length > konamiCode.length) {
          newSequence.shift();
        }
        
        if (newSequence.join(',') === konamiCode.join(',')) {
          onUnlock();
          return [];
        }
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUnlock]);

  return null;
}
