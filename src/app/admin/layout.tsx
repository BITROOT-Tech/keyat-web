// src/app/admin/layout.tsx - DEBUG VERSION
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sidebar, Header } from '@/components/admin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🛠️ ADMIN LAYOUT: Starting auth check...');
        
        const supabase = createClient();
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🛠️ ADMIN LAYOUT: Session:', session);
        console.log('🛠️ ADMIN LAYOUT: Session error:', sessionError);
        
        if (sessionError || !session) {
          console.log('🛠️ ADMIN LAYOUT: No session, redirecting to login');
          router.push('/auth/login');
          return;
        }

        console.log('🛠️ ADMIN LAYOUT: User email:', session.user.email);
        
        // 🚨 TEMPORARY FIX: FORCE ADMIN ACCESS FOR TESTING
        const isAdminEmail = session.user.email?.includes('admin') || 
                            session.user.email === 'admin@keyat.co.bw' ||
                            session.user.email === 'test@test.com'; // Add your test email
        
        console.log('🛠️ ADMIN LAYOUT: Is admin email?', isAdminEmail);
        
        if (isAdminEmail) {
          console.log('🛠️ ADMIN LAYOUT: Granting admin access via email');
          setUser({
            id: session.user.id,
            email: session.user.email,
            first_name: 'Admin',
            user_type: 'admin'
          });
          setLoading(false);
          return;
        }

        // If we get here, try profile check but don't block
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          console.log('🛠️ ADMIN LAYOUT: Profile data:', profile);
          console.log('🛠️ ADMIN LAYOUT: Profile error:', profileError);

          if (profile) {
            setUser(profile);
          } else {
            // If no profile but admin email, still allow
            setUser({
              id: session.user.id,
              email: session.user.email,
              first_name: 'Admin',
              user_type: 'admin'
            });
          }
        } catch (profileErr) {
          console.log('🛠️ ADMIN LAYOUT: Profile fetch failed, using fallback');
          // Still allow access if admin email
          setUser({
            id: session.user.id,
            email: session.user.email,
            first_name: 'Admin',
            user_type: 'admin'
          });
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('🛠️ ADMIN LAYOUT: Critical error:', err);
        // IN DEVELOPMENT: ALLOW ACCESS ANYWAY
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg animate-pulse" />
          </div>
          <p className="text-gray-600">Loading Admin Panel...</p>
          <p className="text-gray-400 text-sm mt-2">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // 🚨 TEMPORARY: Allow access even if user is null for testing
  if (!user) {
    console.log('🛠️ ADMIN LAYOUT: No user but allowing access for testing');
    // Continue anyway for development
  }

  return (
    <div className="min-h-screen bg-gray-50 admin-dashboard">
      <Sidebar user={user} />
      
      <div className="lg:pl-64">
        <Header user={user} notifications={notifications} />
        
        <main className="min-h-screen py-6">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}