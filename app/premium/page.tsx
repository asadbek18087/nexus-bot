"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Crown, Check, Zap, Star, Shield, Lock, ArrowRight } from 'lucide-react';
import { QuantumButton, QuantumCard } from '@/components/quantum-effects';
import { motion } from 'framer-motion';
import SuperAppLayout from '@/components/SuperAppLayout';
import { useEconomyStore } from '@/stores/economyStore';

export default function PremiumPage() {
  const router = useRouter();
  const { isPremium, setPremium } = useEconomyStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [showTrialSuccess, setShowTrialSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const features = [
    "Unlimited AI Quiz Generations",
    "Access to Exclusive Books & Movies",
    "Ad-free Experience",
    "Premium Profile Badge",
    "2x XP & Gold Earnings",
    "Priority Support"
  ];

  const handleTrialActivate = () => {
    // Simulate activation
    localStorage.setItem('nexus_trial_active', 'true');
    localStorage.setItem('nexus_trial_expiry', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()); // 3 days
    
    setShowTrialSuccess(true);
    setTimeout(() => {
      router.push('/game');
    }, 2000);
  };

  const handleSubscribe = () => {
    // Redirect to @polway_bot for payment processing
    window.open('https://t.me/polway_bot?start=premium_payment', '_blank');
  };

  if (isPremium) {
    return (
      <SuperAppLayout>
        <div className="min-h-screen p-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                You&apos;re Premium!
              </h1>
              <p className="text-slate-400 mb-8">
                Enjoy all the exclusive benefits and features
              </p>
              <QuantumButton onClick={() => router.push('/game')} className="mx-auto">
                Back to App
              </QuantumButton>
            </motion.div>
          </div>
        </div>
      </SuperAppLayout>
    );
  }

  return (
    <SuperAppLayout>
      <div className="min-h-screen bg-slate-950 p-4 pb-20 md:pb-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center gap-4 mb-8 pt-4">
        <QuantumButton onClick={() => router.back()} size="sm" variant="secondary">
          <ChevronLeft className="w-5 h-5" />
        </QuantumButton>
        <h1 className="text-2xl font-bold text-white">Premium Access</h1>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Value Proposition */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              Unlock the Full Power of Nexus
            </h2>
            <p className="text-slate-400 text-lg">
              Join the elite operatives and gain access to advanced neural tools, unlimited resources, and exclusive content.
            </p>
          </motion.div>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800"
              >
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="text-slate-200">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-500 blur-3xl opacity-20" />
          <QuantumCard glowColor="gold" className="relative p-8 h-full flex flex-col">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Crown className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex bg-slate-800 p-1 rounded-full mb-6">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedPlan === 'monthly' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedPlan === 'yearly' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Yearly (-20%)
                </button>
              </div>

              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl font-bold text-white">
                  {selectedPlan === 'monthly' ? '24,990' : '249,900'}
                </span>
                <span className="text-slate-400">UZS</span>
              </div>
              <p className="text-slate-500 text-sm">
                {selectedPlan === 'monthly' ? 'per month' : 'per year'}
              </p>
            </div>

            <div className="mt-auto space-y-4">
              <QuantumButton 
                onClick={handleSubscribe}
                disabled={processing}
                className="w-full justify-center py-4 text-lg"
              >
                {processing ? 'Processing...' : (
                  <>
                    Upgrade Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </QuantumButton>
              
              <div className="relative pt-4 border-t border-slate-800">
                <p className="text-center text-xs text-slate-400 mb-3">
                  New user? Try before you buy.
                </p>
                <button
                  onClick={handleTrialActivate}
                  disabled={showTrialSuccess}
                  className="w-full py-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 font-medium hover:bg-yellow-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {showTrialSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Trial Activated!
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" /> Activate 3-Day Free Trial
                    </>
                  )}
                </button>
              </div>
            </div>
          </QuantumCard>
        </div>
      </div>
      </div>
    </SuperAppLayout>
  );
}
