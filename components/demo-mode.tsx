"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Zap, Trophy, Star, ArrowRight } from 'lucide-react';

interface DemoStats {
  movesPerSecond: number;
  tilesMerged: number;
  maxTile: number;
  combo: number;
  score: number;
}

export default function DemoMode() {
  const [isDemo, setIsDemo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState<DemoStats>({
    movesPerSecond: 0,
    tilesMerged: 0,
    maxTile: 0,
    combo: 0,
    score: 0
  });
  const [currentAction, setCurrentAction] = useState('');
  const [showHighlights, setShowHighlights] = useState(false);

  useEffect(() => {
    if (isDemo && !isPaused) {
      const demoInterval = setInterval(() => {
        // Simulate impressive gameplay
        const actions = [
          'Finding best move...',
          'Calculating merge possibilities...',
          'Executing combo!',
          'Chain reaction initiated!',
          'Maximizing score...',
          'Pattern recognition active...',
          'Quantum analysis complete!',
          'Optimal path found!'
        ];
        
        setCurrentAction(actions[Math.floor(Math.random() * actions.length)]);
        
        setStats(prev => ({
          movesPerSecond: 3 + Math.random() * 2,
          tilesMerged: prev.tilesMerged + Math.floor(Math.random() * 3),
          maxTile: Math.max(prev.maxTile, 2048 * Math.pow(2, Math.floor(Math.random() * 5))),
          combo: Math.max(prev.combo, Math.floor(Math.random() * 10)),
          score: prev.score + Math.floor(Math.random() * 1000)
        }));
      }, 1000);

      return () => clearInterval(demoInterval);
    }
  }, [isDemo, isPaused]);

  const startDemo = () => {
    setIsDemo(true);
    setShowHighlights(true);
    // Simulate auto-play in 2048 game
    window.dispatchEvent(new CustomEvent('startDemo'));
  };

  const stopDemo = () => {
    setIsDemo(false);
    setIsPaused(false);
    setShowHighlights(false);
    window.dispatchEvent(new CustomEvent('stopDemo'));
  };

  const resetDemo = () => {
    setStats({
      movesPerSecond: 0,
      tilesMerged: 0,
      maxTile: 0,
      combo: 0,
      score: 0
    });
    setCurrentAction('');
    window.dispatchEvent(new CustomEvent('resetGame'));
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl min-w-[400px]"
      >
        {/* Demo Controls */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            AI Demo Mode
          </h3>
          <div className="flex gap-2">
            {!isDemo ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startDemo}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold"
              >
                <Play className="w-4 h-4" />
                Start Demo
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPaused(!isPaused)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopDemo}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
                >
                  Stop
                </motion.button>
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetDemo}
              className="bg-slate-600 hover:bg-slate-700 text-white p-2 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Live Stats */}
        <AnimatePresence>
          {isDemo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3"
            >
              {/* Current Action */}
              <motion.div
                key={currentAction}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-cyan-400 text-sm font-mono flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                {currentAction}
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-yellow-400 mb-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs uppercase">Score</span>
                  </div>
                  <p className="text-white font-bold text-xl">{stats.score.toLocaleString()}</p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Star className="w-4 h-4" />
                    <span className="text-xs uppercase">Max Tile</span>
                  </div>
                  <p className="text-white font-bold text-xl">{stats.maxTile.toLocaleString()}</p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-green-400 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs uppercase">Moves/Sec</span>
                  </div>
                  <p className="text-white font-bold text-xl">{stats.movesPerSecond.toFixed(1)}</p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-orange-400 mb-1">
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-xs uppercase">Combo</span>
                  </div>
                  <p className="text-white font-bold text-xl">x{stats.combo}</p>
                </motion.div>
              </div>

              {/* Performance Indicator */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-3 rounded-lg border border-green-500/30">
                <p className="text-green-400 text-sm font-bold text-center">
                  🚀 AI Performance: EXCELLENT (Top 0.1%)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Teaser */}
        {!isDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <p className="text-white/60 text-sm mb-2">
              Watch AI play at superhuman speed!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/pricing'}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg font-bold text-sm"
            >
              Unlock Premium Features
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
