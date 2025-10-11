// src/app/consumer/dashboard/page.tsx - BATTLE-TESTED
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Home, Search, Heart, User, Bell, Building2,
  MapPin, ChevronRight, Shield, RefreshCw
} from 'lucide-react';

export default function ConsumerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setUser(profile);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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

  // Mock properties data
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
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
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

        {/* Featured Properties */}
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
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
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
                            <Shield className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600 text-sm">
                          <MapPin className="h-3 w-3" />
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="px-4 py-2">
          <div className="flex justify-around items-center">
            {[
              { icon: Home, label: 'Home', active: true },
              { icon: Search, label: 'Search' },
              { icon: Heart, label: 'Saved' },
              { icon: User, label: 'Profile' },
            ].map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`flex flex-col items-center p-2 transition-all ${
                  active ? 'text-blue-600' : 'text-gray-500'
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