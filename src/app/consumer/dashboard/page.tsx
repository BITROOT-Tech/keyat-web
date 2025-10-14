'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Header, BottomNav } from '@/components/consumer';

// LAZY LOAD ICONS - NO BELLICON HERE
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const ZapIcon = dynamic(() => import('lucide-react').then(mod => mod.Zap));
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));

// ERROR BOUNDARY COMPONENT
function DashboardError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 safe-area-padding">
      <div className="text-center max-w-sm">
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

function QuickActionSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

function WelcomeSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
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

  // QUICK ACTIONS - NO DUPLICATE NOTIFICATION BELL
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
      <div className="min-h-screen bg-gray-50 pb-24 safe-area-padding"> {/* Increased padding */}
        {/* Header Skeleton */}
        <div className="h-20 bg-white border-b border-gray-200 animate-pulse" />
        
        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Welcome Skeleton */}
          <WelcomeSkeleton />
          
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <QuickActionSkeleton key={i} />
            ))}
          </div>
          
          {/* Properties Skeleton */}
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 safe-area-padding"> {/* Increased from pb-20 to pb-24 */}
      {/* REFRESH INDICATOR */}
      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 bg-blue-600 text-white py-3 text-center text-sm z-50 font-medium safe-area-padding"
          >
            🔄 Refreshing...
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER - CLEAN & MINIMAL */}
      <Header
        user={user}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onQuickSearch={handleQuickSearch}
        notifications={notifications}
      />

      {/* MAIN CONTENT */}
      <main className="p-4 space-y-6">
        {/* WELCOME MESSAGE - NOW IN CONTENT AREA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.first_name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 text-sm">
            Ready to find your perfect property?
          </p>
        </motion.section>

        {/* QUICK ACTIONS */}
        <section aria-labelledby="quick-actions-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="quick-actions-heading" className="text-lg font-semibold text-gray-900">
              Quick Access
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ icon: Icon, label, description, color, action }) => (
              <motion.button
                key={label}
                onClick={action}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl border text-left transition-all hover:shadow-md touch-manipulation ${color}`}
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
              </motion.button>
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
              className="text-blue-600 text-sm hover:underline font-medium flex items-center space-x-1 touch-manipulation"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                onClick={() => router.push(`/consumer/property/${property.id}`)}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer touch-manipulation"
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
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* BOTTOM NAVIGATION - PROFILE ACCESS HERE */}
      <BottomNav />
    </div>
  );
}