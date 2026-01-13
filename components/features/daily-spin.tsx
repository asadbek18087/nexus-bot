"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, X } from 'lucide-react';
import { QuantumButton, QuantumCard } from '../quantum-effects';

export default function DailySpin() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rotation, setRotation] = useState(0);

  const prizes = [
    { label: '50 XP', color: '#3b82f6', value: 50 },
    { label: '10 Gold', color: '#eab308', value: 10 },
    { label: 'No Luck', color: '#64748b', value: 0 },
    { label: '100 XP', color: '#8b5cf6', value: 100 },
    { label: '25 Gold', color: '#f59e0b', value: 25 },
    { label: 'Premium', color: '#ec4899', value: 999 },
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setPrize(null);

    // Random rotation between 5 and 10 full spins + random segment
    const randomSpins = 5 + Math.random() * 5;
    const segmentAngle = 360 / prizes.length;
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const targetRotation = rotation + (randomSpins * 360) + (prizeIndex * segmentAngle);

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setPrize(prizes[prizeIndex].label);
    }, 5000); // 5s spin duration
  };

  return (
    <>
      <QuantumButton onClick={() => setShowModal(true)} variant="primary">
        <Gift className="w-5 h-5 mr-2" /> Daily Spin
      </QuantumButton>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <QuantumCard className="max-w-md w-full relative flex flex-col items-center p-8">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-8">Daily Luck Spin</h2>

            <div className="relative w-64 h-64 mb-8">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-red-500" />

              {/* Wheel */}
              <motion.div
                className="w-full h-full rounded-full border-4 border-slate-700 relative overflow-hidden"
                animate={{ rotate: rotation }}
                transition={{ duration: 5, ease: "circOut" }}
                style={{ background: 'conic-gradient(from 0deg, #3b82f6 0deg 60deg, #eab308 60deg 120deg, #64748b 120deg 180deg, #8b5cf6 180deg 240deg, #f59e0b 240deg 300deg, #ec4899 300deg 360deg)' }}
              >
                {/* Segments would be rendered here for better visuals, but gradient works for MVP */}
                {prizes.map((p, i) => (
                  <div 
                    key={i}
                    className="absolute top-1/2 left-1/2 w-full h-[2px] bg-slate-900 origin-left"
                    style={{ transform: `rotate(${i * 60}deg)` }}
                  />
                ))}
              </motion.div>
            </div>

            {prize ? (
              <div className="text-center animate-bounce">
                <p className="text-slate-400">You won:</p>
                <p className="text-3xl font-bold text-yellow-400">{prize}</p>
              </div>
            ) : (
              <QuantumButton 
                onClick={handleSpin} 
                disabled={isSpinning}
                className="w-full justify-center"
              >
                {isSpinning ? 'Spinning...' : 'SPIN NOW'}
              </QuantumButton>
            )}
          </QuantumCard>
        </div>
      )}
    </>
  );
}
