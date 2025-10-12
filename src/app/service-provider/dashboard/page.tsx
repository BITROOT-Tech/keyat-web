// src/app/service-provider/dashboard/page.tsx - CLEAN SERVICE PROVIDER DASHBOARD
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// LAZY LOAD ICONS - NO ERRORS!
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
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const WrenchIcon = dynamic(() => import('lucide-react').then(mod => mod.Wrench));
const ClockIcon = dynamic(() => import('lucide-react').then(mod => mod.Clock));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const TrendingUpIcon = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp));
const LogOutIcon = dynamic(() => import('lucide-react').then(mod => mod.LogOut));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const PlusIcon = dynamic(() => import('lucide-react').then(mod => mod.Plus));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));

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
function ServiceRequestSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
      <div className="flex space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
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

export default function ServiceProviderDashboard() {
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

  // USER MENU OPTIONS
  const userMenuOptions = [
    { icon: UserIcon, label: 'My Profile', action: () => router.push('/service-provider/profile') },
    { icon: BellIcon, label: 'Notifications', action: () => router.push('/service-provider/notifications') },
    { icon: CalendarIcon, label: 'Schedule', action: () => router.push('/service-provider/schedule') },
    { icon: StarIcon, label: 'Portfolio', action: () => router.push('/service-provider/portfolio') },
    { icon: ShieldIcon, label: 'Sign Out', action: handleLogout, destructive: true }
  ];

  // QUICK ACTIONS
  const quickActions = [
    { 
      icon: PlusIcon, 
      label: 'New Service', 
      description: 'Create service offer',
      action: () => router.push('/service-provider/services/new'),
      color: 'bg-blue-50 text-blue-700 border-blue-200'
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
      <div className="min-h-screen bg-gray-50 p-4 space-y-6">
        {/* Header Skeleton */}
        <div className="h-32 bg-white rounded-2xl animate-pulse" />
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
        
        {/* Service Types Skeleton */}
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
        
        {/* Requests Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <ServiceRequestSkeleton key={i} />
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
                Welcome back, {user?.first_name || 'Service Provider'}
              </h1>
              <p className="text-gray-600 text-sm truncate">
                Manage your service requests and schedule
                {user?.company_name && ` • ${user.company_name}`}
              </p>
            </div>

            {/* USER CONTROLS */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => router.push('/service-provider/notifications')}
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
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.first_name?.[0] || user?.email?.[0] || 'S'}
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
                          {user?.first_name || 'Service Provider'}
                        </p>
                        <p className="text-gray-600 text-xs truncate">
                          {user?.email}
                        </p>
                        {user?.company_name && (
                          <p className="text-gray-500 text-xs mt-1">
                            {user.company_name}
                          </p>
                        )}
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
              placeholder="Search service requests, clients, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-500"
              aria-label="Search service requests"
            />
          </div>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <main className="p-4 space-y-6">
        {/* QUICK STATS */}
        <section aria-labelledby="quick-stats-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="quick-stats-heading" className="text-lg font-semibold text-gray-900">
              Business Overview
            </h2>
            <TrendingUpIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-xl p-4">
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
        <section aria-labelledby="service-types-heading">
          <h2 id="service-types-heading" className="text-lg font-semibold text-gray-900 mb-4">
            Service Types
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {serviceTypes.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceTypeClick(service.id)}
                className={`p-3 border rounded-xl text-center transition-all hover:shadow-sm active:scale-95 ${service.color}`}
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
        <section aria-labelledby="quick-actions-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="quick-actions-heading" className="text-lg font-semibold text-gray-900">
              Quick Actions
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

        {/* RECENT SERVICE REQUESTS */}
        <section aria-labelledby="recent-requests-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="recent-requests-heading" className="text-lg font-semibold text-gray-900">
              Recent Requests
            </h2>
            <button 
              onClick={() => router.push('/service-provider/requests')}
              className="text-blue-600 text-sm hover:underline font-medium flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {serviceRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => handleRequestClick(request.id)}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleRequestClick(request.id)}
                aria-label={`View ${request.service} request for ${request.title}`}
              >
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                    <WrenchIcon className="h-6 w-6 text-gray-600" />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      request.urgency === 'high' ? 'bg-red-500' : 
                      request.urgency === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {request.service}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        request.status === 'completed' ? 'bg-green-100 text-green-700' :
                        request.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 text-sm mb-2">
                      <BuildingIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{request.title}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 text-xs mb-2">
                      <MapPinIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{request.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span className="text-xs">{request.scheduled}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-3 w-3" />
                          <span className="text-xs">{request.client}</span>
                        </div>
                      </div>
                      <div className="text-right">
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
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="px-4 py-2">
          <div className="flex justify-around items-center">
            {[
              { icon: HomeIcon, label: 'Dashboard', active: true, href: '/service-provider/dashboard' },
              { icon: CalendarIcon, label: 'Schedule', href: '/service-provider/schedule' },
              { icon: WrenchIcon, label: 'Services', href: '/service-provider/services' },
              { icon: UserIcon, label: 'Profile', href: '/service-provider/profile' },
            ].map(({ icon: Icon, label, active, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className={`flex flex-col items-center p-2 transition-all duration-200 min-w-0 flex-1 ${
                  active 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                  active ? 'bg-blue-50' : 'hover:bg-gray-100'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}