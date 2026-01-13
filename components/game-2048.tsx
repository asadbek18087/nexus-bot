"use client";

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, Undo, Zap } from 'lucide-react';
import { QuantumButton, QuantumCard } from './quantum-effects';

type Grid = number[][];
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Game2048Props {
  onScoreChange: (score: number) => void;
  onGameOver: (score: number) => void;
}

export default function Game2048({ onScoreChange, onGameOver }: Game2048Props) {
  const [grid, setGrid] = useState<Grid>(Array(4).fill(null).map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [previousGrid, setPreviousGrid] = useState<Grid | null>(null);
  const [maxTile, setMaxTile] = useState(0);
  const [theme, setTheme] = useState(0);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, value: number}>>([]);

  // Initialize game
  useEffect(() => {
    startNewGame();
    const savedBest = localStorage.getItem('2048_best_score');
    if (savedBest) setBestScore(parseInt(savedBest));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewGame = () => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setPreviousGrid(null);
  };

  const addRandomTile = (currentGrid: Grid) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) emptyCells.push({ x: i, y: j });
      }
    }
    if (emptyCells.length > 0) {
      const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = useCallback((direction: Direction) => {
    if (gameOver) return;

    const newGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;
    let scoreGain = 0;

    const rotate = (matrix: Grid) => matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    const rotateLeft = (matrix: Grid) => matrix[0].map((_, i) => matrix.map(row => row[row.length - 1 - i]));

    let workingGrid = newGrid;
    if (direction === 'LEFT') workingGrid = rotate(rotate(workingGrid)); // 180 (actually no rotation needed for left logic if we implement left-based) - wait, standard logic usually does left.
    // Let's stick to a standard logic: compress left
    
    // Helper to compress a row to the left
    const compressRow = (row: number[]) => {
      const nonZero = row.filter(x => x !== 0);
      const newRow = [];
      let skip = false;
      
      for (let i = 0; i < nonZero.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }
        if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
          newRow.push(nonZero[i] * 2);
          scoreGain += nonZero[i] * 2;
          skip = true;
          moved = true;
        } else {
          newRow.push(nonZero[i]);
        }
      }
      
      while (newRow.length < 4) newRow.push(0);
      return newRow;
    };

    // Transform grid to be "left-oriented" for processing
    if (direction === 'RIGHT') workingGrid = workingGrid.map(row => [...row].reverse());
    if (direction === 'UP') workingGrid = rotateLeft(workingGrid); // Rotate CCW
    if (direction === 'DOWN') workingGrid = rotate(workingGrid); // Rotate CW

    // Process rows
    const oldGridJSON = JSON.stringify(workingGrid);
    workingGrid = workingGrid.map(row => compressRow(row));
    
    if (JSON.stringify(workingGrid) !== oldGridJSON) moved = true;

    // Transform back
    if (direction === 'RIGHT') workingGrid = workingGrid.map(row => [...row].reverse());
    if (direction === 'UP') workingGrid = rotate(workingGrid); // Rotate CW to undo CCW
    if (direction === 'DOWN') workingGrid = rotateLeft(workingGrid); // Rotate CCW to undo CW

    if (moved) {
      setPreviousGrid(grid);
      addRandomTile(workingGrid);
      setGrid(workingGrid);
      const newScore = score + scoreGain;
      setScore(newScore);
      onScoreChange(newScore);
      
      // Check for max tile and update theme
      let currentMax = 0;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (workingGrid[i][j] > currentMax) {
            currentMax = workingGrid[i][j];
          }
        }
      }
      setMaxTile(currentMax);
      
      // Change theme every 5 levels (2048, 65536, 2097152, ...)
      const newTheme = Math.floor(Math.log2(currentMax) / 5);
      if (newTheme > theme) {
        setTheme(newTheme);
        // Create celebration particles
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          value: currentMax
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 3000);
      }
      
      // Combo system
      if (scoreGain > 0) {
        setCombo(prev => prev + 1);
      } else {
        setCombo(0);
      }
      
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048_best_score', newScore.toString());
      }

      if (checkGameOver(workingGrid)) {
        setGameOver(true);
        onGameOver(newScore);
      }
    } else {
      setCombo(0);
    }
  }, [grid, score, bestScore, gameOver, onScoreChange, onGameOver, theme]);

  const checkGameOver = (currentGrid: Grid) => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) return false;
      }
    }
    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i < 3 && currentGrid[i][j] === currentGrid[i + 1][j]) return false;
        if (j < 3 && currentGrid[i][j] === currentGrid[i][j + 1]) return false;
      }
    }
    return true;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': move('UP'); break;
        case 'ArrowDown': move('DOWN'); break;
        case 'ArrowLeft': move('LEFT'); break;
        case 'ArrowRight': move('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Touch controls
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - touchStart.x;
    const diffY = touchEndY - touchStart.y;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 30) {
        move(diffX > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(diffY) > 30) {
        move(diffY > 0 ? 'DOWN' : 'UP');
      }
    }
    setTouchStart(null);
  };

  const getTileColor = (value: number) => {
    // Theme-based colors for infinite progression
    const themes = [
      // Theme 0: Classic (0-1024)
      {
        2: 'bg-slate-700 text-slate-100',
        4: 'bg-slate-600 text-slate-100',
        8: 'bg-blue-900/50 text-white border border-blue-500/30',
        16: 'bg-blue-800/50 text-white border border-blue-400/40',
        32: 'bg-blue-700/50 text-white border border-blue-300/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
        64: 'bg-purple-900/50 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.4)]',
        128: 'bg-purple-800/50 text-white border border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.5)]',
        256: 'bg-purple-700/50 text-white border border-purple-300/50 shadow-[0_0_25px_rgba(168,85,247,0.6)]',
        512: 'bg-yellow-900/50 text-white border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.5)]',
        1024: 'bg-yellow-800/50 text-white border border-yellow-400/40 shadow-[0_0_35px_rgba(234,179,8,0.6)]',
        2048: 'bg-yellow-600/50 text-white border border-yellow-300/50 shadow-[0_0_40px_rgba(234,179,8,0.8)]',
      },
      // Theme 1: Neon (4096-16777216)
      {
        4096: 'bg-pink-900/50 text-white border border-pink-500/30 shadow-[0_0_45px_rgba(236,72,153,0.8)]',
        8192: 'bg-pink-800/50 text-white border border-pink-400/40 shadow-[0_0_50px_rgba(236,72,153,0.9)]',
        16384: 'bg-pink-700/50 text-white border border-pink-300/50 shadow-[0_0_55px_rgba(236,72,153,1)]',
        32768: 'bg-cyan-900/50 text-white border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.8)]',
        65536: 'bg-cyan-800/50 text-white border border-cyan-400/40 shadow-[0_0_65px_rgba(6,182,212,0.9)]',
        131072: 'bg-cyan-700/50 text-white border border-cyan-300/50 shadow-[0_0_70px_rgba(6,182,212,1)]',
        262144: 'bg-green-900/50 text-white border border-green-500/30 shadow-[0_0_75px_rgba(34,197,94,0.8)]',
        524288: 'bg-green-800/50 text-white border border-green-400/40 shadow-[0_0_80px_rgba(34,197,94,0.9)]',
        1048576: 'bg-green-700/50 text-white border border-green-300/50 shadow-[0_0_85px_rgba(34,197,94,1)]',
        2097152: 'bg-orange-900/50 text-white border border-orange-500/30 shadow-[0_0_90px_rgba(249,115,22,0.8)]',
        4194304: 'bg-orange-800/50 text-white border border-orange-400/40 shadow-[0_0_95px_rgba(249,115,22,0.9)]',
        8388608: 'bg-orange-700/50 text-white border border-orange-300/50 shadow-[0_0_100px_rgba(249,115,22,1)]',
        16777216: 'bg-red-900/50 text-white border border-red-500/30 shadow-[0_0_105px_rgba(239,68,68,0.8)]',
      },
      // Theme 2: Galaxy (33554432+)
      {
        33554432: 'bg-indigo-900/50 text-white border border-indigo-500/30 shadow-[0_0_110px_rgba(99,102,241,0.8)]',
        67108864: 'bg-indigo-800/50 text-white border border-indigo-400/40 shadow-[0_0_115px_rgba(99,102,241,0.9)]',
        134217728: 'bg-indigo-700/50 text-white border border-indigo-300/50 shadow-[0_0_120px_rgba(99,102,241,1)]',
        268435456: 'bg-violet-900/50 text-white border border-violet-500/30 shadow-[0_0_125px_rgba(139,92,246,0.8)]',
        536870912: 'bg-violet-800/50 text-white border border-violet-400/40 shadow-[0_0_130px_rgba(139,92,246,0.9)]',
        1073741824: 'bg-violet-700/50 text-white border border-violet-300/50 shadow-[0_0_135px_rgba(139,92,246,1)]',
        2147483648: 'bg-fuchsia-900/50 text-white border border-fuchsia-500/30 shadow-[0_0_140px_rgba(217,70,239,0.8)]',
        4294967296: 'bg-fuchsia-800/50 text-white border border-fuchsia-400/40 shadow-[0_0_145px_rgba(217,70,239,0.9)]',
        8589934592: 'bg-fuchsia-700/50 text-white border border-fuchsia-300/50 shadow-[0_0_150px_rgba(217,70,239,1)]',
      }
    ];
    
    // Get current theme colors
    const currentTheme = themes[Math.min(theme, themes.length - 1)];
    
    // Check all themes for the value
    for (const t of themes) {
      if (t[value]) return t[value];
    }
    
    // Default for extremely high values
    return 'bg-gradient-to-br from-purple-900/90 to-pink-900/90 text-white border border-white/20 shadow-[0_0_160px_rgba(168,85,247,1)] animate-pulse';
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 select-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Score</p>
            <p className="text-2xl font-bold text-white font-mono">{score}</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Best</p>
            <p className="text-2xl font-bold text-yellow-400 font-mono">{bestScore}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-3 py-2 rounded-lg border border-blue-500/30">
             <p className="text-xs text-blue-400 font-bold">♾️ INFINITE</p>
          </div>
          {combo > 2 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-orange-500/20 to-red-500/20 px-3 py-2 rounded-lg border border-orange-500/30"
            >
              <p className="text-xs text-orange-400 font-bold">COMBO x{combo}</p>
            </motion.div>
          )}
          {theme > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-2 rounded-lg border border-purple-500/30"
            >
              <p className="text-xs text-purple-400 font-bold">
                THEME {['CLASSIC', 'NEON', 'GALAXY'][Math.min(theme, 2)]}
              </p>
            </motion.div>
          )}
          <QuantumButton onClick={startNewGame} size="sm" variant="secondary">
            <RefreshCw className="w-5 h-5" />
          </QuantumButton>
        </div>
      </div>

      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              scale: 0,
              opacity: 1
            }}
            animate={{ 
              y: '-100vh',
              scale: [0, 1.5, 0.5],
              opacity: [1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 3,
              ease: "easeOut"
            }}
            className="fixed pointer-events-none z-50 text-4xl font-bold text-yellow-400"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
          >
            {particle.value}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative aspect-square bg-slate-900/50 rounded-xl p-3 border border-slate-800/50 backdrop-blur-sm shadow-2xl">
        <div className="grid grid-cols-4 grid-rows-4 gap-3 h-full w-full">
          {grid.map((row, i) =>
            row.map((value, j) => (
              <div
                key={`${i}-${j}`}
                className="relative w-full h-full rounded-lg bg-slate-800/30 flex items-center justify-center"
              >
                <AnimatePresence mode="popLayout">
                  {value !== 0 && (
                    <motion.div
                      key={`tile-${value}-${i}-${j}`} // Unique key ensures animation on change
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`absolute inset-0 rounded-lg flex items-center justify-center text-2xl font-bold ${getTileColor(value)}`}
                    >
                      {value}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 rounded-xl flex flex-col items-center justify-center z-10 backdrop-blur-sm"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
            <h2 className="text-4xl font-bold text-white mb-2">Game Over!</h2>
            <p className="text-2xl text-slate-300 mb-2">Final Score: {score}</p>
            <p className="text-lg text-purple-400 mb-4">Max Tile: {maxTile.toLocaleString()}</p>
            {maxTile >= 2048 && (
              <p className="text-sm text-green-400 mb-4">
                🎉 You reached {['CLASSIC', 'NEON', 'GALAXY'][Math.min(theme, 2)]} theme!
              </p>
            )}
            <QuantumButton onClick={startNewGame}>Try Again</QuantumButton>
          </motion.div>
        )}
      </div>
      
      <p className="text-center text-slate-500 mt-6 text-sm">
        Swipe or use arrow keys to join the numbers and reach <span className="text-yellow-500 font-bold">INFINITY</span>! 🚀
      </p>
    </div>
  );
}
