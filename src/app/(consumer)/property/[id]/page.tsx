// src/app/(consumer)/property/[id]/page.tsx - COMPLETE PROFESSIONAL VERSION
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Star, 
  User, 
  Phone, 
  MessageCircle,
  Calendar,
  Shield,
  Wifi,
  Utensils
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  parking: number;
  propertyType: string;
  images: string[];
  amenities: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
    rating: number;
    properties: number;
    image: string;
  };
  features: string[];
  availability: string;
  deposit: number;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // Mock data - replace with real data from Supabase
  const property: Property = {
    id: params.id as string,
    title: 'Modern 2-Bedroom Apartment in Gaborone',
    description: 'Beautiful modern apartment located in the heart of Gaborone. This spacious 2-bedroom unit features contemporary finishes, ample natural light, and convenient access to shopping centers, restaurants, and public transportation. Perfect for professionals or small families seeking comfort and convenience.',
    price: 4500,
    location: 'Block 9, Gaborone',
    address: '123 Main Street, Block 9, Gaborone, Botswana',
    beds: 2,
    baths: 1,
    sqft: 850,
    parking: 1,
    propertyType: 'Apartment',
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400'
    ],
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Garden', 'Playground'],
    agent: {
      name: 'Sarah M. Johnson',
      phone: '+267 71 123 456',
      email: 'sarah@keyat.properties',
      rating: 4.8,
      properties: 24,
      image: '/api/placeholder/100/100'
    },
    features: [
      'Fully Furnished',
      'Air Conditioning',
      'Modern Kitchen',
      'Balcony',
      'Storage',
      'Pet Friendly'
    ],
    availability: 'Immediate',
    deposit: 9000
  };

  const similarProperties = [
    {
      id: '2',
      title: 'Luxury Apartment in Phakalane',
      price: 6000,
      location: 'Phakalane, Gaborone',
      beds: 3,
      baths: 2,
      image: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'Cozy Studio in City Center',
      price: 2800,
      location: 'City Center, Gaborone',
      beds: 1,
      baths: 1,
      image: '/api/placeholder/300/200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {/* Image Gallery */}
        <div className="relative">
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center md:h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🏠</span>
              </div>
              <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">Property Image</p>
            </div>
          </div>
          
          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeImage ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="px-4 py-6">
          {/* Price and Title */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold text-gray-900">{property.title}</h1>
              <div className="text-lg font-bold text-blue-600">
                P{property.price.toLocaleString()}
                <span className="text-gray-500 text-sm font-normal">/month</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-600 mb-3">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{property.location}</span>
            </div>

            {/* Property Features */}
            <div className="flex items-center space-x-4 text-gray-600 text-sm">
              <div className="flex items-center space-x-1">
                <Bed className="h-4 w-4" />
                <span>{property.beds} bed{property.beds > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="h-4 w-4" />
                <span>{property.baths} bath{property.baths > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Square className="h-4 w-4" />
                <span>{property.sqft.toLocaleString()} sqft</span>
              </div>
              <div className="flex items-center space-x-1">
                <Car className="h-4 w-4" />
                <span>{property.parking} parking</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-blue-600 text-sm font-medium">Availability</div>
              <div className="text-gray-900 font-semibold">{property.availability}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-green-600 text-sm font-medium">Deposit</div>
              <div className="text-gray-900 font-semibold">P{property.deposit.toLocaleString()}</div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h2>
            <div className="grid grid-cols-2 gap-2">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Features</h2>
            <div className="grid grid-cols-2 gap-2">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Information */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact Agent</h2>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{property.agent.name}</div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{property.agent.rating}</span>
                  <span>•</span>
                  <span>{property.agent.properties} properties</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={() => setShowContactForm(true)}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message</span>
              </button>
              <a 
                href={`tel:${property.agent.phone}`}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </a>
            </div>
          </div>

          {/* Similar Properties */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Similar Properties</h2>
            <div className="space-y-3">
              {similarProperties.map((prop) => (
                <div 
                  key={prop.id}
                  onClick={() => router.push(`/property/${prop.id}`)}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex space-x-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs">Image</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm mb-1">{prop.title}</div>
                    <div className="text-blue-600 font-semibold text-sm mb-1">
                      P{prop.price.toLocaleString()}/month
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 text-xs">
                      <span>{prop.beds} bed</span>
                      <span>•</span>
                      <span>{prop.baths} bath</span>
                      <span>•</span>
                      <span>{prop.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm">
            <Calendar className="h-4 w-4" />
            <span>Schedule Tour</span>
          </button>
          <button 
            onClick={() => setShowContactForm(true)}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Contact Agent</span>
          </button>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 md:items-center">
          <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[80vh] overflow-y-auto md:rounded-2xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Contact Agent</h3>
                <button 
                  onClick={() => setShowContactForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="+267 71 123 456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="I'm interested in this property..."
                    defaultValue="Hi, I'm interested in this property and would like to schedule a viewing."
                  />
                </div>
                
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                  Send Message to Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}