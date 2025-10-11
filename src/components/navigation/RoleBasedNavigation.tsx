// src/components/navigation/RoleBasedNavigation.tsx - ENTERPRISE GRADE
'use client';

import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

// LAZY LOAD ROLE-SPECIFIC NAVS
const ConsumerNavigation = dynamic(() => import('./ConsumerNavigation'), {
  loading: () => <NavigationSkeleton />,
  ssr: false
});

const LandlordNavigation = dynamic(() => import('./LandlordNavigation'), {
  loading: () => <NavigationSkeleton />,
  ssr: false
});

const AgentNavigation = dynamic(() => import('./AgentNavigation'), {
  loading: () => <NavigationSkeleton />,
  ssr: false
});

const ServiceProviderNavigation = dynamic(() => import('./ServiceProviderNavigation'), {
  loading: () => <NavigationSkeleton />,
  ssr: false
});

const AdminNavigation = dynamic(() => import('./AdminNavigation'), {
  loading: () => <NavigationSkeleton />,
  ssr: false
});

// NAVIGATION SKELETON
function NavigationSkeleton() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 safe-bottom">
      <div className="flex justify-around items-center h-full px-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-10 h-2 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoleBasedNavigation() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setUserRole(profile?.role || 'consumer');
        } else {
          // Path-based fallback
          if (pathname.startsWith('/landlord')) setUserRole('landlord');
          else if (pathname.startsWith('/agent')) setUserRole('agent');
          else if (pathname.startsWith('/service-provider')) setUserRole('service_provider');
          else if (pathname.startsWith('/admin')) setUserRole('admin');
          else setUserRole('consumer');
        }
      } catch (error) {
        console.error('Role check failed:', error);
        setUserRole('consumer');
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [pathname]);

  if (loading) {
    return <NavigationSkeleton />;
  }

  // RENDER ROLE-SPECIFIC NAVIGATION
  switch (userRole) {
    case 'landlord':
      return (
        <Suspense fallback={<NavigationSkeleton />}>
          <LandlordNavigation />
        </Suspense>
      );
    case 'agent':
      return (
        <Suspense fallback={<NavigationSkeleton />}>
          <AgentNavigation />
        </Suspense>
      );
    case 'service_provider':
      return (
        <Suspense fallback={<NavigationSkeleton />}>
          <ServiceProviderNavigation />
        </Suspense>
      );
    case 'admin':
      return (
        <Suspense fallback={<NavigationSkeleton />}>
          <AdminNavigation />
        </Suspense>
      );
    case 'consumer':
    default:
      return (
        <Suspense fallback={<NavigationSkeleton />}>
          <ConsumerNavigation />
        </Suspense>
      );
  }
}
