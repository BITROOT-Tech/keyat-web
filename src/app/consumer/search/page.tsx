// src/app/consumer/search/page.tsx - ADVANCED PROPERTY SEARCH
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Header, BottomNav } from '@/components/consumer';

// Lazy load icons
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const FilterIcon = dynamic(() => import('lucide-react').then(mod => mod.Filter));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
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
function PropertyCard({ property, onFavoriteToggle }: { property: any; onFavoriteToggle: (id: string) => void }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavoriteToggle(property.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => router.push(`/consumer/property/${property.id}`)}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Property Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {property.featured && (
            <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">
              Featured
            </span>
          )}
          {property.verified && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <ShieldIcon className="h-3 w-3" />
              Verified
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
          }`}
        >
          <HeartIcon className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* View Count */}
        <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <EyeIcon className="h-3 w-3" />
          {property.views} views
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight flex-1 pr-2">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-amber-600">
            <StarIcon className="h-4 w-4 fill-current" />
            <span>{property.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{property.location}</span>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <BedIcon className="h-4 w-4" />
              <span>{property.beds} bed</span>
            </div>
            <div className="flex items-center gap-1">
              <BathIcon className="h-4 w-4" />
              <span>{property.baths} bath</span>
            </div>
            <div className="flex items-center gap-1">
              <SquareIcon className="h-4 w-4" />
              <span>{property.area} sqft</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            P{property.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-600">/month</span>
          </div>
          <div className="text-xs text-gray-500">
            Available now
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
  onClose 
}: { 
  filters: any;
  onFiltersChange: (filters: any) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const locations = [
    'CBD, Gaborone',
    'Phakalane Estate', 
    'Broadhurst',
    'Maitisong',
    'Tlokweng',
    'Mogoditshane',
    'All Areas'
  ];

  const propertyTypes = [
    'Apartment',
    'House',
    'Townhouse',
    'Studio',
    'Flat'
  ];

  const amenities = [
    'Parking',
    'Security',
    'Furnished',
    'Pet Friendly',
    'Garden',
    'Pool',
    'Borehole'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:relative lg:z-auto lg:w-64 lg:flex flex-col border-r border-gray-200 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 p-4 space-y-6">
              {/* Location */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Location</h3>
                <div className="space-y-2">
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
                      <span className="ml-2 text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max}
                      onChange={(e) => onFiltersChange({
                        ...filters,
                        priceRange: { ...filters.priceRange, max: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Bedrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, '5+'].map((beds) => (
                    <button
                      key={beds}
                      onClick={() => onFiltersChange({
                        ...filters,
                        bedrooms: filters.bedrooms === beds ? null : beds
                      })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

              {/* Property Type */}
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
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
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

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => onFiltersChange({
                  locations: [],
                  priceRange: { min: '', max: '' },
                  bedrooms: null,
                  propertyTypes: [],
                  amenities: []
                })}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
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

export default function PropertySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    locations: [],
    priceRange: { min: '', max: '' },
    bedrooms: null,
    propertyTypes: [],
    amenities: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');

  // Sample property data
  const properties = [
    {
      id: '1',
      title: 'CBD Luxury Apartment',
      location: 'CBD, Gaborone',
      price: 14500,
      beds: 2,
      baths: 2,
      area: 1200,
      rating: 4.8,
      views: 247,
      featured: true,
      verified: true,
      available: true
    },
    {
      id: '2',
      title: 'Phakalane Executive Home',
      location: 'Phakalane Estate',
      price: 25000,
      beds: 4,
      baths: 3,
      area: 2400,
      rating: 4.9,
      views: 189,
      featured: true,
      verified: true,
      available: true
    },
    {
      id: '3',
      title: 'Broadhurst Family House',
      location: 'Broadhurst, Gaborone',
      price: 8500,
      beds: 3,
      baths: 2,
      area: 1800,
      rating: 4.6,
      views: 156,
      featured: false,
      verified: true,
      available: true
    },
    {
      id: '4',
      title: 'Maitisong Garden Flat',
      location: 'Maitisong, Gaborone',
      price: 6800,
      beds: 2,
      baths: 1,
      area: 950,
      rating: 4.4,
      views: 203,
      featured: false,
      verified: true,
      available: true
    },
    {
      id: '5',
      title: 'Tlokweng Modern Apartment',
      location: 'Tlokweng, Gaborone',
      price: 7200,
      beds: 2,
      baths: 2,
      area: 1100,
      rating: 4.3,
      views: 134,
      featured: false,
      verified: true,
      available: true
    },
    {
      id: '6',
      title: 'Mogoditshane Townhouse',
      location: 'Mogoditshane',
      price: 9200,
      beds: 3,
      baths: 2,
      area: 1600,
      rating: 4.5,
      views: 178,
      featured: false,
      verified: true,
      available: true
    }
  ];

  const handleFavoriteToggle = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleQuickSearch = () => {
    // In a real app, this would update URL and trigger search
    console.log('Searching for:', searchQuery);
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24 safe-area-padding lg:pb-0">
      {/* Header */}
      <Header
        user={null}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onQuickSearch={handleQuickSearch}
        notifications={0}
        showLocationFilter={true}
        onLocationFilterClick={() => setShowFilters(true)}
      />

      {/* Main Content */}
      <div className="flex">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
        />

        {/* Search Results */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Search Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Properties in Gaborone
              </h1>
              <p className="text-gray-600">
                {properties.length} properties found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Toggle for Mobile */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FilterIcon className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                <SlidersIcon className="h-3 w-3" />
                {activeFilterCount} active filters
              </button>
            </div>
          )}

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>

          {/* Empty State */}
          {properties.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={() => setFilters({
                  locations: [],
                  priceRange: { min: '', max: '' },
                  bedrooms: null,
                  propertyTypes: [],
                  amenities: []
                })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}