"use client";

import { useEffect, useRef, useState } from 'react';

interface BackgroundAudioProps {
  isPlaying?: boolean;
  volume?: number;
}

export default function BackgroundAudio({ isPlaying = true, volume = 0.3 }: BackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying && hasInteracted) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume, hasInteracted]);

  return (
    <audio
      ref={audioRef}
      loop
      src="https://cdn.pixabay.com/download/audio/2022/03/24/audio_33385e0541.mp3?filename=relaxing-piano-music-2469.mp3"
    />
  );
}
