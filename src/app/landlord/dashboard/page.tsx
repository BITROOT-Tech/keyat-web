// src/app/landlord/dashboard/page.tsx - PREMIUM LANDLORD DASHBOARD
"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Building2, Users, TrendingUp, Calendar, Wallet, 
  AlertCircle, CheckCircle, Clock, ArrowRight,
  Plus, Eye, MessageCircle, Phone, Mail,
  Shield, Star, MapPin, Home, Zap, Sparkles,
  BarChart3, FileText, Settings, Bell
} from 'lucide-react';

interface LandlordProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  verified: boolean;
}

interface Property {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  tenants: number;
  image: string;
  nextPayment: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  moveInDate: string;
  rent: number;
  status: 'current' | 'overdue' | 'pending';
  nextPayment: string;
}

interface FinancialMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  description: string;
}

export default function LandlordDashboard() {
  const [user, setUser] = useState<LandlordProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  // Landlord financial metrics
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetric[]>([
    { 
      label: 'Monthly Revenue', 
      value: 'P45,800', 
      change: 12.4, 
      trend: 'up',
      description: 'From all properties' 
    },
    { 
      label: 'Occupancy Rate', 
      value: '92%', 
      change: 3.2, 
      trend: 'up',
      description: 'Properties occupied' 
    },
    { 
      label: 'Collection Rate', 
      value: '98%', 
      change: 1.8, 
      trend: 'up',
      description: 'Rent collected on time' 
    },
    { 
      label: 'Maintenance Cost', 
      value: 'P2,400', 
      change: -5.2, 
      trend: 'down',
      description: 'This month' 
    }
  ]);

  // Landlord properties
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      title: 'The Residences • Block 9',
      location: 'CBD, Gaborone',
      type: 'Luxury Apartment',
      price: 14500,
      status: 'occupied',
      tenants: 2,
      image: '/api/placeholder/300/200',
      nextPayment: '2024-03-01',
      paymentStatus: 'paid'
    },
    {
      id: '2',
      title: 'Phakalane Executive Villa',
      location: 'Phakalane Golf Estate',
      type: 'Executive Villa',
      price: 25000,
      status: 'occupied',
      tenants: 5,
      image: '/api/placeholder/300/200',
      nextPayment: '2024-03-05',
      paymentStatus: 'pending'
    },
    {
      id: '3',
      title: 'City Center Studio',
      location: 'Main Mall, Gaborone',
      type: 'Studio Apartment',
      price: 4800,
      status: 'vacant',
      tenants: 0,
      image: '/api/placeholder/300/200',
      nextPayment: 'N/A',
      paymentStatus: 'pending'
    }
  ]);

  // Current tenants
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'Sarah M. Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+267 71 123 456',
      property: 'The Residences • Block 9',
      moveInDate: '2023-08-15',
      rent: 14500,
      status: 'current',
      nextPayment: '2024-03-01'
    },
    {
      id: '2',
      name: 'David K. Smith',
      email: 'david.smith@email.com',
      phone: '+267 72 234 567',
      property: 'Phakalane Executive Villa',
      moveInDate: '2023-11-01',
      rent: 25000,
      status: 'current',
      nextPayment: '2024-03-05'
    }
  ]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setUser(profile);
        }
      } catch (error) {
        console.error('Error in dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Auto-rotate metrics
    const interval = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % financialMetrics.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [router, supabase]);

  const quickActions = [
    { 
      icon: Plus, 
      label: 'Add Property', 
      description: 'List new property',
      gradient: 'from-blue-600 to-cyan-500',
      action: () => router.push('/landlord/properties/new'),
      premium: true
    },
    { 
      icon: Users, 
      label: 'Manage Tenants', 
      description: 'Tenant directory',
      gradient: 'from-emerald-600 to-green-500',
      action: () => router.push('/landlord/tenants'),
      premium: false
    },
    { 
      icon: Wallet, 
      label: 'View Earnings', 
      description: 'Financial reports',
      gradient: 'from-violet-600 to-purple-500',
      action: () => router.push('/landlord/earnings'),
      premium: false
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      description: 'Property performance',
      gradient: 'from-amber-600 to-orange-500',
      action: () => router.push('/landlord/analytics'),
      premium: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'vacant': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      case 'current': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-slate-600 font-medium text-sm mt-4">Loading your property portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 safe-area-padding">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 supports-backdrop-blur:bg-white/60">
        <div className="px-5 pt-6 pb-4">
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Welcome back, {user?.first_name || 'Landlord'} 👋
                </h1>
                <p className="text-slate-600 text-sm">Manage your property portfolio</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center hover:shadow-md transition-all active:scale-95">
                <Bell className="h-5 w-5 text-slate-600" />
              </button>
              <button 
                onClick={() => router.push('/landlord/profile')}
                className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-all active:scale-95"
              >
                <Users className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-slate-200/80">
              <div className="text-slate-900 font-bold text-lg">{properties.length}</div>
              <div className="text-slate-600 text-xs">Properties</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-slate-200/80">
              <div className="text-slate-900 font-bold text-lg">{tenants.length}</div>
              <div className="text-slate-600 text-xs">Tenants</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-slate-200/80">
              <div className="text-slate-900 font-bold text-lg">92%</div>
              <div className="text-slate-600 text-xs">Occupancy</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 pb-32 overflow-y-auto native-scroll">
        {/* Financial Metrics Carousel */}
        <section className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900">Financial Overview</h2>
              <div className="flex items-center space-x-1 text-blue-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Live</span>
              </div>
            </div>
            
            <div className="relative h-20">
              {financialMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className={`absolute inset-0 transition-all duration-500 ${
                    index === activeMetric ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${
                          metric.trend === 'up' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <TrendingUp className={`h-3 w-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                          <span>{metric.trend === 'up' ? '+' : ''}{metric.change}%</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm">{metric.label}</h3>
                      <p className="text-slate-600 text-xs">{metric.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center space-x-1 mt-3">
              {financialMetrics.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveMetric(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeMetric ? 'bg-blue-600 w-4' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ icon: Icon, label, description, gradient, action, premium }) => (
              <button
                key={label}
                onClick={action}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/80 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 active:scale-95 text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  {premium && (
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{label}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Properties Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Properties</h2>
              <p className="text-slate-600 text-sm">Manage your portfolio</p>
            </div>
            <button 
              onClick={() => router.push('/landlord/properties')}
              className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() => router.push(`/landlord/properties/${property.id}`)}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/80 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 active:scale-95 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{property.title}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(property.status)}`}>
                        {property.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-600 mb-2">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs font-medium">{property.location}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-blue-600 font-bold text-lg">
                      P{property.price.toLocaleString()}
                      <span className="text-slate-500 text-sm font-normal">/month</span>
                    </div>
                    <div className="text-slate-600 text-xs">
                      {property.tenants} tenant{property.tenants !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-600 text-xs">
                    <Calendar className="h-3 w-3" />
                    <span>Next payment: {new Date(property.nextPayment).toLocaleDateString()}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(property.paymentStatus)}`}>
                    {property.paymentStatus.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Tenants */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Current Tenants</h2>
              <p className="text-slate-600 text-sm">Tenant management</p>
            </div>
            <button 
              onClick={() => router.push('/landlord/tenants')}
              className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 divide-y divide-slate-200/50">
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                onClick={() => router.push(`/landlord/tenants/${tenant.id}`)}
                className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {tenant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-slate-900 text-sm">{tenant.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(tenant.status)}`}>
                        {tenant.status.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs">{tenant.property}</p>
                    <div className="flex items-center space-x-4 mt-2 text-slate-500 text-xs">
                      <div className="flex items-center space-x-1">
                        <Wallet className="h-3 w-3" />
                        <span>P{tenant.rent.toLocaleString()}/month</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due {new Date(tenant.nextPayment).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors">
                      <MessageCircle className="h-3 w-3 text-slate-600" />
                    </button>
                    <button className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors">
                      <Phone className="h-3 w-3 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <p className="text-slate-600 text-sm">Property updates and alerts</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 divide-y divide-slate-200/50">
            {[
              {
                id: 1,
                type: 'payment',
                title: 'Rent Payment Received',
                description: 'Sarah Johnson - The Residences',
                time: '2 hours ago',
                amount: 14500,
                status: 'success'
              },
              {
                id: 2,
                type: 'maintenance',
                title: 'Maintenance Request',
                description: 'Phakalane Villa - Plumbing issue',
                time: '1 day ago',
                amount: null,
                status: 'pending'
              },
              {
                id: 3,
                type: 'inquiry',
                title: 'New Rental Inquiry',
                description: 'City Center Studio - 3 viewings scheduled',
                time: '2 days ago',
                amount: null,
                status: 'info'
              }
            ].map((activity) => (
              <div
                key={activity.id}
                className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    activity.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'payment' && <Wallet className="h-5 w-5" />}
                    {activity.type === 'maintenance' && <AlertCircle className="h-5 w-5" />}
                    {activity.type === 'inquiry' && <Eye className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-900 text-sm">{activity.title}</h3>
                      {activity.amount && (
                        <div className="text-emerald-600 font-bold text-sm">
                          P{activity.amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs">{activity.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-400 text-xs">{activity.time}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Premium Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-[calc(100%-2.5rem)] max-w-sm">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border border-white/20 px-4 py-3">
          <div className="flex justify-around items-center">
            {[
              { icon: Home, label: 'Dashboard', active: true, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
              { icon: Building2, label: 'Properties', action: () => router.push('/landlord/properties') },
              { icon: Users, label: 'Tenants', action: () => router.push('/landlord/tenants') },
              { icon: Wallet, label: 'Earnings', action: () => router.push('/landlord/earnings') },
              { icon: Settings, label: 'Settings', action: () => router.push('/landlord/settings') },
            ].map(({ icon: Icon, label, active, action }) => (
              <button
                key={label}
                onClick={action}
                className={`flex flex-col items-center p-2 transition-all duration-300 ${
                  active 
                    ? 'text-blue-600 scale-110' 
                    : 'text-slate-600 hover:text-blue-500'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  active ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <style jsx global>{`
        .safe-area-padding {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .native-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        .native-scroll::-webkit-scrollbar {
          display: none;
        }
        
        .native-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
