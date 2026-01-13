"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Brain, 
  Trophy, 
  Zap, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Timer, 
  ShieldCheck, 
  HelpCircle, 
  RotateCcw,
  Target
} from 'lucide-react';
import Link from 'next/link';
import AIQuizGenerator from '@/components/ai-quiz-generator';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';
import BackgroundAudio from '@/components/background-audio';
import { useEconomyStore } from '@/stores/economyStore';
import { useQuizStore } from '@/stores/quizStore';
import Confetti from 'react-confetti';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

interface QuizQuestion {
  id: number | string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function QuizPage() {
  const { width, height } = useWindowSize();
  const { coins, spendCoins, addCoins, isPremium } = useEconomyStore();
  const { questions: storedQuestions, mode: storedMode, clearQuiz } = useQuizStore();
  
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizMode, setQuizMode] = useState<'practice' | 'exam'>('practice');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [credits, setCredits] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  const [jokersUsed, setJokersUsed] = useState({
    fiftyFifty: false,
    aiHelp: false
  });
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, { total: number; correct: number }>>({});
  const [userStats, setUserStats] = useState({
    level: 24,
    xp: 8420,
    totalQuizzes: 45,
    accuracy: 87
  });

  useEffect(() => {
    if (storedQuestions && storedQuestions.length > 0) {
      setQuestions(storedQuestions as QuizQuestion[]);
      setQuizMode(storedMode);
      setQuizStarted(true);
      if (storedMode === 'exam') setTimeLeft(storedQuestions.length * 30);
    } else {
      setQuestions([
        {
          id: 1,
          question: "Fransiya poytaxti qaysi shahar?",
          options: ["London", "Berlin", "Paris", "Madrid"],
          correctAnswer: 2,
          explanation: "To'g'ri javob - Paris. Fransiya poytaxti 987-yildan beri Paris shahridir.",
          category: "Geografiya",
          difficulty: "easy"
        }
      ]);
    }
  }, [storedQuestions, storedMode]);

