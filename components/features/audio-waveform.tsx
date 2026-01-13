"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { QuantumCard } from '../quantum-effects';

export default function AudioWaveform() {
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = 100;
    };
    resize();
    window.addEventListener('resize', resize);

    // Waveform simulation
    const bars = 50;
    const barWidth = canvas.width / bars;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#a855f7');
      gradient.addColorStop(1, '#3b82f6');
      ctx.fillStyle = gradient;

      for (let i = 0; i < bars; i++) {
        // Create a wave pattern
        const baseHeight = 20;
        const amplitude = isPlaying ? Math.sin(time + i * 0.2) * 30 + Math.random() * 10 : 5;
        const height = Math.max(5, baseHeight + amplitude);
        
        const x = i * barWidth;
        const y = (canvas.height - height) / 2;

        // Rounded bars
        ctx.beginPath();
        ctx.roundRect(x + 2, y, barWidth - 4, height, 4);
        ctx.fill();
      }

      if (isPlaying) {
        time += 0.1;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Draw static line if paused
        time = 0;
        // Keep drawing one frame to show static state
        // animationRef.current = requestAnimationFrame(animate); 
        // Actually, just let it stop here
      }
    };

    if (isPlaying) {
      animate();
    } else {
      animate(); // Draw initial state
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <QuantumCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white font-bold">Audiobook: The Quantum Mind</h4>
          <p className="text-xs text-slate-400">Chapter 3: Entanglement</p>
        </div>
        <Volume2 className="text-purple-400 w-5 h-5" />
      </div>

      <canvas ref={canvasRef} className="w-full h-[100px] mb-4 bg-slate-900/50 rounded-lg" />

      <div className="flex items-center justify-center gap-6">
        <button className="text-slate-400 hover:text-white transition-colors">
          <SkipBack className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause className="w-6 h-6 text-white fill-current" /> : <Play className="w-6 h-6 text-white fill-current ml-1" />}
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </QuantumCard>
  );
}
