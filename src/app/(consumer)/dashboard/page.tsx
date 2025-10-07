// src/app/(consumer)/dashboard/page.tsx - PREMIUM NATIVE EXPERIENCE
'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Search, Home, Heart, Bell, User, MapPin, Filter, 
  Calendar, ChevronRight, TrendingUp, Building2,
  Shield, Zap, Star, Clock, Eye, MessageCircle,
  ArrowRight, Settings, Sparkles, BadgeCheck,
  Target, BarChart3, Crown
} from 'lucide-react';

interface UserProfile {
  first_name: string;
  last_name: string;
  user_type: string;
  avatar_url?: string;
}

interface SmartMetric {
  metric: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  description: string;
}

export default function ConsumerDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMetric, setActiveMetric] = useState(0);
  const router = useRouter();
  const supabase = createClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Smart market metrics with auto-rotation
  const [smartMetrics, setSmartMetrics] = useState<SmartMetric[]>([
    { 
      metric: 'Rental Yield', 
      value: '6.8%', 
      change: 2.1, 
      trend: 'up',
      description: 'Above market average' 
    },
    { 
      metric: 'Price Growth', 
      value: '4.3%', 
      change: 1.2, 
      trend: 'up',
      description: 'Quarterly appreciation' 
    },
    { 
      metric: 'Vacancy Rate', 
      value: '3.1%', 
      change: -0.8, 
      trend: 'down',
      description: 'Below national average' 
    },
    { 
      metric: 'ROI Potential', 
      value: '12.4%', 
      change: 3.2, 
      trend: 'up',
      description: 'Premium investments' 
    }
  ]);

  // Premium listings with enhanced data
  const [premiumListings, setPremiumListings] = useState([
    {
      id: '1',
      title: 'The Residences • Block 9',
      type: 'Luxury Apartment',
      price: 14500,
      pricePerSq: 85,
      location: 'CBD, Gaborone',
      features: ['3 beds', '2.5 baths', '1,700 sqft'],
      amenities: ['Pool', 'Gym', '24/7 Security'],
      premium: true,
      verified: true,
      investmentGrade: true,
      roi: 8.2,
      views: 142,
      saved: 23
    },
    {
      id: '2',
      title: 'Phakalane Estate',
      type: 'Executive Villa',
      price: 25000,
      pricePerSq: 72,
      location: 'Phakalane Golf Estate',
      features: ['5 beds', '4 baths', '3,400 sqft'],
      amenities: ['Golf Course', 'Clubhouse', 'Security'],
      premium: true,
      verified: true,
      investmentGrade: true,
      roi: 9.1,
      views: 89,
      saved: 15
    }
  ]);

  // User stats
  const [userStats, setUserStats] = useState({
    saved: 12,
    viewed: 47,
    tours: 8,
    contacts: 15,
    portfolioValue: 2850000
  });

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
      setActiveMetric(prev => (prev + 1) % smartMetrics.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [router, supabase]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Enhanced quick actions with better functionality
  const smartActions = [
    { 
      icon: Search, 
      label: 'Smart Search', 
      description: 'AI-powered matching',
      gradient: 'from-blue-600 to-cyan-500',
      action: () => router.push('/search'),
      premium: true
    },
    { 
      icon: Target, 
      label: 'Investment Finder', 
      description: 'High-yield opportunities',
      gradient: 'from-emerald-600 to-green-500',
      action: () => router.push('/search?investment=true'),
      premium: true
    },
    { 
      icon: Building2, 
      label: 'My Portfolio', 
      description: 'Track investments',
      gradient: 'from-violet-600 to-purple-500',
      action: () => router.push('/portfolio'),
      premium: false
    },
    { 
      icon: BarChart3, 
      label: 'Market Intel', 
      description: 'Live analytics',
      gradient: 'from-amber-600 to-orange-500',
      action: () => router.push('/market-insights'),
      premium: true
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'view',
      title: 'Viewed Luxury Penthouse',
      description: 'The Capital Towers • Main Mall',
      time: '2 hours ago',
      premium: true,
      action: () => router.push('/property/1')
    },
    {
      id: 2,
      type: 'save',
      title: 'Saved Investment Property',
      description: 'Phakalane Golf Estate',
      time: '1 day ago',
      premium: true,
      action: () => router.push('/property/2')
    },
    {
      id: 3,
      type: 'tour',
      title: 'Tour Confirmed',
      description: 'Tomorrow 2:00 PM • Block 9',
      time: '3 hours ago',
      premium: false,
      action: () => router.push('/booking')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-slate-600 font-medium text-sm mt-4">Preparing your dashboard...</p>
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
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Welcome back, {user?.first_name || 'User'} 👋
                </h1>
                <p className="text-slate-600 text-sm">Ready to find your next investment?</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center hover:shadow-md transition-all active:scale-95">
                <Bell className="h-5 w-5 text-slate-600" />
              </button>
              <button 
                onClick={() => router.push('/profile')}
                className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-all active:scale-95"
              >
                <User className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Smart Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-11 pr-12 py-3 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all text-slate-900 placeholder-slate-500 shadow-sm"
              placeholder="Search properties, locations, or investments..."
            />
            <button 
              onClick={handleSearch}
              className="absolute inset-y-1.5 right-1.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95 text-sm flex items-center space-x-1"
            >
              <span>Go</span>
              <Zap className="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main 
        ref={scrollRef}
        className="px-5 pb-32 overflow-y-auto native-scroll"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Smart Metrics Carousel */}
        <section className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900">Market Intelligence</h2>
              <div className="flex items-center space-x-1 text-blue-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Live</span>
              </div>
            </div>
            
            <div className="relative h-20">
              {smartMetrics.map((metric, index) => (
                <div
                  key={metric.metric}
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
                      <h3 className="font-semibold text-slate-900 text-sm">{metric.metric}</h3>
                      <p className="text-slate-600 text-xs">{metric.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center space-x-1 mt-3">
              {smartMetrics.map((_, index) => (
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

        {/* Smart Actions Grid */}
        <section className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            {smartActions.map(({ icon: Icon, label, description, gradient, action, premium }) => (
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
                    <Crown className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{label}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Premium Listings */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Premium Opportunities</h2>
              <p className="text-slate-600 text-sm">Verified high-yield properties</p>
            </div>
            <button 
              onClick={() => router.push('/search?premium=true')}
              className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {premiumListings.map((property) => (
              <div
                key={property.id}
                onClick={() => router.push(`/property/${property.id}`)}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/80 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 active:scale-95 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{property.title}</h3>
                      {property.verified && (
                        <BadgeCheck className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-slate-600 text-xs">{property.location}</p>
                  </div>
                  {property.investmentGrade && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ROI {property.roi}%
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-blue-600 font-bold text-lg">
                    P{property.price.toLocaleString()}
                    <span className="text-slate-500 text-sm font-normal">/month</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500 text-xs">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{property.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{property.saved}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {property.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Activity</h2>
              <p className="text-slate-600 text-sm">Recent interactions</p>
            </div>
            <button 
              onClick={() => router.push('/profile?activity=all')}
              className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 divide-y divide-slate-200/50">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                onClick={activity.action}
                className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.premium 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                      : 'bg-slate-100'
                  }`}>
                    {activity.type === 'view' && <Eye className="h-5 w-5 text-white" />}
                    {activity.type === 'save' && <Heart className="h-5 w-5 text-white" />}
                    {activity.type === 'tour' && <Calendar className="h-5 w-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-slate-900 text-sm">{activity.title}</h3>
                      {activity.premium && (
                        <Sparkles className="h-3 w-3 text-amber-500" />
                      )}
                    </div>
                    <p className="text-slate-600 text-xs">{activity.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-400 text-xs">{activity.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
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
              { icon: Home, label: 'Home', active: true, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
              { icon: Search, label: 'Search', action: () => router.push('/search') },
              { icon: Building2, label: 'Portfolio', action: () => router.push('/portfolio') },
              { icon: Heart, label: 'Saved', action: () => router.push('/profile?saved=true') },
              { icon: User, label: 'Profile', action: () => router.push('/profile') },
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
        
        button:active, 
        [role="button"]:active {
          transform: scale(0.96);
        }
      `}</style>
    </div>
  );
}