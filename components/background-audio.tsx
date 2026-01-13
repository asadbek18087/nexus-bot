"use client";

import { useEffect, useRef, useState } from 'react';

interface BackgroundAudioProps {
  isPlaying?: boolean;
  volume?: number;
}

export default function BackgroundAudio({ isPlaying = true, volume = 0.3 }: BackgroundAudioProps) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    // Only initialize if user has interacted
    if (!hasInteracted || !isPlaying) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Professional Ambient Soundscape Generator
      // Uses a combination of sine waves and filtered noise for a "space-like" atmosphere
      
      const createDrone = (freq: number, type: 'sine' | 'triangle', pan: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner();
        
        osc.type = type;
        osc.frequency.value = freq;
        
        // Add subtle frequency modulation for "alive" feel
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1 + Math.random() * 0.1; // Slow breathing
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 2; // Hz depth
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        gain.gain.value = 0.05; // Low volume for background
        panner.pan.value = pan;

        osc.connect(gain);
        gain.connect(panner);
        panner.connect(masterGain);
        
        osc.start();
        oscillatorsRef.current.push(osc, lfo);
      };

      // Create a chord cluster (E minor 9)
      createDrone(82.41, 'sine', -0.5); // E2
      createDrone(123.47, 'sine', 0.5); // B2
      createDrone(164.81, 'triangle', -0.3); // E3
      createDrone(196.00, 'sine', 0.3); // G3
      createDrone(293.66, 'sine', 0); // D4 (9th)

      // Add "sparkle" random high pitched sounds
      const sparkleInterval = setInterval(() => {
        if (ctx.state === 'closed') return;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner();
        
        osc.type = 'sine';
        // Random pentatonic notes
        const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; 
        osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
        
        panner.pan.value = (Math.random() * 2) - 1;
        
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(masterGain);
        
        osc.start();
        osc.stop(ctx.currentTime + 2);
      }, 4000); // Every 4 seconds

      return () => {
        clearInterval(sparkleInterval);
        oscillatorsRef.current.forEach(osc => osc.stop());
        oscillatorsRef.current = [];
        ctx.close();
      };
    } catch (e) {
      console.error("Audio initialization failed", e);
    }
  }, [hasInteracted, isPlaying, volume]);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return null; // No UI needed
}
