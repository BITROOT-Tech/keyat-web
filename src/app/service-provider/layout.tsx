//src\app\service-provider\layout.tsx
'use client';

import { Sidebar } from '@/components/service-provider';

export default function ServiceProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}