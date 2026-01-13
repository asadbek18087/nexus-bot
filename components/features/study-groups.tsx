// Feature 54: Study Groups
"use client";

import { useState } from 'react';
import { Users, Calendar, MessageCircle, Plus } from 'lucide-react';

const StudyGroups: React.FC = () => {
  const groups = [
    { name: 'JavaScript Masters', members: 45, nextSession: 'Today, 3 PM' },
    { name: 'React Learners', members: 32, nextSession: 'Tomorrow, 5 PM' },
    { name: 'Python Beginners', members: 28, nextSession: 'Friday, 4 PM' }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <Users className="w-8 h-8 text-blue-500" />
        Study Groups
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-5">
            <h3 className="text-xl font-bold text-white mb-2">{group.name}</h3>
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <Users className="w-4 h-4" />
              <span>{group.members} members</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Calendar className="w-4 h-4" />
              <span>{group.nextSession}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all">
              Join Group
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyGroups;
