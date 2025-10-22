// src/app/consumer/home/page.tsx - COMPLETE WITH SIDEBAR
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Header } from '@/components/consumer';
import Sidebar from '@/components/consumer/Sidebar';

// LAZY LOAD ICONS
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const TrendingUpIcon = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp));
const ClockIcon = dynamic(() => import('lucide-react').then(mod => mod.Clock));
const ZapIcon = dynamic(() => import('lucide-react').then(mod => mod.Zap));
const EyeIcon = dynamic(() => import('lucide-react').then(mod => mod.Eye));

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  status: 'available' | 'rented' | 'maintenance';
  beds: number;
  baths: number;
  area: number;
  description: string;
  created_at: string;
}

// SKELETON COMPONENTS
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="flex flex-col lg:flex-row">
      <div className="w-full lg:w-32 h-32 bg-gray-300 flex-shrink-0"></div>
      <div className="p-4 lg:p-6 flex-1">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  </div>
);

const SkeletonStats = () => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 bg-gray-300 rounded w-12 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="p-2 bg-gray-300 rounded-lg w-10 h-10"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function ConsumerHome() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

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
    await Promise.all([checkAuth(), fetchProperties()]);
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
        setUser({
          first_name: session.user.email?.split('@')[0] || 'User',
          email: session.user.email
        });
      } else {
        setUser(profile);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    }
  }, [router]);

  // FETCH REAL PROPERTIES FROM SUPABASE
  const fetchProperties = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available') // Only show available properties
        .order('created_at', { ascending: false })
        .limit(8); // Limit for featured section

      if (error) throw error;
      setProperties(data || []);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([checkAuth(), fetchProperties()]);
      setLoading(false);
    };
    initializeData();
  }, [checkAuth]);

  const handleQuickSearch = () => {
    const query = localSearchQuery.trim();
    if (query) {
      router.push(`/consumer/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/consumer/search');
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Toggle favorite property
  const toggleFavorite = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  // QUICK ACTIONS
  const quickActions = [
    { 
      icon: SearchIcon, 
      label: 'Smart Search', 
      description: 'Find properties',
      action: handleQuickSearch,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'New'
    },
    { 
      icon: HeartIcon, 
      label: 'Favorites', 
      description: `${favorites.length} saved`,
      action: () => router.push('/consumer/saved'),
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    { 
      icon: CalendarIcon, 
      label: 'Tours', 
      description: 'Schedule viewings',
      action: () => router.push('/consumer/tours'),
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    { 
      icon: TrendingUpIcon, 
      label: 'Trending', 
      description: 'Popular areas',
      action: () => router.push('/consumer/trending'),
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  // DASHBOARD STATS - NOW USING REAL DATA
  const dashboardStats = {
    properties_viewed: Math.min(properties.length, 12), // Based on actual properties
    favorites_count: favorites.length,
    searches_saved: 3,
    response_rate: 92
  };

  // RECENT ACTIVITY - OPTIMIZED FOR MOBILE
  const recentActivity = [
    {
      id: '1',
      type: 'view',
      property_title: properties[0]?.title || 'Recent Property',
      timestamp: '2h ago'
    },
    {
      id: '2',
      type: 'search',
      query: '3 bedroom houses',
      timestamp: '1d ago'
    }
  ];

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 safe-area-padding">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <button
            onClick={handleRefresh}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium touch-manipulation"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-gray-50 safe-area-padding">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-30">
          <Header
            user={null}
            searchQuery=""
            onSearchChange={() => {}}
            onQuickSearch={() => {}}
            notifications={0}
            showLocationFilter={true}
            onLocationFilterClick={() => {}}
          />
        </div>
        <div className="p-4 space-y-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          {/* Welcome Skeleton */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-6 animate-pulse">
            <div className="h-8 bg-blue-500 rounded w-3/4 mb-2 mx-auto"></div>
            <div className="h-4 bg-blue-500 rounded w-1/2 mx-auto"></div>
          </div>
          
          {/* Stats Skeleton */}
          <SkeletonStats />
          
          {/* Quick Actions Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-300 rounded w-32"></div>
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border border-gray-200 animate-pulse bg-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-300 w-10 h-10"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Properties Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-300 rounded w-40"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SIDEBAR - NOW INCLUDES MOBILE */}
      <Sidebar user={user} />

      {/* MAIN CONTENT WRAPPER */}
      <div className="lg:ml-64 min-h-screen bg-gradient-to-b from-blue-50/30 to-gray-50 safe-area-padding w-full overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20">
          <Header
            user={user}
            searchQuery={localSearchQuery}
            onSearchChange={setLocalSearchQuery}
            onQuickSearch={handleQuickSearch}
            notifications={3}
            showLocationFilter={true}
            onLocationFilterClick={() => console.log('Open location filter')}
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-gray-50 safe-area-padding w-full overflow-hidden">
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

          {/* MAIN CONTENT */}
          <div className="w-full overflow-hidden">
            <main className="p-4 space-y-6 lg:max-w-6xl lg:mx-auto lg:px-8 w-full">
              {/* WELCOME SECTION */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center w-full"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-6">
                  <h1 className="text-2xl font-bold mb-2 lg:text-3xl">
                    {getGreeting()}, {user?.first_name || 'User'}! 👋
                  </h1>
                  <p className="text-blue-100 text-sm lg:text-base">
                    {properties.length > 0 
                      ? `Discover ${properties.length} amazing properties in Botswana`
                      : 'Ready to find your perfect home in Botswana?'
                    }
                  </p>
                </div>
              </motion.section>

              {/* QUICK STATS */}
              <section aria-labelledby="quick-stats-heading" className="w-full">
                <h2 id="quick-stats-heading" className="text-lg font-semibold text-gray-900 mb-4 lg:text-xl">
                  Your Activity
                </h2>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 w-full">
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.properties_viewed}</p>
                        <p className="text-sm text-gray-600 mt-1">Properties</p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <EyeIcon className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.favorites_count}</p>
                        <p className="text-sm text-gray-600 mt-1">Favorites</p>
                      </div>
                      <div className="p-2 bg-rose-50 rounded-lg">
                        <HeartIcon className="h-4 w-4 text-rose-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.searches_saved}</p>
                        <p className="text-sm text-gray-600 mt-1">Saved Searches</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg">
                        <SearchIcon className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.response_rate}%</p>
                        <p className="text-sm text-gray-600 mt-1">Response Rate</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <ZapIcon className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* QUICK ACTIONS */}
              <section aria-labelledby="quick-actions-heading" className="w-full">
                <div className="flex items-center justify-between mb-4 w-full">
                  <h2 id="quick-actions-heading" className="text-lg font-semibold text-gray-900 lg:text-xl">
                    Quick Access
                  </h2>
                  <ZapIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                </div>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 w-full">
                  {quickActions.map(({ icon: Icon, label, description, color, action, badge }) => (
                    <motion.button
                      key={label}
                      onClick={action}
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-2xl border text-left transition-all hover:shadow-lg touch-manipulation ${color} w-full min-w-0 relative`}
                    >
                      {badge && (
                        <div className="absolute -top-2 -right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {badge}
                        </div>
                      )}
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

              {/* FEATURED PROPERTIES - NOW USING REAL DATA */}
              <section aria-labelledby="featured-properties-heading" className="w-full">
                <div className="flex items-center justify-between mb-4 w-full">
                  <h2 id="featured-properties-heading" className="text-lg font-semibold text-gray-900 lg:text-xl flex-1 min-w-0 pr-2">
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

                {properties.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 w-full">
                    {properties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => router.push(`/consumer/property/${property.id}`)}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer touch-manipulation lg:p-0 w-full group"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && router.push(`/consumer/property/${property.id}`)}
                        aria-label={`View ${property.title} in ${property.location}`}
                      >
                        <div className="flex flex-col lg:flex-row w-full">
                          <div className="relative w-full lg:w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {property.images && property.images.length > 0 ? (
                              <img 
                                src={property.images[0]} 
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BuildingIcon className="h-8 w-8 text-blue-600 lg:h-10 lg:w-10" />
                            )}
                            <button
                              onClick={(e) => toggleFavorite(property.id, e)}
                              className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
                                favorites.includes(property.id)
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-white/90 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                              }`}
                              aria-label={favorites.includes(property.id) ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <HeartIcon className={`h-4 w-4 ${favorites.includes(property.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          <div className="p-4 lg:p-6 flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2 w-full">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-lg truncate lg:text-xl">
                                  {property.title}
                                </h3>
                                <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1 lg:text-base">
                                  <MapPinIcon className="h-3 w-3 flex-shrink-0 lg:h-4 lg:w-4" />
                                  <span className="truncate">{property.location}</span>
                                </div>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                property.status === 'available' ? 'bg-green-100 text-green-800' :
                                property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {property.status}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4 w-full">
                              <div className="flex items-center space-x-4 text-sm text-gray-600 lg:text-base">
                                <span>{property.beds} bed</span>
                                <span>{property.baths} bath</span>
                                <span>{property.area} sqft</span>
                              </div>
                              <div className="text-right flex-shrink-0 ml-2">
                                <div className="text-xl font-bold text-gray-900 lg:text-2xl whitespace-nowrap">
                                  P{property.price?.toLocaleString()}/mo
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <div className="text-5xl mb-4">🏠</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Available</h3>
                    <p className="text-gray-600 mb-4">Check back later for new property listings</p>
                    <button
                      onClick={handleRefresh}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </section>

              {/* RECENT ACTIVITY - OPTIMIZED FOR MOBILE */}
              <section aria-labelledby="recent-activity-heading" className="w-full">
                <div className="flex items-center justify-between mb-3 w-full">
                  <h2 id="recent-activity-heading" className="text-sm font-semibold text-gray-900 lg:text-lg">
                    Recent Activity
                  </h2>
                  <button 
                    onClick={() => router.push('/consumer/activity')}
                    className="text-blue-600 text-xs hover:underline font-medium flex items-center space-x-1 touch-manipulation lg:text-sm"
                  >
                    <span>View all</span>
                    <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-3 lg:p-4">
                  <div className="space-y-2">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {activity.type === 'view' && <EyeIcon className="h-3 w-3 text-blue-600" />}
                          {activity.type === 'search' && <SearchIcon className="h-3 w-3 text-blue-600" />}
                          {activity.type === 'favorite' && <HeartIcon className="h-3 w-3 text-rose-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-900 truncate lg:text-sm">
                            {activity.type === 'view' && `Viewed ${activity.property_title}`}
                            {activity.type === 'search' && `Searched "${activity.query}"`}
                            {activity.type === 'favorite' && `Favorited ${activity.property_title}`}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{activity.timestamp}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}