"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { QuantumButton } from '@/components/quantum-effects';
import VirtualMarketplace from '@/components/features/virtual-marketplace';

export default function MarketplacePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-4 container mx-auto max-w-7xl">
        <QuantumButton onClick={() => router.back()} size="sm" variant="secondary">
          <ChevronLeft className="w-5 h-5" />
        </QuantumButton>
        <h1 className="text-2xl font-bold text-white">Nexus Marketplace</h1>
      </div>

      <VirtualMarketplace />
    </div>
  );
}
