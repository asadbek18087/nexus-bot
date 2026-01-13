"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Star, Award, TrendingUp } from 'lucide-react';
import { QuantumCard, QuantumButton } from '../quantum-effects';

interface Mentor {
  id: string;
  name: string;
  level: number;
  specialty: string;
  students: number;
}

export default function MentorSystem() {
  const [mentors] = useState<Mentor[]>([
    { id: '1', name: 'Master Yoda', level: 50, specialty: 'Philosophy', students: 12 },
    { id: '2', name: 'Code Ninja', level: 45, specialty: 'Algorithms', students: 8 },
    { id: '3', name: 'Quantum Dave', level: 48, specialty: 'Physics', students: 15 },
  ]);

  const [myMentor, setMyMentor] = useState<string | null>(null);

  return (
    <QuantumCard className="p-6">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-400" />
        Mentorship Program
      </h3>

      {!myMentor ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Select a mentor to boost your XP gain by 10%.</p>
          <div className="space-y-3">
            {mentors.map((mentor) => (
              <div 
                key={mentor.id}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{mentor.name}</h4>
                    <p className="text-xs text-slate-500">Lvl {mentor.level} • {mentor.specialty}</p>
                  </div>
                </div>
                <QuantumButton 
                  size="sm" 
                  onClick={() => setMyMentor(mentor.id)}
                >
                  Request
                </QuantumButton>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Award className="w-8 h-8 text-blue-400" />
          </div>
          <h4 className="text-xl font-bold text-white mb-2">Mentorship Active</h4>
          <p className="text-sm text-slate-400 mb-4">
            You are learning from <span className="text-white font-bold">{mentors.find(m => m.id === myMentor)?.name}</span>
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
            <TrendingUp className="w-3 h-3" /> +10% XP Boost Active
          </div>
          <button 
            onClick={() => setMyMentor(null)}
            className="block mx-auto mt-6 text-xs text-slate-500 hover:text-white"
          >
            Leave Mentorship
          </button>
        </div>
      )}
    </QuantumCard>
  );
}
