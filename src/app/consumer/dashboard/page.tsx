'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Header, BottomNav } from '@/components/consumer';

// LAZY LOAD ICONS
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));

// ERROR BOUNDARY COMPONENT
function DashboardError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 safe-area-padding">
      <div className="text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldIcon className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
        <p className="text-gray-600 mb-4 text-sm">{error}</p>
        <button
          onClick={onRetry}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium touch-manipulation"
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
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse w-full">
      <div className="flex space-x-4 w-full">
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
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

function QuickActionSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse w-full">
      <div className="flex items-center space-x-3 w-full">
        <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

function WelcomeSkeleton() {
  return (
    <div className="animate-pulse w-full">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 mx-auto" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
    </div>
  );
}

export default function ConsumerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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
      icon: HomeIcon, 
      label: 'All Properties', 
      description: 'Browse listings',
      action: () => router.push('/consumer/properties'),
      color: 'bg-purple-50 text-purple-700 border-purple-200'
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
      <div className="min-h-screen bg-gray-50 pb-24 safe-area-padding lg:pb-0 w-full overflow-hidden">
        {/* Header Skeleton */}
        <div className="h-20 bg-white border-b border-gray-200 animate-pulse w-full" />
        
        {/* Content */}
        <div className="p-4 space-y-6 lg:max-w-4xl lg:mx-auto w-full overflow-hidden">
          {/* Welcome Skeleton */}
          <div className="w-full overflow-hidden">
            <WelcomeSkeleton />
          </div>
          
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 w-full">
            {[...Array(4)].map((_, i) => (
              <QuickActionSkeleton key={i} />
            ))}
          </div>
          
          {/* Properties Skeleton */}
          <div className="space-y-4 w-full">
            {[...Array(2)].map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 safe-area-padding lg:pb-0 w-full overflow-hidden">
      {/* REFRESH INDICATOR */}
      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 bg-blue-600 text-white py-3 text-center text-sm z-50 font-medium safe-area-padding w-full"
          >
            🔄 Refreshing...
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="w-full">
        <Header
          user={user}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onQuickSearch={handleQuickSearch}
          notifications={notifications}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full overflow-hidden">
        <main className="p-4 space-y-6 lg:max-w-4xl lg:mx-auto lg:px-8 w-full">
          {/* WELCOME MESSAGE */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full"
          >
            <div className="w-full max-w-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 lg:text-3xl break-words">
                {getGreeting()}, {user?.first_name || 'User'}! 👋
              </h1>
              <p className="text-gray-600 text-sm lg:text-base break-words">
                Ready to find your perfect property?
              </p>
            </div>
          </motion.section>

          {/* QUICK ACTIONS */}
          <section aria-labelledby="quick-actions-heading" className="w-full">
            <div className="flex items-center justify-between mb-4 w-full">
              <h2 id="quick-actions-heading" className="text-lg font-semibold text-gray-900 lg:text-xl break-words">
                Quick Access
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 w-full">
              {quickActions.map(({ icon: Icon, label, description, color, action }) => (
                <motion.button
                  key={label}
                  onClick={action}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-2xl border text-left transition-all hover:shadow-md touch-manipulation ${color} w-full min-w-0`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="p-2 rounded-lg bg-white flex-shrink-0">
                      <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className="font-semibold text-sm truncate lg:text-base">{label}</h3>
                      <p className="text-xs opacity-75 mt-0.5 truncate lg:text-sm">{description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* FEATURED PROPERTIES */}
          <section aria-labelledby="featured-properties-heading" className="w-full">
            <div className="flex items-center justify-between mb-4 w-full">
              <h2 id="featured-properties-heading" className="text-lg font-semibold text-gray-900 lg:text-xl break-words flex-1 min-w-0 pr-2">
                Featured Properties
              </h2>
              <button 
                onClick={() => router.push('/consumer/search')}
                className="text-blue-600 text-sm hover:underline font-medium flex items-center space-x-1 touch-manipulation lg:text-base flex-shrink-0 whitespace-nowrap"
              >
                <span>View all</span>
                <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
              </button>
            </div>

            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 w-full">
              {featuredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  onClick={() => router.push(`/consumer/property/${property.id}`)}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer touch-manipulation lg:p-6 w-full"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && router.push(`/consumer/property/${property.id}`)}
                  aria-label={`View ${property.title} in ${property.location}`}
                >
                  <div className="flex space-x-4 lg:space-x-6 w-full">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 relative lg:w-24 lg:h-24">
                      <BuildingIcon className="h-6 w-6 text-gray-400 lg:h-8 lg:w-8" />
                      {property.featured && (
                        <div className="absolute -top-1 -left-1 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center space-x-2 mb-1 w-full">
                        <h3 className="font-semibold text-gray-900 text-sm truncate lg:text-lg flex-1 min-w-0">
                          {property.title}
                        </h3>
                        {property.verified && (
                          <ShieldIcon className="h-4 w-4 text-green-500 flex-shrink-0 lg:h-5 lg:w-5" aria-label="Verified property" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600 text-sm mb-2 lg:text-base w-full">
                        <MapPinIcon className="h-3 w-3 flex-shrink-0 lg:h-4 lg:w-4" />
                        <span className="truncate flex-1 min-w-0">{property.location}</span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3 text-sm text-gray-600 lg:text-base flex-shrink-0 whitespace-nowrap">
                          <span>{property.beds} bed</span>
                          <span>{property.baths} bath</span>
                          <span>{property.area} sqft</span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="text-lg font-bold text-gray-900 lg:text-xl whitespace-nowrap">
                            P{property.price.toLocaleString()}/mo
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 lg:text-sm justify-end">
                            <StarIcon className="h-3 w-3 text-yellow-500 fill-current lg:h-4 lg:w-4 flex-shrink-0" />
                            <span>{property.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="w-full">
        <BottomNav />
      </div>
    </div>
  );
}