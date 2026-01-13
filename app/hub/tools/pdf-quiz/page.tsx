"use client";

import { useState } from 'react';
import SuperAppLayout from '@/components/SuperAppLayout';
import { useSecureEconomyStore } from '@/stores/secureEconomyStore';
import { motion } from 'framer-motion';
import { Upload, FileText, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { spendCoins } from '@/actions/economy';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function PDFQuizPage() {
  const { coins, refreshBalance } = useSecureEconomyStore();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      if (uploadedFile) {
        setFile(uploadedFile);
        setQuiz([]);
        setCurrentQuestion(0);
        setScore(0);
        setShowResults(false);
        setSelectedAnswers([]);
      }
    }
  });

  const generateQuiz = async () => {
    if (!file || coins < 10) return;

    setProcessing(true);
    
    try {
      // Extract text from PDF (in real app, use pdf-parse)
      const text = "Sample PDF text content";
      
      // Call API to generate quiz
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          telegramId: "123456789" // Convert to string for JSON
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQuiz(data.questions);
        await refreshBalance("123456789"); // Refresh balance after spending
      }
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (answerIndex === quiz[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswers([]);
  };

  return (
    <SuperAppLayout>
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              PDF to Quiz Converter
            </h1>
            <p className="text-slate-400">Upload a PDF and generate an interactive quiz</p>
          </div>

          {/* Coins Status */}
          <div className="flex items-center gap-2 mb-6 p-3 bg-slate-800/50 rounded-lg border border-violet-500/20">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm">Coins: {coins}</span>
            {coins < 10 && (
              <span className="text-xs text-red-400 ml-auto">Not enough coins (requires 10)</span>
            )}
          </div>

          {/* Upload Section */}
          {!quiz.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div {...getRootProps()}
                className="border-2 border-dashed border-violet-500/30 rounded-xl p-8 text-center cursor-pointer hover:border-violet-400/50 transition-colors bg-slate-800/30"
              >
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="w-12 h-12 text-violet-400" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateQuiz();
                      }}
                      disabled={processing || coins < 10}
                      className="px-6 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Processing...' : 'Generate Quiz'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-12 h-12 text-slate-400" />
                    <div>
                      <p className="font-medium mb-1">Click to upload PDF</p>
                      <p className="text-slate-400 text-sm">Maximum file size: 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              <input {...getInputProps()} />
            </motion.div>
          )}

          {/* Processing State */}
          {processing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 rounded-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5 text-yellow-400" />
                </motion.div>
                <span>Processing PDF and generating quiz...</span>
              </div>
            </motion.div>
          )}

          {/* Quiz Section */}
          {quiz.length > 0 && !showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-slate-400">
                  Question {currentQuestion + 1} of {quiz.length}
                </span>
                <span className="text-sm font-medium">
                  Score: {score}/{currentQuestion}
                </span>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {quiz[currentQuestion].question}
                </h3>

                <div className="space-y-3">
                  {quiz[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="w-full text-left p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-slate-600/50 hover:border-violet-500/50"
                    >
                      <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-6">
                {score >= quiz.length * 0.8 ? (
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                ) : (
                  <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                )}
                <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
                <p className="text-3xl font-bold text-cyan-400">
                  {score}/{quiz.length}
                </p>
                <p className="text-slate-400">
                  {score >= quiz.length * 0.8 ? 'Excellent work!' : 'Good effort!'}
                </p>
              </div>

              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Try Another Quiz
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </SuperAppLayout>
  );
}
