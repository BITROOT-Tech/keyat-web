// src/app/admin/dashboard/page.tsx - COMPLETE ADMIN DASHBOARD
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Header, BottomNav } from '@/components/admin';

// LAZY LOAD ICONS
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const BarChartIcon = dynamic(() => import('lucide-react').then(mod => mod.BarChart3));
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const TrendingUpIcon = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp));
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle));
const AlertTriangleIcon = dynamic(() => import('lucide-react').then(mod => mod.AlertTriangle));
const XCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.XCircle));
const ZapIcon = dynamic(() => import('lucide-react').then(mod => mod.Zap));
const EyeIcon = dynamic(() => import('lucide-react').then(mod => mod.Eye));
const EditIcon = dynamic(() => import('lucide-react').then(mod => mod.Edit));

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
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
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
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse w-full">
      <div className="flex space-x-4 w-full">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
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

function ReportSkeleton() {
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

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(5);
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // QUICK ACTIONS
  const quickActions = [
    { 
      icon: UsersIcon, 
      label: 'User Management', 
      description: 'Manage all users',
      action: () => router.push('/admin/users'),
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      icon: BuildingIcon, 
      label: 'Properties', 
      description: 'Manage listings',
      action: () => router.push('/admin/properties'),
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      icon: BarChartIcon, 
      label: 'Analytics', 
      description: 'View platform stats',
      action: () => router.push('/admin/analytics'),
      color: 'bg-green-50 text-green-700 border-green-200'
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
    system_health: 99.8,
    monthly_growth: 12.5
  };

  // RECENT USERS DATA
  const recentUsers = [
    {
      id: '1',
      name: 'John Landlord',
      email: 'john@example.com',
      type: 'landlord',
      status: 'active',
      join_date: '2 days ago',
      avatar: 'JL'
    },
    {
      id: '2', 
      name: 'Sarah Agent',
      email: 'sarah@example.com',
      type: 'agent',
      status: 'pending',
      join_date: '1 day ago',
      avatar: 'SA'
    },
    {
      id: '3',
      name: 'Mike Tenant',
      email: 'mike@example.com',
      type: 'tenant',
      status: 'active',
      join_date: '3 hours ago',
      avatar: 'MT'
    },
    {
      id: '4',
      name: 'Service Pro',
      email: 'service@example.com',
      type: 'service',
      status: 'active',
      join_date: '5 days ago',
      avatar: 'SP'
    }
  ];

  // SYSTEM REPORTS
  const systemReports = [
    {
      id: '1',
      title: 'Platform Performance',
      status: 'success',
      description: 'All systems operating normally',
      timestamp: '5 minutes ago',
      priority: 'low'
    },
    {
      id: '2',
      title: 'Security Audit',
      status: 'warning',
      description: '2 failed login attempts detected',
      timestamp: '1 hour ago',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Database Backup',
      status: 'success',
      description: 'Nightly backup completed successfully',
      timestamp: '6 hours ago',
      priority: 'low'
    },
    {
      id: '4',
      title: 'Server Load',
      status: 'warning',
      description: 'High traffic detected on API endpoints',
      timestamp: '2 hours ago',
      priority: 'high'
    }
  ];

  const handleUserClick = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleReportClick = (reportId: string) => {
    router.push(`/admin/reports/${reportId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangleIcon className="h-4 w-4 text-orange-500" />;
      case 'error':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-orange-100 text-orange-700',
      high: 'bg-red-100 text-red-700'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${styles[priority as keyof typeof styles] || styles.low}`}>
        {priority}
      </span>
    );
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
          
          {/* Users Skeleton */}
          <div className="space-y-4 w-full">
            {[...Array(4)].map((_, i) => (
              <UserSkeleton key={i} />
            ))}
          </div>

          {/* Reports Skeleton */}
          <div className="space-y-3 w-full">
            {[...Array(3)].map((_, i) => (
              <ReportSkeleton key={i} />
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
            className="fixed top-0 left-0 right-0 bg-purple-600 text-white py-3 text-center text-sm z-50 font-medium safe-area-padding"
          >
            🔄 Refreshing Admin Dashboard...
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
      <main className="p-4 space-y-6 pb-24 lg:pb-6 lg:max-w-6xl lg:mx-auto w-full overflow-hidden">
        {/* WELCOME SECTION */}
        <section className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, {user?.first_name || 'Admin'}!
                </h1>
                <p className="text-purple-100 opacity-90">
                  Here's what's happening with your platform today.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <ShieldIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* QUICK STATS */}
        <section aria-labelledby="quick-stats-heading" className="w-full">
          <div className="flex items-center justify-between mb-4 w-full">
            <h2 id="quick-stats-heading" className="text-lg font-semibold text-gray-900">
              Platform Overview
            </h2>
            <BarChartIcon className="h-5 w-5 text-purple-500 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-purple-50 text-purple-700 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Total Users</p>
                  <p className="text-2xl font-bold mt-1">{adminStats.total_users.toLocaleString()}</p>
                  <p className="text-xs opacity-70 mt-1">Registered accounts</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <UsersIcon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 text-blue-700 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Active Listings</p>
                  <p className="text-2xl font-bold mt-1">{adminStats.active_listings.toLocaleString()}</p>
                  <p className="text-xs opacity-70 mt-1">Properties available</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <BuildingIcon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-orange-50 text-orange-700 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
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
            </motion.div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section aria-labelledby="quick-actions-heading" className="w-full">
          <div className="flex items-center justify-between mb-4 w-full">
            <h2 id="quick-actions-heading" className="text-lg font-semibold text-gray-900">
              Admin Actions
            </h2>
            <ZapIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            {quickActions.map(({ icon: Icon, label, description, color, action }, index) => (
              <motion.button
                key={label}
                onClick={action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -2 }}
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

        <div className="grid lg:grid-cols-2 gap-6 w-full">
          {/* RECENT USERS */}
          <section aria-labelledby="recent-users-heading" className="w-full">
            <div className="flex items-center justify-between mb-4 w-full">
              <h2 id="recent-users-heading" className="text-lg font-semibold text-gray-900">
                Recent Users
              </h2>
              <button 
                onClick={() => router.push('/admin/users')}
                className="text-purple-600 text-sm hover:underline font-medium flex items-center space-x-1 touch-manipulation flex-shrink-0"
              >
                <span>View all</span>
                <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
              </button>
            </div>

            <div className="space-y-3 w-full">
              {recentUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer touch-manipulation w-full group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleUserClick(user.id)}
                  aria-label={`View ${user.name} profile`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {user.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {user.name}
                          </h3>
                          <p className="text-gray-600 text-xs truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' :
                            user.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {user.status}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize flex-shrink-0">
                            {user.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full mt-2">
                        <p className="text-gray-500 text-xs flex-shrink-0">
                          Joined {user.join_date}
                        </p>
                        <div className="flex space-x-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/users/${user.id}/edit`);
                            }}
                            className="text-purple-600 hover:text-purple-700 p-1 rounded transition-colors"
                            aria-label={`Edit ${user.name}`}
                          >
                            <EditIcon className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/users/${user.id}/view`);
                            }}
                            className="text-gray-600 hover:text-gray-700 p-1 rounded transition-colors"
                            aria-label={`View ${user.name}`}
                          >
                            <EyeIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* SYSTEM REPORTS */}
          <section aria-labelledby="system-reports-heading" className="w-full">
            <div className="flex items-center justify-between mb-4 w-full">
              <h2 id="system-reports-heading" className="text-lg font-semibold text-gray-900">
                System Reports
              </h2>
              <button 
                onClick={() => router.push('/admin/reports')}
                className="text-purple-600 text-sm hover:underline font-medium flex items-center space-x-1 touch-manipulation flex-shrink-0"
              >
                <span>View all</span>
                <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
              </button>
            </div>

            <div className="space-y-3 w-full">
              {systemReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  onClick={() => handleReportClick(report.id)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition-all cursor-pointer touch-manipulation w-full"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleReportClick(report.id)}
                  aria-label={`View ${report.title} report`}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center space-x-2 mb-1 w-full">
                        {getStatusIcon(report.status)}
                        <h3 className="font-medium text-gray-900 text-sm truncate flex-1 min-w-0">
                          {report.title}
                        </h3>
                        {getPriorityBadge(report.priority)}
                      </div>
                      <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">
                        {report.description}
                      </p>
                      <p className="text-gray-500 text-xs mt-1 truncate">
                        {report.timestamp}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* PLATFORM HEALTH */}
        <section aria-labelledby="platform-health-heading" className="w-full">
          <div className="flex items-center justify-between mb-4 w-full">
            <h2 id="platform-health-heading" className="text-lg font-semibold text-gray-900">
              Platform Health
            </h2>
            <TrendingUpIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">API Status</p>
              <p className="text-xs text-green-600 mt-1">Operational</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChartIcon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Response Time</p>
              <p className="text-xs text-blue-600 mt-1">128ms</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Active Sessions</p>
              <p className="text-xs text-purple-600 mt-1">247</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <ZapIcon className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Monthly Growth</p>
              <p className="text-xs text-orange-600 mt-1">+{adminStats.monthly_growth}%</p>
            </div>
          </div>
        </section>
      </main>

      {/* BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  );
}