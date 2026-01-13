"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Pause, Volume2, Maximize, ThumbsUp, Eye } from 'lucide-react';

interface VideoContent {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  author: string;
  uploadDate: string;
}

const VideoLibrary: React.FC = () => {
  const [videos] = useState<VideoContent[]>([
    {
      id: '1',
      title: 'Introduction to React Hooks',
      thumbnail: '/api/placeholder/320/180',
      duration: '15:24',
      views: '10.2K',
      likes: '892',
      author: 'Tech Academy',
      uploadDate: '2 days ago'
    },
    {
      id: '2',
      title: 'Advanced JavaScript Concepts',
      thumbnail: '/api/placeholder/320/180',
      duration: '22:15',
      views: '5.8K',
      likes: '445',
      author: 'Code Masters',
      uploadDate: '1 week ago'
    },
    {
      id: '3',
      title: 'Building Responsive Layouts',
      thumbnail: '/api/placeholder/320/180',
      duration: '18:30',
      views: '3.2K',
      likes: '234',
      author: 'Design Pro',
      uploadDate: '3 days ago'
    }
  ]);

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <Video className="w-8 h-8 text-red-500" />
        Video Library
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer"
          >
            <div className="relative">
              <div className="aspect-video bg-gray-700 flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-50" />
              </div>
              <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{video.author}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {video.views} views
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {video.likes}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VideoLibrary;
