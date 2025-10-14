'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Header, BottomNav } from '@/components/agent';

// LAZY LOAD ICONS
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const PlusIcon = dynamic(() => import('lucide-react').then(mod => mod.Plus));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const BarChartIcon = dynamic(() => import('lucide-react').then(mod => mod.BarChart3));
const TargetIcon = dynamic(() => import('lucide-react').then(mod => mod.Target));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const RefreshIcon = dynamic(() => import('lucide-react').then(mod => mod.RefreshCw));

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
          className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
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
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
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

function ViewingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse w-full">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}

export default function AgentDashboard() {
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
        setUser({
          first_name: session.user.email?.split('@')[0] || 'Agent',
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
      router.push(`/agent/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/agent/search');
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // QUICK ACTIONS
  const quickActions = [
    { 
      icon: PlusIcon, 
      label: 'Add Listing', 
      description: 'Create new property',
      action: () => router.push('/agent/properties/new'),
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    { 
      icon: BuildingIcon, 
      label: 'My Listings', 
      description: 'Manage properties',
      action: () => router.push('/agent/properties'),
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      icon: DollarSignIcon, 
      label: 'Commissions', 
      description: 'View earnings',
      action: () => router.push('/agent/commissions'),
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      icon: UsersIcon, 
      label: 'Clients', 
      description: 'Manage clients',
      action: () => router.push('/agent/clients'),
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ];

  // PROPERTY DATA
  const properties = [
    {
      id: '1',
      title: 'CBD Luxury Apartment',
      location: 'CBD, Gaborone',
      price: 14500,
      beds: 2,
      baths: 2,
      area: 1200,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
    },
    {
      id: '2', 
      title: 'Phakalane Executive Home',
      location: 'Phakalane Estate',
      price: 25000,
      beds: 4,
      baths: 3,
      area: 2400,
      status: 'rented',
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400'
    }
  ];

  // VIEWINGS DATA
  const viewings = [
    {
      id: '1',
      property_title: 'CBD Luxury Apartment',
      client_name: 'John Client',
      scheduled_date: 'Tomorrow, 10:00 AM',
      status: 'confirmed'
    },
    {
      id: '2',
      property_title: 'Phakalane Executive Home', 
      client_name: 'Sarah Johnson',
      scheduled_date: 'Dec 15, 2:00 PM',
      status: 'pending'
    }
  ];

  // DASHBOARD STATS
  const dashboardStats = {
    total_listings: 15,
    active_listings: 8,
    sold_listings: 7,
    monthly_commission: 42500,
    pending_viewings: 5,
    client_inquiries: 12,
    success_rate: 85
  };

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/agent/properties/${propertyId}`);
  };

  const handleViewingClick = (viewingId: string) => {
    router.push(`/agent/viewings/${viewingId}`);
  };

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
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-2xl animate-pulse w-full" />
            ))}
          </div>
          
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse w-full" />
            ))}
          </div>
          
          {/* Properties Skeleton */}
          <div className="space-y-4 w-full">
            {[...Array(2)].map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>

          {/* Viewings Skeleton */}
          <div className="space-y-3 w-full">
            {[...Array(2)].map((_, i) => (
              <ViewingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-hidden">
      {/* REFRESH INDICATOR */}
      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 bg-cyan-600 text-white py-3 text-center text-sm z-50 font-medium safe-area-padding"
          >
            🔄 Refreshing...
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <Header
        user={user}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onQuickSearch={handleQuickSearch}
        notifications={notifications}
      />

      {/* MAIN CONTENT */}
      <main className="p-4 space-y-6 pb-24 lg:pb-6 lg:max-w-4xl lg:mx-auto w-full overflow-hidden">
        {/* QUICK STATS */}
        <section aria-labelledby="quick-stats-heading" className="w-full">
          <div className="flex items-center justify-between mb-4 w-full">
            <h2 id="quick-stats-heading" className="text-lg font-semibold text-gray-900">
              Business Overview
            </h2>
            <BarChartIcon className="h-5 w-5 text-cyan-500 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Total Listings</p>
                  <p className="text-2xl font-bold mt-1">{dashboardStats.total_listings}</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <BuildingIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Monthly Commission</p>
                  <p className="text-2xl font-bold mt-1">P{dashboardStats.monthly_commission.toLocaleString()}</p>
                  <p className="text-xs opacity-70 mt-1">Estimated earnings</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <DollarSignIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="bg-purple-50 text-purple-700 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Success Rate</p>
                  <p className="text-2xl font-bold mt-1">{dashboardStats.success_rate}%</p>
                  <p className="text-xs opacity-70 mt-1">Closing ratio</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <TargetIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="bg-orange-50 text-orange-700 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Pending Viewings</p>
                  <p className="text-2xl font-bold mt-1">{dashboardStats.pending_viewings}</p>
                  <p className="text-xs opacity-70 mt-1">Scheduled tours</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <CalendarIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section aria-labelledby="quick-actions-heading" className="w-full">
          <div className="flex items-center justify-between mb-4 w-full">
            <h2 id="quick-actions-heading" className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
            <RefreshIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            {quickActions.map(({ icon: Icon, label, description, color, action }) => (
              <motion.button
                key={label}
                onClick={action}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl border text-left transition-all hover:shadow-md touch-manipulation ${color} w-full`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="p-2 rounded-lg bg-white flex-shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h3 className="font-semibold text-sm truncate">{label}</h3>
                    <p className="text-xs opacity-75 mt-0.5 truncate">{description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* RECENT LISTINGS */}
        <section aria-labelledby="recent-listings-heading" className="w-full">
          <div className="flex items-center justify-between mb-4 w-full">
            <h2 id="recent-listings-heading" className="text-lg font-semibold text-gray-900">
              Recent Listings
            </h2>
            <button 
              onClick={() => router.push('/agent/properties')}
              className="text-cyan-600 text-sm hover:underline font-medium flex items-center space-x-1 touch-manipulation flex-shrink-0"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
            </button>
          </div>

          <div className="space-y-4 w-full">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                onClick={() => handlePropertyClick(property.id)}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer touch-manipulation w-full"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handlePropertyClick(property.id)}
                aria-label={`View ${property.title} in ${property.location}`}
              >
                <div className="flex space-x-4 w-full">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className={`absolute -top-1 -right-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      property.status === 'available' ? 'bg-green-100 text-green-700' :
                      property.status === 'rented' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {property.status}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center space-x-2 mb-1 w-full">
                      <h3 className="font-semibold text-gray-900 text-sm truncate flex-1 min-w-0">
                        {property.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 text-sm mb-2 w-full">
                      <MapPinIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate flex-1 min-w-0">{property.location}</span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3 text-sm text-gray-600 flex-shrink-0">
                        <span>{property.beds} bed</span>
                        <span>{property.baths} bath</span>
                        <span>{property.area} sqft</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-gray-900">
                          P{property.price.toLocaleString()}/mo
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Agent listed
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* RECENT VIEWINGS */}
        <section aria-labelledby="recent-viewings-heading" className="w-full">
          <div className="flex items-center justify-between mb-4 w-full">
            <h2 id="recent-viewings-heading" className="text-lg font-semibold text-gray-900">
              Recent Viewings
            </h2>
            <button 
              onClick={() => router.push('/agent/viewings')}
              className="text-cyan-600 text-sm hover:underline font-medium flex items-center space-x-1 touch-manipulation flex-shrink-0"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
            </button>
          </div>

          <div className="space-y-3 w-full">
            {viewings.map((viewing) => (
              <motion.div
                key={viewing.id}
                onClick={() => handleViewingClick(viewing.id)}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition-all cursor-pointer touch-manipulation w-full"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleViewingClick(viewing.id)}
                aria-label={`View booking for ${viewing.property_title}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{viewing.property_title}</h3>
                    <p className="text-gray-600 text-xs mt-0.5 truncate">With {viewing.client_name}</p>
                    <p className="text-gray-500 text-xs mt-1 truncate">{viewing.scheduled_date}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ml-2 ${
                    viewing.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    viewing.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {viewing.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  );
}