  const generateAIQuiz = async (topic: string = 'Umumiy bilimlar') => {
    if (!isPremium && credits <= 0) {
      alert("Bugunlik limit tugadi! Cheksiz testlar uchun Premiumga o'ting.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count: 10, difficulty: 'medium' })
      });
      
      const data = await response.json();
      if (data.success && data.questions.length > 0) {
        setQuestions(data.questions);
        setCredits(prev => prev - 1);
        setQuizStarted(true);
      } else {
        alert("Xatolik yuz berdi. Qayta urinib ko'ring.");
      }
    } catch (error) {
      console.error('AI Quiz error:', error);
      alert("Server bilan bog'lanishda xatolik.");
    } finally {
      setIsGenerating(false);
    }
  };

  const playSound = useCallback((type: 'correct' | 'incorrect' | 'click') => {
    try {
      const sounds = {
        correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
        incorrect: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
        click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
      };
      const audio = new Audio(sounds[type]);
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore autoplay blocks
    } catch (e) {}
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
      window.navigator.vibrate(50);
    }
    
    if (quizMode === 'practice') {
      setShowExplanation(true);
    }
    
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      playSound('correct');
      setScore(score + (quizMode === 'exam' ? 30 : 20));
    } else {
      playSound('incorrect');
    }

    const waitTime = quizMode === 'practice' ? 3000 : 500;

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setDisabledOptions([]);
      } else {
        handleQuizComplete(newAnswers);
      }
    }, waitTime);
  };

  const handleQuizComplete = useCallback((finalAnswers: number[]) => {
    setShowResults(true);
    const correctAnswers = finalAnswers.filter((a, i) => a === questions[i]?.correctAnswer).length;
    
    const stats: Record<string, { total: number; correct: number }> = {};
    questions.forEach((q, i) => {
      const cat = q.category || 'Umumiy';
      if (!stats[cat]) stats[cat] = { total: 0, correct: 0 };
      stats[cat].total++;
      if (finalAnswers[i] === q.correctAnswer) stats[cat].correct++;
    });
    setCategoryStats(stats);

    const existingStats = JSON.parse(localStorage.getItem('nexus_category_stats') || '{}');
    Object.entries(stats).forEach(([cat, s]) => {
      if (!existingStats[cat]) existingStats[cat] = { total: 0, correct: 0 };
      existingStats[cat].total += s.total;
      existingStats[cat].correct += s.correct;
    });
    localStorage.setItem('nexus_category_stats', JSON.stringify(existingStats));

    const mistakes = questions.filter((q, i) => finalAnswers[i] !== q.correctAnswer);
    if (mistakes.length > 0) {
      const existingMistakes = JSON.parse(localStorage.getItem('nexus_mistakes') || '[]');
      const updatedMistakes = [...existingMistakes, ...mistakes.map(m => ({ ...m, timestamp: new Date().toISOString() }))].slice(-50);
      localStorage.setItem('nexus_mistakes', JSON.stringify(updatedMistakes));
    }

    const xpEarned = correctAnswers * (quizMode === 'exam' ? 65 : 50) * (isPremium ? 2 : 1);
    const coinsEarned = Math.floor(correctAnswers * 5 * (isPremium ? 2 : 1));
    
    if (coinsEarned > 0) addCoins(coinsEarned);

    setUserStats(prev => ({
      ...prev,
      xp: prev.xp + xpEarned,
      totalQuizzes: prev.totalQuizzes + 1,
      accuracy: Math.round(((prev.accuracy * prev.totalQuizzes + (correctAnswers / questions.length) * 100) / (prev.totalQuizzes + 1)))
    }));
  }, [questions, quizMode, isPremium, addCoins]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted && !showResults) {
      handleQuizComplete(answers);
    }
  }, [quizStarted, timeLeft, showResults, handleQuizComplete, answers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shareResult = () => {
    const correctAnswers = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const text = `Men Nexus AI Quiz-da ${percentage}% natija qayd etdim! 🔥\nSiz ham o'zingizni sinab ko'ring: t.me/nexus_support_bot`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://nexus-web-app.vercel.app')}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const useFiftyFifty = () => {
    if (coins < 50 || jokersUsed.fiftyFifty || quizMode === 'exam' || selectedAnswer !== null) return;
    
    spendCoins(50);
    setJokersUsed(prev => ({ ...prev, fiftyFifty: true }));
    
    const correctIdx = questions[currentQuestion].correctAnswer;
    const options = [0, 1, 2, 3];
    const incorrectOptions = options.filter(i => i !== correctIdx);
    const toDisable = incorrectOptions.sort(() => Math.random() - 0.5).slice(0, 2);
    setDisabledOptions(toDisable);
  };

  const useAIHelp = () => {
    if (coins < 100 || jokersUsed.aiHelp || quizMode === 'exam' || selectedAnswer !== null) return;
    
    spendCoins(100);
    setJokersUsed(prev => ({ ...prev, aiHelp: true }));
    setShowExplanation(true);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/20" />
        <BackgroundAudio />
        <header className="relative z-20 bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Link href="/hub" className="flex items-center gap-3 text-purple-400 hover:text-purple-300 transition-colors">
                <ArrowLeft className="w-6 h-6" />
                <span>Orqaga</span>
              </Link>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AI Learning Lab</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-400" /><span className="font-bold text-sm">{userStats.xp.toLocaleString()} XP</span></div>
              </div>
            </div>
          </div>
        </header>
        <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Brain className="w-20 h-20 mx-auto text-purple-400 mb-6" />
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Bilimingizni sinang</h2>
            <p className="text-slate-400 text-lg">AI tomonidan yaratilgan savollar orqali yangi marralarni zabt eting.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <QuantumButton onClick={() => { setQuizMode('practice'); setQuizStarted(true); }} size="lg" className="text-xl py-6 flex flex-col gap-1">
              <div className="flex items-center gap-2"><Brain className="w-6 h-6" /> Mashq rejimi</div>
              <span className="text-xs opacity-60 font-normal italic">Izohlar bilan o'rganish</span>
            </QuantumButton>
            <QuantumButton onClick={() => { setQuizMode('exam'); setQuizStarted(true); setTimeLeft(questions.length * 30); }} size="lg" variant="secondary" className="text-xl py-6 border-red-500/30 flex flex-col gap-1">
              <div className="flex items-center gap-2"><Timer className="w-6 h-6 text-red-400" /> Imtihon rejimi</div>
              <span className="text-xs opacity-60 font-normal italic">Taymer, +30% XP</span>
            </QuantumButton>
          </div>
          <div className="flex flex-col items-center gap-4">
            <QuantumButton onClick={() => generateAIQuiz()} size="lg" variant="secondary" className="w-full md:w-auto px-12 py-4 bg-violet-600/20" disabled={isGenerating}>
              {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Generatsiya...</> : <><Zap className="w-5 h-5 text-amber-400" /> Yangi AI test yaratish</>}
            </QuantumButton>
            <p className="text-xs text-slate-500">{isPremium ? "Premium: Cheksiz AI Testlar" : `${credits} AI imkoniyati qoldi`}</p>
          </div>
        </main>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    return (
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
        {percentage >= 80 && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} gravity={0.2} />}
        <BackgroundAudio />
        <header className="relative z-20 bg-slate-900/80 backdrop-blur-lg border-b border-white/5 p-4 text-center">
          <h1 className="text-xl font-bold">Natijalar</h1>
        </header>
        <main className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-12">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-4xl font-black">{percentage}%</div>
            <h2 className="text-3xl font-bold mb-2">{percentage >= 80 ? 'Ajoyib!' : percentage >= 60 ? 'Yaxshi!' : 'Yana harakat qiling!'}</h2>
            <p className="text-slate-400">{questions.length} tadan {correctAnswers} ta to'g'ri javob</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <QuantumCard className="p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> Mavzular tahlili</h3>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([cat, stat]) => {
                  const p = Math.round((stat.correct/stat.total)*100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-300"><span>{cat}</span><span>{p}%</span></div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} className={`h-full ${p < 50 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </QuantumCard>
            <QuantumCard className="p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Savollar bo'yicha</h3>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, i) => (
                  <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-sm ${answers[i] === questions[i].correctAnswer ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>{i+1}</div>
                ))}
              </div>
            </QuantumCard>
          </div>
          <div className="flex flex-col gap-3">
            <QuantumButton onClick={shareResult} variant="secondary" className="w-full py-4 text-lg">Natijani ulashish</QuantumButton>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/quiz" className="w-full"><QuantumButton variant="secondary" className="w-full py-4">Qayta yechish</QuantumButton></Link>
              <Link href="/hub" className="w-full"><QuantumButton className="w-full py-4">Asosiy sahifa</QuantumButton></Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <BackgroundAudio />
      <header className="relative z-20 bg-slate-900/80 backdrop-blur-lg border-b border-white/5 p-4">
        <div className="container mx-auto flex items-center justify-between max-w-4xl">
          <Link href="/hub" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></Link>
          <h1 className="font-bold flex items-center gap-2">
            {quizMode === 'exam' ? <Timer className="w-5 h-5 text-red-400" /> : <Brain className="w-5 h-5 text-violet-400" />}
            Savol {currentQuestion + 1} / {questions.length}
          </h1>
          <div className="flex items-center gap-2 text-amber-400 font-bold"><Clock className="w-4 h-4" />{formatTime(timeLeft)}</div>
        </div>
      </header>
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <div className="w-full bg-slate-900/40 h-2 rounded-full mb-8 border border-white/5 overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-violet-500 to-blue-500" animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
        </div>
        {quizMode === 'practice' && (
          <div className="flex gap-3 mb-6">
            <button onClick={useFiftyFifty} disabled={coins < 50 || jokersUsed.fiftyFifty || selectedAnswer !== null} className={`flex-1 p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${jokersUsed.fiftyFifty ? 'opacity-30' : 'bg-slate-900/60 border-white/5 hover:border-violet-500/30'}`}>
              <div className="flex items-center gap-2 text-xs font-black"><RotateCcw className="w-3 h-3 text-violet-400" /> 50/50</div>
              <span className="text-[10px] text-slate-500">50 tanga</span>
            </button>
            <button onClick={useAIHelp} disabled={coins < 100 || jokersUsed.aiHelp || selectedAnswer !== null} className={`flex-1 p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${jokersUsed.aiHelp ? 'opacity-30' : 'bg-slate-900/60 border-white/5 hover:border-cyan-500/30'}`}>
              <div className="flex items-center gap-2 text-xs font-black"><HelpCircle className="w-3 h-3 text-cyan-400" /> AI YORDAM</div>
              <span className="text-[10px] text-slate-500">100 tanga</span>
            </button>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <QuantumCard className="p-8">
              <div className="flex gap-2 mb-6 uppercase tracking-tighter font-black text-[10px]">
                <span className="bg-violet-500/10 text-violet-400 px-2 py-1 rounded border border-violet-500/20">{questions[currentQuestion].category}</span>
                <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">{questions[currentQuestion].difficulty}</span>
              </div>
              <h2 className="text-2xl font-bold mb-8 leading-tight">{questions[currentQuestion].question}</h2>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, i) => {
                  const isCorrect = i === questions[currentQuestion].correctAnswer;
                  const isSelected = i === selectedAnswer;
                  const showResult = selectedAnswer !== null || (quizMode === 'practice' && showExplanation);
                  const isDisabled = disabledOptions.includes(i);
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={showResult || isDisabled} className={`w-full p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${isDisabled ? 'opacity-10 cursor-not-allowed' : showResult ? (isCorrect ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : isSelected ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-slate-900/40 border-white/5 opacity-40') : 'bg-slate-900/40 border-white/5 hover:bg-slate-900/60 hover:border-white/10 active:scale-[0.99]'}`}>
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${showResult ? (isCorrect ? 'bg-emerald-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-600') : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>{showResult && isCorrect ? '✓' : showResult && isSelected ? '✗' : String.fromCharCode(65 + i)}</span>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {showExplanation && questions[currentQuestion].explanation && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-8 p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0"><Info className="w-5 h-5 text-blue-400" /></div>
                  <div><h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Nega?</h4><p className="text-sm text-blue-200/80 leading-relaxed italic">{questions[currentQuestion].explanation}</p></div>
                </motion.div>
              )}
            </QuantumCard>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

import { Loader2, HelpCircle, Info } from 'lucide-react';

