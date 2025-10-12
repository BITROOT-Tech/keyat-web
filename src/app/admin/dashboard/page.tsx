// src/app/admin/dashboard/page.tsx - CLEAN ADMIN DASHBOARD
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
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const BarChartIcon = dynamic(() => import('lucide-react').then(mod => mod.BarChart3));
const ZapIcon = dynamic(() => import('lucide-react').then(mod => mod.Zap));
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const LogOutIcon = dynamic(() => import('lucide-react').then(mod => mod.LogOut));
const AlertTriangleIcon = dynamic(() => import('lucide-react').then(mod => mod.AlertTriangle));
const TrendingUpIcon = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const EyeIcon = dynamic(() => import('lucide-react').then(mod => mod.Eye));
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle));
const XCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.XCircle));

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
function UserSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
      <div className="flex space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
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

function ReportSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(5);
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
          first_name: session.user.email?.split('@')[0] || 'Admin',
          email: session.user.email,
          user_type: 'admin'
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
      router.push(`/admin/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/admin/search');
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
    { icon: UserIcon, label: 'Admin Profile', action: () => router.push('/admin/profile') },
    { icon: SettingsIcon, label: 'System Settings', action: () => router.push('/admin/settings') },
    { icon: UsersIcon, label: 'User Management', action: () => router.push('/admin/users') },
    { icon: ShieldIcon, label: 'Security', action: () => router.push('/admin/security') },
    { icon: ShieldIcon, label: 'Sign Out', action: handleLogout, destructive: true }
  ];

  // QUICK ACTIONS
  const quickActions = [
    { 
      icon: UsersIcon, 
      label: 'User Management', 
      description: 'Manage all users',
      action: () => router.push('/admin/users'),
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      icon: BuildingIcon, 
      label: 'Properties', 
      description: 'Manage listings',
      action: () => router.push('/admin/properties'),
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    { 
      icon: BarChartIcon, 
      label: 'Analytics', 
      description: 'View platform stats',
      action: () => router.push('/admin/analytics'),
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      icon: SettingsIcon, 
      label: 'System Settings', 
      description: 'Platform configuration',
      action: () => router.push('/admin/settings'),
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ];

  // ADMIN STATS
  const adminStats = {
    total_users: 1247,
    active_listings: 289,
    platform_revenue: 125400,
    pending_approvals: 23,
    system_health: 99.8
  };

  // RECENT USERS DATA
  const recentUsers = [
    {
      id: '1',
      name: 'John Landlord',
      email: 'john@example.com',
      type: 'landlord',
      status: 'active',
      join_date: '2 days ago'
    },
    {
      id: '2', 
      name: 'Sarah Agent',
      email: 'sarah@example.com',
      type: 'agent',
      status: 'pending',
      join_date: '1 day ago'
    },
    {
      id: '3',
      name: 'Mike Tenant',
      email: 'mike@example.com',
      type: 'tenant',
      status: 'active',
      join_date: '3 hours ago'
    },
    {
      id: '4',
      name: 'Service Pro',
      email: 'service@example.com',
      type: 'service',
      status: 'active',
      join_date: '5 days ago'
    }
  ];

  // SYSTEM REPORTS
  const systemReports = [
    {
      id: '1',
      title: 'Platform Performance',
      status: 'normal',
      description: 'All systems operating normally',
      timestamp: '5 minutes ago'
    },
    {
      id: '2',
      title: 'Security Audit',
      status: 'warning',
      description: '2 failed login attempts detected',
      timestamp: '1 hour ago'
    },
    {
      id: '3',
      title: 'Database Backup',
      status: 'success',
      description: 'Nightly backup completed successfully',
      timestamp: '6 hours ago'
    }
  ];

  const handleUserClick = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleReportClick = (reportId: string) => {
    router.push(`/admin/reports/${reportId}`);
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
        
        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
        
        {/* Users Skeleton */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <UserSkeleton key={i} />
          ))}
        </div>

        {/* Reports Skeleton */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <ReportSkeleton key={i} />
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
                Welcome back, {user?.first_name || 'Admin'}
              </h1>
              <p className="text-gray-600 text-sm truncate">
                Manage platform operations and users
              </p>
            </div>

            {/* USER CONTROLS */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => router.push('/admin/notifications')}
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
                  aria-label="Admin menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.first_name?.[0] || user?.email?.[0] || 'A'}
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
                          {user?.first_name || 'Admin'}
                        </p>
                        <p className="text-gray-600 text-xs truncate">
                          {user?.email}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          System Administrator
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
              placeholder="Search users, properties, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-500"
              aria-label="Search platform"
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
              Platform Overview
            </h2>
            <BarChartIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 text-blue-700 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Total Users</p>
                  <p className="text-2xl font-bold mt-1">{adminStats.total_users}</p>
                  <p className="text-xs opacity-70 mt-1">Registered accounts</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <UsersIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Active Listings</p>
                  <p className="text-2xl font-bold mt-1">{adminStats.active_listings}</p>
                  <p className="text-xs opacity-70 mt-1">Properties available</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <BuildingIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="bg-purple-50 text-purple-700 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Platform Revenue</p>
                  <p className="text-2xl font-bold mt-1">P{adminStats.platform_revenue.toLocaleString()}</p>
                  <p className="text-xs opacity-70 mt-1">Monthly earnings</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <DollarSignIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="bg-orange-50 text-orange-700 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">System Health</p>
                  <p className="text-2xl font-bold mt-1">{adminStats.system_health}%</p>
                  <p className="text-xs opacity-70 mt-1">Uptime & performance</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <TrendingUpIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section aria-labelledby="quick-actions-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="quick-actions-heading" className="text-lg font-semibold text-gray-900">
              Admin Actions
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

        {/* RECENT USERS */}
        <section aria-labelledby="recent-users-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="recent-users-heading" className="text-lg font-semibold text-gray-900">
              Recent Users
            </h2>
            <button 
              onClick={() => router.push('/admin/users')}
              className="text-blue-600 text-sm hover:underline font-medium flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleUserClick(user.id)}
                aria-label={`View ${user.name} profile`}
              >
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {user.name}
                        </h3>
                        <p className="text-gray-600 text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' :
                          user.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {user.status}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                          {user.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500 text-xs">
                        Joined {user.join_date}
                      </p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/users/${user.id}/edit`);
                          }}
                          className="text-blue-600 text-xs hover:underline font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/users/${user.id}/view`);
                          }}
                          className="text-gray-600 text-xs hover:underline font-medium"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SYSTEM REPORTS */}
        <section aria-labelledby="system-reports-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="system-reports-heading" className="text-lg font-semibold text-gray-900">
              System Reports
            </h2>
            <button 
              onClick={() => router.push('/admin/reports')}
              className="text-blue-600 text-sm hover:underline font-medium flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {systemReports.map((report) => (
              <div
                key={report.id}
                onClick={() => handleReportClick(report.id)}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition-all cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleReportClick(report.id)}
                aria-label={`View ${report.title} report`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {report.title}
                      </h3>
                      {report.status === 'success' && (
                        <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                      {report.status === 'warning' && (
                        <AlertTriangleIcon className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      )}
                      {report.status === 'error' && (
                        <XCircleIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-600 text-xs mt-0.5">
                      {report.description}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {report.timestamp}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                    report.status === 'success' ? 'bg-green-100 text-green-700' :
                    report.status === 'warning' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {report.status}
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
              { icon: HomeIcon, label: 'Dashboard', active: true, href: '/admin/dashboard' },
              { icon: UsersIcon, label: 'Users', href: '/admin/users' },
              { icon: BarChartIcon, label: 'Analytics', href: '/admin/analytics' },
              { icon: SettingsIcon, label: 'Settings', href: '/admin/settings' },
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