// app/admin/dashboard/page.tsx - COMPLETE VERSION
'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Bell, RefreshCw, Users, Building2, DollarSign, 
  Activity, Shield as ShieldIcon, Database, ChevronRight
} from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  email?: string;
  phone?: string;
}

interface SystemStats {
  total_users: number;
  total_properties: number;
  total_transactions: number;
  system_health: number;
  active_sessions: number;
  storage_used: number;
}

interface RecentActivity {
  id: string;
  user_name: string;
  action: string;
  timestamp: string;
  type: 'user' | 'property' | 'system' | 'security';
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<SystemStats>({
    total_users: 0,
    total_properties: 0,
    total_transactions: 0,
    system_health: 0,
    active_sessions: 0,
    storage_used: 0
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setUser(profile);

      // Mock data for demo
      setStats({
        total_users: 1247,
        total_properties: 856,
        total_transactions: 2341,
        system_health: 98.5,
        active_sessions: 42,
        storage_used: 65.2
      });

      setActivities([
        {
          id: '1',
          user_name: 'John Doe',
          action: 'New property listing approved',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          type: 'property'
        },
        {
          id: '2',
          user_name: 'System',
          action: 'Database backup completed',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          type: 'system'
        },
        {
          id: '3',
          user_name: 'Sarah Smith',
          action: 'User account created',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          type: 'user'
        }
      ]);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const quickActions = [
    {
      icon: Users,
      label: 'User Management',
      description: 'Manage all users',
      href: '/admin/users',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      icon: Building2,
      label: 'Properties',
      description: 'Manage listings',
      href: '/admin/properties',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      icon: DollarSign,
      label: 'Transactions',
      description: 'View all payments',
      href: '/admin/transactions',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      icon: ShieldIcon,
      label: 'Security',
      description: 'System security',
      href: '/admin/security',
      color: 'bg-red-50 text-red-700 border-red-200'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAdminData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 p-4 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-white rounded-2xl"></div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 safe-area-inset">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 safe-area-top">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm truncate">
                System overview and management
              </p>
            </div>

            <div className="flex items-center space-x-2 ml-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => router.push('/admin/notifications')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* System Stats */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Total Users</p>
                  <p className="text-2xl font-bold mt-1">{stats.total_users.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Properties</p>
                  <p className="text-2xl font-bold mt-1">{stats.total_properties.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-purple-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Transactions</p>
                  <p className="text-2xl font-bold mt-1">{stats.total_transactions.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">System Health</p>
                  <p className="text-2xl font-bold mt-1">{stats.system_health}%</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ icon: Icon, label, description, href, color }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className={`p-4 border rounded-xl text-left transition-all hover:shadow-sm active:scale-95 ${color}`}   
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{label}</h3>
                    <p className="text-gray-600 text-xs mt-0.5 truncate">{description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-gray-600 text-sm">System and user activities</p>
            </div>
            <button
              onClick={() => router.push('/admin/activity')}
              className="text-blue-600 font-medium text-sm hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'property' ? 'bg-green-100 text-green-600' :
                    activity.type === 'system' ? 'bg-purple-100 text-purple-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {activity.type === 'user' && <Users className="h-4 w-4" />}
                    {activity.type === 'property' && <Building2 className="h-4 w-4" />}
                    {activity.type === 'system' && <Database className="h-4 w-4" />}
                    {activity.type === 'security' && <ShieldIcon className="h-4 w-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">
                      {activity.action}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {activity.user_name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
