// src/app/consumer/layout.tsx - CLEAN VERSION WITH SIMPLE LOADER
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sidebar, BottomNav } from '@/components/consumer';

// SIMPLE PROFESSIONAL LOADER COMPONENT
function SimpleLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center safe-area-padding">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading your dashboard</p>
        <p className="text-gray-400 text-sm mt-1">Preparing your experience</p>
      </div>
    </div>
  );
}

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw new Error('Authentication failed');
        if (!session) {
          router.push('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser(profile || session.user);
        setLoading(false);
      } catch (err: any) {
        console.error('Consumer layout error:', err);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // SIMPLE LOADER: Show while checking auth
  if (loading) {
    return <SimpleLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 consumer-dashboard">
      <Sidebar user={user} />
      
      <div className="lg:pl-64">
        <main className="min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}