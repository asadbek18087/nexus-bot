'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Crown, 
  Star, 
  Zap, 
  Trophy, 
  Shield, 
  Gift, 
  Users,
  ArrowRight,
  Headphones,
  BookOpen,
  Sword,
  Gem
} from 'lucide-react';
import { QuantumButton, QuantumCard, QuantumBackground, FloatingParticles } from '@/components/quantum-effects';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  dailyPrice: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  color: 'purple' | 'blue' | 'green' | 'gold' | 'red';
  popular: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Kunlik',
    price: '7,900',
    period: '/kun',
    dailyPrice: '7,900',
    description: 'Bir kunlik sinov',
    icon: Star,
    features: [
      'Asosiy mining operatsiyalari',
      '30 XP kunlik bonus',
      '5 ta test har kuni',
      'Bepul content ga kirish',
      'Oddiy leaderboard',
      'Jamiyat yordami',
      'Kunlik 3 ta kitob yuklab olish',
      'Kunlik 5 ta film ko\'rish',
      '⚡ Tezkor yordam'
    ],
    color: 'blue',
    popular: false
  },
  {
    name: '3 Kunlik',
    price: '17,990',
    period: '/3 kun',
    dailyPrice: '5,997',
    description: 'Qisqa muddatli',
    icon: Zap,
    features: [
      'Advanced mining (1.5x tezlik)',
      '100 XP kunlik bonus',
      '10 ta test har kuni',
      'Premium content kirishi',
      'Advanced leaderboard',
      'Prioritet yordam',
      'Har kuni 7 ta kitob',
      'Har kuni 15 ta film',
      'Battle arena kirishi',
      '🧠 AI test generator (5 ta)',
      '🎯 Personal recommendations'
    ],
    color: 'purple',
    popular: true
  },
  {
    name: 'Haftalik',
    price: '39,900',
    period: '/hafta',
    dailyPrice: '5,700',
    description: 'Eng yaxshi tanlov',
    icon: Crown,
    features: [
      'Ultimate mining (2x tezlik)',
      '200 XP kunlik bonus',
      'Cheksiz testlar',
      'VIP content library',
      'Top leaderboard joylashuvi',
      '24/7 alohida yordam',
      'Cheksiz kitoblar',
      'Cheksiz filmlar',
      'Exclusive battle rejimlari',
      'Referral bonus: 50%',
      '🎓 Kurslar va treninglar',
      '🎮 Gaming tournaments',
      '👑 Exclusive avatar va frame',
      '� Streak multiplier 2x',
      '🧠 AI test generator (cheksiz)',
      '🌟 Early access barcha yangiliklar'
    ],
    color: 'gold',
    popular: false
  },
  {
    name: 'Oylik',
    price: '69,900',
    period: '/oy',
    dailyPrice: '2,330',
    description: 'Uzoq muddatli',
    icon: Trophy,
    features: [
      'Ultimate mining (3x tezlik)',
      '500 XP kunlik bonus',
      'Cheksiz hamma narsa',
      'VIP content library',
      'Top leaderboard joylashuvi',
      '24/7 alohida yordam',
      'Cheksiz kitoblar',
      'Cheksiz filmlar',
      'Exclusive battle rejimlari',
      'Referral bonus: 75%',
      '🎓 Barcha kurslar va treninglar',
      '🎮 Gaming tournaments',
      '👑 Exclusive avatar va frame',
      '🔥 Streak multiplier 3x',
      '📊 Advanced analytics',
      '🎯 Custom content requests',
      '🌟 Early access barcha yangiliklar',
      '💎 Gold mining bonus',
      '🧠 AI test generator (cheksiz)',
      '⚡ Offline rejim'
    ],
    color: 'green',
    popular: false
  }
];

const additionalFeatures = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Encrypted transactions and data protection'
  },
  {
    icon: Gift,
    title: 'Loyalty Rewards',
    description: 'Earn bonuses for long-term membership'
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Join exclusive Discord and Telegram groups'
  },
  {
    icon: Trophy,
    title: 'Achievement System',
    description: 'Unlock special rewards and recognition'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      <QuantumBackground />
      <FloatingParticles count={20} />
      
      {/* Header */}
      <header className="relative z-10 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4"
            >
              Choose Your Plan
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-300"
            >
              Unlock the full potential of Nexus Quantum Apex
            </motion.p>
          </div>
        </div>
      </header>

      {/* Pricing Cards */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <QuantumCard 
                glowColor={plan.color}
                className={`relative h-full ${
                  plan.popular 
                    ? 'border-2 border-purple-500/50 scale-105 shadow-2xl' 
                    : ''
                }`}
              >
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${
                    plan.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    plan.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    'from-yellow-500 to-yellow-600'
                  } rounded-full flex items-center justify-center`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-slate-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-slate-400 ml-2">{plan.period}</span>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-sm text-green-400 font-medium">
                      💰 Kunlik: {plan.dailyPrice} so&apos;m
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <QuantumButton 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                      : ''
                  }`}
                  onClick={() => {
                    // Handle plan selection
                    console.log(`Selected ${plan.name} plan`);
                  }}
                >
                  {plan.popular ? 'Start Free Trial' : 'Choose Plan'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </QuantumButton>
              </QuantumCard>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Nexus Quantum Apex?</h2>
            <p className="text-xl text-slate-300">Premium features that make the difference</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <QuantumCard>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </QuantumCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-20"
        >
          <QuantumCard>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-300">Everything you need to know about our pricing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I change my plan anytime?</h3>
                <p className="text-slate-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-slate-400">We offer a 7-day money-back guarantee for all new subscriptions.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-slate-400">We accept credit cards, PayPal, and cryptocurrency payments.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-slate-400">Yes, Pro plan comes with a 14-day free trial. No credit card required.</p>
              </div>
            </div>
          </QuantumCard>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-20 text-center"
        >
          <QuantumCard glowColor="purple">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of players already enjoying Nexus Quantum Apex
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <QuantumButton size="lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </QuantumButton>
                <QuantumButton variant="secondary" size="lg">
                  View Demo
                </QuantumButton>
              </div>
            </div>
          </QuantumCard>
        </motion.div>
      </main>
    </div>
  );
}
