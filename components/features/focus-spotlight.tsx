"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FocusSpotlight() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFocusing, setIsFocusing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsFocusing(true);
    const handleMouseUp = () => setIsFocusing(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isFocusing) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity duration-300"
        style={{
          maskImage: `radial-gradient(circle 150px at ${position.x}px ${position.y}px, transparent 0%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle 150px at ${position.x}px ${position.y}px, transparent 0%, black 100%)`
        }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] border border-white/20 rounded-full"
        style={{ 
          left: position.x - 150, 
          top: position.y - 150,
        }}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />
    </div>
  );
}
