"use client";

import { useState, useEffect, useRef } from 'react';
import { CloudRain, Sun, CloudSnow, CloudLightning } from 'lucide-react';

type WeatherType = 'clear' | 'rain' | 'snow' | 'storm';

export default function WeatherEffect() {
  const [weather, setWeather] = useState<WeatherType>('clear');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock weather detection based on random or time
  useEffect(() => {
    // Simulate fetching weather
    const hour = new Date().getHours();
    if (hour > 18) setWeather('rain'); // Evening rain
    else setWeather('clear');
  }, []);

  useEffect(() => {
    if (weather === 'clear' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{x: number, y: number, speed: number, length: number}> = [];
    const maxParticles = weather === 'storm' ? 200 : 100;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 5 + 5,
        length: Math.random() * 20 + 10
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = weather === 'snow' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(174, 194, 224, 0.5)';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;

      particles.forEach(p => {
        if (weather === 'snow') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.length);
          ctx.stroke();
        }

        p.y += p.speed;
        if (p.y > canvas.height) {
          p.y = -p.length;
          p.x = Math.random() * canvas.width;
        }
      });

      if (weather === 'storm' && Math.random() > 0.98) {
        // Lightning flash
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [weather]);

  if (weather === 'clear') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[10]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute top-4 right-20 bg-slate-800/50 p-2 rounded-lg backdrop-blur-sm flex items-center gap-2 text-xs text-slate-300">
        {weather === 'rain' && <CloudRain className="w-4 h-4" />}
        {weather === 'snow' && <CloudSnow className="w-4 h-4" />}
        {weather === 'storm' && <CloudLightning className="w-4 h-4" />}
        <span>{weather === 'rain' ? 'Raining' : weather === 'snow' ? 'Snowing' : 'Stormy'}</span>
      </div>
    </div>
  );
}
