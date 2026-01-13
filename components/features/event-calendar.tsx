"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  Star, 
  Zap, 
  Target,
  Flame,
  Gift,
  Crown,
  AlertCircle,
  CheckCircle,
  Video
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'tournament' | 'workshop' | 'meetup' | 'live' | 'special';
  startDate: Date;
  endDate: Date;
  location: string;
  participants: number;
  maxParticipants: number;
  rewards: {
    xp: number;
    coins: number;
    special?: string;
  };
  registered: boolean;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

const EventCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Summer Championship',
      description: 'The biggest tournament of the year with massive prizes',
      type: 'tournament',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      location: 'Virtual Arena',
      participants: 456,
      maxParticipants: 500,
      rewards: {
        xp: 5000,
        coins: 2000,
        special: 'Champion Title'
      },
      registered: false,
      completed: false,
      difficulty: 'hard',
      tags: ['competition', 'prizes', 'elite']
    },
    {
      id: '2',
      title: 'JavaScript Masterclass',
      description: 'Learn advanced JavaScript techniques from industry experts',
      type: 'workshop',
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: 'Online',
      participants: 128,
      maxParticipants: 200,
      rewards: {
        xp: 500,
        coins: 100
      },
      registered: true,
      completed: false,
      difficulty: 'medium',
      tags: ['learning', 'coding', 'skills']
    },
    {
      id: '3',
      title: 'Community Meetup',
      description: 'Meet fellow gamers and make new friends',
      type: 'meetup',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      location: 'Discord',
      participants: 78,
      maxParticipants: 100,
      rewards: {
        xp: 200,
        coins: 50
      },
      registered: false,
      completed: false,
      difficulty: 'easy',
      tags: ['social', 'community', 'fun']
    },
    {
      id: '4',
      title: 'Live Quiz Show',
      description: 'Join our host for an exciting live quiz competition',
      type: 'live',
      startDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 13 * 60 * 60 * 1000),
      location: 'Live Stream',
      participants: 234,
      maxParticipants: 1000,
      rewards: {
        xp: 300,
        coins: 75,
        special: 'Quiz Master Badge'
      },
      registered: true,
      completed: false,
      difficulty: 'medium',
      tags: ['live', 'quiz', 'prizes']
    },
    {
      id: '5',
      title: 'Speed Running Challenge',
      description: 'Complete games as fast as possible for amazing rewards',
      type: 'tournament',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: 'Virtual',
      participants: 89,
      maxParticipants: 150,
      rewards: {
        xp: 1500,
        coins: 500,
        special: 'Speed Demon Title'
      },
      registered: false,
      completed: false,
      difficulty: 'hard',
      tags: ['gaming', 'speed', 'challenge']
    },
    {
      id: '6',
      title: 'Creator Weekend',
      description: 'Special weekend event for content creators',
      type: 'special',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      location: 'Platform Wide',
      participants: 45,
      maxParticipants: 100,
      rewards: {
        xp: 1000,
        coins: 300,
        special: 'Creator Badge'
      },
      registered: false,
      completed: false,
      difficulty: 'medium',
      tags: ['creators', 'special', 'exclusive']
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'tournament': return 'bg-red-500';
      case 'workshop': return 'bg-blue-500';
      case 'meetup': return 'bg-green-500';
      case 'live': return 'bg-purple-500';
      case 'special': return 'bg-gradient-to-r from-yellow-500 to-purple-500';
    }
  };

  const getDifficultyColor = (difficulty: Event['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntil = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Soon';
  };

  const registerForEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, registered: true, participants: event.participants + 1 }
        : event
    ));
  };

  const unregisterFromEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, registered: false, participants: event.participants - 1 }
        : event
    ));
  };

  const filteredEvents = selectedFilter === 'all' 
    ? events 
    : events.filter(event => event.type === selectedFilter);

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'tournament', label: 'Tournaments' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'meetup', label: 'Meetups' },
    { value: 'live', label: 'Live Events' },
    { value: 'special', label: 'Special' }
  ];

  const upcomingEvents = events.filter(e => !e.completed && e.startDate > new Date());
  const registeredEvents = events.filter(e => e.registered && !e.completed);

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-8 h-8 text-blue-500" />
          Event Calendar
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-orange-400">
            <Flame className="w-5 h-5" />
            <span className="font-semibold">{upcomingEvents.length} Upcoming</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{registeredEvents.length} Registered</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Total Events</p>
          <p className="text-2xl font-bold text-white">{events.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Total Participants</p>
          <p className="text-2xl font-bold text-white">
            {events.reduce((sum, e) => sum + e.participants, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Gift className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Total Prizes</p>
          <p className="text-2xl font-bold text-white">
            {events.reduce((sum, e) => sum + e.rewards.coins, 0).toLocaleString()} coins
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Your Events</p>
          <p className="text-2xl font-bold text-white">{registeredEvents.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {eventTypes.map(type => (
          <button
            key={type.value}
            onClick={() => setSelectedFilter(type.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedFilter === type.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`relative bg-gray-800 rounded-lg p-5 border-2 transition-all hover:border-blue-500 ${
                event.registered ? 'border-green-500' : 'border-gray-700'
              }`}
            >
              {/* Event Type Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getEventTypeColor(event.type)}`}>
                  {event.type}
                </span>
              </div>

              {/* Registered Badge */}
              {event.registered && (
                <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Registered
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{event.description}</p>

                {/* Event Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{event.participants}/{event.maxParticipants}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {event.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Rewards */}
                <div className="bg-gray-700 rounded p-2 mb-3">
                  <p className="text-xs text-gray-400 mb-1">Rewards:</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-purple-400">
                      <Zap className="w-3 h-3" />
                      <span className="text-xs font-medium">{event.rewards.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Trophy className="w-3 h-3" />
                      <span className="text-xs font-medium">{event.rewards.coins} coins</span>
                    </div>
                    {event.rewards.special && (
                      <div className="flex items-center gap-1 text-orange-400">
                        <Crown className="w-3 h-3" />
                        <span className="text-xs font-medium">{event.rewards.special}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Until */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-medium ${getDifficultyColor(event.difficulty)}`}>
                    {event.difficulty}
                  </span>
                  <span className="text-sm text-orange-400">
                    Starts in {getTimeUntil(event.startDate)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {event.registered ? (
                    <>
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => unregisterFromEvent(event.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all text-sm"
                      >
                        Leave
                      </button>
                    </>
                  ) : event.participants < event.maxParticipants ? (
                    <button
                      onClick={() => registerForEvent(event.id)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all text-sm"
                    >
                      Register Now
                    </button>
                  ) : (
                    <button disabled className="w-full bg-gray-700 text-gray-400 py-2 rounded-lg font-medium cursor-not-allowed text-sm">
                      Full
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded text-sm font-bold text-white ${getEventTypeColor(selectedEvent.type)}`}>
                    {selectedEvent.type}
                  </span>
                  <span className={`text-sm font-medium ${getDifficultyColor(selectedEvent.difficulty)}`}>
                    {selectedEvent.difficulty}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-white"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-300 mb-4">{selectedEvent.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-gray-400 text-sm mb-1">Start Time</p>
                <p className="text-white font-medium">{formatDate(selectedEvent.startDate)}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-gray-400 text-sm mb-1">Duration</p>
                <p className="text-white font-medium">
                  {Math.floor((selectedEvent.endDate.getTime() - selectedEvent.startDate.getTime()) / (1000 * 60 * 60))} hours
                </p>
              </div>
            </div>

            {selectedEvent.type === 'live' && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 text-white">
                  <Video className="w-6 h-6" />
                  <div>
                    <p className="font-bold">Live Stream Event</p>
                    <p className="text-sm opacity-90">Join us live for this exclusive event</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all">
                Set Reminder
              </button>
              <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-all">
                Share Event
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EventCalendar;
