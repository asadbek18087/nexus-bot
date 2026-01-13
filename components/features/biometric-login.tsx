"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Fingerprint, Lock, Unlock } from 'lucide-react';

interface BiometricLoginProps {
  onAuthenticated: () => void;
}

export default function BiometricLogin({ onAuthenticated }: BiometricLoginProps) {
  const [scanning, setScanning] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setAuthenticated(true);
      setTimeout(onAuthenticated, 1000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-6">
      <AnimatePresence>
        {!authenticated ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
              <button 
                onClick={startScan}
                className="relative w-24 h-24 bg-slate-900 border-2 border-blue-500/50 rounded-full flex items-center justify-center overflow-hidden group"
              >
                <Fingerprint className={`w-12 h-12 text-blue-400 transition-all duration-500 ${scanning ? 'scale-110 opacity-50' : 'group-hover:scale-105'}`} />
                
                {scanning && (
                  <motion.div 
                    className="absolute inset-0 bg-blue-500/20"
                    initial={{ y: "100%" }}
                    animate={{ y: ["100%", "-100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Nexus Security</h2>
            <p className="text-slate-400 text-sm text-center max-w-xs">
              {scanning ? "Verifying biometric signature..." : "Tap sensor to authenticate"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-green-400"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-500/50">
              <Unlock className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-white">Access Granted</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
