// src/app/consumer/tours/page.tsx - MOBILE FIRST WITH CLEAN HEADER
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { Header, BottomNav } from '@/components/consumer';

// Lazy load icons
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const ClockIcon = dynamic(() => import('lucide-react').then(mod => mod.Clock));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const PhoneIcon = dynamic(() => import('lucide-react').then(mod => mod.Phone));
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle));
const XCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.XCircle));
const Clock4Icon = dynamic(() => import('lucide-react').then(mod => mod.Clock4));
const PlusIcon = dynamic(() => import('lucide-react').then(mod => mod.Plus));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));

interface Tour {
  id: string;
  property_id: string;
  property_title: string;
  property_location: string;
  property_image: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'confirmed';
  agent_name: string;
  agent_phone: string;
  notes?: string;
  created_at: string;
}

interface Property {
  id: string;
  title: string;
  location: string;
  images: string[];
  price: number;
  beds: number;
  baths: number;
}

export default function ToursPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New tour form state
  const [newTour, setNewTour] = useState({
    property_id: '',
    scheduled_date: '',
    scheduled_time: '',
    notes: ''
  });

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
      } catch (err) {
        console.error('Auth error:', err);
      }
    };

    checkAuth();
  }, []);

  // Fetch tours and properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        
        // Fetch mock tours
        const mockTours: Tour[] = [
          {
            id: '1',
            property_id: '1',
            property_title: 'Modern 3-Bedroom Apartment',
            property_location: 'Gaborone, Block 9',
            property_image: '',
            scheduled_date: '2024-01-15',
            scheduled_time: '10:00',
            status: 'confirmed',
            agent_name: 'Sarah Johnson',
            agent_phone: '+267 71 123 456',
            notes: 'Please bring ID for security clearance',
            created_at: '2024-01-10'
          },
          {
            id: '2',
            property_id: '2',
            property_title: 'Luxury Villa with Pool',
            property_location: 'Phakalane, Gaborone',
            property_image: '',
            scheduled_date: '2024-01-20',
            scheduled_time: '14:30',
            status: 'scheduled',
            agent_name: 'David Smith',
            agent_phone: '+267 72 234 567',
            notes: 'Pool maintenance scheduled for same day',
            created_at: '2024-01-12'
          },
          {
            id: '3',
            property_id: '3',
            property_title: 'Cozy 2-Bedroom Townhouse',
            property_location: 'Mogoditshane',
            property_image: '',
            scheduled_date: '2024-01-08',
            scheduled_time: '09:00',
            status: 'completed',
            agent_name: 'Anna Brown',
            agent_phone: '+267 73 345 678',
            notes: 'Great neighborhood, near schools',
            created_at: '2024-01-05'
          }
        ];

        // Fetch available properties for scheduling
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'available')
          .limit(10);

        setTours(mockTours);
        setProperties(propertiesData || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScheduleTour = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to schedule the tour
    console.log('Scheduling tour:', newTour);
    
    // Mock success - add to tours list
    const property = properties.find(p => p.id === newTour.property_id);
    if (property) {
      const newTourObj: Tour = {
        id: Date.now().toString(),
        property_id: newTour.property_id,
        property_title: property.title,
        property_location: property.location,
        property_image: property.images?.[0] || '',
        scheduled_date: newTour.scheduled_date,
        scheduled_time: newTour.scheduled_time,
        status: 'scheduled',
        agent_name: 'TBA',
        agent_phone: '+267 70 000 000',
        notes: newTour.notes,
        created_at: new Date().toISOString()
      };

      setTours(prev => [newTourObj, ...prev]);
      setNewTour({ property_id: '', scheduled_date: '', scheduled_time: '', notes: '' });
      setShowScheduleForm(false);
    }
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.property_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tour.property_location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'upcoming') {
      return matchesSearch && ['scheduled', 'confirmed'].includes(tour.status);
    } else {
      return matchesSearch && ['completed', 'cancelled'].includes(tour.status);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'scheduled': return <Clock4Icon className="h-4 w-4" />;
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled': return <XCircleIcon className="h-4 w-4" />;
      default: return <Clock4Icon className="h-4 w-4" />;
    }
  };

  const handleQuickSearch = () => {
    // Search functionality for tours
    console.log('Searching tours:', searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const upcomingToursCount = tours.filter(t => ['scheduled', 'confirmed'].includes(t.status)).length;
  const pastToursCount = tours.filter(t => ['completed', 'cancelled'].includes(t.status)).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-padding">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
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
        <div className="p-4 max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
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
    <div className="min-h-screen bg-gray-50 safe-area-padding">
      {/* CLEAN HEADER */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <Header
          user={user}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onQuickSearch={handleQuickSearch}
          notifications={0}
          showLocationFilter={false}
          onLocationFilterClick={() => {}}
        />
      </div>

      <div className="p-4 max-w-6xl mx-auto">
        {/* IMPROVED PAGE HEADER */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Tours</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  {upcomingToursCount + pastToursCount} total tours
                </span>
                <span className="text-gray-300">•</span>
                <span>{upcomingToursCount} upcoming</span>
                <span className="text-gray-300">•</span>
                <span>{pastToursCount} past</span>
              </div>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowScheduleForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium active:scale-95 touch-manipulation"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Schedule Tour</span>
              <span className="sm:hidden">New</span>
            </motion.button>
          </div>
        </div>

        {/* TABS - MOBILE OPTIMIZED */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
          {[
            { key: 'upcoming', label: 'Upcoming', count: upcomingToursCount },
            { key: 'past', label: 'Past', count: pastToursCount }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'upcoming' | 'past')}
              className={`flex-1 py-3 px-2 sm:px-4 rounded-lg text-sm font-medium transition-all active:scale-95 touch-manipulation ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="truncate">{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs min-w-6 ${
                  activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* SEARCH SUMMARY - Only show when searching */}
        {searchQuery && (
          <div className="mb-4 p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Showing {filteredTours.length} tours for "{searchQuery}"
                </span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium active:scale-95 touch-manipulation"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* SCHEDULE TOUR MODAL */}
        <AnimatePresence>
          {showScheduleForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 safe-area-padding"
              onClick={() => setShowScheduleForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Schedule New Tour</h2>
                
                <form onSubmit={handleScheduleTour} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Property
                    </label>
                    <select
                      required
                      value={newTour.property_id}
                      onChange={(e) => setNewTour(prev => ({ ...prev, property_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a property</option>
                      {properties.map(property => (
                        <option key={property.id} value={property.id}>
                          {property.title} - {property.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={newTour.scheduled_date}
                        onChange={(e) => setNewTour(prev => ({ ...prev, scheduled_date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        required
                        value={newTour.scheduled_time}
                        onChange={(e) => setNewTour(prev => ({ ...prev, scheduled_time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={newTour.notes}
                      onChange={(e) => setNewTour(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any special requirements or questions..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowScheduleForm(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors active:scale-95 touch-manipulation"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium active:scale-95 touch-manipulation"
                    >
                      Schedule Tour
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOURS LIST */}
        {filteredTours.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'upcoming' ? 'No Upcoming Tours' : 'No Past Tours'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'upcoming' 
                ? 'Schedule your first property tour to get started'
                : 'Your completed and cancelled tours will appear here'
              }
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => setShowScheduleForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors active:scale-95 touch-manipulation"
              >
                Schedule a Tour
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(`/consumer/tours/${tour.id}`)}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg transition-all cursor-pointer group active:scale-95 touch-manipulation"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Property Image */}
                  <div className="w-full sm:w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    {tour.property_image ? (
                      <img 
                        src={tour.property_image} 
                        alt={tour.property_title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <HomeIcon className="h-6 w-6 text-blue-600" />
                    )}
                  </div>

                  {/* Tour Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {tour.property_title}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{tour.property_location}</span>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(tour.status)}`}>
                        {getStatusIcon(tour.status)}
                        <span className="capitalize">{tour.status}</span>
                      </div>
                    </div>

                    {/* Tour Schedule - Mobile Optimized */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">
                          {new Date(tour.scheduled_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">{tour.scheduled_time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">{tour.agent_name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">{tour.agent_phone}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {tour.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700 line-clamp-2">{tour.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {tour.status === 'scheduled' && (
                      <div className="flex gap-3 pt-3 border-t border-gray-200">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium active:scale-95 touch-manipulation">
                          Reschedule
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium active:scale-95 touch-manipulation">
                          Cancel
                        </button>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium ml-auto active:scale-95 touch-manipulation">
                          Confirm
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}