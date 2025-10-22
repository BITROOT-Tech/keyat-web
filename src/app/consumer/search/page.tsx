// src/app/consumer/search/page.tsx - FIXED SYNTAX
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { Header, BottomNav } from '@/components/consumer';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  status: 'available' | 'rented' | 'maintenance';
  beds: number;
  baths: number;
  area: number;
  description: string;
  created_at: string;
}

// Lazy load icons
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const FilterIcon = dynamic(() => import('lucide-react').then(mod => mod.Filter));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const BathIcon = dynamic(() => import('lucide-react').then(mod => mod.Bath));
const BedIcon = dynamic(() => import('lucide-react').then(mod => mod.Bed));
const SquareIcon = dynamic(() => import('lucide-react').then(mod => mod.Square));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const EyeIcon = dynamic(() => import('lucide-react').then(mod => mod.Eye));
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const XIcon = dynamic(() => import('lucide-react').then(mod => mod.X));
const SlidersIcon = dynamic(() => import('lucide-react').then(mod => mod.SlidersHorizontal));

// Property Card Component
function PropertyCard({ property, onFavoriteToggle }: { property: Property; onFavoriteToggle: (id: string) => void }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavoriteToggle(property.id);
  };

  const views = Math.floor(Math.random() * 500) + 50;
  const rating = (Math.random() * 1 + 4).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => router.push(`/consumer/property/${property.id}`)}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group active:scale-[0.98] w-full max-w-full"
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HomeIcon className="h-12 w-12 text-blue-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[70%]">
          {property.status === 'available' && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium truncate">
              Available
            </span>
          )}
          {property.status === 'rented' && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium truncate">
              Rented
            </span>
          )}
        </div>

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all active:scale-95 ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
          }`}
        >
          <HeartIcon className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1 max-w-[60%] truncate">
          <EyeIcon className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{views} views</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2 gap-2 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight flex-1 min-w-0 pr-2">
            <span className="line-clamp-2 break-words">{property.title}</span>
          </h3>
          <div className="flex items-center gap-1 text-sm text-amber-600 flex-shrink-0 pl-2">
            <StarIcon className="h-4 w-4 fill-current flex-shrink-0" />
            <span className="whitespace-nowrap">{rating}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3 gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {property.beds > 0 && (
              <div className="flex items-center gap-1 whitespace-nowrap">
                <BedIcon className="h-4 w-4 flex-shrink-0" />
                <span>{property.beds} bed</span>
              </div>
            )}
            {property.baths > 0 && (
              <div className="flex items-center gap-1 whitespace-nowrap">
                <BathIcon className="h-4 w-4 flex-shrink-0" />
                <span>{property.baths} bath</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-1 whitespace-nowrap">
                <SquareIcon className="h-4 w-4 flex-shrink-0" />
                <span>{property.area?.toLocaleString()} sqft</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="text-2xl font-bold text-gray-900 min-w-0 flex-1">
            <span className="whitespace-nowrap truncate">
              P{property.price?.toLocaleString()}
              <span className="text-sm font-normal text-gray-600">/month</span>
            </span>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full flex-shrink-0 whitespace-nowrap ${
            property.status === 'available' ? 'bg-green-100 text-green-800' :
            property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {property.status}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Filter Sidebar Component
function FilterSidebar({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onClose,
  locations 
}: { 
  filters: any;
  onFiltersChange: (filters: any) => void;
  isOpen: boolean;
  onClose: () => void;
  locations: string[];
}) {
  const propertyTypes = [
    'apartment',
    'house',
    'townhouse',
    'studio',
    'flat',
    'commercial'
  ];

  const amenities = [
    'Parking',
    'Security',
    'Furnished',
    'Garden',
    'Pool',
    'Borehole',
    'Solar',
    'Garage',
    'Gym',
    'Maid Quarters'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:relative lg:z-auto lg:w-64 lg:flex flex-col border-r border-gray-200 overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden active:scale-95"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Location</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {locations.map((location) => (
                    <label key={location} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.locations.includes(location)}
                        onChange={(e) => {
                          const newLocations = e.target.checked
                            ? [...filters.locations, location]
                            : filters.locations.filter((l: string) => l !== location);
                          onFiltersChange({ ...filters, locations: newLocations });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 truncate">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Price Range (P/month)</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min}
                      onChange={(e) => onFiltersChange({
                        ...filters,
                        priceRange: { ...filters.priceRange, min: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max}
                      onChange={(e) => onFiltersChange({
                        ...filters,
                        priceRange: { ...filters.priceRange, max: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Bedrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((beds) => (
                    <button
                      key={beds}
                      onClick={() => onFiltersChange({
                        ...filters,
                        bedrooms: filters.bedrooms === beds ? null : beds
                      })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors active:scale-95 ${
                        filters.bedrooms === beds
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {beds} {beds === 1 ? 'bed' : 'beds'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Property Type</h3>
                <div className="space-y-2">
                  {propertyTypes.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.propertyTypes.includes(type)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...filters.propertyTypes, type]
                            : filters.propertyTypes.filter((t: string) => t !== type);
                          onFiltersChange({ ...filters, propertyTypes: newTypes });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Amenities</h3>
                <div className="space-y-2">
                  {amenities.map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={(e) => {
                          const newAmenities = e.target.checked
                            ? [...filters.amenities, amenity]
                            : filters.amenities.filter((a: string) => a !== amenity);
                          onFiltersChange({ ...filters, amenities: newAmenities });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => onFiltersChange({
                  locations: [],
                  priceRange: { min: '', max: '' },
                  bedrooms: null,
                  propertyTypes: [],
                  amenities: []
                })}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium active:scale-95"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Fetch properties from Supabase
const fetchPropertiesFromSupabase = async (filters: any = {}, sortBy: string = 'newest') => {
  const supabase = createClient();
  
  let query = supabase
    .from('properties')
    .select('*');

  if (filters?.searchQuery) {
    query = query.or(`title.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%`);
  }

  if (filters?.locations && filters.locations.length > 0) {
    query = query.in('location', filters.locations);
  }

  if (filters?.priceRange?.min) {
    query = query.gte('price', parseFloat(filters.priceRange.min));
  }

  if (filters?.priceRange?.max) {
    query = query.lte('price', parseFloat(filters.priceRange.max));
  }

  if (filters?.bedrooms) {
    query = query.eq('beds', filters.bedrooms);
  }

  switch (sortBy) {
    case 'price-low':
      query = query.order('price', { ascending: true });
      break;
    case 'price-high':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
};

// Fetch locations from Supabase
const fetchLocationsFromSupabase = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('properties')
    .select('location')
    .not('location', 'is', null);

  if (error) throw error;
  
  const locations = [...new Set(data.map(item => item.location))].filter(Boolean);
  return locations as string[];
};

// Default filters
const defaultFilters = {
  locations: [],
  priceRange: { min: '', max: '' },
  bedrooms: null,
  propertyTypes: [],
  amenities: []
};

export default function PropertySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [properties, setProperties] = useState<Property[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
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
            first_name: session.user.email?.split('@')[0] || 'User',
            email: session.user.email
          });
        } else {
          setUser(profile);
        }
      } catch (err: any) {
        console.error('Auth error in search:', err);
      }
    };

    checkAuth();
  }, [router]);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      
      const filtersToApply = {
        searchQuery: searchQuery || undefined,
        locations: filters.locations.length > 0 ? filters.locations : undefined,
        priceRange: {
          min: filters.priceRange.min ? parseFloat(filters.priceRange.min) : undefined,
          max: filters.priceRange.max ? parseFloat(filters.priceRange.max) : undefined,
        },
        bedrooms: filters.bedrooms || undefined,
        propertyTypes: filters.propertyTypes.length > 0 ? filters.propertyTypes : undefined,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
      };

      const data = await fetchPropertiesFromSupabase(filtersToApply, sortBy);
      setProperties(data);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, sortBy]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const [locationsData, propertiesData] = await Promise.all([
          fetchLocationsFromSupabase(),
          fetchPropertiesFromSupabase({ searchQuery }, sortBy)
        ]);
        
        setLocations(locationsData);
        setProperties(propertiesData);
      } catch (err: any) {
        console.error('Error initializing data:', err);
        setError(err.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProperties();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchProperties]);

  const handleFavoriteToggle = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleQuickSearch = () => {
    fetchProperties();
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const activeFilterCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) return count + filter.length;
    if (typeof filter === 'object' && filter !== null) {
      return count + (filter.min || filter.max ? 1 : 0);
    }
    return count + (filter ? 1 : 0);
  }, 0);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center safe-area-padding">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Properties</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProperties}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 safe-area-padding lg:pb-0">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <Header
          user={user}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onQuickSearch={handleQuickSearch}
          notifications={3}
          showLocationFilter={true}
          onLocationFilterClick={() => setShowFilters(true)}
        />
      </div>

      <div className="flex min-w-0">
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          locations={locations}
        />

        <main className="flex-1 min-w-0">
          <div className="p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 w-full max-w-full">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 truncate">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'All Properties in Botswana'}
                </h1>
                <p className="text-gray-600 truncate">
                  {loading ? 'Loading...' : `${properties.length} properties found`}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors active:scale-95 flex-shrink-0"
                >
                  <FilterIcon className="h-4 w-4 flex-shrink-0" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full flex-shrink-0">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-shrink-0 min-w-[140px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="relevance">Relevance</option>
                </select>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 w-full max-w-full">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium active:scale-95 flex-shrink-0"
                >
                  <SlidersIcon className="h-3 w-3 flex-shrink-0" />
                  {activeFilterCount} active filters
                </button>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full max-w-full overflow-hidden">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse w-full">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="flex justify-between w-full">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && properties.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full max-w-full overflow-hidden">
                {properties.map((property, index) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
            )}

            {!loading && properties.length === 0 && (
              <div className="text-center py-12 w-full max-w-full">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  {searchQuery || activeFilterCount > 0 
                    ? 'Try adjusting your search criteria or filters'
                    : 'No properties available at the moment. Check back later!'
                  }
                </p>
                {(searchQuery || activeFilterCount > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters(defaultFilters);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}