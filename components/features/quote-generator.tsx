"use client";

import { useState, useRef } from 'react';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { QuantumButton, QuantumCard } from '../quantum-effects';

export default function QuoteGenerator() {
  const [text, setText] = useState("Innovation distinguishes between a leader and a follower.");
  const [author, setAuthor] = useState("Steve Jobs");
  const [theme, setTheme] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const themes = [
    ['#1e3a8a', '#7c3aed'], // Blue to Purple
    ['#064e3b', '#10b981'], // Green
    ['#7f1d1d', '#f87171'], // Red
    ['#000000', '#434343'], // Dark
  ];

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, themes[theme][0]);
    gradient.addColorStop(1, themes[theme][1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Overlay pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width, 
        Math.random() * canvas.height, 
        Math.random() * 50 + 20, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
    }

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Word wrap logic
    const words = text.split(' ');
    let line = '';
    let y = canvas.height / 2 - 40;
    const lineHeight = 40;
    const maxWidth = canvas.width - 80;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // Author
    ctx.font = 'italic 20px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(`- ${author}`, canvas.width / 2, y + 60);

    // Branding
    ctx.font = '14px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('NEXUS MEDIA', canvas.width / 2, canvas.height - 30);
  };

  const handleDownload = () => {
    generateImage(); // Ensure latest state
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'nexus-quote.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <QuantumCard className="p-6">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-purple-400" />
        Quote Generator
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Quote Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            {themes.map((t, i) => (
              <button
                key={i}
                onClick={() => setTheme(i)}
                className={`w-8 h-8 rounded-full border-2 ${
                  theme === i ? 'border-white' : 'border-transparent'
                }`}
                style={{ background: `linear-gradient(135deg, ${t[0]}, ${t[1]})` }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={400} 
            className="w-full max-w-[300px] h-auto rounded-lg shadow-xl mb-4 bg-slate-900"
          />
          <div className="flex gap-2 w-full max-w-[300px]">
            <QuantumButton onClick={generateImage} variant="secondary" className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" /> Preview
            </QuantumButton>
            <QuantumButton onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" /> Save
            </QuantumButton>
          </div>
        </div>
      </div>
    </QuantumCard>
  );
}
