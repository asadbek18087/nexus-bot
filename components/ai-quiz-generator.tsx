'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';
import { QuantumButton, QuantumCard } from './quantum-effects';

interface AIQuizGeneratorProps {
  onQuestionsGenerated: (questions: any[]) => void;
  onClose: () => void;
}

export default function AIQuizGenerator({ onQuestionsGenerated, onClose }: AIQuizGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [count, setCount] = useState(5);
  const [language, setLanguage] = useState<'uz' | 'en'>('uz');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const popularTopics = [
    { name: 'Mavzuni kiriting (masalan: &apos;Tarix&apos;, &apos;Fan&apos;, &apos;Matematika&apos;)' },
    { name: 'Fizika', icon: '⚛️', topic: 'physics' },
    { name: 'Kimyo', icon: '🧪', topic: 'chemistry' },
    { name: 'Tarix', icon: '📚', topic: 'history' },
    { name: 'Geografiya', icon: '🌍', topic: 'geography' },
    { name: 'Adabiyot', icon: '📖', topic: 'literature' },
    { name: 'Ingliz tili', icon: '🇬🇧', topic: 'english language' },
    { name: 'Dasturlash', icon: '💻', topic: 'programming' },
    { name: 'Psixologiya', icon: '🧠', topic: 'psychology' },
    { name: 'Sport', icon: '⚽', topic: 'sports' }
  ];

  const checkAvailability = async () => {
    try {
      const response = await fetch('/api/ai-quiz');
      const data = await response.json();
      setIsAvailable(data.available);
    } catch (error) {
      setIsAvailable(false);
    }
  };

  React.useEffect(() => {
    checkAvailability();
  }, []);

  const generateQuestions = async () => {
    if (!topic.trim()) {
      setError('Iltimos, mavzu kiriting');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/ai-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          difficulty,
          count,
          language
        }),
      });

      const data = await response.json();

      if (data.success && data.questions.length > 0) {
        onQuestionsGenerated(data.questions);
        onClose();
      } else {
        setError(data.error || 'Savollar generatsiya qilinmadi');
      }
    } catch (error) {
      setError('Xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAvailable) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <QuantumCard className="max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Test Generator</h3>
            <p className="text-slate-300 mb-6">
              Hozircha AI test generator mavjud emas. Tez orada qo&apos;shiladi.
            </p>
            <QuantumButton onClick={onClose}>
              Yopish
            </QuantumButton>
          </div>
        </QuantumCard>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <QuantumCard>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">🧠 AI Test Generator</h3>
            <p className="text-slate-300">
              Sun&apos;iy intellekt yordamida shaxsiy testlar yarating
            </p>
          </div>

          {/* Topic Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Test mavzusi
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Masalan: matematika, fizika, tarix..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
            />
          </div>

          {/* Popular Topics */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4 inline mr-2" />
              Mashhur mavzular
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {popularTopics.map((item) => (
                <button
                  key={item.topic}
                  onClick={() => setTopic(item.name)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Qiyinlik darajasi
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
              >
                <option value="easy">Oson</option>
                <option value="medium">O&apos;rta</option>
                <option value="hard">Qiyin</option>
              </select>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Savollar soni (5-20 ta)
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
              >
                <option value={3}>3 ta</option>
                <option value={5}>5 ta</option>
                <option value={7}>7 ta</option>
                <option value={10}>10 ta</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Til
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'uz' | 'en')}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
              >
                <option value="uz">O&apos;zbekcha</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center">
              <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <QuantumButton
              onClick={generateQuestions}
              disabled={isGenerating || !topic.trim()}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generatsiya qilinmoqda...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Test yaratish
                </>
              )}
            </QuantumButton>
            <QuantumButton
              variant="secondary"
              onClick={onClose}
              disabled={isGenerating}
            >
              Bekor qilish
            </QuantumButton>
          </div>

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start">
              <Brain className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">AI yordamida generatsiya qilinadi</p>
                <p>
                  OpenAI GPT-3.5 dan foydalanib, siz tanlagan mavzuda 
                  yuqori sifatli test savollari yaratiladi.
                </p>
              </div>
            </div>
          </div>
        </QuantumCard>
      </motion.div>
    </div>
  );
}
