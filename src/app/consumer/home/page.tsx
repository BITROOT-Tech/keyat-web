// src/app/consumer/home/page.tsx - COMPACT QUICK ACTIONS
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Header, BottomNav } from '@/components/consumer';

// LAZY LOAD ICONS
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const TrendingUpIcon = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp));
const EyeIcon = dynamic(() => import('lucide-react').then(mod => mod.Eye));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));

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

export default function ConsumerHome() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // FETCH REAL PROPERTIES FROM SUPABASE
  const fetchProperties = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setProperties(data || []);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
    }
  };

  // GET USER FROM SESSION
  const getUser = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser(profile || {
          first_name: session.user.email?.split('@')[0] || 'User',
          email: session.user.email
        });
      }
    } catch (err: any) {
      console.error('Error getting user:', err);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([getUser(), fetchProperties()]);
      setLoading(false);
    };
    initializeData();
  }, []);

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

  // COMPACT QUICK ACTIONS
  const quickActions = [
    { 
      icon: SearchIcon, 
      label: 'Search', 
      description: 'Find properties',
      action: handleQuickSearch,
      gradient: 'from-blue-500 to-blue-600',
      hover: 'hover:from-blue-600 hover:to-blue-700'
    },
    { 
      icon: HeartIcon, 
      label: 'Favorites', 
      description: `${favorites.length} saved`,
      action: () => router.push('/consumer/saved'),
      gradient: 'from-rose-500 to-rose-600',
      hover: 'hover:from-rose-600 hover:to-rose-700'
    },
    { 
      icon: CalendarIcon, 
      label: 'Tours', 
      description: 'Schedule viewings',
      action: () => router.push('/consumer/tours'),
      gradient: 'from-green-500 to-green-600',
      hover: 'hover:from-green-600 hover:to-green-700'
    },
    { 
      icon: TrendingUpIcon, 
      label: 'Trending', 
      description: 'Popular areas',
      action: () => router.push('/consumer/trending'),
      gradient: 'from-purple-500 to-purple-600',
      hover: 'hover:from-purple-600 hover:to-purple-700'
    }
  ];

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 safe-area-padding">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <button
            onClick={fetchProperties}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium active:scale-95 touch-manipulation"
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
      <div className="min-h-screen bg-gray-50 safe-area-padding">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
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
        <div className="p-4 space-y-6">
          {/* Welcome Skeleton */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-6 animate-pulse">
            <div className="h-6 bg-blue-500 rounded w-3/4 mb-2 mx-auto"></div>
            <div className="h-4 bg-blue-500 rounded w-1/2 mx-auto"></div>
          </div>
          
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-3 rounded-xl border border-gray-200 animate-pulse bg-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Properties Skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-300 rounded-xl flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-padding">
      {/* CLEAN HEADER */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
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

      {/* REFRESH INDICATOR */}
      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 bg-blue-600 text-white py-3 text-center text-sm z-50 font-medium safe-area-top"
          >
            🔄 Refreshing...
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="p-4 space-y-6">
        {/* WELCOME SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              {getGreeting()}, {user?.first_name || 'User'}! 👋
            </h1>
            <p className="text-blue-100 text-sm">
              {properties.length > 0 
                ? `Discover ${properties.length} properties in Botswana`
                : 'Find your perfect home in Botswana'
              }
            </p>
          </div>
        </motion.section>

        {/* COMPACT QUICK ACTIONS */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ icon: Icon, label, description, gradient, hover, action }) => (
              <motion.button
                key={label}
                onClick={action}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${gradient} ${hover} rounded-xl p-3 text-white transition-all shadow-md hover:shadow-lg active:scale-95 touch-manipulation`}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-medium text-white leading-tight">{label}</div>
                    <div className="text-xs text-white/80 leading-tight truncate">{description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* FEATURED PROPERTIES WITH LARGER IMAGES */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Featured Properties</h2>
            <button 
              onClick={() => router.push('/consumer/search')}
              className="text-blue-600 text-sm hover:underline font-medium flex items-center space-x-1 active:scale-95 touch-manipulation"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          {properties.length > 0 ? (
            <div className="space-y-4">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/consumer/property/${property.id}`)}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group active:scale-95 touch-manipulation"
                >
                  <div className="flex items-start gap-4 p-4">
                    {/* LARGER PROPERTY IMAGE */}
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {property.images && property.images.length > 0 ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <HomeIcon className="h-8 w-8 text-blue-600" />
                      )}
                      
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(property.id, e)}
                        className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
                          favorites.includes(property.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/90 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                        }`}
                      >
                        <HeartIcon className={`h-3 w-3 ${favorites.includes(property.id) ? 'fill-current' : ''}`} />
                      </button>

                      {/* Status Badge */}
                      <div className="absolute bottom-2 left-2">
                        {property.status === 'available' && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            Available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                        {property.title}
                      </h3>

                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <span>{property.beds} bed</span>
                        <span>{property.baths} bath</span>
                        {property.area && <span>{property.area} sqft</span>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                          P{property.price?.toLocaleString()}
                          <span className="text-sm font-normal text-gray-600">/mo</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {property.status === 'available' ? 'Ready to move' : 'Recently added'}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-2xl border border-gray-200">
              <div className="text-4xl mb-3">🏠</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Available</h3>
              <p className="text-gray-600 mb-4">Check back later for new listings</p>
              <button
                onClick={fetchProperties}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors active:scale-95 touch-manipulation"
              >
                Refresh
              </button>
            </div>
          )}
        </section>

        {/* RECENT ACTIVITY */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button 
              onClick={() => router.push('/consumer/activity')}
              className="text-blue-600 text-sm hover:underline font-medium flex items-center space-x-1 active:scale-95 touch-manipulation"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <EyeIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Viewed 3 properties today</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <StarIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Saved 2 favorites</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}