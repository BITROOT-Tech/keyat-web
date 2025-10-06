// src/app/(consumer)/property/[id]/page.tsx
'use client';

import { useState } from 'react';

// Sample property data - in real app, this would come from API
const propertyData = {
  id: 1,
  title: "Modern 3-Bedroom House in Gaborone",
  type: "House",
  price: 4500,
  location: "Broadhurst, Gaborone",
  address: "123 Independence Avenue, Broadhurst",
  bedrooms: 3,
  bathrooms: 2,
  area: 180,
  yearBuilt: 2018,
  description: "This stunning modern house offers the perfect blend of comfort and style. Located in the desirable Broadhurst neighborhood, this property features spacious living areas, modern finishes, and a beautiful garden perfect for family living.",
  features: [
    "Modern Kitchen", 
    "Swimming Pool", 
    "Secure Parking", 
    "Garden", 
    "Air Conditioning",
    "Built-in Wardrobes",
    "Ensuite Bathroom",
    "Security System"
  ],
  agent: {
    name: "Tebogo Moloi",
    phone: "+267 71 123 456",
    email: "tebogo@keyat.co.bw",
    rating: 4.8,
    reviews: 47,
    verified: true
  },
  images: [
    "/api/placeholder/800/600",
    "/api/placeholder/800/600", 
    "/api/placeholder/800/600",
    "/api/placeholder/800/600"
  ]
};

export default function PropertyDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

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
                <a href="/search" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Properties</a>
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
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/search" className="hover:text-blue-600">Properties</a></li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
            </li>
            <li><a href="/search" className="hover:text-blue-600">Gaborone</a></li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900">{propertyData.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
              <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                <span className="text-6xl">🏠</span>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {propertyData.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 bg-gradient-to-br from-blue-50 to-green-50 rounded border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  } flex items-center justify-center`}
                >
                  <span className="text-xl">🏠</span>
                </button>
              ))}
            </div>

            {/* Property Details Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Tab Headers */}
              <div className="border-b">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === 'details'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === 'features'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Features
                  </button>
                  <button
                    onClick={() => setActiveTab('location')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === 'location'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Location
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <span className="text-sm text-gray-600">Property Type</span>
                        <p className="font-medium">{propertyData.type}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Bedrooms</span>
                        <p className="font-medium">{propertyData.bedrooms}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Bathrooms</span>
                        <p className="font-medium">{propertyData.bathrooms}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Area</span>
                        <p className="font-medium">{propertyData.area} m²</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Year Built</span>
                        <p className="font-medium">{propertyData.yearBuilt}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Description</span>
                      <p className="mt-2 text-gray-700">{propertyData.description}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {propertyData.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                      <div className="text-center">
                        <span className="text-4xl mb-2">🗺️</span>
                        <p className="text-gray-600">Map of {propertyData.location}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p><strong>Address:</strong> {propertyData.address}</p>
                      <p><strong>Neighborhood:</strong> {propertyData.location}</p>
                      <p className="text-sm text-gray-600">
                        Located in one of Gaborone's most sought-after neighborhoods, close to schools, shopping centers, and major transportation routes.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Agent & Actions */}
          <div className="space-y-6">
            {/* Price & Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">BWP {propertyData.price}/mo</div>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span className="mr-4">🛏️ {propertyData.bedrooms} bed</span>
                <span className="mr-4">🚿 {propertyData.bathrooms} bath</span>
                <span>📐 {propertyData.area} m²</span>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Schedule Viewing
                </button>
                <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Contact Agent
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Save Property
                </button>
              </div>
            </div>

            {/* Agent Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Listed by</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg">👨‍💼</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">{propertyData.agent.name}</h4>
                    {propertyData.agent.verified && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>⭐ {propertyData.agent.rating}</span>
                    <span className="mx-2">•</span>
                    <span>{propertyData.agent.reviews} reviews</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">📞</span>
                  <span>{propertyData.agent.phone}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">✉️</span>
                  <span>{propertyData.agent.email}</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                View Profile
              </button>
            </div>

            {/* Mortgage Calculator */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Mortgage Calculator</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Property Price</label>
                  <input
                    type="text"
                    value={`BWP ${propertyData.price * 120}`} // Approximate sale price
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Down Payment</label>
                  <input
                    type="text"
                    value="BWP 50,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Monthly Payment</label>
                  <input
                    type="text"
                    value="BWP ~3,800"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
              <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Apply for Mortgage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}