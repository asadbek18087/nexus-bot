"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Trash2, Star, Archive, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  subject: string;
  content: string;
  date: Date;
  read: boolean;
  starred: boolean;
  type: 'inbox' | 'sent' | 'archived' | 'spam';
}

const InboxSystem: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'System',
      subject: 'Welcome to Nexus!',
      content: 'Thank you for joining our platform. Here are some tips to get started...',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false,
      starred: false,
      type: 'inbox'
    },
    {
      id: '2',
      from: 'Alex Chen',
      subject: 'Study Group Invitation',
      content: 'Hey! I noticed you\'re interested in JavaScript. Want to join our study group?',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      starred: true,
      type: 'inbox'
    },
    {
      id: '3',
      from: 'Nexus Team',
      subject: 'New Features Released',
      content: 'Check out our latest features including voice chat and virtual marketplace...',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      starred: false,
      type: 'inbox'
    }
  ]);

  const [selectedType, setSelectedType] = useState<'inbox' | 'sent' | 'archived' | 'spam'>('inbox');

  const filteredMessages = messages.filter(m => m.type === selectedType);

  const markAsRead = (id: string) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, read: true } : m
    ));
  };

  const toggleStar = (id: string) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, starred: !m.starred } : m
    ));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <Mail className="w-8 h-8 text-blue-500" />
        Inbox
      </h2>

      <div className="flex gap-2 mb-6">
        {['inbox', 'sent', 'archived', 'spam'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type as any)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              selectedType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredMessages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-all ${
              !message.read ? 'border-l-4 border-blue-500' : ''
            }`}
            onClick={() => markAsRead(message.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-white ${!message.read ? 'font-bold' : ''}`}>
                    {message.from}
                  </p>
                  {!message.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className={`${!message.read ? 'font-semibold' : ''} text-gray-200 mb-1`}>
                  {message.subject}
                </p>
                <p className="text-gray-400 text-sm truncate">{message.content}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(message.id);
                  }}
                  className={`p-1 ${message.starred ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-all`}
                >
                  <Star className={`w-4 h-4 ${message.starred ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMessage(message.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              {message.date.toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No messages in {selectedType}</p>
        </div>
      )}
    </div>
  );
};

export default InboxSystem;
