"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuantumButton, QuantumCard } from '../quantum-effects';
import { Smile, Frown, Meh, Zap, Coffee } from 'lucide-react';

type Mood = 'happy' | 'sad' | 'bored' | 'energetic' | 'relaxed';

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  const moods: { id: Mood; icon: any; label: string; color: string }[] = [
    { id: 'happy', icon: Smile, label: 'Happy', color: 'text-yellow-400' },
    { id: 'sad', icon: Frown, label: 'Sad', color: 'text-blue-400' },
    { id: 'bored', icon: Meh, label: 'Bored', color: 'text-gray-400' },
    { id: 'energetic', icon: Zap, label: 'Energetic', color: 'text-orange-400' },
    { id: 'relaxed', icon: Coffee, label: 'Relaxed', color: 'text-purple-400' },
  ];

  const getRecommendation = (mood: Mood) => {
    // Mock AI recommendation logic
    const recommendations = {
      happy: { title: "The Office", type: "Series", reason: "Keep the vibes high!" },
      sad: { title: "Interstellar", type: "Movie", reason: "Sometimes you need a good cry in space." },
      bored: { title: "Atomic Habits", type: "Book", reason: "Productivity kills boredom." },
      energetic: { title: "Doom Eternal", type: "Game", reason: "Rip and tear!" },
      relaxed: { title: "Lofi Beats", type: "Music", reason: "Chill vibes only." },
    };
    return recommendations[mood];
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setRecommendation(null);
    setTimeout(() => {
      setRecommendation(getRecommendation(mood));
    }, 1500); // Simulate AI processing
  };

  return (
    <QuantumCard className="p-6">
      <h3 className="text-white font-bold mb-4">How are you feeling?</h3>
      
      {!recommendation ? (
        <div className="grid grid-cols-5 gap-2">
          {moods.map((m) => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMoodSelect(m.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors ${selectedMood === m.id ? 'ring-2 ring-purple-500' : ''}`}
            >
              <m.icon className={`w-6 h-6 mb-2 ${m.color}`} />
              <span className="text-[10px] text-slate-400">{m.label}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
        >
          <p className="text-xs text-slate-400 mb-1">AI Recommends for {selectedMood}:</p>
          <h4 className="text-lg font-bold text-white mb-1">{recommendation.title}</h4>
          <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2 inline-block">
            {recommendation.type}
          </span>
          <p className="text-sm text-slate-300 italic">&quot;{recommendation.reason}&quot;</p>
          <QuantumButton 
            className="w-full mt-4" 
            variant="secondary"
            onClick={() => { setSelectedMood(null); setRecommendation(null); }}
          >
            Try Another
          </QuantumButton>
        </motion.div>
      )}
      
      {selectedMood && !recommendation && (
        <div className="mt-4 text-center">
          <div className="inline-block w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-xs text-slate-400">AI is analyzing your mood...</span>
        </div>
      )}
    </QuantumCard>
  );
}
