// src/app/(consumer)/booking/page.tsx - MOBILE-FIRST NATIVE EXPERIENCE
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
  MessageCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Star,
  Shield,
  Building2,
  ArrowLeft,
  Plus
} from 'lucide-react';

interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  price: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  agent: {
    name: string;
    phone: string;
    rating: number;
    verified: boolean;
  };
  notes: string;
  duration: number;
}

export default function BookingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const bookings: Booking[] = [
    {
      id: '1',
      propertyId: '1',
      propertyTitle: 'CBD Luxury Apartment',
      propertyLocation: 'CBD, Gaborone',
      price: 14500,
      date: '2024-02-15',
      time: '14:00',
      status: 'confirmed',
      agent: {
        name: 'Sarah Johnson',
        phone: '+267 71 123 456',
        rating: 4.9,
        verified: true
      },
      notes: 'Bring ID for verification. Parking in basement P2.',
      duration: 60
    },
    {
      id: '2',
      propertyId: '2',
      propertyTitle: 'Phakalane Executive Home',
      propertyLocation: 'Phakalane Estate',
      price: 25000,
      date: '2024-02-20',
      time: '10:00',
      status: 'pending',
      agent: {
        name: 'David Smith',
        phone: '+267 72 234 567',
        rating: 4.7,
        verified: true
      },
      notes: 'Golf course view. Meet at clubhouse.',
      duration: 90
    }
  ];

  const pastBookings: Booking[] = [
    {
      id: '3',
      propertyId: '3',
      propertyTitle: 'Capital Towers Penthouse',
      propertyLocation: 'Main Mall, Gaborone',
      price: 38000,
      date: '2024-01-25',
      time: '15:30',
      status: 'completed',
      agent: {
        name: 'Lisa Brown',
        phone: '+267 73 345 678',
        rating: 5.0,
        verified: true
      },
      notes: 'Stunning city views. Private terrace.',
      duration: 75
    }
  ];

  const availableProperties = [
    {
      id: '1',
      title: 'CBD Luxury Apartment',
      location: 'CBD, Gaborone',
      price: 14500,
      type: 'Apartment',
      beds: 2,
      baths: 2,
      sqft: 1200,
      verified: true
    },
    {
      id: '2',
      title: 'Phakalane Executive Home',
      location: 'Phakalane Estate',
      price: 25000,
      type: 'House',
      beds: 4,
      baths: 3,
      sqft: 2400,
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
      <div 
        className="bg-card border rounded-xl p-3 hover:shadow-sm transition-all cursor-pointer active:scale-95 touch-manipulation"
        onClick={() => router.push(`/property/${booking.propertyId}`)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 truncate">
              {booking.propertyTitle}
            </h3>
            <div className="flex items-center space-x-1 text-muted-foreground text-xs">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{booking.propertyLocation}</span>
            </div>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium flex-shrink-0 ml-2 ${statusConfig.color}`}>
            <StatusIcon className="h-3 w-3" />
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="flex items-center space-x-2 text-xs">
            <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <div>
              <div className="text-foreground font-medium">
                {new Date(booking.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-muted-foreground text-xs">
                {new Date(booking.date).toLocaleDateString('en-US', { 
                  weekday: 'short' 
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <div>
              <div className="text-foreground font-medium">{booking.time}</div>
              <div className="text-muted-foreground text-xs">{booking.duration} min</div>
            </div>
          </div>
        </div>

        {/* Agent Info */}
        <div className="flex items-center justify-between p-2 bg-muted rounded-lg mb-2">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-3 w-3 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium text-foreground truncate">{booking.agent.name}</span>
                {booking.agent.verified && (
                  <Shield className="h-3 w-3 text-primary flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-amber-500 flex-shrink-0" />
                <span className="text-muted-foreground text-xs">{booking.agent.rating}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.open(`tel:${booking.agent.phone}`);
              }}
              className="w-6 h-6 bg-background border border-border rounded flex items-center justify-center hover:border-primary transition-colors active:scale-95"
            >
              <Phone className="h-3 w-3 text-muted-foreground" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle message
              }}
              className="w-6 h-6 bg-background border border-border rounded flex items-center justify-center hover:border-primary transition-colors active:scale-95"
            >
              <MessageCircle className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
            <div className="text-xs text-blue-800 leading-relaxed">
              {booking.notes}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 safe-area-inset">
      {/* Mobile-Optimized Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 sticky top-0 z-50 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <button 
                onClick={() => router.back()}
                className="p-1.5 hover:bg-accent rounded-lg transition-colors active:scale-95 touch-manipulation"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold text-foreground truncate">Property Tours</h1>
                <p className="text-muted-foreground text-sm truncate">Schedule and manage viewings</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowBookingForm(true)}
              className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors active:scale-95 flex items-center space-x-1 text-sm touch-manipulation"
            >
              <Plus className="h-4 w-4" />
              <span>New</span>
            </button>
          </div>

          {/* Mobile-Optimized Tabs */}
          <div className="bg-muted rounded-lg p-1">
            <div className="flex">
              {[
                { id: 'upcoming', label: 'Upcoming', count: bookings.length },
                { id: 'past', label: 'Past', count: pastBookings.length }
              ].map(({ id, label, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex-1 py-2 px-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center space-x-1 touch-manipulation ${
                    activeTab === id 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="truncate">{label}</span>
                  <span className={`px-1 py-0.5 rounded-full text-xs flex-shrink-0 ${
                    activeTab === id ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Bookings List */}
        <div className="space-y-3">
          {(activeTab === 'upcoming' ? bookings : pastBookings).map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}

          {/* Empty State */}
          {(activeTab === 'upcoming' ? bookings : pastBookings).length === 0 && (
            <div className="bg-card border rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {activeTab === 'upcoming' ? 'No upcoming tours' : 'No past tours'}
              </h3>
              <p className="text-muted-foreground text-xs mb-4 max-w-xs mx-auto">
                {activeTab === 'upcoming' 
                  ? 'Schedule property tours to see them here.' 
                  : 'Your completed tours will appear here.'
                }
              </p>
              {activeTab === 'upcoming' && (
                <button 
                  onClick={() => setShowBookingForm(true)}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors active:scale-95 flex items-center space-x-1 text-sm mx-auto touch-manipulation"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Tour</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile-First Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 safe-area-inset">
          <div className="bg-background rounded-t-2xl w-full max-h-[85vh] overflow-y-auto touch-manipulation">
            {/* Header */}
            <div className="p-4 border-b border-border sticky top-0 bg-background">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {selectedProperty ? 'Schedule Tour' : 'Select Property'}
                  </h3>
                  <p className="text-muted-foreground text-sm truncate">
                    {selectedProperty ? 'Choose date and time' : 'Choose property to tour'}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedProperty(null);
                  }}
                  className="p-2 hover:bg-accent rounded-lg transition-colors active:scale-95 ml-2"
                >
                  <span className="text-xl text-muted-foreground">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {!selectedProperty ? (
                // Property Selection
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-sm">Available Properties</h4>
                  
                  <div className="space-y-2">
                    {availableProperties.map((property) => (
                      <div 
                        key={property.id}
                        onClick={() => handleNewBooking(property)}
                        className="flex items-center space-x-3 p-3 bg-card border border-border rounded-xl cursor-pointer hover:border-primary transition-colors active:scale-95 touch-manipulation"
                      >
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1 mb-1">
                            <h5 className="font-semibold text-foreground text-sm truncate">
                              {property.title}
                            </h5>
                            {property.verified && (
                              <div className="bg-primary text-primary-foreground px-1 py-0.5 rounded text-xs font-medium flex-shrink-0">
                                VERIFIED
                              </div>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs mb-1 truncate">{property.location}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-primary font-semibold text-sm">
                              P{property.price.toLocaleString()}
                            </span>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <span>{property.beds} bd</span>
                              <span>•</span>
                              <span>{property.baths} ba</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Booking Form
                <div className="space-y-4">
                  {/* Selected Property */}
                  <div className="bg-muted rounded-xl p-3 border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm truncate">{selectedProperty.title}</h4>
                        <p className="text-muted-foreground text-xs truncate">{selectedProperty.location}</p>
                        <div className="text-primary font-semibold text-sm">
                          P{selectedProperty.price.toLocaleString()}/month
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Tour Date</label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Time</label>
                      <select className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm">
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
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Notes <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <textarea 
                      rows={2}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm resize-none"
                      placeholder="Special requests or questions..."
                    />
                  </div>

                  {/* Confirmation */}
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="text-blue-800 font-medium text-sm">Instant Confirmation</div>
                        <div className="text-blue-700 text-xs">Booking details sent immediately</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="flex-1 py-2 px-3 border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors active:scale-95 text-sm touch-manipulation"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        // Handle booking submission
                        setShowBookingForm(false);
                        setSelectedProperty(null);
                      }}
                      className="flex-1 py-2 px-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors active:scale-95 flex items-center justify-center space-x-1 text-sm touch-manipulation"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Schedule</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-40 safe-area-bottom">
        <div className="px-4 py-2">
          <div className="flex justify-around items-center">
            {[
              { icon: Home, label: 'Home', active: false, href: '/dashboard' },
              { icon: Calendar, label: 'Tours', active: true, href: '/booking' },
              { icon: Building2, label: 'Search', active: false, href: '/search' },
              { icon: User, label: 'Profile', active: false, href: '/profile' },
            ].map(({ icon: Icon, label, active, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className={`flex flex-col items-center p-2 transition-all duration-200 min-w-0 flex-1 touch-manipulation ${
                  active 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                  active ? 'bg-primary/10' : 'hover:bg-accent'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 font-medium truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}