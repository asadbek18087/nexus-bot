'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Globe, 
  Bot, 
  Sparkles, 
  Maximize2, 
  Minimize2
} from 'lucide-react';
import Link from 'next/link';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

type Language = 'uz' | 'ru' | 'en';

const TRANSLATIONS = {
  uz: {
    title: 'AI Yordamchilar',
    subtitle: 'Google va Microsoft sun\'iy intellektlari',
    returnHome: 'Asosiy menyu',
    selectAi: 'AI tanlang',
    copilotDesc: 'Microsoft Copilot',
    googleDesc: 'Google AI',
    fullscreen: 'To\'liq ekran',
    exitFullscreen: 'Kichik ekran'
  },
  ru: {
    title: 'AI Помощники',
    subtitle: 'Искусственный интеллект Google и Microsoft',
    returnHome: 'Главное меню',
    selectAi: 'Выберите ИИ',
    copilotDesc: 'Microsoft Copilot',
    googleDesc: 'Google AI',
    fullscreen: 'На весь экран',
    exitFullscreen: 'Обычный режим'
  },
  en: {
    title: 'AI Assistants',
    subtitle: 'Google and Microsoft AI',
    returnHome: 'Main Menu',
    selectAi: 'Select AI',
    copilotDesc: 'Microsoft Copilot',
    googleDesc: 'Google AI',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen'
  }
};

export default function AIToolsPage() {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('uz');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Exact URLs provided by the user
  const AI_URLS = {
    copilot: 'https://www.bing.com/copilotsearch?setlang=en-us&cc=UZ&form=WSHAIT&cvid=f101d1757fc64402b56cc92e2d82f1a7&nclid=90CC2747FFFD64C931A81D19E20E55AD&ts=1768320565502&PC=WSBDSB',
    google: 'https://www.google.com/sorry/index?continue=https://www.google.com/search%3Fq%3D%26rlz%3D1C1GCEA_enUZ1193UZ1193%26sourceid%3Dchrome%26ie%3DUTF-8%26udm%3D50%26aep%3D48%26cud%3D0%26qsubts%3D1768318706749&q=EgS5i4ktGPzOmcsGIjBjrMUhpeYNCa2Q_OIgl2I3rZRBeaGlD3c6bMHAG9IfvMS5LttUhKx-ofrw2YIZF-0yAnJSWgFD'
  };

  const t = TRANSLATIONS[lang];

  const handleAiSelect = (url: string) => {
    setActiveUrl(url);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`min-h-screen bg-slate-900 ${isFullscreen ? 'p-0' : 'p-4'}`}>
      {/* Header Bar */}
      <div className={`w-full bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4 py-3 z-50 ${isFullscreen ? 'fixed top-0 left-0 right-0' : 'rounded-xl mb-4'}`}>
        <div className="flex items-center gap-2">
          {/* Back Button */}
          {activeUrl ? (
            <Button 
              variant="ghost" 
              onClick={() => setActiveUrl(null)}
              className="text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t.selectAi}
            </Button>
          ) : (
            <Link href="/hub">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700/50">
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t.returnHome}
              </Button>
            </Link>
          )}
        </div>

        {/* Center Title (only visible if not on mobile/small screens) */}
        {!activeUrl && <h1 className="text-white font-semibold hidden md:block">{t.title}</h1>}

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-slate-800 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
                <Globe className="w-4 h-4 mr-2" />
                {lang.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              <DropdownMenuItem onClick={() => setLang('uz')} className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                O&apos;zbek
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang('ru')} className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                Русский
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang('en')} className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Fullscreen Toggle (only when AI is active) */}
          {activeUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`w-full ${isFullscreen ? 'h-screen pt-16' : 'h-[calc(100vh-100px)]'}`}>
        {!activeUrl ? (
          // Selection Cards
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center justify-center max-w-4xl mx-auto">
            {/* Copilot Card */}
            <Card 
              onClick={() => handleAiSelect(AI_URLS.copilot)}
              className="group cursor-pointer bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all p-8 flex flex-col items-center justify-center text-center space-y-6 h-64 hover:scale-105 duration-300"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Microsoft Copilot</h2>
                <p className="text-slate-400">{t.copilotDesc}</p>
              </div>
            </Card>

            {/* Google AI Card */}
            <Card 
              onClick={() => handleAiSelect(AI_URLS.google)}
              className="group cursor-pointer bg-slate-800/50 border-blue-500/20 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all p-8 flex flex-col items-center justify-center text-center space-y-6 h-64 hover:scale-105 duration-300"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-red-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Google AI</h2>
                <p className="text-slate-400">{t.googleDesc}</p>
              </div>
            </Card>
          </div>
        ) : (
          // Iframe Container
          <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={activeUrl}
              className="w-full h-full border-0"
              allow="microphone; camera; clipboard-write; clipboard-read; geolocation"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
              title="AI Tool"
            />
          </div>
        )}
      </div>
    </div>
  );
}
