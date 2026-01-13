"use client";

import { useEffect, useRef, useState } from 'react';

interface AudioNode {
  oscillator: OscillatorNode;
  gainNode: GainNode;
  frequency: number;
}

export default function GenerativeAudioEngine() {
  const audioContextRef = useRef<AudioContext>();
  const masterGainRef = useRef<GainNode>();
  const nextNoteTimeRef = useRef<number>(0);
  const moodRef = useRef<'calm' | 'energetic' | 'focused'>('calm');
  const [isPlaying, setIsPlaying] = useState(false);
  const [mood, setMood] = useState<'calm' | 'energetic' | 'focused'>('calm');
  const nodesRef = useRef<AudioNode[]>([]);
  
  const tempo = 60;

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  useEffect(() => {
    // Initialize Web Audio API
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGainRef.current = audioContextRef.current.createGain();
    masterGainRef.current.connect(audioContextRef.current.destination);
    masterGainRef.current.gain.value = 0.3; // Master volume
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startAudio = () => {
    if (!audioContextRef.current || isPlaying) return;

    const ctx = audioContextRef.current;
    const nodes: AudioNode[] = [];

    // Piano Synthesis
    const playPianoNote = (note: number, time: number, velocity: number = 0.5) => {
      const ctx = audioContextRef.current!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const harmonic2 = ctx.createOscillator();
      const harmonic2Gain = ctx.createGain();
      
      const freq = 440 * Math.pow(2, (note - 69) / 12);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      harmonic2.type = 'triangle';
      harmonic2.frequency.setValueAtTime(freq * 2, time);
      
      // Envelope
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(velocity, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 2.0);
      
      harmonic2Gain.gain.setValueAtTime(0, time);
      harmonic2Gain.gain.linearRampToValueAtTime(velocity * 0.1, time + 0.02);
      harmonic2Gain.gain.exponentialRampToValueAtTime(0.001, time + 1.5);
      
      osc.connect(gain);
      harmonic2.connect(harmonic2Gain);
      
      if (masterGainRef.current) {
        gain.connect(masterGainRef.current);
        harmonic2Gain.connect(masterGainRef.current);
      }
      
      osc.start(time);
      harmonic2.start(time);
      osc.stop(time + 2.5);
      harmonic2.stop(time + 2.5);
      
      nodes.push({ oscillator: osc, gainNode: gain, frequency: freq });
      nodes.push({ oscillator: harmonic2, gainNode: harmonic2Gain, frequency: freq * 2 });
    };

    // Ambient Pad (Soft strings)
    const playPad = (currentMood: string) => {
      const ctx = audioContextRef.current!;
      
      // Frequencies based on mood
      const freqs = currentMood === 'focus' ? [220, 330, 440] : // A major
                   currentMood === 'energy' ? [261.6, 329.6, 392] : // C major
                   [196, 246.9, 293.7]; // G major (calm)
                   
      // Play a chord
      freqs.forEach((f) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.value = 0.05;
        o.connect(g);
        if (masterGainRef.current) {
          g.connect(masterGainRef.current);
        }
        o.start();
        o.stop(ctx.currentTime + 4);
        // Smooth fade
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 4);
        
        nodes.push({ oscillator: o, gainNode: g, frequency: f });
      });
    };
    
    // Algorithmic Composition
    const scheduleNextNote = () => {
      const secondsPerBeat = 60.0 / tempo;
      const nextNoteTime = nextNoteTimeRef.current;
      const ctx = audioContextRef.current!;
      
      // Lookahead: only schedule if within 0.1s
      if (nextNoteTime < ctx.currentTime + 0.1) {
          // Pentatonic Scale for pleasant sounds
          const scale = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81];
          const note = scale[Math.floor(Math.random() * scale.length)];
          
          // Play note
          playPianoNote(note, nextNoteTime + 0.1, 0.1 + Math.random() * 0.2);
          
          // Occasional chords or bass
          if (Math.random() < 0.2) {
             playPianoNote(note - 12, nextNoteTime + 0.1, 0.15);
          }
          
          // Ambient pad every 4 bars (approx every 8 notes if 2 beats per bar)
          // Simplified: random chance for pad
          if (Math.random() < 0.1) {
            playPad(moodRef.current);
          }

          nextNoteTimeRef.current += secondsPerBeat;
      }
    };

    // Start loop
    nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.1;
    // Clear any existing interval
    if ((window as any).audioInterval) clearInterval((window as any).audioInterval);
    (window as any).audioInterval = setInterval(scheduleNextNote, 25); // Check schedule often

    // Create rhythmic clicks
    const createClick = (time: number) => {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime + time);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + time);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + time + 0.01);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + time + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + 0.1);
    };

    // Add rhythm based on mood
    const rhythms = {
      calm: [0, 4],
      energetic: [0, 1, 2, 3, 4, 5, 6, 7],
      focused: [0, 2, 4, 6]
    };

    // Only play rhythm if mood is energetic or focused
    if (mood !== 'calm') {
        const rhythm = rhythms[mood];
        rhythm.forEach(beat => {
          for (let i = 0; i < 4; i++) { // Less frequent clicks
            createClick(i * 2 + beat * 0.5);
          }
        });
    }

    nodesRef.current = nodes;
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if ((window as any).audioInterval) clearInterval((window as any).audioInterval);
    nodesRef.current.forEach(node => {
      try {
        node.oscillator.stop();
      } catch (e) {
        // Already stopped
      }
    });
    nodesRef.current = [];
    setIsPlaying(false);
  };

  const addSoundEffect = (type: 'click' | 'success' | 'error') => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    switch (type) {
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        break;
      case 'success':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        break;
      case 'error':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        break;
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={isPlaying ? stopAudio : startAudio}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold"
          >
            {isPlaying ? '🔇 Stop Audio' : '🎵 Start Audio'}
          </button>
          
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value as any)}
            className="bg-white/20 text-white px-3 py-2 rounded-lg"
          >
            <option value="calm">😌 Calm</option>
            <option value="energetic">⚡ Energetic</option>
            <option value="focused">🎯 Focused</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => addSoundEffect('click')}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm"
          >
            Click
          </button>
          <button
            onClick={() => addSoundEffect('success')}
            className="bg-green-500/50 hover:bg-green-500/70 text-white px-3 py-1 rounded text-sm"
          >
            Success
          </button>
          <button
            onClick={() => addSoundEffect('error')}
            className="bg-red-500/50 hover:bg-red-500/70 text-white px-3 py-1 rounded text-sm"
          >
            Error
          </button>
        </div>
      </div>
    </div>
  );
}
