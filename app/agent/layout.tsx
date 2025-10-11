// app/agent/layout.tsx
'use client';

import { Suspense } from 'react';
import { RoleBasedNavigation } from '@/components/navigation';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 safe-bottom">
      <main className="pb-20">
        {children}
      </main>
      
      <Suspense fallback={
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 safe-bottom" />
      }>
        <RoleBasedNavigation />
      </Suspense>
    </div>
  );
}
