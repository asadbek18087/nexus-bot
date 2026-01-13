"use client";

import { useState, useEffect, useCallback } from 'react';
import { useEconomyStore } from '@/stores/economyStore';
import SuperAppLayout from '@/components/SuperAppLayout';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy, Gamepad2, ArrowRight, Zap, Coins } from 'lucide-react';
import Link from 'next/link';

type Grid = (number | null)[][];
type Direction = 'up' | 'down' | 'left' | 'right';

export default function GamePage() {
  const { addCoins, coins } = useEconomyStore();
  const [grid, setGrid] = useState<Grid>(() => initializeGrid());
  const [score, setScore] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  function initializeGrid(): Grid {
    const newGrid: Grid = Array(4).fill(null).map(() => Array(4).fill(null));
    addNewTile(newGrid);
    addNewTile(newGrid);
    return newGrid;
  }

  function addNewTile(currentGrid: Grid): boolean {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!currentGrid[i][j]) {
          emptyCells.push([i, j]);
        }
      }
    }
    
    if (emptyCells.length === 0) return false;
    
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    currentGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  const move = useCallback((direction: Direction) => {
    if (gameOver) return;

    let newGrid = grid.map(row => [...row]);
    let moved = false;
    let mergeScore = 0;

    const rotateGrid = (g: Grid): Grid => {
      const n = g.length;
      const rotated = Array(n).fill(null).map(() => Array(n).fill(null));
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          rotated[j][n - 1 - i] = g[i][j];
        }
      }
      return rotated;
    };

    // Rotate grid based on direction
    const rotations = { left: 0, up: 1, right: 2, down: 3 };
    for (let i = 0; i < rotations[direction]; i++) {
      newGrid = rotateGrid(newGrid);
    }

    // Move left
    for (let i = 0; i < 4; i++) {
      const row = newGrid[i].filter(val => val !== null);
      const merged: number[] = [];
      
      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          const mergedValue = (row[j] as number) * 2;
          merged.push(mergedValue);
          mergeScore += mergedValue;
          j++;
        } else {
          merged.push(row[j] as number);
        }
      }
      
      const newRow = [...merged, ...Array(4 - merged.length).fill(null)];
      if (JSON.stringify(newRow) !== JSON.stringify(newGrid[i])) {
        moved = true;
      }
      newGrid[i] = newRow;
    }

    // Rotate back
    for (let i = 0; i < (4 - rotations[direction]) % 4; i++) {
      newGrid = rotateGrid(newGrid);
    }

    if (moved) {
      addNewTile(newGrid);
      setGrid(newGrid);
      setScore(prev => prev + mergeScore);
      
      // Earn coins based on merges
      const coinsEarned = Math.floor(mergeScore / 100) * 0.5;
      if (coinsEarned > 0) {
        setSessionCoins(prev => prev + coinsEarned);
        addCoins(coinsEarned);
      }

      // Check game over
      if (!hasAvailableMoves(newGrid)) {
        setGameOver(true);
        if (score > bestScore) {
          setBestScore(score);
        }
      }
    }
  }, [grid, gameOver, score, bestScore, addCoins]);

  function hasAvailableMoves(currentGrid: Grid): boolean {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!currentGrid[i][j]) return true;
      }
    }
    
    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = currentGrid[i][j];
        if (
          (i < 3 && currentGrid[i + 1][j] === current) ||
          (j < 3 && currentGrid[i][j + 1] === current)
        ) {
          return true;
        }
      }
    }
    
    return false;
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move]);

  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setSessionCoins(0);
    setGameOver(false);
  };

  const getTileColor = (value: number | null): string => {
    if (!value) return 'bg-slate-800';
    const colors: { [key: number]: string } = {
      2: 'bg-slate-700',
      4: 'bg-slate-600',
      8: 'bg-violet-600',
      16: 'bg-violet-500',
      32: 'bg-violet-400',
      64: 'bg-violet-300',
      128: 'bg-cyan-600',
      256: 'bg-cyan-500',
      512: 'bg-cyan-400',
      1024: 'bg-cyan-300',
      2048: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    };
    return colors[value] || 'bg-gradient-to-br from-pink-500 to-violet-500';
  };

  return (
    <SuperAppLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              2048
            </h1>
            <p className="text-slate-400 text-sm">Plitkalarni birlashtiring va tangalar yig'ing!</p>
          </div>

          {/* Score Board */}
          <div className="flex justify-between mb-4 gap-4">
            <div className="flex-1 bg-slate-800 rounded-lg p-3 text-center">
              <p className="text-slate-400 text-xs">Ball</p>
              <p className="text-2xl font-bold text-white">{score}</p>
            </div>
            <div className="flex-1 bg-slate-800 rounded-lg p-3 text-center">
              <p className="text-slate-400 text-xs">Rekord</p>
              <p className="text-2xl font-bold text-white">{bestScore}</p>
            </div>
            <div className="flex-1 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 rounded-lg p-3 text-center border border-violet-500/30">
              <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
                Yig'ilgan <Coins className="w-3 h-3 text-yellow-400" />
              </p>
              <p className="text-2xl font-bold text-cyan-400">{sessionCoins.toFixed(1)}</p>
            </div>
          </div>

          {/* Game Grid */}
          <div className="relative bg-slate-800 rounded-xl p-2 mb-4">
            <div className="grid grid-cols-4 gap-2">
              {grid.map((row, i) =>
                row.map((value, j) => (
                  <motion.div
                    key={`${i}-${j}`}
                    layout
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`aspect-square rounded-lg flex items-center justify-center text-2xl font-bold ${getTileColor(value)}`}
                  >
                    {value || ''}
                  </motion.div>
                ))
              )}
            </div>

            {/* Game Over Overlay */}
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-900/95 rounded-xl flex items-center justify-center"
              >
                <div className="text-center">
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">O'yin Tugadi!</h2>
                  <p className="text-slate-400 mb-4">Yakuniy Ball: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Qayta O'ynash
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center mb-8">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Yangi O'yin
            </button>
          </div>

          {/* Leaderboard */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-lg text-white">Top O'yinchilar</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { rank: 1, name: 'CommanderX', score: 50420, active: true },
                { rank: 2, name: 'NeonRider', score: 48900, active: false },
                { rank: 3, name: 'QuantumBit', score: 45200, active: false },
              ].map((player) => (
                <div key={player.rank} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 flex items-center justify-center rounded font-bold text-xs ${
                      player.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      player.rank === 2 ? 'bg-slate-400/20 text-slate-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      #{player.rank}
                    </div>
                    <span className="text-sm font-medium text-slate-200">{player.name}</span>
                  </div>
                  <span className="text-sm font-bold text-cyan-400">{player.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <p className="text-center text-slate-500 text-sm mb-6 mt-6">
            O'ynash uchun suring yoki strelkalardan foydalaning
          </p>
        </div>
      </div>
    </SuperAppLayout>
  );
}
