// app/consumer/dashboard/page.tsx - COMPLETE PRODUCTION PAGE
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// LAZY LOAD ALL FUCKING ICONS - NO MISSING IMPORTS!
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const BellIcon = dynamic(() => import('lucide-react').then(mod => mod.Bell));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const ZapIcon = dynamic(() => import('lucide-react').then(mod => mod.Zap));
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User)); // ← YOU MISSED THIS!

// ERROR BOUNDARY COMPONENT
function DashboardError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldIcon className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
        <p className="text-gray-600 mb-4 text-sm">{error}</p>
        <button
          onClick={onRetry}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// SKELETON LOADERS
function PropertySkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
      <div className="flex space-x-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConsumerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [refreshing, setRefreshing] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // CLOSE USER MENU ON CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // PULL-TO-REFRESH
  useEffect(() => {
    let startY = 0;
    let pulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      pulling = window.scrollY === 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!pulling) return;
      
      const pullDistance = e.touches[0].clientY - startY;
      if (pullDistance > 100 && !refreshing) {
        handleRefresh();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [refreshing]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await checkAuth();
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setError(null);
      const supabase = createClient();
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw new Error('Authentication failed');
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        // Fallback to session data
        setUser({
          first_name: session.user.email?.split('@')[0] || 'User',
          email: session.user.email
        });
      } else {
        setUser(profile);
      }
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleQuickSearch = () => {
    const query = searchQuery.trim();
    if (query) {
      router.push(`/consumer/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/consumer/search');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickSearch();
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  // USER MENU OPTIONS - WITH ALL FUCKING ICONS DEFINED!
  const userMenuOptions = [
    { icon: UserIcon, label: 'My Profile', action: () => router.push('/consumer/profile') },
    { icon: BellIcon, label: 'Notifications', action: () => router.push('/consumer/notifications') },
    { icon: CalendarIcon, label: 'Bookings', action: () => router.push('/consumer/booking') },
    { icon: HeartIcon, label: 'Favorites', action: () => router.push('/consumer/saved') },
    { icon: ShieldIcon, label: 'Sign Out', action: handleLogout, destructive: true }
  ];

  // QUICK ACTIONS
  const quickActions = [
    { 
      icon: SearchIcon, 
      label: 'Smart Search', 
      description: 'Find properties',
      action: handleQuickSearch,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      icon: HeartIcon, 
      label: 'Favorites', 
      description: 'Saved properties',
      action: () => router.push('/consumer/saved'),
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    { 
      icon: CalendarIcon, 
      label: 'Viewings', 
      description: 'Scheduled tours',
      action: () => router.push('/consumer/booking'),
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    { 
      icon: BellIcon, 
      label: 'Alerts', 
      description: 'Price drops',
      action: () => router.push('/consumer/alerts'),
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  // PROPERTY DATA
  const featuredProperties = [
    {
      id: '1',
      title: 'CBD Luxury Apartment',
      location: 'CBD, Gaborone',
      price: 14500,
      beds: 2,
      baths: 2,
      area: 1200,
      verified: true,
      rating: 4.8,
      featured: true
    },
    {
      id: '2', 
      title: 'Phakalane Family Home',
      location: 'Phakalane Estate',
      price: 25000,
      beds: 4,
      baths: 3,
      area: 2400,
      verified: true,
      rating: 4.9,
      featured: true
    }
  ];

  // ERROR STATE
  if (error) {
    return <DashboardError error={error} onRetry={checkAuth} />;
  }

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 space-y-6">
        {/* Header Skeleton */}
        <div className="h-32 bg-white rounded-2xl animate-pulse" />
        
        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
        
        {/* Properties Skeleton */}
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <PropertySkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* REFRESH INDICATOR */}
      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 bg-blue-600 text-white py-3 text-center text-sm z-50 font-medium"
          >
            🔄 Refreshing...
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-30"
      >
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                Welcome back, {user?.first_name || 'User'}
              </h1>
              <p className="text-gray-600 text-sm truncate">
                Ready to find your perfect property?
              </p>
            </div>

            {/* USER CONTROLS */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => router.push('/consumer/notifications')}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {user?.first_name || 'User'}
                        </p>
                        <p className="text-gray-600 text-xs truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        {userMenuOptions.map(({ icon: Icon, label, action, destructive }) => (
                          <button
                            key={label}
                            onClick={() => {
                              action();
                              setShowUserMenu(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${
                              destructive 
                                ? 'text-red-600 hover:bg-red-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties, locations, amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-500"
              aria-label="Search properties"
            />
          </div>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <main className="p-4 space-y-6">
        {/* QUICK ACTIONS */}
        <section aria-labelledby="quick-actions-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="quick-actions-heading" className="text-lg font-semibold text-gray-900">
              Quick Access
            </h2>
            <ZapIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ icon: Icon, label, description, color, action }) => (
              <button
                key={label}
                onClick={action}
                className={`p-4 rounded-2xl border text-left transition-all hover:shadow-md ${color}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{label}</h3>
                    <p className="text-xs opacity-75 mt-0.5 truncate">{description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* FEATURED PROPERTIES */}
        <section aria-labelledby="featured-properties-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="featured-properties-heading" className="text-lg font-semibold text-gray-900">
              Featured Properties
            </h2>
            <button 
              onClick={() => router.push('/consumer/search')}
              className="text-blue-600 text-sm hover:underline font-medium flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => router.push(`/consumer/property/${property.id}`)}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && router.push(`/consumer/property/${property.id}`)}
                aria-label={`View ${property.title} in ${property.location}`}
              >
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                    <BuildingIcon className="h-6 w-6 text-gray-400" />
                    {property.featured && (
                      <div className="absolute -top-1 -left-1 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {property.title}
                      </h3>
                      {property.verified && (
                        <ShieldIcon className="h-4 w-4 text-green-500 flex-shrink-0" aria-label="Verified property" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 text-sm mb-2">
                      <MapPinIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{property.beds} bed</span>
                        <span>{property.baths} bath</span>
                        <span>{property.area} sqft</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          P{property.price.toLocaleString()}/mo
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <StarIcon className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{property.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}