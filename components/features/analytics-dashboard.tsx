"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react';

interface Stats {
  label: string;
  value: string | number;
  change: number;
  period: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  const stats: Stats[] = [
    { label: 'Total XP Earned', value: '12,450', change: 15.3, period: 'vs last week' },
    { label: 'Lessons Completed', value: 47, change: 8.5, period: 'vs last week' },
    { label: 'Study Streak', value: '12 days', change: 20, period: 'vs last week' },
    { label: 'Quiz Average', value: '87%', change: -2.1, period: 'vs last week' },
    { label: 'Active Hours', value: '24.5', change: 5.2, period: 'vs last week' },
    { label: 'Friends Made', value: 8, change: 12.5, period: 'vs last week' },
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-purple-500" />
          Analytics Dashboard
        </h2>
        <div className="flex gap-2">
          {['day', 'week', 'month'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-5"
          >
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
            <div className="flex items-center gap-2">
              {stat.change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                stat.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {Math.abs(stat.change)}%
              </span>
              <span className="text-gray-500 text-sm">{stat.period}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Activity Chart</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {[65, 80, 45, 90, 75, 60, 85, 70, 95, 80, 65, 75].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-purple-600 to-pink-600 rounded-t"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
