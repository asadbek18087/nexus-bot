"use client";

import { PageTransition } from '@/components/micro-interactions';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      {children}
    </PageTransition>
  );
}
