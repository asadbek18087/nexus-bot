"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Brain, 
  Swords, 
  Users, 
  User, 
  TrendingUp,
  Zap,
  Target,
  Shield,
  Star,
  ArrowRight
} from 'lucide-react';

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  stats: {
    label: string;
    value: string;
  }[];
  view: string;
}

interface ProfessionalDashboardProps {
  onNavigate: (view: string) => void;
}

export default function ProfessionalDashboard({ onNavigate }: ProfessionalDashboardProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const modules: ModuleCard[] = [
    {
      id: 'games',
      title: 'Gaming Arena',
      description: 'Challenge yourself with strategic games and earn rewards',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      stats: [
        { label: 'High Score', value: '12,450' },
        { label: 'Games Played', value: '48' }
      ],
      view: 'game-2048'
    },
    {
      id: 'quiz',
      title: 'AI Learning Lab',
      description: 'Enhance your knowledge with AI-powered quizzes',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      stats: [
        { label: 'Accuracy', value: '87%' },
        { label: 'Completed', value: '23' }
      ],
      view: 'quiz'
    },
    {
      id: 'battle',
      title: 'Battle Zone',
      description: 'Compete with players worldwide in real-time battles',
      icon: <Swords className="w-8 h-8" />,
      color: 'from-red-500 to-pink-600',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
      stats: [
        { label: 'Win Rate', value: '72%' },
        { label: 'Rank', value: 'Diamond' }
      ],
      view: 'battle'
    },
    {
      id: 'social',
      title: 'Social Hub',
      description: 'Connect, share, and collaborate with the community',
      icon: <Users className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-600',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
      stats: [
        { label: 'Friends', value: '156' },
        { label: 'Referrals', value: '12' }
      ],
      view: 'social'
    },
    {
      id: 'profile',
      title: 'Profile Center',
      description: 'Track your progress and manage your achievements',
      icon: <User className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-600',
      gradient: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)',
      stats: [
        { label: 'Level', value: '24' },
        { label: 'XP', value: '8,420' }
      ],
      view: 'profile'
    }
  ];

  // Animated background effect
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{x: number, y: number, vx: number, vy: number, size: number}> = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
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

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Animated Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/50 to-slate-950 z-10" />

      {/* Header */}
      <div className="relative z-20 text-center pt-12 pb-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-white mb-4"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Nexus Quantum
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-lg"
        >
          Welcome to your personalized command center
        </motion.p>
      </div>

      {/* Quick Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-20 max-w-6xl mx-auto px-6 mb-8"
      >
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-yellow-400 mb-1">
                <Zap className="w-5 h-5" />
                <span className="text-2xl font-bold">8,420</span>
              </div>
              <p className="text-slate-400 text-sm">Total XP</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                <TrendingUp className="w-5 h-5" />
                <span className="text-2xl font-bold">24</span>
              </div>
              <p className="text-slate-400 text-sm">Current Level</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                <Target className="w-5 h-5" />
                <span className="text-2xl font-bold">87%</span>
              </div>
              <p className="text-slate-400 text-sm">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
                <Shield className="w-5 h-5" />
                <span className="text-2xl font-bold">PRO</span>
              </div>
              <p className="text-slate-400 text-sm">Account Status</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Module Cards Grid */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredCard(module.id)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => onNavigate(module.view)}
              className="group relative"
            >
              {/* Card Background */}
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-slate-600/50">
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${module.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${module.color} text-white mb-4`}>
                  {module.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{module.description}</p>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  {module.stats.map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-slate-500 text-xs">{stat.label}</span>
                      <span className="text-white font-semibold text-sm">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* Arrow Indicator */}
                <div className="flex items-center text-slate-400 group-hover:text-white transition-colors">
                  <span className="text-sm mr-2">Enter</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover Glow Effect */}
              {hoveredCard === module.id && (
                <motion.div
                  layoutId="glow"
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${module.color} opacity-30 blur-xl`}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="fixed bottom-8 right-8 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg shadow-purple-500/25"
        >
          <Star className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
