"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface QuizQuestion {
  id: number;
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
  
  // Jokers state
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

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      explanation: "To'g'ri javob - Paris. Fransiya poytaxti 987-yildan beri Paris shahridir. London - Buyuk Britaniya, Berlin - Germaniya, Madrid - Ispaniya poytaxtlari.",
      category: "Geography",
      difficulty: "easy"
    },
    // ... initial questions
  ]);

  const generateAIQuiz = async (topic: string = 'General Science') => {
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

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    // Haptic feedback for answer
    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
      window.navigator.vibrate(50);
    }
    
    // In Exam Mode, we don't show explanation or results immediately
    if (quizMode === 'practice') {
      setShowExplanation(true);
    }
    
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + (quizMode === 'exam' ? 30 : 20)); // Exam mode gives more points
    }

    const waitTime = quizMode === 'practice' ? 3000 : 500;

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setDisabledOptions([]); // Reset 50/50 for next question
      } else {
        handleQuizComplete();
      }
    }, waitTime);
  };

  const useFiftyFifty = () => {
    if (coins < 50 || jokersUsed.fiftyFifty || quizMode === 'exam') return;
    
    spendCoins(50);
    setJokersUsed(prev => ({ ...prev, fiftyFifty: true }));
    
    const correctIdx = questions[currentQuestion].correctAnswer;
    const options = [0, 1, 2, 3];
    const incorrectOptions = options.filter(i => i !== correctIdx);
    
    // Pick 2 random incorrect options to disable
    const toDisable = incorrectOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    setDisabledOptions(toDisable);
  };

  const useAIHelp = () => {
    if (coins < 100 || jokersUsed.aiHelp || quizMode === 'exam') return;
    
    spendCoins(100);
    setJokersUsed(prev => ({ ...prev, aiHelp: true }));
    
    // AI highlights the correct answer or gives a strong hint
    // For now, we'll just show the explanation early
    setShowExplanation(true);
  };

  const handleQuizComplete = useCallback(() => {
    setShowResults(true);
    const correctAnswers = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
    
    // Calculate category stats (Weakness Tracker)
    const stats: Record<string, { total: number; correct: number }> = {};
    questions.forEach((q, i) => {
      const cat = q.category || 'General';
      if (!stats[cat]) stats[cat] = { total: 0, correct: 0 };
      stats[cat].total++;
      if (answers[i] === q.correctAnswer) stats[cat].correct++;
    });
    setCategoryStats(stats);

    // Save to global weakness tracker
    const existingStats = JSON.parse(localStorage.getItem('nexus_category_stats') || '{}');
    Object.entries(stats).forEach(([cat, s]) => {
      if (!existingStats[cat]) existingStats[cat] = { total: 0, correct: 0 };
      existingStats[cat].total += s.total;
      existingStats[cat].correct += s.correct;
    });
    localStorage.setItem('nexus_category_stats', JSON.stringify(existingStats));

    // Save mistakes for review
    const mistakes = questions.filter((q, i) => answers[i] !== q.correctAnswer);
    if (mistakes.length > 0) {
      const existingMistakes = JSON.parse(localStorage.getItem('nexus_mistakes') || '[]');
      const updatedMistakes = [...existingMistakes, ...mistakes].slice(-50); // Keep last 50
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
  }, [answers, questions, quizMode]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleQuizComplete();
    }
  }, [quizStarted, timeLeft, showResults, handleQuizComplete]);

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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/20" />
        <div className="absolute inset-0">
          {mounted && Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
        </div>

        {/* Audio and Visual Effects */}
        <BackgroundAudio />

        {/* Header */}
        <header className="relative z-20 bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 text-purple-400 hover:text-purple-300 transition-colors">
                <ArrowLeft className="w-6 h-6" />
                <span>Back to Home</span>
              </Link>
              
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI Learning Lab
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold">{userStats.xp.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <span className="font-bold">{userStats.totalQuizzes} Quizzes</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <Brain className="w-20 h-20 mx-auto text-purple-400 mb-6" />
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Test Your Knowledge
              </h2>
              <p className="text-slate-400 text-lg">
                Challenge yourself with AI-generated questions across various topics
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <QuantumCard glowColor="purple" className="p-6 text-center">
                <h3 className="text-3xl font-bold text-purple-400 mb-2">{questions.length}</h3>
                <p className="text-slate-400">Questions</p>
              </QuantumCard>
              <QuantumCard glowColor="blue" className="p-6 text-center">
                <h3 className="text-3xl font-bold text-blue-400 mb-2">5 min</h3>
                <p className="text-slate-400">Time Limit</p>
              </QuantumCard>
              <QuantumCard glowColor="green" className="p-6 text-center">
                <h3 className="text-3xl font-bold text-green-400 mb-2">{userStats.accuracy}%</h3>
                <p className="text-slate-400">Your Accuracy</p>
              </QuantumCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuantumButton 
                onClick={() => {
                  setQuizMode('practice');
                  setQuizStarted(true);
                }}
                size="lg"
                className="text-xl px-12 py-4 flex flex-col items-center gap-1"
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Practice Mode
                </div>
                <span className="text-xs opacity-60 font-normal italic">Learn with explanations</span>
              </QuantumButton>

              <QuantumButton 
                onClick={() => {
                  setQuizMode('exam');
                  setQuizStarted(true);
                  setTimeLeft(180); // 3 minutes for exam
                }}
                size="lg"
                variant="secondary"
                className="text-xl px-12 py-4 border-red-500/30 hover:border-red-500/60 flex flex-col items-center gap-1"
              >
                <div className="flex items-center gap-2">
                  <Timer className="w-6 h-6 text-red-400" />
                  Exam Mode
                </div>
                <span className="text-xs opacity-60 font-normal italic">Timer, no hints, +30% XP</span>
              </QuantumButton>
            </div>
            
            <div className="flex flex-col items-center gap-4 mt-4">
              <QuantumButton 
                onClick={generateAIQuiz}
                size="lg"
                variant="secondary"
                className="text-xl px-12 py-4 w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600/20 to-cyan-600/20"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    AI generatsiya qilmoqda...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-amber-400" />
                    AI bilan yangi test yaratish
                  </>
                )}
              </QuantumButton>
              <p className="text-sm text-slate-400">
                {isPremium ? "Premium: Cheksiz AI Testlar" : `${credits} AI Credits qoldi bugun`}
              </p>
            </div>
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
        {percentage >= 80 && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
          />
        )}
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/20" />
        <BackgroundAudio />

        {/* Header */}
        <header className="relative z-20 bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/quiz" className="flex items-center gap-3 text-purple-400 hover:text-purple-300 transition-colors">
                <ArrowLeft className="w-6 h-6" />
                <span>Back to Quiz</span>
              </Link>
              
              <h1 className="text-2xl font-bold">Quiz Results</h1>
              
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">{correctAnswers}/{questions.length}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Results */}
        <main className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-8"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-4xl font-bold">{percentage}%</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
              </h2>
              <p className="text-slate-400">
                You got {correctAnswers} out of {questions.length} questions correct
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <QuantumCard glowColor="purple" className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Zaif nuqtalar tahlili
                </h3>
                <div className="space-y-4">
                  {Object.entries(categoryStats).map(([cat, stat]) => {
                    const perc = Math.round((stat.correct / stat.total) * 100);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">{cat}</span>
                          <span className={perc < 50 ? 'text-red-400' : perc < 80 ? 'text-yellow-400' : 'text-green-400'}>
                            {perc}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${perc}%` }}
                            className={`h-full ${perc < 50 ? 'bg-red-500' : perc < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          />
                        </div>
                        {perc < 50 && (
                          <p className="text-[10px] text-red-400/80 italic">Ushbu mavzuda ko'proq ishlash kerak!</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </QuantumCard>

              <QuantumCard glowColor="blue" className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-blue-400" />
                  Xatolarni ko'rish
                </h3>
                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-white/5">
                      <div className="flex items-center gap-3">
                        {answers[i] === q.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="text-sm font-medium">Savol {i + 1}</span>
                      </div>
                      <span className="text-xs text-slate-500">{q.category}</span>
                    </div>
                  ))}
                </div>
              </QuantumCard>
            </div>

            <div className="flex gap-4">
              <QuantumButton variant="secondary" className="flex-1" onClick={shareResult}>
                Natijani ulashish
              </QuantumButton>
              <Link href="/quiz" className="flex-1">
                <QuantumButton variant="secondary" className="w-full">
                  Try Again
                </QuantumButton>
              </Link>
              <Link href="/" className="flex-1">
                <QuantumButton className="w-full">
                  Back to Home
                </QuantumButton>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/20" />
      <BackgroundAudio />

      {/* Header */}
      <header className="relative z-20 bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/quiz" className="flex items-center gap-3 text-purple-400 hover:text-purple-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
              <span>Exit Quiz</span>
            </Link>
            
            <h1 className="text-xl font-bold flex items-center gap-2">
              {quizMode === 'exam' ? <Timer className="w-5 h-5 text-red-400" /> : <Brain className="w-5 h-5 text-violet-400" />}
              {quizMode === 'exam' ? 'Exam Mode' : 'Practice Mode'} - {currentQuestion + 1}/{questions.length}
            </h1>
            
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-slate-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Jokers - Only in Practice Mode */}
          {quizMode === 'practice' && (
            <div className="flex gap-4 mb-6">
              <button
                onClick={useFiftyFifty}
                disabled={coins < 50 || jokersUsed.fiftyFifty || selectedAnswer !== null}
                className={`flex-1 p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  jokersUsed.fiftyFifty 
                    ? 'bg-slate-800/20 border-slate-700/50 opacity-50 cursor-not-allowed' 
                    : 'bg-slate-800/40 border-white/10 hover:border-violet-500/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-violet-400" />
                  <span className="font-bold text-sm">50/50</span>
                </div>
                <span className="text-[10px] text-slate-400">50 tanga</span>
              </button>

              <button
                onClick={useAIHelp}
                disabled={coins < 100 || jokersUsed.aiHelp || selectedAnswer !== null}
                className={`flex-1 p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  jokersUsed.aiHelp 
                    ? 'bg-slate-800/20 border-slate-700/50 opacity-50 cursor-not-allowed' 
                    : 'bg-slate-800/40 border-white/10 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-sm">AI Yordam</span>
                </div>
                <span className="text-[10px] text-slate-400">100 tanga</span>
              </button>
            </div>
          )}

          {/* Question */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <QuantumCard glowColor="purple" className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">
                  {questions[currentQuestion].category}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                  {questions[currentQuestion].difficulty}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-6">
                {questions[currentQuestion].question}
              </h2>
              
              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, i) => {
                  const isCorrect = i === questions[currentQuestion].correctAnswer;
                  const isSelected = i === selectedAnswer;
                  const showResult = selectedAnswer !== null || (quizMode === 'practice' && showExplanation);
                  const isDisabled = disabledOptions.includes(i);
                  
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: (showResult || isDisabled) ? 1 : 1.02 }}
                      whileTap={{ scale: (showResult || isDisabled) ? 1 : 0.98 }}
                      onClick={() => !(showResult || isDisabled) && handleAnswer(i)}
                      disabled={showResult || isDisabled}
                      className={`w-full p-4 rounded-xl border transition-all text-left ${
                        isDisabled ? 'opacity-20 cursor-not-allowed grayscale' :
                        showResult
                          ? isCorrect
                            ? 'bg-green-500/20 border-green-500/50'
                            : isSelected
                            ? 'bg-red-500/20 border-red-500/50'
                            : 'bg-slate-800/30 border-slate-700/50'
                          : 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700 hover:border-purple-500/50'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          showResult
                            ? isCorrect
                              ? 'bg-green-500 text-white'
                              : isSelected
                              ? 'bg-red-500 text-white'
                              : 'bg-slate-700 text-slate-400'
                            : 'bg-slate-700'
                        }`}>
                          {showResult && isCorrect ? '✓' : showResult && isSelected ? '✗' : String.fromCharCode(65 + i)}
                        </span>
                        <span className={showResult && isCorrect ? 'text-green-400' : showResult && isSelected ? 'text-red-400' : ''}>
                          {option}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Explanation */}
              {showExplanation && questions[currentQuestion].explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">Nega?</span>
                    <p className="text-sm text-blue-300">
                      {questions[currentQuestion].explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </QuantumCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
