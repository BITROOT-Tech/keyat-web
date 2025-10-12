'use client';

import { RoleBasedNavigation } from '@/components/navigation';

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <RoleBasedNavigation />
      <main className="lg:pt-0">
        {children}
      </main>
    </div>
  );
}