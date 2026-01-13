"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import BinaryClock from '@/components/features/binary-clock';
import QuoteGenerator from '@/components/features/quote-generator';
import StepCounter from '@/components/features/step-counter';
import DailySpin from '@/components/features/daily-spin';
import GlitchText from '@/components/features/glitch-text';
import GyroParallax from '@/components/features/gyro-parallax';
import VoiceSearch from '@/components/features/voice-search';
import MoodSelector from '@/components/features/mood-selector';
import GiftSystem from '@/components/features/gift-system';
import Game2048 from '@/components/game-2048';
import AIQuizGenerator from '@/components/ai-quiz-generator';
import FlashcardsSystem from '@/components/features/flashcards';
import Game404 from '@/components/features/game-404';
import AudioWaveform from '@/components/features/audio-waveform';
import CodeHighlighter from '@/components/features/code-highlighter';
import ProfileShowcase from '@/components/features/profile-showcase';
import MentorSystem from '@/components/features/mentor-system';
import SmartGreeter from '@/components/features/smart-greeter';
import ReadingSpeedTest from '@/components/features/reading-speed-test';
import DraggableDashboard from '@/components/features/draggable-dashboard';
import AISummarizer from '@/components/features/ai-summarizer';
import CertificateGenerator from '@/components/features/certificate-generator';
import StakingSimulator from '@/components/features/staking-simulator';
import SelfDestructMessages from '@/components/features/self-destruct-messages';
import { BentoGrid, BentoGridItem } from "@/components/bento-grid";
import { 
  Home,
  Gamepad2, 
  Brain, 
  Swords, 
  Users, 
  User,
  Settings,
  Trophy,
  Zap,
  Target,
  Shield,
  Star,
  ChevronRight,
  Activity,
  TrendingUp,
  Music,
  Code,
  FileText,
  Heart,
  Thermometer,
  Cpu,
  BookOpen,
  Film,
  GraduationCap,
  Play,
  Crown,
  ShoppingBag,
  Hammer
} from 'lucide-react';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  view: string;
}

interface ModernDashboardProps {
  onNavigate: (view: string) => void;
}

