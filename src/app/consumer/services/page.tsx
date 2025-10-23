// src/app/consumer/services/page.tsx - COMPLETE SERVICES MARKETPLACE
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { Header, BottomNav } from '@/components/consumer';

// Lazy load icons
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const FilterIcon = dynamic(() => import('lucide-react').then(mod => mod.Filter));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const ClockIcon = dynamic(() => import('lucide-react').then(mod => mod.Clock));
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle));
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const WrenchIcon = dynamic(() => import('lucide-react').then(mod => mod.Wrench));
const SparklesIcon = dynamic(() => import('lucide-react').then(mod => mod.Sparkles));
const TruckIcon = dynamic(() => import('lucide-react').then(mod => mod.Truck));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  price_range: string;
  response_time: string;
  location: string;
  image: string;
  verified: boolean;
  featured: boolean;
  services: string[];
  experience: string;
  languages: string[];
  availability: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  count: number;
}

export default function ServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Service categories
  const serviceCategories: ServiceCategory[] = [
    {
      id: 'all',
      name: 'All Services',
      description: 'Browse all service providers',
      icon: HomeIcon,
      color: 'bg-blue-500',
      count: 48
    },
    {
      id: 'cleaning',
      name: 'Cleaning',
      description: 'Home & office cleaning',
      icon: SparklesIcon,
      color: 'bg-green-500',
      count: 12
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      description: 'Repairs & fixes',
      icon: WrenchIcon,
      color: 'bg-orange-500',
      count: 8
    },
    {
      id: 'moving',
      name: 'Moving',
      description: 'Relocation services',
      icon: TruckIcon,
      color: 'bg-purple-500',
      count: 6
    },
    {
      id: 'plumbing',
      name: 'Plumbing',
      description: 'Pipe & drainage work',
      icon: WrenchIcon,
      color: 'bg-cyan-500',
      count: 5
    },
    {
      id: 'electrical',
      name: 'Electrical',
      description: 'Wiring & installations',
      icon: SparklesIcon,
      color: 'bg-yellow-500',
      count: 7
    },
    {
      id: 'pest-control',
      name: 'Pest Control',
      description: 'Extermination services',
      icon: ShieldIcon,
      color: 'bg-red-500',
      count: 4
    },
    {
      id: 'gardening',
      name: 'Gardening',
      description: 'Landscaping & lawn care',
      icon: SparklesIcon,
      color: 'bg-emerald-500',
      count: 3
    }
  ];

  // Mock service providers data
  const serviceProviders: ServiceProvider[] = [
    {
      id: '1',
      name: 'ProClean Services',
      category: 'cleaning',
      description: 'Professional home and office cleaning with eco-friendly products',
      rating: 4.8,
      reviews: 127,
      price_range: 'P300 - P800',
      response_time: 'Within 2 hours',
      location: 'Gaborone, Block 9',
      image: '',
      verified: true,
      featured: true,
      services: ['Deep Cleaning', 'Office Cleaning', 'Move-in/Move-out Cleaning'],
      experience: '5+ years',
      languages: ['English', 'Setswana'],
      availability: 'Available Today'
    },
    {
      id: '2',
      name: 'QuickFix Maintenance',
      category: 'maintenance',
      description: 'General home repairs and maintenance services',
      rating: 4.6,
      reviews: 89,
      price_range: 'P200 - P1,500',
      response_time: 'Within 1 hour',
      location: 'Phakalane, Gaborone',
      image: '',
      verified: true,
      featured: false,
      services: ['Furniture Assembly', 'Minor Repairs', 'Painting'],
      experience: '3+ years',
      languages: ['English', 'Setswana'],
      availability: 'Available Tomorrow'
    },
    {
      id: '3',
      name: 'SafeMove Relocations',
      category: 'moving',
      description: 'Professional moving services with insurance coverage',
      rating: 4.9,
      reviews: 156,
      price_range: 'P1,500 - P5,000',
      response_time: 'Within 4 hours',
      location: 'Broadhurst, Gaborone',
      image: '',
      verified: true,
      featured: true,
      services: ['Local Moving', 'Packing Services', 'Storage Solutions'],
      experience: '7+ years',
      languages: ['English', 'Setswana'],
      availability: 'Available This Week'
    },
    {
      id: '4',
      name: 'PipeMaster Plumbing',
      category: 'plumbing',
      description: 'Licensed plumbers for all your pipe and drainage needs',
      rating: 4.7,
      reviews: 94,
      price_range: 'P400 - P2,000',
      response_time: 'Within 3 hours',
      location: 'Mogoditshane',
      image: '',
      verified: true,
      featured: false,
      services: ['Leak Repair', 'Drain Cleaning', 'Fixture Installation'],
      experience: '8+ years',
      languages: ['English', 'Setswana'],
      availability: 'Available Today'
    },
    {
      id: '5',
      name: 'Spark Electric',
      category: 'electrical',
      description: 'Certified electricians for safe electrical work',
      rating: 4.8,
      reviews: 112,
      price_range: 'P500 - P3,000',
      response_time: 'Within 2 hours',
      location: 'Tlokweng, Gaborone',
      image: '',
      verified: true,
      featured: true,
      services: ['Wiring', 'Light Installation', 'Socket Repair'],
      experience: '6+ years',
      languages: ['English', 'Setswana'],
      availability: 'Available Tomorrow'
    },
    {
      id: '6',
      name: 'GreenThumb Landscaping',
      category: 'gardening',
      description: 'Professional gardening and landscape design',
      rating: 4.5,
      reviews: 67,
      price_range: 'P350 - P1,200',
      response_time: 'Within 24 hours',
      location: 'Molepolole',
      image: '',
      verified: true,
      featured: false,
      services: ['Lawn Care', 'Garden Design', 'Tree Trimming'],
      experience: '4+ years',
      languages: ['English', 'Setswana'],
      availability: 'Available Next Week'
    },
    {
      id: '7',
      name: 'BugBusters Pest Control',
      category: 'pest-control',
      description: 'Effective pest elimination with safe chemicals',
      rating: 4.6,
      reviews: 78,
      price_range: 'P600 - P1,800',
      response_time: 'Within 6 hours',
      location: 'Palapye',
      image: '',
      verified: true,
      featured: false,
      services: ['Fumigation', 'Rodent Control', 'Preventive Treatment'],
      experience: '5+ years',
      languages: ['English', 'Setswana'],
      availability: 'Available Today'
    },
    {
      id: '8',
      name: 'Elite Cleaners',
      category: 'cleaning',
      description: 'Premium cleaning services for luxury homes',
      rating: 4.9,
      reviews: 203,
      price_range: 'P800 - P2,500',
      response_time: 'Within 4 hours',
      location: 'Phakalane, Gaborone',
      image: '',
      verified: true,
      featured: true,
      services: ['Luxury Cleaning', 'Carpet Cleaning', 'Window Cleaning'],
      experience: '10+ years',
      languages: ['English', 'Setswana', 'Afrikaans'],
      availability: 'Available Tomorrow'
    }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser(profile || {
            first_name: session.user.email?.split('@')[0] || 'User',
            email: session.user.email
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Auth error:', err);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Filter and sort providers
  const filteredProviders = serviceProviders
    .filter(provider => {
      const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          provider.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'price-low':
          return parseFloat(a.price_range.replace(/[^\d.]/g, '')) - parseFloat(b.price_range.replace(/[^\d.]/g, ''));
        case 'price-high':
          return parseFloat(b.price_range.replace(/[^\d.]/g, '')) - parseFloat(a.price_range.replace(/[^\d.]/g, ''));
        default:
          return 0;
      }
    });

  const handleFavoriteToggle = (providerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleProviderClick = (providerId: string) => {
    router.push(`/consumer/services/${providerId}`);
  };

  const getCategoryColor = (categoryId: string) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    return category?.color || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200">
          <Header
            user={user}
            searchQuery=""
            onSearchChange={() => {}}
            onQuickSearch={() => {}}
            notifications={0}
            showLocationFilter={false}
            onLocationFilterClick={() => {}}
          />
        </div>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            
            {/* Categories skeleton */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            
            {/* Providers skeleton */}
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <Header
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onQuickSearch={() => {}}
          notifications={0}
          showLocationFilter={false}
          onLocationFilterClick={() => {}}
        />
      </div>

      <div className="p-4 max-w-6xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Providers</h1>
          <p className="text-gray-600">Find trusted professionals for your home needs</p>
        </div>

        {/* CATEGORIES GRID */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {serviceCategories.map((category) => (
              <motion.button
                key={category.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${category.color} text-white`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{category.name}</h3>
                    <p className="text-gray-600 text-xs truncate">{category.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{category.count} providers</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* FILTERS AND SORT */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FilterIcon className="h-4 w-4" />
              Filters
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviews</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* SERVICE PROVIDERS */}
        <div className="space-y-4">
          {filteredProviders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No service providers found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? `No results for "${searchQuery}"`
                  : 'No providers available in this category'
                }
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleProviderClick(provider.id)}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Provider Image & Badges */}
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      {provider.image ? (
                        <img 
                          src={provider.image} 
                          alt={provider.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <UsersIcon className="h-8 w-8 text-blue-600" />
                      )}
                    </div>
                    
                    {/* Verification Badge */}
                    {provider.verified && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                        <ShieldIcon className="h-3 w-3" />
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {provider.featured && (
                      <div className="absolute -bottom-1 -left-1 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Provider Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                            {provider.name}
                          </h3>
                          {provider.verified && (
                            <ShieldIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{provider.location}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2">{provider.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Rating */}
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-semibold text-gray-900">{provider.rating}</span>
                          </div>
                          <div className="text-gray-500 text-sm">({provider.reviews} reviews)</div>
                        </div>
                        
                        {/* Favorite Button */}
                        <button
                          onClick={(e) => handleFavoriteToggle(provider.id, e)}
                          className={`p-2 rounded-full transition-all ${
                            favorites.includes(provider.id)
                              ? 'bg-rose-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                          }`}
                        >
                          <HeartIcon className={`h-4 w-4 ${favorites.includes(provider.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Services & Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="text-gray-900 font-medium">{provider.response_time}</div>
                          <div className="text-gray-500 text-xs">Response</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="text-gray-900 font-medium">{provider.experience}</div>
                          <div className="text-gray-500 text-xs">Experience</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircleIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="text-gray-900 font-medium">{provider.availability}</div>
                          <div className="text-gray-500 text-xs">Available</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(provider.category)} flex-shrink-0`}></div>
                        <div>
                          <div className="text-gray-900 font-medium capitalize">{provider.category}</div>
                          <div className="text-gray-500 text-xs">Category</div>
                        </div>
                      </div>
                    </div>

                    {/* Services Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {provider.services.slice(0, 3).map((service, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                          >
                            {service}
                          </span>
                        ))}
                        {provider.services.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                            +{provider.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{provider.price_range}</div>
                        <div className="text-gray-600 text-sm">Starting price</div>
                      </div>
                      
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* FILTER MODAL */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center lg:justify-center"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-t-2xl lg:rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FilterIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Min Price (P)</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Max Price (P)</label>
                      <input
                        type="number"
                        placeholder="5000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Rating</h3>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 flex items-center">
                          {rating}+ 
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Today', 'Tomorrow', 'This Week', 'Next Week'].map((availability) => (
                      <button
                        key={availability}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                      >
                        {availability}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Verification</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center">
                        Verified Only
                        <ShieldIcon className="h-4 w-4 text-blue-500 ml-1" />
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM NAVIGATION */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}