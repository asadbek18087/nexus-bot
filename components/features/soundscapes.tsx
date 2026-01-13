"use client";

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function Soundscapes() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock audio generation (Pink Noise) using Web Audio API
  // real audio files would be better, but this is self-contained
  useEffect(() => {
    if (!isPlaying) return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Create pink noise buffer
    const bufferSize = 4096;
    const pinkNoise = (function() {
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        const node = audioCtx.createScriptProcessor(bufferSize, 1, 1);
        node.onaudioprocess = function(e) {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11; // (roughly) compensate for gain
                b6 = white * 0.115926;
            }
        };
        return node;
    })();

    pinkNoise.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = volume;

    return () => {
        pinkNoise.disconnect();
        gainNode.disconnect();
        audioCtx.close();
    };
  }, [isPlaying, volume]);

  return (
    <div className="fixed bottom-4 right-20 z-50">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`p-3 rounded-full backdrop-blur-md transition-all ${
          isPlaying 
            ? 'bg-blue-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
        }`}
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </div>
  );
}
