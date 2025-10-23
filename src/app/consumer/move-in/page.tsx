// src/app/consumer/move-in/page.tsx - ULTRA COMPACT MOBILE VERSION
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/consumer';

// Lazy load icons
const TruckIcon = dynamic(() => import('lucide-react').then(mod => mod.Truck));
const PackageIcon = dynamic(() => import('lucide-react').then(mod => mod.Package));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));

interface MovingService {
  id: string;
  name: string;
  description: string;
  price_range: string;
  duration: string;
  rating: number;
  reviews: number;
  features: string[];
  image: string;
  category: 'standard' | 'premium' | 'express';
}

interface MovingRequest {
  move_date: string;
  move_time: string;
  from_address: string;
  to_address: string;
  property_size: string;
  service_type: string;
  special_requests: string;
}

export default function MoveInPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'book' | 'tracking'>('services');
  const [selectedService, setSelectedService] = useState<MovingService | null>(null);

  // Moving request form state
  const [movingRequest, setMovingRequest] = useState<MovingRequest>({
    move_date: '',
    move_time: '',
    from_address: '',
    to_address: '',
    property_size: '',
    service_type: '',
    special_requests: ''
  });

  // Mock moving services data
  const movingServices: MovingService[] = [
    {
      id: '1',
      name: 'Standard Moving',
      description: 'Studio & 1-bedroom apartments',
      price_range: 'P1,500 - P3,000',
      duration: '3-5 hours',
      rating: 4.7,
      reviews: 128,
      features: ['2 movers', 'Medium truck', 'Basic insurance'],
      image: '',
      category: 'standard'
    },
    {
      id: '2',
      name: 'Premium Moving',
      description: '2-3 bedroom homes with packing',
      price_range: 'P3,500 - P6,000',
      duration: '5-8 hours',
      rating: 4.9,
      reviews: 89,
      features: ['3 movers', 'Large truck', 'Full packing', 'Premium insurance'],
      image: '',
      category: 'premium'
    },
    {
      id: '3',
      name: 'Express Moving',
      description: 'Quick moves for urgent relocations',
      price_range: 'P2,000 - P4,000',
      duration: '2-4 hours',
      rating: 4.5,
      reviews: 67,
      features: ['2 movers', 'Rapid service', 'Priority scheduling'],
      image: '',
      category: 'express'
    },
    {
      id: '4',
      name: 'Office Relocation',
      description: 'Business moves with IT handling',
      price_range: 'P8,000 - P15,000',
      duration: '1-2 days',
      rating: 4.8,
      reviews: 45,
      features: ['4+ movers', 'Multiple trucks', 'IT equipment', 'Commercial insurance'],
      image: '',
      category: 'premium'
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

  const handleBookService = (service: MovingService) => {
    setSelectedService(service);
    setMovingRequest(prev => ({
      ...prev,
      service_type: service.id,
      property_size: service.category === 'standard' ? 'studio' : 
                     service.category === 'premium' ? '2-3 bedroom' : '1 bedroom'
    }));
    setActiveTab('book');
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking moving service:', {
      service: selectedService,
      request: movingRequest
    });
    
    alert(`Moving service booked! ${selectedService?.name} confirmed for ${movingRequest.move_date}`);
    setSelectedService(null);
    setMovingRequest({
      move_date: '',
      move_time: '',
      from_address: '',
      to_address: '',
      property_size: '',
      service_type: '',
      special_requests: ''
    });
    setActiveTab('tracking');
  };

  const getServiceColor = (category: string) => {
    switch (category) {
      case 'premium': return 'from-purple-500 to-pink-500';
      case 'express': return 'from-orange-500 to-red-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const getServiceBadge = (category: string) => {
    switch (category) {
      case 'premium': return { text: 'Premium', color: 'bg-purple-100 text-purple-800' };
      case 'express': return { text: 'Express', color: 'bg-orange-100 text-orange-800' };
      default: return { text: 'Standard', color: 'bg-blue-100 text-blue-800' };
    }
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
            <div className="grid grid-cols-1 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
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
      {/* COMPACT HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
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
        {/* MINIMAL HEADER - JUST TABS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 mb-4"
        >
          {[
            { key: 'services', label: 'Services', icon: PackageIcon },
            { key: 'book', label: 'Book', icon: CalendarIcon },
            { key: 'tracking', label: 'Tracking', icon: TruckIcon }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-3 w-3" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="text-center mb-2">
              <h1 className="text-lg font-bold text-gray-900">Moving Services</h1>
              <p className="text-gray-600 text-xs">Choose your package</p>
            </div>

            <div className="space-y-3">
              {movingServices.map((service, index) => {
                const badge = getServiceBadge(service.category);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleBookService(service)}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                  >
                    {/* Service Header */}
                    <div className={`bg-gradient-to-r ${getServiceColor(service.category)} p-3 text-white`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TruckIcon className="h-4 w-4 text-white" />
                          <h3 className="font-bold text-sm">{service.name}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      <p className="text-white/90 text-xs mt-1">{service.description}</p>
                    </div>

                    {/* Service Details */}
                    <div className="p-3">
                      {/* Rating & Price */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900 text-xs">{service.rating}</span>
                          <span className="text-gray-500 text-xs">({service.reviews})</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-sm">{service.price_range}</div>
                          <div className="text-gray-500 text-xs">{service.duration}</div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded">
                              <CheckCircleIcon className="h-3 w-3 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-xs">
                        Book Now
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Additional Services */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-3"
            >
              <h3 className="font-bold text-gray-900 text-sm mb-2">Extra Services</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <PackageIcon className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900 text-xs">Packing</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <HomeIcon className="h-4 w-4 text-green-600 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900 text-xs">Storage</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <ShieldIcon className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                  <div className="font-semibold text-gray-900 text-xs">Insurance</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* BOOK MOVE TAB */}
        {activeTab === 'book' && (
          <motion.div
            key="book"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {selectedService ? `Book ${selectedService.name}` : 'Book Moving Service'}
            </h2>

            <form onSubmit={handleSubmitBooking} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Move Date *</label>
                  <input
                    type="date"
                    required
                    value={movingRequest.move_date}
                    onChange={(e) => setMovingRequest(prev => ({ ...prev, move_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    required
                    value={movingRequest.move_time}
                    onChange={(e) => setMovingRequest(prev => ({ ...prev, move_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">From Address *</label>
                <input
                  type="text"
                  required
                  value={movingRequest.from_address}
                  onChange={(e) => setMovingRequest(prev => ({ ...prev, from_address: e.target.value }))}
                  placeholder="Current address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">To Address *</label>
                <input
                  type="text"
                  required
                  value={movingRequest.to_address}
                  onChange={(e) => setMovingRequest(prev => ({ ...prev, to_address: e.target.value }))}
                  placeholder="New address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Property Size *</label>
                  <select
                    required
                    value={movingRequest.property_size}
                    onChange={(e) => setMovingRequest(prev => ({ ...prev, property_size: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select size</option>
                    <option value="studio">Studio</option>
                    <option value="1 bedroom">1 Bedroom</option>
                    <option value="2-3 bedroom">2-3 Bedrooms</option>
                    <option value="4+ bedroom">4+ Bedrooms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Service Type *</label>
                  <select
                    required
                    value={movingRequest.service_type}
                    onChange={(e) => setMovingRequest(prev => ({ ...prev, service_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select service</option>
                    {movingServices.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Special Requests</label>
                <textarea
                  value={movingRequest.special_requests}
                  onChange={(e) => setMovingRequest(prev => ({ ...prev, special_requests: e.target.value }))}
                  rows={2}
                  placeholder="Fragile items, special instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedService(null);
                    setActiveTab('services');
                  }}
                  className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* TRACKING TAB */}
        {activeTab === 'tracking' && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TruckIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Track Your Move</h3>
            <p className="text-gray-600 text-sm mb-3">
              Book a service to track your move here
            </p>
            
            <button
              onClick={() => setActiveTab('services')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              Book a Move
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}