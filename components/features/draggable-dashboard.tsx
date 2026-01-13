"use client";

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripHorizontal, X } from 'lucide-react';
import { QuantumCard } from '../quantum-effects';

interface Widget {
  id: string;
  content: React.ReactNode;
  size: 'small' | 'medium' | 'large';
}

interface DraggableDashboardProps {
  widgets: Widget[];
}

export default function DraggableDashboard({ widgets: initialWidgets }: DraggableDashboardProps) {
  const [items, setItems] = useState(initialWidgets);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <GripHorizontal className="w-5 h-5 text-blue-400" />
          Customizable Layout
        </h3>
        <p className="text-xs text-slate-400">Drag to reorder</p>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-4">
        {items.map((item) => (
          <Reorder.Item key={item.id} value={item}>
            <div className="relative group cursor-grab active:cursor-grabbing">
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripHorizontal className="w-4 h-4 text-slate-500" />
              </div>
              {item.content}
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