export default function ModernDashboard({ onNavigate }: ModernDashboardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: <Home className="w-6 h-6" />,
      label: 'Sector Alpha',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      view: 'home'
    },
    {
      id: 'games',
      icon: <Gamepad2 className="w-6 h-6" />,
      label: 'Sector Gamma',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      view: 'games'
    },
    {
      id: 'quiz',
      icon: <Brain className="w-6 h-6" />,
      label: 'Sector Beta',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      view: 'quiz'
    },
    {
      id: 'battle',
      icon: <Swords className="w-6 h-6" />,
      label: 'Arena',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      view: 'battle'
    },
    {
      id: 'social',
      icon: <Users className="w-6 h-6" />,
      label: 'Nexus Hub',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      view: 'social'
    },
    {
      id: 'profile',
      icon: <User className="w-6 h-6" />,
      label: 'Identity',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      view: 'profile'
    }
  ];

  // Animated background
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{x: number, y: number, vx: number, vy: number, size: number}> = [];
    
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 116, 139, 0.3)';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (index: number, view: string) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden flex">
      {/* Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950 z-10" />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen relative z-30 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider">NEXUS</h1>
            <span className="text-xs text-blue-400 font-medium">OS v2.0</span>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(index, item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeIndex === index 
                  ? `bg-slate-800 border border-slate-700 shadow-lg ${item.color}` 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className={`p-2 rounded-lg ${activeIndex === index ? item.bgColor : 'bg-slate-800/50 group-hover:bg-slate-800'}`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
              {activeIndex === index && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                98%
              </div>
              <div>
                <p className="text-sm text-white font-medium">System Optimal</p>
                <p className="text-xs text-slate-400">All systems operational</p>
              </div>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
              <div className="bg-green-500 h-full w-[98%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="relative z-20 flex-1 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4 md:hidden">
              {/* Mobile Logo shown only on mobile since sidebar handles desktop */}
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  <GlitchText text="NEXUS" />
                </h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <h2 className="text-xl font-semibold text-slate-200">
                {navItems[activeIndex].label} Dashboard
              </h2>
            </div>

            <div className="hidden md:block">
              <BinaryClock />
            </div>

            <div className="hidden md:flex items-center gap-6">
              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-yellow-400 font-bold text-lg">8,420</p>
                  <p className="text-slate-500 text-xs">XP</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-bold text-lg">24</p>
                  <p className="text-slate-500 text-xs">LVL</p>
                </div>
                <div className="text-center">
                  <p className="text-purple-400 font-bold text-lg">87%</p>
                  <p className="text-slate-500 text-xs">WIN</p>
                </div>
              </div>

              {/* User Avatar */}
              <div className="w-12 h-12 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center hover:border-purple-500 transition-colors cursor-pointer group">
                <User className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </header>

          {/* Main Dashboard Area */}
        <div className="flex-1 flex justify-center px-4 md:px-8 overflow-y-auto pb-24 md:pb-8 pt-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="w-full max-w-7xl">
            {activeIndex === 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Cpu className="w-6 h-6 text-blue-400" />
                      Sector Alpha: Command
                    </h2>
                    <p className="text-slate-400 text-sm">Central operations and daily tasks</p>
                  </div>
                </div>

                <BentoGrid>
                  {/* Daily Command Center */}
                  <BentoGridItem
                    title="Daily Operations"
                    description="Daily spin, streaks, and quick rewards"
                    header={<DailySpin />}
                    icon={<Zap className="w-4 h-4 text-yellow-500" />}
                    className="md:col-span-1"
                  />
                  
                  {/* Vital Signs */}
                  <BentoGridItem
                    title="Vital Signs"
                    description="Physical and mental status tracking"
                    header={
                      <div className="h-full flex flex-col gap-2 p-2">
                        <StepCounter />
                        <MoodSelector />
                      </div>
                    }
                    icon={<Heart className="w-4 h-4 text-red-500" />}
                    className="md:col-span-1"
                  />

                  {/* Quick Access */}
                  <BentoGridItem
                    title="Quick Access"
                    description="Frequently used modules"
                    header={
                      <div className="grid grid-cols-2 gap-2 h-full p-2">
                        <div className="bg-slate-800/50 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => setActiveIndex(1)}>
                          <Gamepad2 className="w-6 h-6 text-green-400 mb-2" />
                          <span className="text-xs text-slate-300">Games</span>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => setActiveIndex(2)}>
                          <Brain className="w-6 h-6 text-purple-400 mb-2" />
                          <span className="text-xs text-slate-300">Learn</span>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => setActiveIndex(3)}>
                          <Swords className="w-6 h-6 text-red-400 mb-2" />
                          <span className="text-xs text-slate-300">Battle</span>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => setActiveIndex(4)}>
                          <Users className="w-6 h-6 text-yellow-400 mb-2" />
                          <span className="text-xs text-slate-300">Social</span>
                        </div>
                      </div>
                    }
                    icon={<Activity className="w-4 h-4 text-blue-500" />}
                    className="md:col-span-1"
                  />

                  <BentoGridItem
                    title="Environment"
                    description="System interactions and voice control"
                    header={
                      <div className="h-full flex flex-col gap-2 p-2">
                        <VoiceSearch />
                        <GyroParallax>
                           <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                             <span className="text-xs text-slate-400">Gyroscope Active</span>
                           </div>
                        </GyroParallax>
                      </div>
                    }
                    icon={<Thermometer className="w-4 h-4 text-cyan-500" />}
                    className="md:col-span-1"
                  />

                  <BentoGridItem
                    title="Neural Enhancement"
                    description="Daily cognitive exercises"
                    header={
                      <div className="h-full p-2">
                        <ReadingSpeedTest />
                      </div>
                    }
                    icon={<Brain className="w-4 h-4 text-purple-500" />}
                    className="md:col-span-2"
                  />
                </BentoGrid>
              </div>
            )}

            {activeIndex === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Gamepad2 className="w-6 h-6 text-green-400" />
                      Sector Gamma: Entertainment
                    </h2>
                    <p className="text-slate-400 text-sm">Games, Media, and Digital Experiences</p>
                  </div>
                </div>

                <BentoGrid>
                  <BentoGridItem
                    title="Quantum 2048"
                    description="Merge blocks to reach singularity"
                    header={
                      <div className="h-full flex items-center justify-center bg-slate-900/50 rounded-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-900/20 z-0" />
                        <Link href="/games/2048" className="z-10">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-colors"
                          >
                            <Play className="w-5 h-5 fill-current" /> Play Now
                          </motion.button>
                        </Link>
                      </div>
                    }
                    icon={<Gamepad2 className="w-4 h-4 text-green-500" />}
                    className="md:col-span-2 md:row-span-2"
                  />
                  <BentoGridItem
                    title="Secret Arcade"
                    description="Hidden retro games"
                    header={<div className="h-full flex items-center justify-center p-4"><Game404 /></div>}
                    icon={<Code className="w-4 h-4 text-pink-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="Glitch Art"
                    description="Visual anomalies"
                    header={<div className="h-full flex items-center justify-center"><GlitchText text="SYSTEM_OVERRIDE" /></div>}
                    icon={<Zap className="w-4 h-4 text-cyan-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="Nexus Library"
                    description="Digital books and archives"
                    header={
                      <Link href="/library" className="h-full flex items-center justify-center bg-slate-800/30 rounded-lg group hover:bg-slate-800/50 transition-colors">
                        <BookOpen className="w-12 h-12 text-blue-400 opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all" />
                      </Link>
                    }
                    icon={<BookOpen className="w-4 h-4 text-blue-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="Cinema"
                    description="Streaming entertainment"
                    header={
                      <Link href="/cinema" className="h-full flex items-center justify-center bg-slate-800/30 rounded-lg group hover:bg-slate-800/50 transition-colors">
                        <Film className="w-12 h-12 text-purple-400 opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all" />
                      </Link>
                    }
                    icon={<Film className="w-4 h-4 text-purple-500" />}
                    className="md:col-span-1"
                  />
                </BentoGrid>
              </div>
            )}

            {activeIndex === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Brain className="w-6 h-6 text-purple-400" />
                      Sector Beta: Intelligence
                    </h2>
                    <p className="text-slate-400 text-sm">Neural Training and Knowledge Base</p>
                  </div>
                </div>

                <BentoGrid>
                  <BentoGridItem
                    title="AI Quiz Generator"
                    description="Generate custom quizzes on any topic"
                    header={<div className="h-full flex items-center justify-center p-4 bg-purple-900/20 rounded-lg"><AIQuizGenerator onQuestionsGenerated={() => {}} onClose={() => {}} /></div>}
                    icon={<Brain className="w-4 h-4 text-purple-500" />}
                    className="md:col-span-2"
                  />
                  <BentoGridItem
                    title="Flashcards"
                    description="Spaced repetition learning"
                    header={<FlashcardsSystem />}
                    icon={<FileText className="w-4 h-4 text-yellow-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="AI Summarizer"
                    description="Condense information instantly"
                    header={<AISummarizer />}
                    icon={<Cpu className="w-4 h-4 text-blue-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="Nexus Academy"
                    description="Advanced courses and training"
                    header={
                      <Link href="/academy" className="h-full flex items-center justify-center bg-slate-800/30 rounded-lg group hover:bg-slate-800/50 transition-colors">
                        <GraduationCap className="w-12 h-12 text-yellow-400 opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all" />
                      </Link>
                    }
                    icon={<GraduationCap className="w-4 h-4 text-yellow-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="Code Vault"
                    description="Syntax highlighted snippets"
                    header={<CodeHighlighter language="typescript" code="const nexus = 'infinite';" title="Core.ts" />}
                    icon={<Code className="w-4 h-4 text-green-500" />}
                    className="md:col-span-1"
                  />
                </BentoGrid>
              </div>
            )}

            {activeIndex === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Swords className="w-6 h-6 text-red-400" />
                      Sector Arena: Battle
                    </h2>
                    <p className="text-slate-400 text-sm">Competitive Zones and Challenges</p>
                  </div>
                </div>

                <BentoGrid>
                  <BentoGridItem
                    title="Operations"
                    description="Limited time tactical missions"
                    header={<div className="h-full bg-slate-900/50 rounded-lg flex items-center justify-center text-slate-500">Mission Control Active</div>} 
                    icon={<Target className="w-4 h-4 text-red-500" />}
                    className="md:col-span-2"
                  />
                  <BentoGridItem
                    title="Global Rankings"
                    description="Elite operatives leaderboard"
                    header={<div className="h-full bg-slate-900/50 rounded-lg flex items-center justify-center text-slate-500">Accessing Database...</div>}
                    icon={<Trophy className="w-4 h-4 text-yellow-500" />}
                    className="md:col-span-1"
                  />
                </BentoGrid>
              </div>
            )}

            {activeIndex === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Users className="w-6 h-6 text-yellow-400" />
                      Sector Nexus Hub: Social
                    </h2>
                    <p className="text-slate-400 text-sm">Communications and Networking</p>
                  </div>
                </div>

                <BentoGrid>
                  <BentoGridItem
                    title="Secure Comms"
                    description="Encrypted messaging channels"
                    header={<SelfDestructMessages />}
                    icon={<Shield className="w-4 h-4 text-green-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="Gift Exchange"
                    description="Send resources to allies"
                    header={<GiftSystem />}
                    icon={<Star className="w-4 h-4 text-yellow-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="Inspiration"
                    description="Daily quantum quotes"
                    header={<QuoteGenerator />}
                    icon={<Zap className="w-4 h-4 text-purple-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="Mentor Uplink"
                    description="Connect with senior operatives"
                    header={
                      <Link href="/mentor" className="h-full flex flex-col justify-center bg-slate-800/30 rounded-lg p-4 group hover:bg-slate-800/50 transition-colors">
                        <MentorSystem />
                        <div className="mt-2 text-center text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Open Neural Link &rarr;
                        </div>
                      </Link>
                    }
                    icon={<User className="w-4 h-4 text-blue-500" />}
                    className="md:col-span-3"
                  />
                </BentoGrid>
              </div>
            )}

            {activeIndex === 5 && (
              <div className="space-y-6">
                 <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <User className="w-6 h-6 text-cyan-400" />
                      Sector Identity: Profile
                    </h2>
                    <p className="text-slate-400 text-sm">Personal Data and Achievements</p>
                  </div>
                </div>

                <BentoGrid>
                  <BentoGridItem
                    title="Operative Profile"
                    description="Clearance level and stats"
                    header={
                      <Link href="/profile" className="h-full block group cursor-pointer">
                        <div className="h-full transition-transform duration-200 group-hover:scale-[1.02]">
                          <ProfileShowcase />
                        </div>
                      </Link>
                    }
                    icon={<User className="w-4 h-4 text-cyan-500" />}
                    className="md:col-span-2 md:row-span-2"
                  />
                  <BentoGridItem
                    title="Certifications"
                    description="Earned credentials"
                    header={<CertificateGenerator />}
                    icon={<FileText className="w-4 h-4 text-yellow-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="Mining Operations"
                    description="Extract crystals & energy"
                    header={
                      <Link href="/mining" className="h-full flex items-center justify-center bg-slate-800/30 rounded-lg group hover:bg-slate-800/50 transition-colors">
                        <Hammer className="w-12 h-12 text-blue-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </Link>
                    }
                    icon={<Hammer className="w-4 h-4 text-blue-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="Marketplace"
                    description="Spend gold & gems"
                    header={
                      <Link href="/marketplace" className="h-full flex items-center justify-center bg-slate-800/30 rounded-lg group hover:bg-slate-800/50 transition-colors">
                        <ShoppingBag className="w-12 h-12 text-purple-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </Link>
                    }
                    icon={<ShoppingBag className="w-4 h-4 text-purple-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title="Premium Access"
                    description="Manage subscription & perks"
                    header={
                      <div className="h-full flex items-center justify-center bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-lg group hover:from-yellow-900/40 hover:to-orange-900/40 transition-colors cursor-pointer">
                        <Crown className="w-12 h-12 text-yellow-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </div>
                    }
                    icon={<Crown className="w-4 h-4 text-yellow-500" />}
                    className="md:col-span-1"
                  />
                </BentoGrid>
              </div>
            )}
            
            {activeIndex !== 0 && activeIndex !== 1 && activeIndex !== 2 && activeIndex !== 4 && activeIndex !== 5 && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
                <p>Module Under Construction</p>
                <button onClick={() => setActiveIndex(0)} className="text-blue-400 mt-4 hover:underline">
                  Return Home
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation - Mobile First */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-30">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(index, item.view)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                  activeIndex === index 
                    ? `${item.bgColor} ${item.color}` 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="w-6 h-6">
                  {item.icon}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
