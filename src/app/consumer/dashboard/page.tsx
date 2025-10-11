// src/app/consumer/dashboard/page.tsx - WINDOWS BATTLE-TESTED
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// DIRECT ICON IMPORTS - PREVENT CHUNK ERRORS
import { Home } from 'lucide-react';
import { Search } from 'lucide-react';
import { Heart } from 'lucide-react';
import { User } from 'lucide-react';
import { Bell } from 'lucide-react';
import { Building2 } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Shield } from 'lucide-react';

export default function ConsumerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw new Error('Authentication failed');
        }
        
        if (!session) {
          console.log('No session, redirecting to login');
          router.push('/auth/login');
          return;
        }

        console.log('Session found, fetching profile...');

        // Get user profile with error handling
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.warn('Profile fetch error:', profileError);
          // Use basic user info from session
          setUser({
            first_name: session.user.email?.split('@')[0] || 'User',
            email: session.user.email
          });
        } else {
          console.log('Profile loaded:', profile);
          setUser(profile);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Dashboard initialization error:', err);
        setError(err.message || 'Failed to load dashboard');
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quick actions data
  const quickActions = [
    { 
      icon: Search, 
      label: 'Find Properties', 
      description: 'Browse listings',
      href: '/consumer/search',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      icon: Heart, 
      label: 'Saved', 
      description: 'Your favorites',
      href: '/consumer/saved',
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    { 
      icon: Building2, 
      label: 'Bookings', 
      description: 'View tours',
      href: '/consumer/booking',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    { 
      icon: User, 
      label: 'Profile', 
      description: 'Account settings',
      href: '/consumer/profile',
      color: 'bg-gray-50 text-gray-700 border-gray-200'
    }
  ];

  // Featured properties data
  const featuredProperties = [
    {
      id: '1',
      title: 'CBD Luxury Apartment',
      location: 'CBD, Gaborone',
      price: 14500,
      beds: 2,
      baths: 2,
      area: 1200,
      verified: true
    },
    {
      id: '2', 
      title: 'Phakalane Family Home',
      location: 'Phakalane Estate',
      price: 25000,
      beds: 4,
      baths: 3,
      area: 2400,
      verified: true
    }
  ];

  // Bottom navigation items
  const navItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Search' },
    { icon: Heart, label: 'Saved' },
    { icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                Welcome back, {user?.first_name || 'User'}
              </h1>
              <p className="text-gray-600 text-sm truncate">
                Ready to find your next property?
              </p>
            </div>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => console.log('Notifications clicked')}
            >
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Quick Actions Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ icon: Icon, label, description, href, color }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className={`p-4 border rounded-xl text-left transition-all hover:shadow-sm active:scale-95 ${color}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{label}</h3>
                    <p className="text-gray-600 text-xs mt-0.5 truncate">{description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Properties Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Featured Properties</h2>
              <p className="text-gray-600 text-sm">Premium listings for you</p>
            </div>
            <button 
              onClick={() => router.push('/consumer/search')}
              className="text-blue-600 font-medium text-sm hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => router.push(`/consumer/property/${property.id}`)}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {property.title}
                          </h3>
                          {property.verified && (
                            <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600 text-sm">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{property.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{property.beds} bed</span>
                        <span>{property.baths} bath</span>
                        <span>{property.area} sqft</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        P{property.price.toLocaleString()}/mo
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="px-4 py-2">
          <div className="flex justify-around items-center">
            {navItems.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                onClick={() => {
                  if (label === 'Home') return; // Already on home
                  router.push(`/consumer/${label.toLowerCase()}`);
                }}
                className={`flex flex-col items-center p-2 transition-all ${
                  active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1 font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}