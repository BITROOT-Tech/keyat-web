//src\app\service-provider\dashboard\page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Header, BottomNav } from '@/components/service-provider';

// LAZY LOAD ICONS
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const WrenchIcon = dynamic(() => import('lucide-react').then(mod => mod.Wrench));
const PlusIcon = dynamic(() => import('lucide-react').then(mod => mod.Plus));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));
const ClockIcon = dynamic(() => import('lucide-react').then(mod => mod.Clock));
const TrendingUpIcon = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));

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
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// SKELETON LOADERS
function ServiceRequestSkeleton() {
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

export default function ServiceProviderDashboard() {
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
          first_name: session.user.email?.split('@')[0] || 'Service Provider',
          email: session.user.email,
          company_name: 'Premium Services',
          service_type: 'General Maintenance'
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
      router.push(`/service-provider/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/service-provider/search');
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // QUICK ACTIONS
  const quickActions = [
    { 
      icon: PlusIcon, 
      label: 'New Service', 
      description: 'Create service offer',
      action: () => router.push('/service-provider/services/new'),
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    { 
      icon: CalendarIcon, 
      label: 'Schedule', 
      description: 'View calendar',
      action: () => router.push('/service-provider/schedule'),
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    { 
      icon: DollarSignIcon, 
      label: 'Earnings', 
      description: 'View revenue',
      action: () => router.push('/service-provider/earnings'),
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      icon: UsersIcon, 
      label: 'Clients', 
      description: 'Manage clients',
      action: () => router.push('/service-provider/clients'),
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ];

  // SERVICE TYPES
  const serviceTypes = [
    { id: 'plumbing', name: 'Plumbing', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'electrical', name: 'Electrical', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'painting', name: 'Painting', color: 'bg-green-50 text-green-700 border-green-200' },
    { id: 'carpentry', name: 'Carpentry', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'construction', name: 'Construction', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'maintenance', name: 'Maintenance', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' }
  ];

  // SERVICE REQUESTS DATA
  const serviceRequests = [
    {
      id: '1',
      title: 'CBD Luxury Apartment',
      location: 'CBD, Gaborone',
      service: 'Plumbing Repair',
      urgency: 'high',
      status: 'assigned',
      scheduled: 'Tomorrow, 10:00 AM',
      cost: 1200,
      client: 'John Landlord'
    },
    {
      id: '2', 
      title: 'Phakalane Executive Home',
      location: 'Phakalane Estate',
      service: 'Electrical Inspection',
      urgency: 'medium',
      status: 'pending',
      scheduled: 'Dec 15, 2:00 PM',
      cost: 2500,
      client: 'Sarah Manager'
    },
    {
      id: '3',
      title: 'Broadhurst Family House',
      location: 'Broadhurst, Gaborone',
      service: 'Interior Painting',
      urgency: 'low',
      status: 'completed',
      scheduled: 'Dec 10, 9:00 AM',
      cost: 4500,
      client: 'Mike Tenant'
    }
  ];

  // DASHBOARD STATS
  const dashboardStats = {
    active_requests: 8,
    monthly_revenue: 28500,
    average_rating: 4.7,
    response_time: 2.5
  };

  const handleServiceTypeClick = (serviceType: string) => {
    router.push(`/service-provider/services?type=${serviceType}`);
  };

  const handleRequestClick = (requestId: string) => {
    router.push(`/service-provider/requests/${requestId}`);
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
          
          {/* Service Types Skeleton */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse w-full" />
            ))}
          </div>
          
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse w-full" />
            ))}
          </div>
          
          {/* Requests Skeleton */}
          <div className="space-y-4 w-full">
            {[...Array(3)].map((_, i) => (
              <ServiceRequestSkeleton key={i} />
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
            className="fixed top-0 left-0 right-0 bg-indigo-600 text-white py-3 text-center text-sm z-50 font-medium safe-area-padding"
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
            <TrendingUpIcon className="h-5 w-5 text-indigo-500 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Active Requests</p>
                  <p className="text-2xl font-bold mt-1">{dashboardStats.active_requests}</p>
                  <p className="text-xs opacity-70 mt-1">In progress</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <ClockIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Monthly Revenue</p>
                  <p className="text-2xl font-bold mt-1">P{dashboardStats.monthly_revenue.toLocaleString()}</p>
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
                  <p className="text-sm font-medium opacity-80">Avg Rating</p>
                  <p className="text-2xl font-bold mt-1">{dashboardStats.average_rating}</p>
                  <p className="text-xs opacity-70 mt-1">Customer satisfaction</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <StarIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="bg-orange-50 text-orange-700 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Response Time</p>
                  <p className="text-2xl font-bold mt-1">{dashboardStats.response_time}h</p>
                  <p className="text-xs opacity-70 mt-1">Average response</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <TrendingUpIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE TYPES */}
        <section aria-labelledby="service-types-heading" className="w-full">
          <h2 id="service-types-heading" className="text-lg font-semibold text-gray-900 mb-4">
            Service Types
          </h2>
          <div className="grid grid-cols-3 gap-3 w-full">
            {serviceTypes.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceTypeClick(service.id)}
                className={`p-3 border rounded-xl text-center transition-all hover:shadow-sm active:scale-95 touch-manipulation ${service.color}`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 rounded-lg bg-white">
                    <WrenchIcon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium capitalize">{service.name}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section aria-labelledby="quick-actions-heading" className="w-full">
          <div className="flex items-center justify-between mb-4 w-full">
            <h2 id="quick-actions-heading" className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
            <PlusIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
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

        {/* RECENT SERVICE REQUESTS */}
        <section aria-labelledby="recent-requests-heading" className="w-full">
          <div className="flex items-center justify-between mb-4 w-full">
            <h2 id="recent-requests-heading" className="text-lg font-semibold text-gray-900">
              Recent Requests
            </h2>
            <button 
              onClick={() => router.push('/service-provider/requests')}
              className="text-indigo-600 text-sm hover:underline font-medium flex items-center space-x-1 touch-manipulation flex-shrink-0"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
            </button>
          </div>

          <div className="space-y-4 w-full">
            {serviceRequests.map((request) => (
              <motion.div
                key={request.id}
                onClick={() => handleRequestClick(request.id)}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer touch-manipulation w-full"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleRequestClick(request.id)}
                aria-label={`View ${request.service} request for ${request.title}`}
              >
                <div className="flex space-x-4 w-full">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                    <WrenchIcon className="h-6 w-6 text-gray-600" />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      request.urgency === 'high' ? 'bg-red-500' : 
                      request.urgency === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center space-x-2 mb-1 w-full">
                      <h3 className="font-semibold text-gray-900 text-sm truncate flex-1 min-w-0">
                        {request.service}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                        request.status === 'completed' ? 'bg-green-100 text-green-700' :
                        request.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 text-sm mb-2 w-full">
                      <BuildingIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate flex-1 min-w-0">{request.title}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 text-xs mb-2 w-full">
                      <MapPinIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate flex-1 min-w-0">{request.location}</span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3 text-sm text-gray-600 flex-shrink-0">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span className="text-xs">{request.scheduled}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-3 w-3" />
                          <span className="text-xs">{request.client}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-gray-900">
                          P{request.cost.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {request.urgency} priority
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

      {/* BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  );
}