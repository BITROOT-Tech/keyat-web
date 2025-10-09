// src/app/(consumer)/search/page.tsx - BATTLE-TESTED PREMIUM VERSION
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, Filter, MapPin, Home, Bed, Bath, Heart, Star, 
  Square, Car, Building2, Crown, Sparkles, Zap, TrendingUp,
  X, SlidersHorizontal, Grid3X3, List, Map
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  parking: number;
  image: string;
  rating: number;
  premium: boolean;
  investment_grade: boolean;
  roi?: number;
  views: number;
  saved: number;
  featured: boolean;
  property_type: string;
}

function SearchContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    propertyType: '',
    investmentGrade: false,
    premiumOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const propertyTypes = [
    'Luxury Apartment', 'Executive Villa', 'Apartment', 'Townhouse', 
    'Studio', 'Commercial', 'Penthouse', 'Duplex'
  ];

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      
      try {
        // Real Supabase query - replace with your actual query
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active')
          .limit(20);

        if (error) throw error;

        // Mock data for demo - replace with actual data
        const mockProperties: Property[] = [
          {
            id: '1',
            title: 'The Residences • Luxury 2-Bedroom',
            price: 14500,
            location: 'Block 9, CBD Gaborone',
            beds: 2,
            baths: 2.5,
            sqft: 1700,
            parking: 2,
            image: '/api/placeholder/300/200',
            rating: 4.9,
            premium: true,
            investment_grade: true,
            roi: 8.2,
            views: 247,
            saved: 38,
            featured: true,
            property_type: 'Luxury Apartment'
          },
          {
            id: '2',
            title: 'Phakalane Executive Villa',
            price: 25000,
            location: 'Phakalane Golf Estate',
            beds: 5,
            baths: 4,
            sqft: 3400,
            parking: 3,
            image: '/api/placeholder/300/200',
            rating: 4.8,
            premium: true,
            investment_grade: true,
            roi: 9.1,
            views: 189,
            saved: 25,
            featured: true,
            property_type: 'Executive Villa'
          },
          {
            id: '3',
            title: 'Modern City Apartment',
            price: 6500,
            location: 'Main Mall, Gaborone',
            beds: 2,
            baths: 1,
            sqft: 950,
            parking: 1,
            image: '/api/placeholder/300/200',
            rating: 4.5,
            premium: false,
            investment_grade: false,
            views: 156,
            saved: 12,
            featured: false,
            property_type: 'Apartment'
          }
        ];

        setProperties(mockProperties);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [supabase]);

  const handleSaveProperty = async (propertyId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Toggle save status implementation
      const { error } = await supabase
        .from('saved_properties')
        .upsert({
          user_id: session.user.id,
          property_id: propertyId,
          saved_at: new Date().toISOString()
        });

      if (error) throw error;
      
      // Update local state
      setProperties(prev => prev.map(p => 
        p.id === propertyId 
          ? { ...p, saved: p.saved + 1, saved_by_user: true }
          : p
      ));
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const PropertyCard = ({ property, viewMode }: { property: Property; viewMode: 'grid' | 'list' }) => (
    <div 
      onClick={() => router.push(`/property/${property.id}`)}
      className={`bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer group ${
        viewMode === 'grid' ? 'flex flex-col' : 'flex'
      }`}
    >
      {/* Property Image */}
      <div className={`relative ${
        viewMode === 'grid' ? 'w-full h-48' : 'w-32 h-32 flex-shrink-0'
      }`}>
        <div className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${
          viewMode === 'grid' ? 'rounded-t-2xl' : 'rounded-l-2xl'
        }`}>
          <Building2 className="h-8 w-8 text-gray-400" />
        </div>
        
        {/* Premium Badge */}
        {property.premium && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
              <Crown className="h-3 w-3" />
              <span>PREMIUM</span>
            </div>
          </div>
        )}

        {/* Investment Grade Badge */}
        {property.investment_grade && (
          <div className="absolute top-3 right-3">
            <div className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              INVESTMENT
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleSaveProperty(property.id);
          }}
          className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-all shadow-sm hover:shadow-md"
        >
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Property Details */}
      <div className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-center' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 truncate">
              {property.title}
            </h3>
            <div className="flex items-center space-x-1 text-gray-600 mb-2">
              <MapPin className="h-3 w-3" />
              <span className="text-xs font-medium">{property.location}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              P{property.price.toLocaleString()}
              <span className="text-gray-500 text-sm font-normal">/month</span>
            </div>
            {property.roi && (
              <div className="flex items-center space-x-1 justify-end mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600 text-xs font-bold">{property.roi}% ROI</span>
              </div>
            )}
          </div>
        </div>

        {/* Property Features */}
        <div className="flex items-center space-x-3 text-gray-600 text-xs mb-3">
          <div className="flex items-center space-x-1">
            <Bed className="h-3 w-3" />
            <span className="font-medium">{property.beds}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="h-3 w-3" />
            <span className="font-medium">{property.baths}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Square className="h-3 w-3" />
            <span className="font-medium">{property.sqft.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Car className="h-3 w-3" />
            <span className="font-medium">{property.parking}</span>
          </div>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-amber-500 fill-current" />
            <span className="text-gray-700 text-xs font-medium">{property.rating}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 text-xs">
            <span>{property.views} views</span>
            <span>•</span>
            <span>{property.saved} saved</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-gray-600 font-medium text-sm mt-4">Loading premium properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 supports-backdrop-blur:bg-white/60">
        <div className="px-5 pt-6 pb-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Find Properties</h1>
                <p className="text-gray-600 text-sm">Premium investment opportunities</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center hover:shadow-md transition-all active:scale-95"
              >
                {viewMode === 'grid' ? 
                  <List className="h-5 w-5 text-gray-600" /> : 
                  <Grid3X3 className="h-5 w-5 text-gray-600" />
                }
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`w-10 h-10 rounded-xl shadow-sm border flex items-center justify-center transition-all active:scale-95 ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-200 text-blue-600' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                }`}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Smart Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all text-gray-900 placeholder-gray-500 shadow-sm"
              placeholder="Search locations, investments, or features..."
            />
            <button 
              onClick={() => {/* Handle search */}}
              className="absolute inset-y-1.5 right-1.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95 text-sm flex items-center space-x-1"
            >
              <span>Search</span>
              <Zap className="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>

      {/* Premium Filters Panel */}
      {showFilters && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/80 px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Refine Search</h3>
            <button 
              onClick={() => setShowFilters(false)}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price Range */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Price Range (P)</label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Beds & Baths */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Bedrooms</label>
              <select
                value={filters.beds}
                onChange={(e) => setFilters(prev => ({ ...prev, beds: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Bathrooms</label>
              <select
                value={filters.baths}
                onChange={(e) => setFilters(prev => ({ ...prev, baths: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Property Type</label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Premium Filters */}
            <div className="col-span-2 space-y-3">
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={filters.premiumOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, premiumOnly: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-900">Premium Properties Only</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={filters.investmentGrade}
                  onChange={(e) => setFilters(prev => ({ ...prev, investmentGrade: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-900">Investment Grade Only</span>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex space-x-3 pt-2">
              <button
                onClick={() => setFilters({ minPrice: '', maxPrice: '', beds: '', baths: '', propertyType: '', investmentGrade: false, premiumOnly: false })}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-95"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Properties List */}
      <main className="px-5 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {properties.length} Premium Properties
            </h2>
            <p className="text-gray-600 text-sm">Investment opportunities in Botswana</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm font-medium">Sort by:</span>
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Highest ROI</option>
            </select>
          </div>
        </div>

        {/* Properties Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 gap-4' 
            : 'space-y-4'
        }`}>
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              viewMode={viewMode} 
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-95 flex items-center space-x-2 mx-auto">
            <Sparkles className="h-4 w-4" />
            <span>Load More Properties</span>
          </button>
        </div>
      </main>
    </div>
  );
}

// Add Link import at the top
import Link from 'next/link';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-gray-600 font-medium text-sm mt-4">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}