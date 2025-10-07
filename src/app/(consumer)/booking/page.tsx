// src/app/(consumer)/booking/page.tsx - PREMIUM NATIVE VERSION
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Home, 
  User, 
  Phone, 
  Mail, 
  MessageCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Star,
  Shield,
  Zap,
  Building2,
  Sparkles,
  ArrowLeft,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  price: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  agent: {
    name: string;
    phone: string;
    email: string;
    rating: number;
    verified: boolean;
  };
  notes: string;
  createdAt: string;
  duration: number;
}

export default function BookingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Premium bookings data
  const bookings: Booking[] = [
    {
      id: '1',
      propertyId: '1',
      propertyTitle: 'The Residences • Block 9',
      propertyLocation: 'CBD, Gaborone',
      propertyImage: '/api/placeholder/300/200',
      price: 14500,
      date: '2024-02-15',
      time: '14:00',
      status: 'confirmed',
      agent: {
        name: 'Sarah Johnson',
        phone: '+267 71 123 456',
        email: 'sarah@keyat.properties',
        rating: 4.9,
        verified: true
      },
      notes: 'Please bring ID for verification. Parking available in basement P2.',
      createdAt: '2024-02-10',
      duration: 60
    },
    {
      id: '2',
      propertyId: '2',
      propertyTitle: 'Phakalane Estate Villa',
      propertyLocation: 'Phakalane Golf Estate',
      propertyImage: '/api/placeholder/300/200',
      price: 25000,
      date: '2024-02-20',
      time: '10:00',
      status: 'pending',
      agent: {
        name: 'David Smith',
        phone: '+267 72 234 567',
        email: 'david@keyat.properties',
        rating: 4.7,
        verified: true
      },
      notes: 'Golf course view. Meet at clubhouse entrance.',
      createdAt: '2024-02-12',
      duration: 90
    }
  ];

  const pastBookings: Booking[] = [
    {
      id: '3',
      propertyId: '3',
      propertyTitle: 'Capital Towers Penthouse',
      propertyLocation: 'Main Mall, Gaborone',
      propertyImage: '/api/placeholder/300/200',
      price: 38000,
      date: '2024-01-25',
      time: '15:30',
      status: 'completed',
      agent: {
        name: 'Lisa Brown',
        phone: '+267 73 345 678',
        email: 'lisa@keyat.properties',
        rating: 5.0,
        verified: true
      },
      notes: 'Stunning city views. Private terrace access.',
      createdAt: '2024-01-20',
      duration: 75
    }
  ];

  const premiumProperties = [
    {
      id: '1',
      title: 'The Residences • Block 9',
      location: 'CBD, Gaborone',
      price: 14500,
      type: 'Luxury Apartment',
      features: ['3 beds', '2.5 baths', '1,700 sqft'],
      premium: true,
      verified: true
    },
    {
      id: '2',
      title: 'Phakalane Estate',
      location: 'Phakalane Golf Estate',
      price: 25000,
      type: 'Executive Villa',
      features: ['5 beds', '4 baths', '3,400 sqft'],
      premium: true,
      verified: true
    }
  ];

  const getStatusConfig = (status: string) => {
    const config = {
      confirmed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Confirmed' },
      pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock, label: 'Pending' },
      completed: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle, label: 'Cancelled' }
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const handleNewBooking = (property: any) => {
    setSelectedProperty(property);
    setShowBookingForm(true);
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const statusConfig = getStatusConfig(booking.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => router.push(`/property/${booking.propertyId}`)}
            >
              <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">
                {booking.propertyTitle}
              </h3>
              <div className="flex items-center space-x-1 text-slate-600 text-sm">
                <MapPin className="h-3 w-3" />
                <span>{booking.propertyLocation}</span>
              </div>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-bold ${statusConfig.color}`}>
              <StatusIcon className="h-3 w-3" />
              <span>{statusConfig.label}</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-slate-900 font-medium">
                    {new Date(booking.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {new Date(booking.date).toLocaleDateString('en-US', { 
                      weekday: 'short' 
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-slate-900 font-medium">{booking.time}</div>
                  <div className="text-slate-500 text-xs">{booking.duration} min</div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Info */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-slate-900">{booking.agent.name}</span>
                  {booking.agent.verified && (
                    <Shield className="h-3 w-3 text-blue-600" />
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-amber-500" />
                  <span className="text-slate-600 text-xs">{booking.agent.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button className="w-8 h-8 bg-white border border-slate-300 rounded-lg flex items-center justify-center hover:border-blue-300 transition-colors">
                <Phone className="h-3 w-3 text-slate-600" />
              </button>
              <button className="w-8 h-8 bg-white border border-slate-300 rounded-lg flex items-center justify-center hover:border-blue-300 transition-colors">
                <MessageCircle className="h-3 w-3 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <div className="text-sm text-blue-800 leading-relaxed">
                {booking.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 safe-area-padding">
      {/* Premium Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.back()}
                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Property Tours</h1>
                <p className="text-slate-600 text-sm">Schedule and manage viewings</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowBookingForm(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all active:scale-95 flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>New Tour</span>
            </button>
          </div>

          {/* Smart Tabs */}
          <div className="bg-slate-100 rounded-xl p-1">
            <div className="flex">
              {[
                { id: 'upcoming', label: 'Upcoming', count: bookings.length },
                { id: 'past', label: 'Past', count: pastBookings.length }
              ].map(({ id, label, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    activeTab === id 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 pb-24">
        {/* Bookings Grid */}
        <div className="space-y-3">
          {(activeTab === 'upcoming' ? bookings : pastBookings).map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}

          {/* Empty State */}
          {(activeTab === 'upcoming' ? bookings : pastBookings).length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {activeTab === 'upcoming' ? 'No upcoming tours' : 'No past tours'}
              </h3>
              <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto">
                {activeTab === 'upcoming' 
                  ? 'Schedule property tours to see them here.' 
                  : 'Your completed property tours will appear here.'
                }
              </p>
              {activeTab === 'upcoming' && (
                <button 
                  onClick={() => setShowBookingForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all active:scale-95 flex items-center space-x-2 mx-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Schedule Tour</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Premium Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 md:items-center">
          <div className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto md:rounded-3xl native-scroll">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedProperty ? 'Schedule Tour' : 'Select Property'}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {selectedProperty ? 'Choose date and time' : 'Choose a property to tour'}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedProperty(null);
                  }}
                  className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {!selectedProperty ? (
                // Property Selection
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">Premium Properties</h4>
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {premiumProperties.map((property) => (
                      <div 
                        key={property.id}
                        onClick={() => handleNewBooking(property)}
                        className="flex items-center space-x-3 p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-bold text-slate-900 text-sm truncate">
                              {property.title}
                            </h5>
                            {property.verified && (
                              <div className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                                VERIFIED
                              </div>
                            )}
                          </div>
                          <p className="text-slate-600 text-xs mb-1">{property.location}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600 font-bold text-sm">
                              P{property.price.toLocaleString()}
                              <span className="text-slate-500 text-xs font-normal">/month</span>
                            </span>
                            <div className="flex items-center space-x-1">
                              {property.features.map((feature, index) => (
                                <span key={index} className="text-slate-500 text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Booking Form
                <div className="space-y-6">
                  {/* Selected Property */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">{selectedProperty.title}</h4>
                        <p className="text-slate-600 text-xs">{selectedProperty.location}</p>
                        <div className="text-blue-600 font-bold text-sm">
                          P{selectedProperty.price.toLocaleString()}/month
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Tour Date</label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Preferred Time</label>
                      <select className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900">
                        <option value="">Select time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Additional Notes
                      <span className="text-slate-500 font-normal ml-1">(Optional)</span>
                    </label>
                    <textarea 
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 resize-none"
                      placeholder="Any specific requirements, questions, or special requests for the agent..."
                    />
                  </div>

                  {/* Confirmation */}
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="text-blue-800 font-medium text-sm">Instant Confirmation</div>
                        <div className="text-blue-700 text-xs">You'll receive booking details immediately</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all active:scale-95"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        // Handle booking submission
                        setShowBookingForm(false);
                        setSelectedProperty(null);
                      }}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Schedule Tour</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .safe-area-padding {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .native-scroll {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
}