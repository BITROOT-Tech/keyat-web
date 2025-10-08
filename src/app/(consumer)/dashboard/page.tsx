// src/app/(consumer)/dashboard/page.tsx - FIXED VERSION
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Search, Home, Heart, Bell, User, MapPin, 
  ChevronRight, Building2,
  Shield, Eye, BadgeCheck, Target, TrendingUp
} from 'lucide-react';

interface UserProfile {
  first_name: string;
  last_name: string;
  user_type: string;
  avatar_url?: string;
}

export default function ConsumerDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const quickActions = [
    { 
      icon: Search, 
      label: 'Find Properties', 
      description: 'Browse listings',
      href: '/search',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      icon: Target, 
      label: 'Investment', 
      description: 'ROI analysis',
      href: '/investment-tools',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    { 
      icon: Building2, 
      label: 'Portfolio', 
      description: 'Track properties',
      href: '/portfolio',
      color: 'bg-violet-50 text-violet-700 border-violet-200'
    },
    { 
      icon: Heart, 
      label: 'Saved', 
      description: 'Favorites',
      href: '/saved',
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    }
  ];

  const featuredProperties = [
    {
      id: '1',
      title: 'CBD Luxury Apartment',
      location: 'CBD, Gaborone',
      price: 14500,
      type: 'Apartment',
      beds: 2,
      baths: 2,
      sqft: 1200,
      verified: true,
      premium: true
    },
    {
      id: '2',
      title: 'Phakalane Executive Home',
      location: 'Phakalane Estate',
      price: 25000,
      type: 'House',
      beds: 4,
      baths: 3,
      sqft: 2400,
      verified: true,
      premium: true
    }
  ];

  // FIXED: Remove fake tour activity
  const recentActivity = [
    {
      id: 1,
      type: 'view',
      title: 'Viewed Apartment',
      property: 'The Residences',
      time: '2h ago'
    },
    {
      id: 2,
      type: 'save',
      title: 'Saved Property',
      property: 'Phakalane Villa',
      time: '1d ago'
    },
    {
      id: 3,
      type: 'trending',
      title: 'New Properties',
      property: 'In your area',
      time: 'Just now'
    }
  ];

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser(profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router, supabase]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center safe-area-inset">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 safe-area-inset">
      {/* Mobile-Optimized Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 sticky top-0 z-50 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-foreground truncate">
                Welcome, {user?.first_name}
              </h1>
              <p className="text-muted-foreground text-sm truncate">
                Find your perfect property
              </p>
            </div>
            
            <div className="flex items-center space-x-1 ml-3">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors active:scale-95 touch-manipulation">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Mobile-First Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder-muted-foreground text-base"
              placeholder="Search properties..."
              enterKeyHint="search"
            />
          </div>
        </div>
      </header>

      {/* Mobile-Optimized Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Quick Actions - Mobile Grid */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ icon: Icon, label, description, href, color }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className={`p-3 border rounded-xl text-left hover:shadow-sm transition-all active:scale-95 touch-manipulation ${color}`}
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-white/50">
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

        {/* Featured Properties - Mobile Cards */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Featured</h2>
              <p className="text-muted-foreground text-sm">Premium listings</p>
            </div>
            <button 
              onClick={() => router.push('/search')}
              className="text-primary font-medium text-sm hover:underline flex items-center space-x-1 active:scale-95"
            >
              <span>View all</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => router.push(`/property/${property.id}`)}
                className="bg-card border rounded-xl p-3 hover:shadow-sm transition-all cursor-pointer active:scale-95 touch-manipulation"
              >
                <div className="flex space-x-3">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Home className="h-6 w-6 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 mb-1">
                          <h3 className="font-semibold text-foreground text-sm truncate">
                            {property.title}
                          </h3>
                          {property.verified && (
                            <BadgeCheck className="h-3 w-3 text-primary flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1 text-muted-foreground text-xs mb-2">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{property.location}</span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <span>{property.beds} bd</span>
                          <span>{property.baths} ba</span>
                          <span>{property.sqft.toLocaleString()} sqft</span>
                        </div>
                      </div>

                      <div className="text-right pl-2 flex-shrink-0">
                        <div className="text-base font-semibold text-foreground">
                          P{property.price.toLocaleString()}
                        </div>
                        {property.premium && (
                          <div className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-xs font-medium mt-1">
                            Premium
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity - Mobile List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
              <p className="text-muted-foreground text-sm">Your interactions</p>
            </div>
          </div>

          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="bg-card border rounded-xl p-3 hover:shadow-sm transition-all cursor-pointer active:scale-95 touch-manipulation"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {activity.type === 'view' && <Eye className="h-4 w-4 text-muted-foreground" />}
                      {activity.type === 'save' && <Heart className="h-4 w-4 text-muted-foreground" />}
                      {activity.type === 'trending' && <TrendingUp className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm truncate">{activity.title}</h3>
                      <p className="text-muted-foreground text-xs truncate">{activity.property}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-muted-foreground text-xs">{activity.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mobile-Optimized CTA */}
        <section>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-foreground text-sm mb-1">Verified Profile</h3>
            <p className="text-muted-foreground text-xs mb-3">
              Better application success
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors active:scale-95 text-sm">
              Complete Profile
            </button>
          </div>
        </section>
      </main>

      {/* Mobile-First Bottom Navigation - FIXED: Remove Tours */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-40 safe-area-bottom">
        <div className="px-4 py-2">
          <div className="flex justify-around items-center">
            {[
              { icon: Home, label: 'Home', active: true, href: '/dashboard' },
              { icon: Search, label: 'Search', href: '/search' },
              { icon: Heart, label: 'Saved', href: '/saved' },
              { icon: User, label: 'Profile', href: '/profile' },
            ].map(({ icon: Icon, label, active, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className={`flex flex-col items-center p-2 transition-all duration-200 min-w-0 flex-1 ${
                  active 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                  active ? 'bg-primary/10' : 'hover:bg-accent'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 font-medium truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <style jsx global>{`
        .safe-area-inset {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }
        
        .safe-area-top {
          padding-top: env(safe-area-inset-top);
        }
        
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .touch-manipulation {
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
}