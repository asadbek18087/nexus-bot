"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Zap, Trophy, Coins } from 'lucide-react';

interface Prize {
  id: number;
  icon: React.ReactNode;
  name: string;
  value: number;
  color: string;
}

const DailyBonusWheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null);

  const prizes: Prize[] = [
    { id: 1, icon: <Coins className="w-6 h-6" />, name: "100 Coins", value: 100, color: "from-yellow-400 to-yellow-600" },
    { id: 2, icon: <Star className="w-6 h-6" />, name: "50 XP", value: 50, color: "from-blue-400 to-blue-600" },
    { id: 3, icon: <Zap className="w-6 h-6" />, name: "Energy Boost", value: 1, color: "from-purple-400 to-purple-600" },
    { id: 4, icon: <Trophy className="w-6 h-6" />, name: "Rare Item", value: 1, color: "from-orange-400 to-orange-600" },
    { id: 5, icon: <Gift className="w-6 h-6" />, name: "Mystery Box", value: 1, color: "from-pink-400 to-pink-600" },
    { id: 6, icon: <Coins className="w-6 h-6" />, name: "500 Coins", value: 500, color: "from-green-400 to-green-600" },
    { id: 7, icon: <Star className="w-6 h-6" />, name: "100 XP", value: 100, color: "from-indigo-400 to-indigo-600" },
    { id: 8, icon: <Zap className="w-6 h-6" />, name: "Double Points", value: 1, color: "from-red-400 to-red-600" },
  ];

  useEffect(() => {
    const lastSpin = localStorage.getItem('lastDailySpin');
    if (lastSpin) {
      const lastSpinDate = new Date(lastSpin);
      const now = new Date();
      const diff = now.getTime() - lastSpinDate.getTime();
      const hours = diff / (1000 * 60 * 60);
      
      if (hours < 24) {
        setCanSpin(false);
        const nextSpin = new Date(lastSpinDate.getTime() + 24 * 60 * 60 * 1000);
        setNextSpinTime(nextSpin);
      }
    }
  }, []);

  const spin = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setPrize(null);
    
    const spinRotation = 360 * 5 + Math.random() * 360;
    setRotation(prev => prev + spinRotation);
    
    setTimeout(() => {
      const normalizedRotation = spinRotation % 360;
      const prizeIndex = Math.floor((360 - normalizedRotation) / (360 / prizes.length));
      const wonPrize = prizes[prizeIndex];
      
      setPrize(wonPrize);
      setIsSpinning(false);
      setCanSpin(false);
      
      const now = new Date();
      localStorage.setItem('lastDailySpin', now.toISOString());
      const nextSpin = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      setNextSpinTime(nextSpin);
      
      // Save prize to user inventory
      const inventory = JSON.parse(localStorage.getItem('userInventory') || '{}');
      if (wonPrize.name.includes('Coins')) {
        inventory.coins = (inventory.coins || 0) + wonPrize.value;
      } else if (wonPrize.name.includes('XP')) {
        inventory.xp = (inventory.xp || 0) + wonPrize.value;
      } else {
        inventory.items = [...(inventory.items || []), wonPrize.name];
      }
      localStorage.setItem('userInventory', JSON.stringify(inventory));
    }, 4000);
  };

  const formatTimeRemaining = () => {
    if (!nextSpinTime) return '';
    const now = new Date();
    const diff = nextSpinTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Daily Bonus Wheel</h2>
      
      <div className="relative w-80 h-80 mx-auto mb-6">
        {/* Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: "easeOut" }}
          className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
        >
          {prizes.map((prize, index) => {
            const angle = (360 / prizes.length) * index;
            const nextAngle = (360 / prizes.length) * (index + 1);
            return (
              <div
                key={prize.id}
                className={`absolute inset-0 bg-gradient-to-br ${prize.color}`}
                style={{
                  transform: `rotate(${angle}deg)`,
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`
                }}
              >
                <div
                  className="absolute text-white flex items-center justify-center"
                  style={{
                    top: '25%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${angle + (360 / prizes.length) / 2}deg)`,
                  }}
                >
                  {prize.icon}
                </div>
              </div>
            );
          })}
        </motion.div>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-red-500"></div>
        </div>
        
        {/* Center button */}
        <button
          onClick={spin}
          disabled={!canSpin || isSpinning}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full font-bold text-white shadow-lg z-20 ${
            canSpin && !isSpinning
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              : 'bg-gray-600 cursor-not-allowed'
          } transition-all`}
        >
          {isSpinning ? '...' : canSpin ? 'SPIN' : 'WAIT'}
        </button>
      </div>
      
      {/* Prize Display */}
      {prize && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 mb-4"
        >
          <p className="text-center text-white font-bold text-lg">
            🎉 You won: {prize.name}!
          </p>
        </motion.div>
      )}
      
      {/* Timer */}
      {!canSpin && nextSpinTime && (
        <div className="text-center text-gray-400">
          <p>Next spin in: {formatTimeRemaining()}</p>
        </div>
      )}
    </div>
  );
};

export default DailyBonusWheel;