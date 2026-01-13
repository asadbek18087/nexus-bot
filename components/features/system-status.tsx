"use client";

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Battery, BatteryCharging, BatteryWarning } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SystemStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Network Status
      setIsOnline(navigator.onLine);
      const handleOnline = () => {
        setIsOnline(true);
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 3000);
      };
      const handleOffline = () => {
        setIsOnline(false);
        setShowStatus(true);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Battery Status (Navigator interface extension)
      // @ts-ignore
      if (navigator.getBattery) {
        // @ts-ignore
        navigator.getBattery().then((battery) => {
          setBatteryLevel(battery.level * 100);
          setIsCharging(battery.charging);

          battery.addEventListener('levelchange', () => setBatteryLevel(battery.level * 100));
          battery.addEventListener('chargingchange', () => setIsCharging(battery.charging));
        });
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <>
      {/* Network Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center text-xs font-bold z-[100] flex items-center justify-center gap-2"
          >
            <WifiOff className="w-4 h-4" />
            OFFLINE MODE - CACHED CONTENT AVAILABLE
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Restored Toast */}
      <AnimatePresence>
        {isOnline && showStatus && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 bg-green-600 text-white p-2 text-center text-xs font-bold z-[100] flex items-center justify-center gap-2"
          >
            <Wifi className="w-4 h-4" />
            CONNECTION RESTORED
          </motion.div>
        )}
      </AnimatePresence>

      {/* Battery Indicator (only if low or charging) */}
      <div className="fixed bottom-4 left-4 z-[50] flex flex-col gap-2 pointer-events-none">
        {batteryLevel !== null && (batteryLevel <= 20 || isCharging) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-2 text-xs font-mono
              ${batteryLevel <= 20 && !isCharging 
                ? 'bg-red-900/50 border-red-500 text-red-200' 
                : 'bg-green-900/50 border-green-500 text-green-200'}`}
          >
            {isCharging ? <BatteryCharging className="w-3 h-3" /> : <Battery className="w-3 h-3" />}
            {Math.round(batteryLevel)}%
          </motion.div>
        )}
      </div>
    </>
  );
}
