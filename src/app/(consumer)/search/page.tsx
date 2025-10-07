// src/app/(consumer)/search/page.tsx - COMPLETE PROFESSIONAL VERSION
'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Home, Bed, Bath, Heart, Star } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  rating: number;
  isFeatured: boolean;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    propertyType: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with real data from Supabase
  const properties: Property[] = [
    {
      id: '1',
      title: 'Modern Apartment in Gaborone',
      price: 4500,
      location: 'Gaborone, Block 9',
      beds: 2,
      baths: 1,
      sqft: 850,
      image: '/api/placeholder/300/200',
      rating: 4.5,
      isFeatured: true
    },
    {
      id: '2',
      title: 'Spacious Family House',
      price: 8000,
      location: 'Phakalane, Gaborone',
      beds: 4,
      baths: 3,
      sqft: 1800,
      image: '/api/placeholder/300/200',
      rating: 4.8,
      isFeatured: false
    },
    {
      id: '3',
      title: 'Cozy Studio Apartment',
      price: 2800,
      location: 'Mall, Francistown',
      beds: 1,
      baths: 1,
      sqft: 500,
      image: '/api/placeholder/300/200',
      rating: 4.2,
      isFeatured: true
    }
  ];

  const propertyTypes = [
    'Apartment', 'House', 'Townhouse', 'Studio', 'Commercial'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">Find Properties</h1>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              placeholder="Search locations, properties..."
            />
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Price Range */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Beds & Baths */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beds</label>
              <select
                value={filters.beds}
                onChange={(e) => setFilters(prev => ({ ...prev, beds: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Baths</label>
              <select
                value={filters.baths}
                onChange={(e) => setFilters(prev => ({ ...prev, baths: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              >
                <option value="">Any Type</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex space-x-2 pt-2">
              <button
                onClick={() => setFilters({ minPrice: '', maxPrice: '', beds: '', baths: '', propertyType: '' })}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Properties List */}
      <main className="px-4 py-4">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-600">
            {properties.length} properties found
          </h2>
          <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
            Sort by: Recommended
          </button>
        </div>

        {/* Properties Grid */}
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Property Image */}
              <div className="relative">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <Home className="h-12 w-12 text-gray-400" />
                </div>
                
                {/* Featured Badge */}
                {property.isFeatured && (
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </div>
                )}

                {/* Favorite Button */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Property Details */}
              <div className="p-4">
                {/* Price & Rating */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold text-gray-900">P{property.price.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{property.rating}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-medium text-gray-900 mb-1 text-sm">{property.title}</h3>

                {/* Location */}
                <div className="flex items-center space-x-1 mb-3">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600 text-xs">{property.location}</span>
                </div>

                {/* Property Features */}
                <div className="flex items-center space-x-4 text-gray-600 text-xs">
                  <div className="flex items-center space-x-1">
                    <Bed className="h-3 w-3" />
                    <span>{property.beds} bed{property.beds > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="h-3 w-3" />
                    <span>{property.baths} bath{property.baths > 1 ? 's' : ''}</span>
                  </div>
                  <div>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 py-2 px-3 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-6">
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
            Load More Properties
          </button>
        </div>
      </main>
    </div>
  );
}