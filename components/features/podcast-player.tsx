// Feature 53: Podcast Player
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';

const PodcastPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  
  const episodes = [
    { title: 'The Future of AI', duration: '45:30', host: 'Tech Talk' },
    { title: 'Web Development Trends', duration: '38:15', host: 'Code Cast' },
    { title: 'Career in Tech', duration: '52:20', host: 'Dev Stories' }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Podcast Player</h2>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{episodes[currentEpisode].title}</h3>
        <p className="text-gray-400 mb-4">{episodes[currentEpisode].host}</p>
        
        <div className="bg-gray-700 rounded-full h-2 mb-4">
          <div className="bg-purple-500 h-2 rounded-full w-1/3"></div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white transition-all">
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-all">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        {episodes.map((episode, index) => (
          <button
            key={index}
            onClick={() => setCurrentEpisode(index)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              currentEpisode === index ? 'bg-gray-800' : 'bg-gray-800 bg-opacity-50 hover:bg-opacity-75'
            }`}
          >
            <p className="text-white font-medium">{episode.title}</p>
            <p className="text-gray-400 text-sm">{episode.duration}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PodcastPlayer;
