// src\app\(consumer)\dashboard\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Search, Home, Heart, Bell, User, MapPin, Filter, Plus, Calendar, Truck } from 'lucide-react';

interface UserProfile {
  first_name: string;
  last_name: string;
  user_type: string;
}

export default function ConsumerDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setUser(profile);
        }
      } catch (error) {
        console.error('Error in dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router, supabase]);

  // Navigation handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Search':
        router.push('/search');
        break;
      case 'Saved':
        router.push('/profile?saved=true');
        break;
      case 'Alerts':
        // Open notifications
        break;
      case 'Near Me':
        router.push('/search?location=nearby');
        break;
      default:
        break;
    }
  };

  const handleBottomNav = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'discover':
        // Already on dashboard
        break;
      case 'search':
        router.push('/search');
        break;
      case 'add':
        // Future: Add property feature
        break;
      case 'saved':
        router.push('/profile?saved=true');
        break;
      case 'profile':
        router.push('/profile');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Mobile Header - Simplified */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 md:relative">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Welcome - Mobile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center md:w-10 md:h-10 md:rounded-xl">
                <span className="text-white font-bold text-sm md:text-lg">K</span>
              </div>
              <div className="md:hidden">
                <p className="text-sm font-medium text-gray-900">Welcome back</p>
                <p className="text-xs text-gray-600">{user?.first_name || 'User'}</p>
              </div>
            </div>

            {/* Desktop Logo */}
            <div className="hidden md:block">
              <span className="text-xl font-bold text-gray-900">Keyat</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.push('/booking')}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
              >
                <Calendar className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-white"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1.5">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name || 'User'}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar - Always Visible */}
          <div className="mt-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder="Search properties, areas..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Filter 
                  className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => router.push('/search?filters=open')}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 max-w-7xl mx-auto">
        {/* Welcome Section - Desktop */}
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back{user?.first_name ? `, ${user.first_name}` : ''}! 👋
          </h1>
          <p className="text-gray-600 text-sm">
            Ready to find your perfect property in Botswana?
          </p>
        </div>

        {/* Quick Stats - Horizontal Scroll on Mobile */}
        <div className="mb-6">
          <div className="flex space-x-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
            {/* Saved Properties */}
            <div 
              onClick={() => router.push('/profile?saved=true')}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 min-w-[140px] flex-shrink-0 md:min-w-0 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Saved</p>
                  <p className="text-lg font-bold text-gray-900">12</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </div>

            {/* Properties Viewed */}
            <div 
              onClick={() => router.push('/profile?activity=viewed')}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 min-w-[140px] flex-shrink-0 md:min-w-0 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Viewed</p>
                  <p className="text-lg font-bold text-gray-900">24</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Bookings */}
            <div 
              onClick={() => router.push('/booking')}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 min-w-[140px] flex-shrink-0 md:min-w-0 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Tours</p>
                  <p className="text-lg font-bold text-gray-900">3</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>

            {/* Moving Services */}
            <div 
              onClick={() => router.push('/moving')}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 min-w-[140px] flex-shrink-0 md:min-w-0 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Moving</p>
                  <p className="text-lg font-bold text-gray-900">1</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Grid Layout */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3 md:text-lg md:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {[
              { icon: Search, label: 'Search', color: 'blue', action: 'Search' },
              { icon: MapPin, label: 'Near Me', color: 'green', action: 'Near Me' },
              { icon: Heart, label: 'Saved', color: 'purple', action: 'Saved' },
              { icon: Calendar, label: 'Bookings', color: 'orange', action: 'Bookings' },
            ].map(({ icon: Icon, label, color, action }) => (
              <button
                key={label}
                onClick={() => handleQuickAction(action)}
                className="flex flex-col items-center p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group md:p-3"
              >
                <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center mb-1 group-hover:bg-${color}-200 transition-colors md:w-10 md:h-10 md:mb-2`}>
                  <Icon className={`h-4 w-4 text-${color}-600 md:h-5 md:w-5`} />
                </div>
                <span className="font-medium text-gray-900 text-xs md:text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 md:text-lg">Recent Activity</h2>
            <button 
              onClick={() => router.push('/profile?activity=all')}
              className="text-blue-600 font-medium hover:text-blue-700 text-sm"
            >
              View all
            </button>
          </div>
          
          <div className="space-y-3">
            <div 
              onClick={() => router.push('/property/1')}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                <Home className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">Viewed Modern Apartment</div>
                <div className="text-gray-600 text-xs">Block 9, Gaborone • 2 hours ago</div>
              </div>
            </div>

            <div 
              onClick={() => router.push('/booking')}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">Tour scheduled</div>
                <div className="text-gray-600 text-xs">Tomorrow at 2:00 PM • Phakalane House</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Properties */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 md:text-lg">Recommended for You</h2>
            <button 
              onClick={() => router.push('/search?recommended=true')}
              className="text-blue-600 font-medium hover:text-blue-700 text-sm"
            >
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Property Card 1 */}
            <div 
              onClick={() => router.push('/property/1')}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                <Home className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm mb-1">Modern Apartment in Gaborone</div>
                <div className="text-blue-600 font-semibold text-sm mb-1">P4,500/month</div>
                <div className="flex items-center space-x-2 text-gray-600 text-xs">
                  <span>2 beds</span>
                  <span>•</span>
                  <span>1 bath</span>
                  <span>•</span>
                  <span>Block 9</span>
                </div>
              </div>
            </div>

            {/* Property Card 2 */}
            <div 
              onClick={() => router.push('/property/2')}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                <Home className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm mb-1">Spacious Family House</div>
                <div className="text-blue-600 font-semibold text-sm mb-1">P8,000/month</div>
                <div className="flex items-center space-x-2 text-gray-600 text-xs">
                  <span>4 beds</span>
                  <span>•</span>
                  <span>3 baths</span>
                  <span>•</span>
                  <span>Phakalane</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around items-center h-14">
          {[
            { icon: Home, label: 'Home', id: 'discover' },
            { icon: Search, label: 'Search', id: 'search' },
            { icon: Plus, label: 'Add', id: 'add' },
            { icon: Heart, label: 'Saved', id: 'saved' },
            { icon: User, label: 'Profile', id: 'profile' },
          ].map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => handleBottomNav(id)}
              className={`flex flex-col items-center p-1 transition-colors ${
                activeTab === id ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-0.5">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}