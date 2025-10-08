// src/app/(consumer)/property/[id]/page.tsx - SYNTAX ERROR FIXED
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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
  Phone, 
  MessageCircle,
  Calendar,
  CheckCircle,
  Crown,
  BadgeCheck,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight
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
  property_type: string;
  images: string[];
  amenities: string[];
  agent_id: string;
  features: string[];
  availability: string;
  deposit: number;
  is_premium: boolean;
  investment_grade: boolean;
  roi: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  rating: number;
  properties_count: number;
  avatar_url: string;
  is_verified: boolean;
  response_time: string;
  company: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!property || property.images.length <= 1) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > minSwipeDistance) {
      setActiveImage(prev => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    } else if (distance < -minSwipeDistance) {
      setActiveImage(prev => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [params.id]);

  const fetchPropertyData = async () => {
    try {
      setTimeout(() => {
        setProperty({
          id: params.id as string,
          title: 'Modern 3-Bedroom Apartment with City Views',
          description: 'Beautiful modern apartment located in the heart of Gaborone. Features high-end finishes, spacious living areas, and premium amenities. Perfect for professionals and investors seeking quality urban living.',
          price: 16500,
          location: 'Block 9, Gaborone CBD',
          address: '123 Premium Tower, Central Business District',
          beds: 3,
          baths: 2,
          sqft: 1450,
          parking: 2,
          property_type: 'Luxury Apartment',
          images: Array(4).fill('/api/placeholder/600/400'),
          amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Concierge', 'Parking', 'Elevator', 'Rooftop Terrace', 'Business Center'],
          agent_id: 'agent-123',
          features: ['Smart Home', 'Balcony', 'Modern Kitchen', 'Walk-in Closet', 'Pet Friendly'],
          availability: 'Immediate',
          deposit: 33000,
          is_premium: true,
          investment_grade: true,
          roi: 7.2,
          view_count: 287,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        setAgent({
          id: 'agent-123',
          first_name: 'Sarah',
          last_name: 'Johnson',
          phone: '+267 71 123 456',
          email: 'sarah@premiumproperties.co.bw',
          rating: 4.8,
          properties_count: 34,
          avatar_url: '/api/placeholder/100/100',
          is_verified: true,
          response_time: '< 2 hours',
          company: 'Premium Properties BW'
        });

        setLoading(false);
      }, 800);

    } catch (error) {
      console.error('Error fetching property:', error);
      setLoading(false);
    }
  };

  const handleSaveProperty = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
        return;
      }

      setIsFavorite(!isFavorite);
      
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
      
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-hidden">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 safe-area-top">
          <div className="px-4 pt-4 pb-3 max-w-full">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
              <div className="flex space-x-2">
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-32 overflow-hidden">
          <div className="h-80 bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-4 max-w-full">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center safe-area-padding overflow-hidden">
        <div className="text-center p-6 w-full max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">This property may have been removed or is no longer available.</p>
          <button 
            onClick={() => router.push('/search')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors w-full max-w-xs mx-auto"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  const displayedAmenities = showAllAmenities 
    ? property.amenities 
    : property.amenities.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-gray-200 z-50 safe-area-top overflow-hidden">
        <div className="px-4 py-3 max-w-full mx-auto">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95 flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button 
                onClick={handleSaveProperty}
                className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0 ${
                  isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-600' 
                    : 'bg-white border-gray-200 text-gray-700 hover:border-red-300'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              <button 
                onClick={handleShare}
                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95 flex-shrink-0"
              >
                <Share2 className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-32 overflow-x-hidden">
        <div className="relative w-full overflow-hidden">
          <div 
            className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 relative touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-blue-600/60" />
                </div>
                <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Image {activeImage + 1} of {property.images.length}
                </div>
              </div>
            </div>
          </div>
          
          {property.is_premium && (
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
                <Crown className="h-4 w-4" />
                <span>PREMIUM</span>
              </div>
            </div>
          )}

          {property.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImage(prev => Math.max(0, prev - 1))}
                disabled={activeImage === 0}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </button>
              
              <button
                onClick={() => setActiveImage(prev => Math.min(property.images.length - 1, prev + 1))}
                disabled={activeImage === property.images.length - 1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === activeImage ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-4 py-6 space-y-6 w-full max-w-full mx-auto">
          <div className="space-y-4 w-full">
            <div className="flex items-start justify-between gap-3 w-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap w-full">
                  <h1 className="text-xl font-bold text-gray-900 leading-tight break-words w-full">
                    {property.title}
                  </h1>
                  {property.investment_grade && (
                    <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold shrink-0 mt-1">
                      INVESTMENT
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 mb-3 w-full">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium break-words w-full">
                    {property.location}
                  </span>
                </div>
              </div>
              
              <div className="text-right shrink-0 ml-2">
                <div className="text-xl font-bold text-blue-600 whitespace-nowrap">
                  P{property.price.toLocaleString()}
                  <span className="text-gray-500 text-sm font-normal">/month</span>
                </div>
                {property.roi > 0 && (
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <TrendingUp className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span className="text-emerald-600 text-xs font-bold">{property.roi}% ROI</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl p-4 border border-gray-200 w-full">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                  <Bed className="h-4 w-4" />
                  <span className="font-semibold text-gray-900 text-sm">{property.beds}</span>
                </div>
                <span className="text-gray-500 text-xs">Beds</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                  <Bath className="h-4 w-4" />
                  <span className="font-semibold text-gray-900 text-sm">{property.baths}</span>
                </div>
                <span className="text-gray-500 text-xs">Baths</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                  <Square className="h-4 w-4" />
                  <span className="font-semibold text-gray-900 text-sm">{property.sqft.toLocaleString()}</span>
                </div>
                <span className="text-gray-500 text-xs">Sq Ft</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                  <Car className="h-4 w-4" />
                  <span className="font-semibold text-gray-900 text-sm">{property.parking}</span>
                </div>
                <span className="text-gray-500 text-xs">Parking</span>
              </div>
            </div>
          </div>

          {property.investment_grade && (
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 w-full">
              <div className="flex items-center gap-2 mb-3 w-full">
                <TrendingUp className="h-5 w-5 text-blue-600 shrink-0" />
                <h3 className="font-semibold text-gray-900">Investment Analysis</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                <div>
                  <div className="text-gray-600 text-sm">Rental Yield</div>
                  <div className="text-gray-900 font-bold">{property.roi}%</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Property Views</div>
                  <div className="text-gray-900 font-bold">{property.view_count}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Market Demand</div>
                  <div className="text-emerald-600 font-bold">High</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Availability</div>
                  <div className="text-gray-900 font-bold text-sm">{property.availability}</div>
                </div>
              </div>
            </div>
          )}

          <div className="w-full">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Property Overview</h2>
            <p className="text-gray-600 leading-relaxed break-words w-full">{property.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="text-gray-600 text-sm font-medium mb-1">Availability</div>
              <div className="text-gray-900 font-bold flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="truncate">{property.availability}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="text-gray-600 text-sm font-medium mb-1">Security Deposit</div>
              <div className="text-gray-900 font-bold">P{property.deposit.toLocaleString()}</div>
            </div>
          </div>

          {property.features.length > 0 && (
            <div className="w-full">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Key Features</h2>
              <div className="grid grid-cols-2 gap-2 w-full">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <CheckCircle className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="flex-1 break-words">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {property.amenities.length > 0 && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-3 w-full">
                <h2 className="text-lg font-bold text-gray-900">Amenities</h2>
                {property.amenities.length > 6 && (
                  <button 
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="text-blue-600 text-sm font-medium shrink-0 ml-2"
                  >
                    {showAllAmenities ? 'Show Less' : `Show All (${property.amenities.length})`}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                {displayedAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded-xl p-3 border border-gray-200">
                    <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
                    <span className="break-words flex-1">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {agent && (
            <div className="bg-white rounded-2xl p-5 border border-gray-200 w-full">
              <div className="flex items-center justify-between mb-4 w-full">
                <h2 className="text-lg font-bold text-gray-900">Listing Agent</h2>
                {agent.is_verified && (
                  <div className="flex items-center gap-1 text-blue-600 shrink-0 ml-2">
                    <BadgeCheck className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-4 w-full">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0">
                  {agent.first_name?.[0]}{agent.last_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 break-words">{agent.first_name} {agent.last_name}</div>
                  {agent.company && (
                    <div className="text-gray-600 text-sm break-words">{agent.company}</div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-1 flex-wrap">
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-3 w-3 text-amber-500 fill-current shrink-0" />
                      <span>{agent.rating}</span>
                    </div>
                    <span className="shrink-0">•</span>
                    <span className="shrink-0">{agent.properties_count} properties</span>
                    <span className="shrink-0">•</span>
                    <span className="break-words">{agent.response_time}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <a 
                  href={`tel:${agent.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-95 text-sm min-w-0"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span className="truncate">Call</span>
                </a>
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95 text-sm min-w-0"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span className="truncate">Message</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-40 safe-area-bottom overflow-hidden">
        <div className="px-4 py-3 max-w-full mx-auto">
          <div className="flex gap-3 w-full">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all active:scale-95 text-sm min-w-0">
              <Calendar className="h-4 w-4 shrink-0" />
              <span className="truncate">Schedule Tour</span>
            </button>
            <button 
              onClick={() => setShowContactForm(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95 text-sm min-w-0"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span className="truncate">Contact</span>
            </button>
          </div>
        </div>
      </div>

      {showContactForm && agent && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 safe-area-padding overflow-hidden">
          <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto max-w-full mx-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 break-words">Contact Agent</h3>
                  <p className="text-gray-600 text-sm break-words">Get more information about this property</p>
                </div>
                <button 
                  onClick={() => setShowContactForm(false)}
                  className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0 ml-2"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
            
            <div className="p-6 w-full">
              <div className="space-y-4 w-full">
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-900 mb-2 w-full">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-900 mb-2 w-full">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                    placeholder="+267 71 123 456"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-900 mb-2 w-full">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-900 mb-2 w-full">Your Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 resize-none"
                    placeholder={`Hi ${agent.first_name}, I'm interested in ${property.title}...`}
                  />
                </div>
                
                <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}