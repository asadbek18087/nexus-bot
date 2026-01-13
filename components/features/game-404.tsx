"use client";

import { useState, useEffect, useRef } from 'react';
import { QuantumButton, QuantumCard } from '../quantum-effects';
import { Play, RotateCcw } from 'lucide-react';

export default function Game404() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let playerY = 150;
    let playerVelocity = 0;
    let obstacles: { x: number; height: number }[] = [];
    let frame = 0;
    const gravity = 0.6;
    const jumpStrength = -10;
    const speed = 5;

    const jump = () => {
      if (playerY >= 150) {
        playerVelocity = jumpStrength;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', jump); // Mobile support

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 180, canvas.width, 2);

      // Player (Dino-ish)
      playerVelocity += gravity;
      playerY += playerVelocity;

      if (playerY > 150) {
        playerY = 150;
        playerVelocity = 0;
      }

      ctx.fillStyle = '#a855f7'; // Purple player
      ctx.fillRect(50, playerY, 30, 30);

      // Obstacles
      if (frame % 100 === 0) {
        obstacles.push({ x: canvas.width, height: Math.random() * 20 + 20 });
      }

      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= speed;
        
        ctx.fillStyle = '#ef4444'; // Red obstacle
        ctx.fillRect(obstacles[i].x, 180 - obstacles[i].height, 20, obstacles[i].height);

        // Collision detection
        if (
          50 < obstacles[i].x + 20 &&
          50 + 30 > obstacles[i].x &&
          playerY + 30 > 180 - obstacles[i].height
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return;
        }
      }

      // Cleanup off-screen obstacles
      obstacles = obstacles.filter(obs => obs.x > -20);

      // Score
      if (frame % 10 === 0) {
        setScore(prev => prev + 1);
      }

      frame++;
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', jump);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <QuantumCard className="p-6 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">404 - Page Not Found</h2>
      <p className="text-slate-400 mb-6">But you found a secret game!</p>

      <div className="relative inline-block border-4 border-slate-700 rounded-lg overflow-hidden bg-slate-900">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={200} 
          className="w-full max-w-full h-auto block"
        />
        
        {(!isPlaying && !gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <QuantumButton onClick={() => setIsPlaying(true)} size="lg">
              <Play className="w-6 h-6 mr-2" /> Start Game
            </QuantumButton>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-red-500 mb-2">Game Over</h3>
            <p className="text-white mb-4">Score: {score}</p>
            <QuantumButton 
              onClick={() => {
                setGameOver(false);
                setScore(0);
                setIsPlaying(true);
              }} 
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </QuantumButton>
          </div>
        )}
        
        {isPlaying && (
          <div className="absolute top-2 right-4 text-white font-mono font-bold text-xl">
            {score}
          </div>
        )}
      </div>
      
      <p className="text-xs text-slate-500 mt-4">Press Space or Tap to Jump</p>
    </QuantumCard>
  );
}
