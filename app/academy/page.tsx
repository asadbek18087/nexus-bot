"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, GraduationCap, Play, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { QuantumButton, QuantumCard, QuantumProgressBar } from '@/components/quantum-effects';
import { motion } from 'framer-motion';
import { getCourses, getUserCourses } from '@/actions/content';

export default function AcademyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('My Courses');
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userCoursesData, catalogData] = await Promise.all([
          getUserCourses("123456789"), // TODO: Use real Telegram ID
          getCourses()
        ]);
        setMyCourses(userCoursesData);
        setCatalog(catalogData);
      } catch (error) {
        console.error('Failed to load courses', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <QuantumButton onClick={() => router.back()} size="sm" variant="secondary">
          <ChevronLeft className="w-5 h-5" />
        </QuantumButton>
        <h1 className="text-2xl font-bold text-white">Nexus Academy</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800 mb-8">
        {['My Courses', 'Browse Catalog', 'Certificates'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'My Courses' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Continue Learning</h2>
          {myCourses.length === 0 ? (
            <div className="text-slate-400 text-center py-8">
              No courses yet. Check the catalog!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCourses.map(({ course, progress, completed }) => (
                <QuantumCard key={course.id} className="p-4 flex gap-4 items-center">
                  <div className={`w-16 h-16 rounded-lg ${course.image || 'bg-slate-800'} flex items-center justify-center shrink-0`}>
                    <GraduationCap className="w-8 h-8 text-white/50" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold mb-1">{course.title}</h3>
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>{progress}% Complete</span>
                      <span>{completed ? 'Completed' : 'In Progress'}</span>
                    </div>
                    <QuantumProgressBar value={progress} max={100} color="blue" height={4} />
                  </div>
                  <button className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                    <Play className="w-5 h-5 text-white fill-current" />
                  </button>
                </QuantumCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Browse Catalog' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Featured Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {catalog.map(course => (
              <motion.div key={course.id} whileHover={{ y: -5 }}>
                <QuantumCard className="h-full flex flex-col p-0 overflow-hidden cursor-pointer">
                  <div className={`aspect-video ${course.image || 'bg-slate-800'} flex items-center justify-center`}>
                    <GraduationCap className="w-12 h-12 text-white/30" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-white font-bold mb-1">{course.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">by {course.author}</p>
                    <div className="mt-auto flex justify-between items-center text-xs text-slate-300">
                      <span className="bg-slate-800 px-2 py-1 rounded">{course.level}</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </QuantumCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
