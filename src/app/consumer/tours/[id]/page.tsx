// src/app/consumer/tours/[id]/page.tsx - UPDATED WITH REAL DATA
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/consumer';

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
const ArrowLeftIcon = dynamic(() => import('lucide-react').then(mod => mod.ArrowLeft));
const MessageCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.MessageCircle));
const NavigationIcon = dynamic(() => import('lucide-react').then(mod => mod.Navigation));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));
const MapIcon = dynamic(() => import('lucide-react').then(mod => mod.Map));
const BedIcon = dynamic(() => import('lucide-react').then(mod => mod.Bed));
const BathIcon = dynamic(() => import('lucide-react').then(mod => mod.Bath));

interface Tour {
  id: string;
  property_id: string;
  property_title: string;
  property_location: string;
  property_image: string;
  property_price: number;
  property_beds: number;
  property_baths: number;
  property_area?: number;
  scheduled_date: string;
  scheduled_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'confirmed';
  agent_name: string;
  agent_phone: string;
  agent_email?: string;
  agent_photo?: string;
  agent_rating?: number;
  notes?: string;
  meeting_point?: string;
  duration?: number;
  created_at: string;
}

export default function TourDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tourId = params.id as string;
  
  const [user, setUser] = useState<any>(null);
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'agent' | 'location'>('details');

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

  // Fetch tour details from database
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError('Please log in to view tour details');
          setLoading(false);
          return;
        }

        // Fetch real tour data from database
        const { data: tourData, error } = await supabase
          .from('tours')
          .select(`
            *,
            properties (
              title,
              location,
              images,
              price,
              bedrooms,
              bathrooms,
              area
            ),
            agent_profiles (
              first_name,
              last_name,
              phone,
              email,
              photo_url,
              rating
            )
          `)
          .eq('id', tourId)
          .eq('tenant_id', session.user.id)
          .single();

        if (error) throw error;
        if (!tourData) {
          setError('Tour not found');
          setLoading(false);
          return;
        }

        // Transform the data
        const formattedTour: Tour = {
          id: tourData.id,
          property_id: tourData.property_id,
          property_title: tourData.properties?.title || 'Unknown Property',
          property_location: tourData.properties?.location || 'Location not specified',
          property_image: tourData.properties?.images?.[0] || '',
          property_price: tourData.properties?.price || 0,
          property_beds: tourData.properties?.bedrooms || 0,
          property_baths: tourData.properties?.bathrooms || 0,
          property_area: tourData.properties?.area,
          scheduled_date: tourData.preferred_date.split('T')[0],
          scheduled_time: tourData.viewing_time,
          status: tourData.status,
          agent_name: tourData.agent_profiles ? 
            `${tourData.agent_profiles.first_name} ${tourData.agent_profiles.last_name}` : 
            'Agent TBA',
          agent_phone: tourData.agent_profiles?.phone || '+267 70 000 000',
          agent_email: tourData.agent_profiles?.email,
          agent_photo: tourData.agent_profiles?.photo_url,
          agent_rating: tourData.agent_profiles?.rating || 4.5,
          notes: tourData.notes,
          meeting_point: tourData.meeting_point,
          duration: tourData.duration,
          created_at: tourData.created_at
        };

        setTour(formattedTour);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Failed to load tour details');
        setLoading(false);
      }
    };

    if (tourId) {
      fetchTour();
    }
  }, [tourId]);

  const handleCallAgent = () => {
    if (tour) {
      window.open(`tel:${tour.agent_phone}`);
    }
  };

  const handleMessageAgent = () => {
    if (tour) {
      window.open(`https://wa.me/${tour.agent_phone.replace(/\D/g, '')}?text=Hi ${tour.agent_name}, I have a question about my tour for ${tour.property_title}`);
    }
  };

  const handleViewProperty = () => {
    if (tour) {
      router.push(`/consumer/property/${tour.property_id}`);
    }
  };

  const handleGetDirections = () => {
    if (tour) {
      const encodedLocation = encodeURIComponent(tour.property_location);
      window.open(`https://maps.google.com/?q=${encodedLocation}`);
    }
  };

  const handleReschedule = () => {
    if (tour) {
      router.push(`/consumer/tours/${tour.id}/reschedule`);
    }
  };

  const handleCancelTour = async () => {
    if (tour && confirm('Are you sure you want to cancel this tour?')) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('tours')
          .update({ status: 'cancelled' })
          .eq('id', tour.id);

        if (error) throw error;
        
        setTour(prev => prev ? { ...prev, status: 'cancelled' } : null);
        alert('Tour cancelled successfully');
      } catch (err) {
        console.error('Error cancelling tour:', err);
        alert('Failed to cancel tour');
      }
    }
  };

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
      case 'confirmed': return <CheckCircleIcon className="h-5 w-5" />;
      case 'scheduled': return <Clock4Icon className="h-5 w-5" />;
      case 'completed': return <CheckCircleIcon className="h-5 w-5" />;
      case 'cancelled': return <XCircleIcon className="h-5 w-5" />;
      default: return <Clock4Icon className="h-5 w-5" />;
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
        <div className="p-4 max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Tour Not Found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'The tour you are looking for does not exist.'}
          </p>
          <button
            onClick={() => router.push('/consumer/tours')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
      {/* HEADER */}
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

      <div className="p-4 max-w-4xl mx-auto">
        {/* BACK BUTTON */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => router.push('/consumer/tours')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Tours</span>
        </motion.button>

        {/* TOUR HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {tour.property_title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{tour.property_location}</span>
                  </div>
                  
                  {/* Property Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <BedIcon className="h-4 w-4" />
                      <span>{tour.property_beds} beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BathIcon className="h-4 w-4" />
                      <span>{tour.property_baths} baths</span>
                    </div>
                    <div className="font-semibold text-green-600">
                      P{tour.property_price?.toLocaleString()}/month
                    </div>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(tour.status)}`}>
                  {getStatusIcon(tour.status)}
                  <span className="capitalize">{tour.status}</span>
                </div>
              </div>

              {/* QUICK INFO GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(tour.scheduled_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-gray-600">Date</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{tour.scheduled_time}</div>
                  <div className="text-xs text-gray-600">Time</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <UserIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{tour.agent_name}</div>
                  <div className="text-xs text-gray-600">Agent</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <PhoneIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{tour.agent_phone}</div>
                  <div className="text-xs text-gray-600">Contact</div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCallAgent}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <PhoneIcon className="h-4 w-4" />
              Call Agent
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleMessageAgent}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <MessageCircleIcon className="h-4 w-4" />
              Message
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleGetDirections}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <NavigationIcon className="h-4 w-4" />
              Get Directions
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleViewProperty}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <HomeIcon className="h-4 w-4" />
              View Property
            </motion.button>
          </div>
        </motion.div>

        {/* CONTENT TABS */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {[
              { key: 'details', label: 'Tour Details', icon: CalendarIcon },
              { key: 'agent', label: 'Agent Info', icon: UserIcon },
              { key: 'location', label: 'Location', icon: MapIcon }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <p className="text-gray-900 font-medium">
                        {new Date(tour.scheduled_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} at {tour.scheduled_time}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                      <p className="text-gray-900 font-medium">{tour.property_title}</p>
                      <p className="text-gray-600 text-sm">{tour.property_location}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Details</label>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{tour.property_beds} beds</span>
                        <span>{tour.property_baths} baths</span>
                        {tour.property_area && (
                          <span>{tour.property_area.toLocaleString()} sqft</span>
                        )}
                        <span className="font-medium text-gray-900">P{tour.property_price?.toLocaleString()}/mo</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
                      <p className="text-gray-900 font-medium">{tour.agent_name}</p>
                      <p className="text-gray-600 text-sm">{tour.agent_phone}</p>
                      {tour.agent_email && (
                        <p className="text-gray-600 text-sm">{tour.agent_email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(tour.status)}`}>
                        {getStatusIcon(tour.status)}
                        <span className="capitalize">{tour.status}</span>
                      </div>
                    </div>

                    {tour.meeting_point && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Point</label>
                        <p className="text-gray-900">{tour.meeting_point}</p>
                      </div>
                    )}

                    {tour.duration && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <p className="text-gray-900">{tour.duration} minutes</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {tour.notes && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Additional Notes</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700">{tour.notes}</p>
                  </div>
                </div>
              )}

              {/* TOUR ACTIONS BASED ON STATUS */}
              {tour.status === 'scheduled' && (
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Tour Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Confirm Attendance
                    </button>
                    <button 
                      onClick={handleReschedule}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={handleCancelTour}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel Tour
                    </button>
                  </div>
                </div>
              )}

              {tour.status === 'completed' && (
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Tour Feedback</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-3">
                      How was your tour experience with {tour.agent_name}?
                    </p>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className="h-6 w-6 text-yellow-400 fill-current cursor-pointer hover:scale-110 transition-transform"
                        />
                      ))}
                    </div>
                    <textarea
                      placeholder="Share your feedback about the property and agent..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Submit Feedback
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'agent' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {tour.agent_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{tour.agent_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{tour.agent_rating || '4.5'}</span>
                    </div>
                    <span className="text-sm text-gray-600">• Licensed Real Estate Agent</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <p className="text-gray-900">{tour.agent_phone}</p>
                    {tour.agent_email && (
                      <p className="text-gray-900">{tour.agent_email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <p className="text-gray-900">Residential Properties, Luxury Homes</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <p className="text-gray-900">5+ years in real estate</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                    <p className="text-gray-900">English, Setswana</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">About {tour.agent_name}</h4>
                <p className="text-gray-700">
                  {tour.agent_name} is a dedicated real estate professional with extensive experience 
                  in the Gaborone property market. Specializing in residential properties, they have 
                  helped numerous clients find their perfect homes through personalized service and 
                  deep market knowledge.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Location</h3>
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-gray-500 text-sm">Location: {tour.property_location}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-700">{tour.property_location}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Meeting Point</h4>
                    <p className="text-gray-700">
                      {tour.meeting_point || `Main entrance, look for ${tour.agent_name}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Transportation</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🚗</div>
                    <div className="font-medium text-gray-900">Parking</div>
                    <div className="text-sm text-gray-600">Visitor parking available</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🚌</div>
                    <div className="font-medium text-gray-900">Public Transport</div>
                    <div className="text-sm text-gray-600">Bus stop nearby</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🚕</div>
                    <div className="font-medium text-gray-900">Taxis</div>
                    <div className="text-sm text-gray-600">Readily available</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}