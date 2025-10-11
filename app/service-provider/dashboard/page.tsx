// app/service-provider/dashboard/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Search, Home, Plus, Bell, User, MapPin, 
  ChevronRight, Building2, Eye, TrendingUp,
  Loader2, AlertCircle, RefreshCw, Shield,
  Calendar, DollarSign, Users, Settings,
  BarChart3, FileText, MessageSquare,
  Wrench, Clock, CheckCircle, Star
} from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  email?: string;
  phone?: string;
}

interface ServiceJob {
  id: string;
  title: string;
  type: string;
  client_name: string;
  location: string;
  scheduled_date: string;
  price: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
}

interface ServiceStats {
  total_jobs: number;
  active_jobs: number;
  completed_this_month: number;
  monthly_earnings: number;
  average_rating: number;
  response_time: number;
}

export default function ServiceProviderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<ServiceJob[]>([]);
  const [stats, setStats] = useState<ServiceStats>({
    total_jobs: 0,
    active_jobs: 0,
    completed_this_month: 0,
    monthly_earnings: 0,
    average_rating: 0,
    response_time: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchServiceData = useCallback(async () => {
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
      setJobs([
        {
          id: '1',
          title: 'Plumbing Repair',
          type: 'plumbing',
          client_name: 'John Tenant',
          location: 'CBD, Gaborone',
          scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          price: 1200,
          status: 'scheduled',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Electrical Inspection',
          type: 'electrical',
          client_name: 'Sarah Smith',
          location: 'Phakalane Estate',
          scheduled_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          price: 800,
          status: 'scheduled',
          priority: 'medium'
        }
      ]);

      setStats({
        total_jobs: 24,
        active_jobs: 8,
        completed_this_month: 16,
        monthly_earnings: 28500,
        average_rating: 4.7,
        response_time: 2.3
      });

    } catch (error) {
      console.error('Error fetching service data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  const quickActions = [
    { 
      icon: Plus, 
      label: 'New Service', 
      description: 'Add service offer',
      href: '/service-provider/services/new',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      icon: Wrench, 
      label: 'My Jobs', 
      description: 'Manage service jobs',
      href: '/service-provider/jobs',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    { 
      icon: Calendar, 
      label: 'Schedule', 
      description: 'View calendar',
      href: '/service-provider/schedule',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      icon: DollarSign, 
      label: 'Earnings', 
      description: 'View income',
      href: '/service-provider/earnings',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchServiceData();
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
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-xl"></div>
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
                Welcome, {user?.first_name}
              </h1>
              <p className="text-gray-600 text-sm truncate">
                Manage your service jobs and schedule
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
                onClick={() => router.push('/service-provider/notifications')}
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
        {/* Quick Stats */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Active Jobs</p>
                  <p className="text-2xl font-bold mt-1">{stats.active_jobs}</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <Wrench className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Monthly Earnings</p>
                  <p className="text-2xl font-bold mt-1">P{stats.monthly_earnings.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-purple-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Completed</p>
                  <p className="text-2xl font-bold mt-1">{stats.completed_this_month}</p>
                  <p className="text-xs opacity-70 mt-1">this month</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Rating</p>
                  <p className="text-2xl font-bold mt-1">{stats.average_rating}/5</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <Star className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
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

        {/* Upcoming Jobs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Jobs</h2>
              <p className="text-gray-600 text-sm">Scheduled service calls</p>
            </div>
            <button 
              onClick={() => router.push('/service-provider/jobs')}
              className="text-blue-600 font-medium text-sm hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => router.push(`/service-provider/jobs/${job.id}`)}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Wrench className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {job.title}
                        </h3>
                        <div className="flex items-center space-x-1 text-gray-600 text-xs mt-0.5">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">For {job.client_name}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                        job.priority === 'high' ? 'bg-red-100 text-red-700' :
                        job.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {job.priority}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(job.scheduled_date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-semibold text-gray-900">
                          P{job.price.toLocaleString()}
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
    </div>
  );
}
