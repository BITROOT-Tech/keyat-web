// components/AuthGuard.tsx - BATTLE-TESTED
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { USER_ROLES } from '@/lib/constants';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallbackPath?: string;
}

export default function AuthGuard({ 
  children, 
  requiredRole, 
  fallbackPath = '/auth/login' 
}: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        router.push(fallbackPath);
        return;
      }

      const userType = session.user.user_metadata?.user_type || USER_ROLES.TENANT;

      // Check role authorization
      if (requiredRole && userType !== requiredRole) {
        router.push('/unauthorized');
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Auth guard error:', error);
      router.push(fallbackPath);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}