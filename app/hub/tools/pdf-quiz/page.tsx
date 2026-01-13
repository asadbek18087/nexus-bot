"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileUp, Shield, Zap, CheckCircle2, Loader2, AlertCircle, ChevronRight, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';
import { QuantumCard, QuantumButton } from '@/components/quantum-effects';
import { useEconomyStore } from '@/stores/economyStore';
import { useQuizStore } from '@/stores/quizStore';

export default function PdfQuizPage() {
  const router = useRouter();
  const { coins, spendCoins } = useEconomyStore();
  const { setQuestions, setMode, setTopic } = useQuizStore();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<'upload' | 'processing' | 'ready'>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startProcessing = async () => {
    if (!file || coins < 50) return;
    
    setIsUploading(true);
    setStep('processing');
    
    try {
      // In a real app, we would upload the PDF and get questions back
      // For now, we'll simulate a successful extraction after 3s
      setTimeout(() => {
        const mockQuestions = [
          {
            id: 'pdf_1',
            question: "PDF tahlili natijasida: Sun'iy intellektning asosiy maqsadi nima?",
            options: ["Inson ongini nusxalash", "Muammolarni aqlli hal qilish", "Robotlar yasash", "O'yinlar o'ynash"],
            correctAnswer: 1,
            explanation: "To'g'ri javob - Muammolarni aqlli hal qilish. AI inson intellektini simulyatsiya qilib, murakkab vazifalarni bajarish uchun mo'ljallangan.",
            category: "PDF Tahlili",
            difficulty: "medium"
          }
        ];
        
        spendCoins(50);
        setQuestions(mockQuestions as any);
        setTopic(file.name);
        setMode('practice');
        setIsUploading(false);
        setStep('ready');
      }, 3000);
    } catch (e) {
      alert("Xatolik yuz berdi.");
      setStep('upload');
    }
  };

  return (
    <SuperAppLayout>
      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-50">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">PDF dan Test</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 py-8">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                    <FileUp className="w-10 h-10 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">PDF yuklang</h2>
                  <p className="text-slate-400">Har qanday o'quv qo'llanma yoki kitobni interaktiv testga aylantiring.</p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium">Narxi: 50 tanga</span>
                  </div>
                  <span className={`text-xs ${coins < 50 ? 'text-red-400' : 'text-slate-500'}`}>
                    Sizda: {coins} tanga
                  </span>
                </div>

                <QuantumCard className="p-8 border-dashed border-2 border-slate-700 hover:border-blue-500/50 transition-all group relative">
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FileUp className="w-8 h-8 text-slate-400" />
                    </div>
                    <span className="text-lg font-medium text-slate-300 text-center">
                      {file ? file.name : 'Faylni tanlang yoki shu yerga tashlang'}
                    </span>
                    <span className="text-sm text-slate-500 mt-2">Maksimal hajm: 20MB</span>
                  </label>
                </QuantumCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex gap-3">
                    <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold">Xavfsiz va Maxfiy</h4>
                      <p className="text-xs text-slate-500">Sizning fayllaringiz faqat test yaratish uchun ishlatiladi.</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex gap-3">
                    <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold">Tezkor Generatsiya</h4>
                      <p className="text-xs text-slate-500">AI bir necha soniya ichida murakkab testlarni tayyorlaydi.</p>
                    </div>
                  </div>
                </div>

                <QuantumButton 
                  disabled={!file || coins < 50} 
                  className="w-full py-4 text-lg mt-8 shadow-lg shadow-blue-500/20"
                  onClick={startProcessing}
                >
                  {coins < 50 ? 'Tanga yetarli emas' : 'Test yaratishni boshlash'}
                </QuantumButton>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  <FileUp className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Tahlil qilinmoqda...</h2>
                <p className="text-slate-400 max-w-xs mx-auto">
                  AI PDF faylni o'qib chiqmoqda va eng muhim savollarni saralamoqda.
                </p>
              </motion.div>
            )}

            {step === 'ready' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Tayyor!</h2>
                <p className="text-slate-400">PDF asosida 15 ta test savoli muvaffaqiyatli yaratildi.</p>
                
                <QuantumCard className="p-6 text-left space-y-4 mt-8">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-slate-400 text-sm">Fayl:</span>
                    <span className="text-slate-200 font-medium truncate max-w-[200px] text-sm">{file?.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-slate-400 text-sm">Savollar soni:</span>
                    <span className="text-slate-200 font-medium text-sm">15 ta</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Qiyinlik:</span>
                    <span className="text-blue-400 font-medium uppercase tracking-wider text-xs italic">O'rtacha</span>
                  </div>
                </QuantumCard>

                <div className="flex gap-4 mt-8">
                  <QuantumButton 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => setStep('upload')}
                  >
                    Qayta yuklash
                  </QuantumButton>
                  <QuantumButton 
                    className="flex-1"
                    onClick={() => router.push('/quiz')}
                  >
                    Boshlash
                  </QuantumButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SuperAppLayout>
  );
}

