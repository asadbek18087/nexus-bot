"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Trophy, Zap, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import AIQuizGenerator from '@/components/ai-quiz-generator';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';
import BackgroundAudio from '@/components/background-audio';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [credits, setCredits] = useState(5); // Daily limits from bot
  const [isGenerating, setIsGenerating] = useState(false);
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
      category: "Geography",
      difficulty: "easy"
    },
    // ... initial questions
  ]);

  const generateAIQuiz = () => {
    if (credits <= 0) {
      alert("No credits left today! Upgrade to Premium for unlimited quizzes.");
      return;
    }
    
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setQuestions([
        {
          id: 101,
          question: "Which quantum particle is responsible for electromagnetic force?",
          options: ["Gluon", "Photon", "Higgs Boson", "Graviton"],
          correctAnswer: 1,
          category: "Quantum Physics",
          difficulty: "hard"
        },
        {
          id: 102,
          question: "Who coined the term 'Artificial Intelligence'?",
          options: ["Alan Turing", "John McCarthy", "Marvin Minsky", "Elon Musk"],
          correctAnswer: 1,
          category: "AI History",
          difficulty: "medium"
        },
        {
          id: 103,
          question: "What is the speed of light in vacuum?",
          options: ["299,792 km/s", "300,000 km/s", "150,000 km/s", "Unlimited"],
          correctAnswer: 0,
          category: "Physics",
          difficulty: "medium"
        }
      ]);
      setCredits(prev => prev - 1);
      setIsGenerating(false);
      setQuizStarted(true);
    }, 2000);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 20);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = useCallback(() => {
    setShowResults(true);
    const correctAnswers = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
    const xpEarned = correctAnswers * 50;
    setUserStats(prev => ({
      ...prev,
      xp: prev.xp + xpEarned,
      totalQuizzes: prev.totalQuizzes + 1,
      accuracy: Math.round(((prev.accuracy * prev.totalQuizzes + (correctAnswers / questions.length) * 100) / (prev.totalQuizzes + 1)))
    }));
  }, [answers, questions]);

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

            <div className="text-center flex flex-col gap-4">
              <QuantumButton 
                onClick={() => setQuizStarted(true)}
                size="lg"
                className="text-xl px-12 py-4 w-full md:w-auto"
              >
                Start Classic Quiz
              </QuantumButton>
              
              <div className="flex flex-col items-center gap-2">
                <QuantumButton 
                  onClick={generateAIQuiz}
                  size="lg"
                  variant="secondary"
                  className="text-xl px-12 py-4 w-full md:w-auto flex items-center justify-center gap-2"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate with AI
                    </>
                  )}
                </QuantumButton>
                <p className="text-sm text-slate-400">
                  {credits} AI Credits remaining today
                </p>
              </div>
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

            <QuantumCard glowColor="purple" className="p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Review Your Answers</h3>
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      {answers[i] === q.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-sm">Question {i + 1}</span>
                    </div>
                    <span className="text-xs text-slate-400">{q.category}</span>
                  </div>
                ))}
              </div>
            </QuantumCard>

            <div className="flex gap-4">
              <Link href="/quiz">
                <QuantumButton variant="secondary" className="flex-1">
                  Try Again
                </QuantumButton>
              </Link>
              <Link href="/">
                <QuantumButton className="flex-1">
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
            
            <h1 className="text-xl font-bold">Question {currentQuestion + 1} of {questions.length}</h1>
            
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
                {questions[currentQuestion].options.map((option, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(i)}
                    className="w-full p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 hover:border-purple-500/50 transition-all text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </span>
                  </motion.button>
                ))}
              </div>
            </QuantumCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
