// src/app/(consumer)/search/page.tsx
'use client';

import { useState } from 'react';

// Sample property data for Botswana
const sampleProperties = [
  {
    id: 1,
    title: "Modern 3-Bedroom House in Gaborone",
    type: "House",
    price: 4500,
    location: "Gaborone, Broadhurst",
    bedrooms: 3,
    bathrooms: 2,
    image: "/api/placeholder/400/300",
    featured: true
  },
  {
    id: 2,
    title: "Luxury Apartment in CBD",
    type: "Apartment",
    price: 3200,
    location: "Gaborone, CBD",
    bedrooms: 2,
    bathrooms: 2,
    image: "/api/placeholder/400/300",
    featured: false
  },
  {
    id: 3,
    title: "Spacious Family Home in Francistown",
    type: "House",
    price: 3800,
    location: "Francistown, Aerodrome",
    bedrooms: 4,
    bathrooms: 3,
    image: "/api/placeholder/400/300",
    featured: true
  },
  {
    id: 4,
    title: "Cozy Studio near University",
    type: "Studio",
    price: 1800,
    location: "Gaborone, UB",
    bedrooms: 1,
    bathrooms: 1,
    image: "/api/placeholder/400/300",
    featured: false
  },
  {
    id: 5,
    title: "Vacation Home in Maun",
    type: "House",
    price: 2800,
    location: "Maun",
    bedrooms: 3,
    bathrooms: 2,
    image: "/api/placeholder/400/300",
    featured: false
  },
  {
    id: 6,
    title: "Commercial Space in Kasane",
    type: "Commercial",
    price: 7500,
    location: "Kasane",
    bedrooms: 0,
    bathrooms: 2,
    image: "/api/placeholder/400/300",
    featured: true
  }
];

const botswanaCities = [
  "All Cities",
  "Gaborone",
  "Francistown", 
  "Maun",
  "Kasane",
  "Jwaneng",
  "Lobatse"
];

const propertyTypes = [
  "All Types",
  "House",
  "Apartment",
  "Studio", 
  "Commercial",
  "Land"
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedType, setSelectedType] = useState("All Types");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [bedrooms, setBedrooms] = useState(0);

  const filteredProperties = sampleProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "All Cities" || property.location.includes(selectedCity);
    const matchesType = selectedType === "All Types" || property.type === selectedType;
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesBedrooms = bedrooms === 0 || property.bedrooms >= bedrooms;

    return matchesSearch && matchesCity && matchesType && matchesPrice && matchesBedrooms;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg"></div>
                <span className="ml-2 text-xl font-bold text-gray-900">Keyat</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="/search" className="bg-blue-100 text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Properties</a>
                <a href="/agents" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Agents</a>
                <a href="/services" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Services</a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Login</a>
              <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Sign Up</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Property in Botswana</h1>
          <p className="text-gray-600">Discover {sampleProperties.length}+ properties across major cities</p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Properties</label>
              <input
                type="text"
                placeholder="Enter location or property name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {botswanaCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: BWP {priceRange[0]} - BWP {priceRange[1]}
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              className="w-full"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            />
          </div>

          {/* Quick City Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Quick filters:</span>
            {botswanaCities.slice(1).map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  selectedCity === city 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {sampleProperties.length} properties
          </p>
          <div className="flex items-center space-x-4">
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
              <option>Sort by: Newest</option>
              <option>Sort by: Price: Low to High</option>
              <option>Sort by: Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <div key={property.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-t-lg flex items-center justify-center">
                    <span className="text-4xl">🏠</span>
                  </div>
                  {property.featured && (
                    <span className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{property.title}</h3>
                    <span className="text-lg font-bold text-green-600">BWP {property.price}/mo</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{property.location}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-3">🛏️ {property.bedrooms} bed</span>
                    <span>🚿 {property.bathrooms} bath</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{property.type}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6">Let our agents help you find the perfect property</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
              Contact an Agent
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50">
              Set Up Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}