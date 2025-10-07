// src/app/(consumer)/booking/page.tsx - COMPLETE PROFESSIONAL VERSION
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
  MoreVertical
} from 'lucide-react';

interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  agent: {
    name: string;
    phone: string;
    email: string;
  };
  notes: string;
  createdAt: string;
}

export default function BookingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Mock bookings data
  const bookings: Booking[] = [
    {
      id: '1',
      propertyId: '1',
      propertyTitle: 'Modern Apartment in Gaborone',
      propertyLocation: 'Block 9, Gaborone',
      propertyImage: '/api/placeholder/300/200',
      date: '2024-02-15',
      time: '14:00',
      status: 'confirmed',
      agent: {
        name: 'Sarah Johnson',
        phone: '+267 71 123 456',
        email: 'sarah@keyat.properties'
      },
      notes: 'Please bring ID for verification',
      createdAt: '2024-02-10'
    },
    {
      id: '2',
      propertyId: '2',
      propertyTitle: 'Spacious Family House',
      propertyLocation: 'Phakalane, Gaborone',
      propertyImage: '/api/placeholder/300/200',
      date: '2024-02-20',
      time: '10:00',
      status: 'pending',
      agent: {
        name: 'David Smith',
        phone: '+267 72 234 567',
        email: 'david@keyat.properties'
      },
      notes: 'Parking available in front',
      createdAt: '2024-02-12'
    }
  ];

  const pastBookings: Booking[] = [
    {
      id: '3',
      propertyId: '3',
      propertyTitle: 'Cozy Studio Apartment',
      propertyLocation: 'Mall, Francistown',
      propertyImage: '/api/placeholder/300/200',
      date: '2024-01-25',
      time: '15:30',
      status: 'completed',
      agent: {
        name: 'Lisa Brown',
        phone: '+267 73 345 678',
        email: 'lisa@keyat.properties'
      },
      notes: 'Great location near shopping center',
      createdAt: '2024-01-20'
    }
  ];

  const properties = [
    {
      id: '1',
      title: 'Modern Apartment in Gaborone',
      location: 'Block 9, Gaborone',
      price: 4500,
      image: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Spacious Family House',
      location: 'Phakalane, Gaborone',
      price: 8000,
      image: '/api/placeholder/300/200'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleNewBooking = (property: any) => {
    setSelectedProperty(property);
    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Property Tours</h1>
            <button 
              onClick={() => setShowBookingForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              New Booking
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming Tours
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past Tours
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {(activeTab === 'upcoming' ? bookings : pastBookings).map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Property Info */}
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <Home className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 
                          className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => router.push(`/property/${booking.propertyId}`)}
                        >
                          {booking.propertyTitle}
                        </h3>
                        <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{booking.propertyLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{booking.time}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{booking.agent.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{booking.agent.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="text-sm text-gray-600">
                          <strong>Notes:</strong> {booking.notes}
                        </div>
                      </div>
                    )}

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <a 
                          href={`tel:${booking.agent.phone}`}
                          className="flex items-center space-x-1 px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          <span>Call</span>
                        </a>
                        <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span>Message</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {(activeTab === 'upcoming' ? bookings : pastBookings).length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'upcoming' ? 'No upcoming tours' : 'No past tours'}
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'upcoming' 
                  ? 'Schedule property tours to see them here.' 
                  : 'Your completed tours will appear here.'
                }
              </p>
              {activeTab === 'upcoming' && (
                <button 
                  onClick={() => setShowBookingForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Schedule a Tour
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* New Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 md:items-center">
          <div className="bg-white rounded-t-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto md:rounded-2xl">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedProperty ? 'Schedule Property Tour' : 'Select Property'}
                </h3>
                <button 
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedProperty(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {!selectedProperty ? (
                // Property Selection
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Select a property to tour:</h4>
                  <div className="space-y-3">
                    {properties.map((property) => (
                      <div 
                        key={property.id}
                        onClick={() => setSelectedProperty(property)}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                          <Home className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-600">{property.location}</div>
                          <div className="text-blue-600 font-semibold">P{property.price.toLocaleString()}/month</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Booking Form
                <div className="space-y-4">
                  {/* Selected Property */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <Home className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{selectedProperty.title}</div>
                        <div className="text-sm text-gray-600">{selectedProperty.location}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tour Date</label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                    <textarea 
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Any specific requirements or questions for the agent..."
                    />
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>You'll receive a confirmation within 24 hours</span>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        // Handle booking submission
                        setShowBookingForm(false);
                        setSelectedProperty(null);
                      }}
                      className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      Schedule Tour
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}