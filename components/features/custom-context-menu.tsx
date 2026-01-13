"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, Share2, Home, ArrowLeft, Settings } from 'lucide-react';

export default function CustomContextMenu() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    const handleScroll = () => {
        setVisible(false);
    }

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    { icon: <Home className="w-4 h-4" />, label: 'Home', action: () => window.location.href = '/' },
    { icon: <ArrowLeft className="w-4 h-4" />, label: 'Back', action: () => window.history.back() },
    { icon: <RefreshCw className="w-4 h-4" />, label: 'Reload', action: () => window.location.reload() },
    { type: 'divider' },
    { icon: <Copy className="w-4 h-4" />, label: 'Copy', action: () => document.execCommand('copy') },
    { icon: <Share2 className="w-4 h-4" />, label: 'Share', action: () => navigator.share?.({ url: window.location.href }) },
    { type: 'divider' },
    { icon: <Settings className="w-4 h-4" />, label: 'Settings', action: () => console.log('Settings') },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.1 }}
          className="fixed z-[9999] min-w-[180px] bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
          style={{ top: position.y, left: position.x }}
        >
          <div className="p-1">
            {menuItems.map((item, index) => (
              item.type === 'divider' ? (
                <div key={index} className="h-px bg-slate-700 my-1 mx-2" />
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    item.action?.();
                    setVisible(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
