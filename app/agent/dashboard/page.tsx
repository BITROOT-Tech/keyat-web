// app/agent/dashboard/page.tsx
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
  Target, Briefcase, Award
} from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  email?: string;
  phone?: string;
}

interface Listing {
  id: string;
  title: string;
  type: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  status: 'active' | 'pending' | 'sold' | 'draft';
  views: number;
  inquiries: number;
  created_at: string;
}

interface AgentStats {
  total_listings: number;
  active_listings: number;
  pending_deals: number;
  total_commission: number;
  monthly_earnings: number;
  client_satisfaction: number;
}

export default function AgentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<AgentStats>({
    total_listings: 0,
    active_listings: 0,
    pending_deals: 0,
    total_commission: 0,
    monthly_earnings: 0,
    client_satisfaction: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAgentData = useCallback(async () => {
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
      setListings([
        {
          id: '1',
          title: 'CBD Luxury Apartment',
          type: 'apartment',
          price: 14500,
          location: 'CBD, Gaborone',
          bedrooms: 2,
          bathrooms: 2,
          status: 'active',
          views: 124,
          inquiries: 8,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Phakalane Executive Home',
          type: 'house',
          price: 25000,
          location: 'Phakalane Estate',
          bedrooms: 4,
          bathrooms: 3,
          status: 'pending',
          views: 89,
          inquiries: 5,
          created_at: new Date().toISOString()
        }
      ]);

      setStats({
        total_listings: 12,
        active_listings: 8,
        pending_deals: 4,
        total_commission: 45230,
        monthly_earnings: 15600,
        client_satisfaction: 4.8
      });

    } catch (error) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAgentData();
  }, [fetchAgentData]);

  const quickActions = [
    { 
      icon: Plus, 
      label: 'Add Listing', 
      description: 'Create new property',
      href: '/agent/listings/new',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      icon: Briefcase, 
      label: 'My Listings', 
      description: 'Manage properties',
      href: '/agent/listings',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    { 
      icon: Users, 
      label: 'Clients', 
      description: 'Client management',
      href: '/agent/clients',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      icon: DollarSign, 
      label: 'Commissions', 
      description: 'View earnings',
      href: '/agent/commissions',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAgentData();
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
                Welcome, Agent {user?.first_name}
              </h1>
              <p className="text-gray-600 text-sm truncate">
                Manage your listings and commissions
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
                onClick={() => router.push('/agent/notifications')}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Active Listings</p>
                  <p className="text-2xl font-bold mt-1">{stats.active_listings}</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <Target className="h-5 w-5" />
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
                  <p className="text-sm font-medium opacity-80">Pending Deals</p>
                  <p className="text-2xl font-bold mt-1">{stats.pending_deals}</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Satisfaction</p>
                  <p className="text-2xl font-bold mt-1">{stats.client_satisfaction}/5</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <Award className="h-5 w-5" />
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

        {/* Recent Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Listings</h2>
              <p className="text-gray-600 text-sm">Your property listings</p>
            </div>
            <button 
              onClick={() => router.push('/agent/listings')}
              className="text-blue-600 font-medium text-sm hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => router.push(`/agent/listings/${listing.id}`)}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {listing.title}
                        </h3>
                        <div className="flex items-center space-x-1 text-gray-600 text-xs mt-0.5">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{listing.location}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                        listing.status === 'active' ? 'bg-green-100 text-green-700' :
                        listing.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {listing.status}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        <span>{listing.bedrooms} bed</span>
                        <span>{listing.bathrooms} bath</span>
                        <span>{listing.views} views</span>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-semibold text-gray-900">
                          P{listing.price.toLocaleString()}/mo
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
