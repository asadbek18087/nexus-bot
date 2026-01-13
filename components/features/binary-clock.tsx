"use client";

import { useState, useEffect } from 'react';

export default function BinaryClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getBinary = (num: number) => num.toString(2).padStart(6, '0').split('');

  const hours = getBinary(time.getHours());
  const minutes = getBinary(time.getMinutes());
  const seconds = getBinary(time.getSeconds());

  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
      <h3 className="text-xs text-slate-500 font-mono mb-2 text-center">QUANTUM TIME</h3>
      <div className="flex gap-4 justify-center">
        {/* Hours */}
        <div className="flex flex-col gap-1">
          {hours.map((bit, i) => (
            <div 
              key={`h-${i}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                bit === '1' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-slate-800'
              }`}
            />
          ))}
          <span className="text-xs text-slate-500 mt-1">{time.getHours()}</span>
        </div>

        {/* Minutes */}
        <div className="flex flex-col gap-1">
          {minutes.map((bit, i) => (
            <div 
              key={`m-${i}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                bit === '1' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-slate-800'
              }`}
            />
          ))}
          <span className="text-xs text-slate-500 mt-1">{time.getMinutes()}</span>
        </div>

        {/* Seconds */}
        <div className="flex flex-col gap-1">
          {seconds.map((bit, i) => (
            <div 
              key={`s-${i}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                bit === '1' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-slate-800'
              }`}
            />
          ))}
          <span className="text-xs text-slate-500 mt-1">{time.getSeconds()}</span>
        </div>
      </div>
    </div>
  );
}
