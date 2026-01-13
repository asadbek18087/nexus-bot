"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import Link from 'next/link';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎸'];

export default function MemoryCardsGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const initializeGame = useCallback(() => {
    const gameCards: Card[] = [];
    EMOJIS.forEach((emoji, index) => {
      gameCards.push(
        { id: index * 2, emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setIsChecking(false);
  }, []);

  useEffect(() => {
    initializeGame();
    const saved = localStorage.getItem('memory-cards-best');
    if (saved) setBestScore(parseInt(saved));
  }, [initializeGame]);

  const handleCardClick = useCallback((cardId: number) => {
    if (isChecking) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    
    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);
    
    if (newSelected.length === 2) {
      setIsChecking(true);
      setMoves(prev => prev + 1);
      
      const [first, second] = newSelected;
      const firstCard = newCards.find(c => c.id === first);
      const secondCard = newCards.find(c => c.id === second);
      
      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first || c.id === second
              ? { ...c, isMatched: true }
              : c
          ));
          setMatches(prev => prev + 1);
          setSelectedCards([]);
          setIsChecking(false);
          
          if (matches + 1 === EMOJIS.length) {
            setGameWon(true);
            if (!bestScore || moves + 1 < bestScore) {
              setBestScore(moves + 1);
              localStorage.setItem('memory-cards-best', (moves + 1).toString());
            }
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first || c.id === second
              ? { ...c, isFlipped: false }
              : c
          ));
          setSelectedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [cards, selectedCards, isChecking, matches, moves, bestScore]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/game" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Memory Cards
          </h1>
          <div className="w-20" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="md:col-span-2">
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {cards.map((card) => (
                  <motion.button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isFlipped || card.isMatched}
                    className={`aspect-square rounded-lg text-4xl font-bold transition-all duration-300 ${
                      card.isFlipped || card.isMatched
                        ? card.isMatched
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-95'
                          : 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-600 hover:scale-105'
                    }`}
                    whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {card.isFlipped || card.isMatched ? card.emoji : '?'}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats & Controls */}
          <div className="space-y-4">
            {/* Score */}
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <h2 className="text-xl font-bold mb-4 text-purple-400">Stats</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Moves</span>
                  <span className="font-mono text-xl">{moves}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Matches</span>
                  <span className="font-mono">{matches}/{EMOJIS.length}</span>
                </div>
                {bestScore && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Best</span>
                    <span className="font-mono text-yellow-400">{bestScore}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <h2 className="text-xl font-bold mb-4 text-purple-400">Progress</h2>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(matches / EMOJIS.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-slate-400 mt-2 text-center">
                {Math.round((matches / EMOJIS.length) * 100)}% Complete
              </p>
            </div>

            {/* Reset Button */}
            <button
              onClick={initializeGame}
              className="w-full bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </button>
          </div>
        </div>

        {/* Win Overlay */}
        {gameWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center max-w-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 text-yellow-400">You Won! 🎉</h2>
              <p className="text-xl mb-2">Completed in</p>
              <p className="text-4xl font-bold text-purple-400 mb-2">{moves} moves</p>
              {moves === bestScore && (
                <p className="text-green-400 mb-4">New Best Score! ⭐</p>
              )}
              <div className="flex gap-4">
                <button
                  onClick={initializeGame}
                  className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Play Again
                </button>
                <Link
                  href="/game"
                  className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  Back to Games
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
