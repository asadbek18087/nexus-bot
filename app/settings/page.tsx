"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SuperAppLayout from '@/components/SuperAppLayout';
import { motion } from 'framer-motion';
import { 
  User, Bell, Shield, Smartphone, Globe, Moon, 
  Volume2, HelpCircle, LogOut, ChevronRight, ChevronLeft 
} from 'lucide-react';
import { QuantumButton, QuantumCard } from '@/components/quantum-effects';

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('English');

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', href: '/profile/edit' },
        { icon: Shield, label: 'Privacy & Security', href: '/settings/privacy' },
        { icon: Smartphone, label: 'Linked Devices', href: '/settings/devices' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: Bell, 
          label: 'Notifications', 
          type: 'toggle', 
          value: notifications, 
          onChange: () => setNotifications(!notifications) 
        },
        { 
          icon: Volume2, 
          label: 'Sound Effects', 
          type: 'toggle', 
          value: sound, 
          onChange: () => setSound(!sound) 
        },
        { 
          icon: Moon, 
          label: 'Dark Mode', 
          type: 'toggle', 
          value: darkMode, 
          onChange: () => setDarkMode(!darkMode) 
        },
        { 
          icon: Globe, 
          label: 'Language', 
          type: 'select', 
          value: language, 
          options: ['English', 'Uzbek', 'Russian'],
          onChange: (val: string) => setLanguage(val)
        },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', href: '/support' },
        { icon: MessageSquare, label: 'Contact Us', href: '/support/contact' },
      ]
    }
  ];

  return (
    <SuperAppLayout>
      <div className="min-h-screen p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <QuantumButton onClick={() => router.back()} size="sm" variant="secondary">
              <ChevronLeft className="w-5 h-5" />
            </QuantumButton>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider px-2">
                  {section.title}
                </h2>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                  {section.items.map((item: any, itemIdx) => (
                    <div 
                      key={itemIdx}
                      className={`
                        flex items-center justify-between p-4 hover:bg-slate-800/80 transition-colors
                        ${itemIdx !== section.items.length - 1 ? 'border-b border-slate-700/50' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-700/50 rounded-lg">
                          <item.icon className="w-5 h-5 text-slate-300" />
                        </div>
                        <span className="font-medium text-slate-200">{item.label}</span>
                      </div>

                      {item.type === 'toggle' ? (
                        <button
                          onClick={item.onChange}
                          className={`
                            w-12 h-6 rounded-full transition-colors relative
                            ${item.value ? 'bg-violet-600' : 'bg-slate-700'}
                          `}
                        >
                          <motion.div
                            initial={false}
                            animate={{ x: item.value ? 24 : 2 }}
                            className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                          />
                        </button>
                      ) : item.type === 'select' ? (
                        <select
                          value={item.value}
                          onChange={(e) => item.onChange(e.target.value)}
                          className="bg-transparent text-slate-400 text-sm focus:outline-none cursor-pointer"
                        >
                          {item.options.map((opt: string) => (
                            <option key={opt} value={opt} className="bg-slate-800">
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Logout Button */}
            <button className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium">
              <LogOut className="w-5 h-5" />
              Log Out
            </button>

            <div className="text-center text-xs text-slate-500 pt-4">
              <p>Nexus Web App v1.0.0</p>
              <p className="mt-1">© 2024 Nexus Inc.</p>
            </div>
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}

// Helper icon component
function MessageSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
