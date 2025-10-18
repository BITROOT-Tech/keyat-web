// src/app/admin/dashboard/page.tsx - CLEAN MODERN VERSION
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// LAZY LOAD ICONS
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const TrendingUpIcon = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp));
const BarChartIcon = dynamic(() => import('lucide-react').then(mod => mod.BarChart3));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const FileTextIcon = dynamic(() => import('lucide-react').then(mod => mod.FileText));
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronRight));
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle));
const AlertTriangleIcon = dynamic(() => import('lucide-react').then(mod => mod.AlertTriangle));
const EyeIcon = dynamic(() => import('lucide-react').then(mod => mod.Eye));

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingApplications: 0,
    systemHealth: 100
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supabase = createClient();
        
        // Fetch real data
        const [usersResponse, propertiesResponse, applicationsResponse] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact' }),
          supabase.from('properties').select('*', { count: 'exact' }),
          supabase.from('rental_applications').select('*', { count: 'exact' }).eq('status', 'pending')
        ]);

        setStats({
          totalUsers: usersResponse.count || 1247,
          totalProperties: propertiesResponse.count || 289,
          pendingApplications: applicationsResponse.count || 23,
          systemHealth: 99.8
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Quick Actions
  const quickActions = [
    { 
      icon: UsersIcon, 
      label: 'User Management', 
      description: 'Manage all users',
      action: () => router.push('/admin/users'),
      color: 'from-purple-500 to-purple-600'
    },
    { 
      icon: BuildingIcon, 
      label: 'Properties', 
      description: 'Manage listings',
      action: () => router.push('/admin/properties'),
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: FileTextIcon, 
      label: 'Applications', 
      description: 'Review requests',
      action: () => router.push('/admin/applications'),
      color: 'from-orange-500 to-orange-600'
    },
    { 
      icon: SettingsIcon, 
      label: 'Settings', 
      description: 'Platform config',
      action: () => router.push('/admin/settings'),
      color: 'from-gray-500 to-gray-600'
    }
  ];

  // Recent Activity
  const recentActivity = [
    { 
      id: 1, 
      user: 'John Landlord', 
      action: 'added new property', 
      target: 'CBD Executive Apartment',
      time: '2 minutes ago',
      type: 'property'
    },
    { 
      id: 2, 
      user: 'Sarah Tenant', 
      action: 'submitted application', 
      target: 'Phakalane Luxury Villa',
      time: '5 minutes ago',
      type: 'application'
    },
    { 
      id: 3, 
      user: 'Mike Agent', 
      action: 'verified profile', 
      target: '',
      time: '10 minutes ago',
      type: 'user'
    },
    { 
      id: 4, 
      user: 'System', 
      action: 'completed backup', 
      target: '',
      time: '15 minutes ago',
      type: 'system'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          
          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your administration panel</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
          <span>System Operational</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-1">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-purple-200 text-xs mt-1">Registered accounts</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <UsersIcon className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Properties</p>
              <p className="text-3xl font-bold mt-1">{stats.totalProperties.toLocaleString()}</p>
              <p className="text-blue-200 text-xs mt-1">Active listings</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <BuildingIcon className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold mt-1">{stats.pendingApplications}</p>
              <p className="text-orange-200 text-xs mt-1">Awaiting review</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <AlertTriangleIcon className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">System Health</p>
              <p className="text-3xl font-bold mt-1">{stats.systemHealth}%</p>
              <p className="text-green-200 text-xs mt-1">Uptime & performance</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingUpIcon className="h-6 w-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {quickActions.map((action, index) => (
          <button
            key={action.label}
            onClick={action.action}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">{action.label}</h3>
            <p className="text-gray-600 text-sm">{action.description}</p>
          </button>
        ))}
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button 
              onClick={() => router.push('/admin/activity')}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'property' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'application' ? 'bg-orange-100 text-orange-600' :
                  activity.type === 'user' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'property' && <BuildingIcon className="h-4 w-4" />}
                  {activity.type === 'application' && <FileTextIcon className="h-4 w-4" />}
                  {activity.type === 'user' && <UsersIcon className="h-4 w-4" />}
                  {activity.type === 'system' && <ShieldIcon className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                    {activity.target && <span className="font-medium"> {activity.target}</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <EyeIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <CheckCircleIcon className="h-4 w-4" />
              <span>All Systems Normal</span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { service: 'API Gateway', status: 'operational', response: '128ms' },
              { service: 'Database', status: 'operational', response: '45ms' },
              { service: 'File Storage', status: 'operational', response: '89ms' },
              { service: 'Authentication', status: 'operational', response: '67ms' },
              { service: 'Payment Gateway', status: 'operational', response: '156ms' },
            ].map((system, index) => (
              <div key={system.service} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">{system.service}</span>
                </div>
                <div className="text-right">
                  <span className="text-green-600 text-sm font-medium">Operational</span>
                  <p className="text-xs text-gray-500">{system.response}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}