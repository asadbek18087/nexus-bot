"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Share2, Eye, Heart, MessageSquare } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  date: Date;
  views: number;
  likes: number;
  comments: number;
  isPublic: boolean;
}

const NotesSharing: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      content: 'Variables, functions, and basic concepts...',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      views: 234,
      likes: 45,
      comments: 12,
      isPublic: true
    },
    {
      id: '2',
      title: 'React Hooks Guide',
      content: 'Understanding useState, useEffect, and custom hooks...',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      views: 567,
      likes: 89,
      comments: 23,
      isPublic: true
    },
    {
      id: '3',
      title: 'Personal Study Plan',
      content: 'My goals and schedule for this month...',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      views: 0,
      likes: 0,
      comments: 0,
      isPublic: false
    }
  ]);

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <FileText className="w-8 h-8 text-blue-500" />
        Notes & Sharing
      </h2>

      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all mb-6">
        Create New Note
      </button>

      <div className="space-y-4">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{note.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{note.content}</p>
                <p className="text-gray-500 text-xs">
                  {note.date.toLocaleDateString()}
                  {note.isPublic && ' • Public'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{note.views}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{note.likes}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">{note.comments}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white transition-all">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotesSharing;
