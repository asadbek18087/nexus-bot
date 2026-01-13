"use client";

import { useState, useEffect } from 'react';
import SuperAppLayout from '@/components/SuperAppLayout';
import { useEconomyStore } from '@/stores/economyStore';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, X, Zap, Plus, Trash2, Save } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function FlashcardsPage() {
  const { spendCoins, coins } = useEconomyStore();
  const [cards, setCards] = useState<Flashcard[]>([
    { id: '1', front: 'What is React?', back: 'A JavaScript library for building user interfaces', difficulty: 'easy' },
    { id: '2', front: 'What is a Hook?', back: 'Functions that let you use state and other React features', difficulty: 'medium' },
    { id: '3', front: 'What is the Virtual DOM?', back: 'A JavaScript representation of the real DOM', difficulty: 'hard' },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [showResults, setShowResults] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '', difficulty: 'medium' as const });

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    if (!studyMode) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setShowResults(true);
    }
  };

  const resetStudy = () => {
    setCurrentIndex(0);
    setScore({ correct: 0, incorrect: 0 });
    setShowResults(false);
    setIsFlipped(false);
    setStudyMode(false);
  };

  const addCard = () => {
    if (newCard.front && newCard.back) {
      setCards(prev => [...prev, {
        id: Date.now().toString(),
        ...newCard
      }]);
      setNewCard({ front: '', back: '', difficulty: 'medium' });
    }
  };

  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const saveDeck = async () => {
    if (coins < 3) {
      alert('Not enough coins! (Requires 3)');
      return;
    }

    if (!spendCoins(3)) return;

    localStorage.setItem('flashcards', JSON.stringify(cards));
    alert('Deck saved successfully!');
  };

  const loadDeck = () => {
    const saved = localStorage.getItem('flashcards');
    if (saved) {
      setCards(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadDeck();
  }, []);

  return (
    <SuperAppLayout>
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Flashcards
            </h1>
            <p className="text-slate-400">Study with interactive flashcards</p>
          </div>

          {/* Coins Status */}
          <div className="flex items-center gap-2 mb-6 p-3 bg-slate-800/50 rounded-lg border border-violet-500/20">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm">Coins: {coins}</span>
            <span className="text-xs text-slate-400 ml-auto">Save deck costs 3 coins</span>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => !studyMode && setStudyMode(true)}
              disabled={studyMode}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                studyMode
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800/50 hover:bg-slate-800'
              }`}
            >
              Study Mode
            </button>
            <button
              onClick={() => studyMode && setStudyMode(false)}
              disabled={!studyMode}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                !studyMode
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800/50 hover:bg-slate-800'
              }`}
            >
              Edit Mode
            </button>
          </div>

          {/* Edit Mode */}
          {!studyMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mb-6"
            >
              {/* Add New Card */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <h3 className="font-semibold mb-3">Add New Card</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Front of card"
                    value={newCard.front}
                    onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <textarea
                    placeholder="Back of card"
                    value={newCard.back}
                    onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <select
                    value={newCard.difficulty}
                    onChange={(e) => setNewCard(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button
                    onClick={addCard}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Card
                  </button>
                </div>
              </div>

              {/* Card List */}
              <div className="space-y-2">
                {cards.map((card, index) => (
                  <div key={card.id} className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-sm text-slate-300">Card {index + 1}: {card.front}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        card.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        card.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {card.difficulty}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <button
                onClick={saveDeck}
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Deck
              </button>
            </motion.div>
          )}

          {/* Study Mode */}
          {studyMode && !showResults && cards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Progress */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">
                  Card {currentIndex + 1} of {cards.length}
                </span>
                <span className="text-cyan-400">
                  Score: {score.correct} / {score.correct + score.incorrect}
                </span>
              </div>

              {/* Flashcard */}
              <div className="relative h-80">
                <motion.div
                  className="absolute inset-0 bg-slate-800/50 rounded-2xl border border-slate-700 cursor-pointer"
                  onClick={handleFlip}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-2xl p-8 flex items-center justify-center text-xl font-medium"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {currentCard.front}
                  </div>
                  
                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-2xl p-8 flex items-center justify-center text-xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-violet-500/30"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {currentCard.back}
                  </div>
                </motion.div>
              </div>

              {/* Actions */}
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-4"
                  >
                    <button
                      onClick={() => handleAnswer(false)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Incorrect
                    </button>
                    <button
                      onClick={() => handleAnswer(true)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-5 h-5" />
                      Correct
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Results */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <h2 className="text-3xl font-bold mb-4">Study Complete!</h2>
              <div className="text-5xl font-bold text-cyan-400 mb-2">
                {score.correct}/{cards.length}
              </div>
              <p className="text-slate-400 mb-8">
                {score.correct >= cards.length * 0.8 ? 'Great job!' : 'Keep practicing!'}
              </p>
              <button
                onClick={resetStudy}
                className="px-6 py-3 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
              >
                Study Again
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {studyMode && cards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No cards yet. Switch to Edit Mode to add some!</p>
            </div>
          )}
        </div>
      </div>
    </SuperAppLayout>
  );
}
