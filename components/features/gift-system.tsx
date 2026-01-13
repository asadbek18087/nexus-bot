"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Send, User, Coins, CheckCircle } from 'lucide-react';
import { QuantumButton, QuantumCard } from '../quantum-effects';

export default function GiftSystem() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const friends = [
    { id: '1', name: 'Alex', status: 'online' },
    { id: '2', name: 'Sarah', status: 'offline' },
    { id: '3', name: 'Mike', status: 'playing' },
  ];

  const gifts = [
    { id: 'xp_boost', name: 'XP Boost (1h)', cost: 50, icon: '⚡' },
    { id: 'premium_day', name: 'Premium (1 Day)', cost: 100, icon: '👑' },
    { id: 'mystery_box', name: 'Mystery Box', cost: 75, icon: '🎁' },
  ];

  const handleSend = () => {
    if (!selectedFriend || !selectedGift) return;
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setShowModal(false);
        setSelectedFriend(null);
        setSelectedGift(null);
      }, 2000);
    }, 1500);
  };

  return (
    <>
      <QuantumButton onClick={() => setShowModal(true)} variant="secondary" size="sm">
        <Gift className="w-4 h-4 mr-2" /> Send Gift
      </QuantumButton>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <QuantumCard className="max-w-md w-full relative p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Gift className="w-6 h-6 text-pink-500" />
                Send a Gift
              </h3>

              {!sentSuccess ? (
                <div className="space-y-6">
                  {/* Select Friend */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Select Friend</label>
                    <div className="grid grid-cols-3 gap-2">
                      {friends.map((friend) => (
                        <button
                          key={friend.id}
                          onClick={() => setSelectedFriend(friend.id)}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                            selectedFriend === friend.id
                              ? 'bg-blue-600/20 border-blue-500 text-white'
                              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium">{friend.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Gift */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Select Gift</label>
                    <div className="space-y-2">
                      {gifts.map((gift) => (
                        <button
                          key={gift.id}
                          onClick={() => setSelectedGift(gift.id)}
                          className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                            selectedGift === gift.id
                              ? 'bg-purple-600/20 border-purple-500 text-white'
                              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{gift.icon}</span>
                            <span className="font-medium">{gift.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                            <Coins className="w-3 h-3" />
                            {gift.cost}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <QuantumButton 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </QuantumButton>
                    <QuantumButton 
                      variant="primary" 
                      className="flex-1"
                      disabled={!selectedFriend || !selectedGift || isSending}
                      onClick={handleSend}
                    >
                      {isSending ? 'Sending...' : 'Send Gift'} <Send className="w-4 h-4 ml-2" />
                    </QuantumButton>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Gift Sent!</h4>
                  <p className="text-slate-400 text-sm">Your friend will receive it shortly.</p>
                </motion.div>
              )}
            </QuantumCard>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
