// src/app/(consumer)/property/[id]/page.tsx - PREMIUM NATIVE VERSION
'use client';

import { useState, useEffect } from 'react';
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
  User, 
  Phone, 
  MessageCircle,
  Calendar,
  Shield,
  Wifi,
  Utensils,
  Building2,
  CheckCircle,
  Zap,
  Sparkles,
  Crown,
  BadgeCheck,
  TrendingUp
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
    verified: boolean;
    response_time: string;
  };
  features: string[];
  availability: string;
  deposit: number;
  premium: boolean;
  investment_grade: boolean;
  roi: number;
  views: number;
  saved: number;
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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Simulate API call - replace with actual Supabase query
        setTimeout(() => {
          setProperty({
            id: params.id as string,
            title: 'The Residences • Luxury 2-Bedroom Apartment',
            description: 'Exceptional investment opportunity in Gaborone\'s premier residential development. This meticulously designed 2-bedroom apartment offers sophisticated urban living with premium finishes, smart home features, and exclusive amenities. Located in the heart of Block 9 with direct access to corporate hubs, shopping districts, and entertainment venues.',
            price: 14500,
            location: 'Block 9, CBD Gaborone',
            address: 'The Residences, Plot 123, Central Business District, Gaborone',
            beds: 2,
            baths: 2.5,
            sqft: 1700,
            parking: 2,
            propertyType: 'Luxury Apartment',
            images: [
              '/api/placeholder/600/400',
              '/api/placeholder/600/400',
              '/api/placeholder/600/400',
              '/api/placeholder/600/400'
            ],
            amenities: ['Infinity Pool', 'State-of-the-Art Gym', '24/7 Security', 'Concierge', 'Business Center', 'Sky Lounge'],
            agent: {
              name: 'Sarah M. Johnson',
              phone: '+267 71 123 456',
              email: 'sarah@keyat.properties',
              rating: 4.9,
              properties: 47,
              image: '/api/placeholder/100/100',
              verified: true,
              response_time: '< 2 hours'
            },
            features: [
              'Smart Home System',
              'Premium European Kitchen',
              'Marble Flooring',
              'Private Balcony',
              'Walk-in Closets',
              'Pet Friendly',
              'Fiber Internet Ready',
              'Central AC'
            ],
            availability: 'Immediate',
            deposit: 29000,
            premium: true,
            investment_grade: true,
            roi: 8.2,
            views: 247,
            saved: 38
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching property:', error);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  const similarProperties = [
    {
      id: '2',
      title: 'Phakalane Executive Villa',
      price: 25000,
      location: 'Phakalane Golf Estate',
      beds: 5,
      baths: 4,
      sqft: 3400,
      premium: true,
      image: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'Capital Towers Penthouse',
      price: 38000,
      location: 'Main Mall, Gaborone',
      beds: 4,
      baths: 3,
      sqft: 4000,
      premium: true,
      image: '/api/placeholder/300/200'
    }
  ];

  const handleSaveProperty = async () => {
    if (!property) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Toggle save status
      if (isFavorite) {
        // Remove from saved
        await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', session.user.id)
          .eq('property_id', property.id);
      } else {
        // Add to saved
        await supabase
          .from('saved_properties')
          .insert({
            user_id: session.user.id,
            property_id: property.id
          });
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-slate-600 font-medium text-sm mt-4">Loading premium property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 safe-area-padding">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 supports-backdrop-blur:bg-white/60">
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center hover:shadow-md transition-all active:scale-95"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleSaveProperty}
                className={`w-10 h-10 rounded-xl shadow-sm border flex items-center justify-center transition-all active:scale-95 ${
                  isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-600' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-red-300'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center hover:shadow-md transition-all active:scale-95">
                <Share2 className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-24">
        {/* Premium Image Gallery */}
        <div className="relative">
          <div className="w-full h-80 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <div className="text-center">
              <Building2 className="h-16 w-16 text-slate-400 mx-auto mb-3" />
              <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                Premium Property Images
              </div>
            </div>
          </div>
          
          {/* Premium Badge */}
          {property.premium && (
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
                <Crown className="h-4 w-4" />
                <span>PREMIUM</span>
              </div>
            </div>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeImage ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="px-5 py-6">
          {/* Premium Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                    {property.title}
                  </h1>
                  {property.investment_grade && (
                    <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold">
                      INVESTMENT
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 text-slate-600 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{property.location}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  P{property.price.toLocaleString()}
                  <span className="text-slate-500 text-sm font-normal">/month</span>
                </div>
                {property.roi && (
                  <div className="flex items-center space-x-1 justify-end mt-1">
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                    <span className="text-emerald-600 text-xs font-bold">{property.roi}% ROI</span>
                  </div>
                )}
              </div>
            </div>

            {/* Property Stats */}
            <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-slate-600 mb-1">
                  <Bed className="h-4 w-4" />
                  <span className="font-semibold text-slate-900">{property.beds}</span>
                </div>
                <span className="text-slate-500 text-xs">Beds</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-slate-600 mb-1">
                  <Bath className="h-4 w-4" />
                  <span className="font-semibold text-slate-900">{property.baths}</span>
                </div>
                <span className="text-slate-500 text-xs">Baths</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-slate-600 mb-1">
                  <Square className="h-4 w-4" />
                  <span className="font-semibold text-slate-900">{property.sqft.toLocaleString()}</span>
                </div>
                <span className="text-slate-500 text-xs">Sq Ft</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-slate-600 mb-1">
                  <Car className="h-4 w-4" />
                  <span className="font-semibold text-slate-900">{property.parking}</span>
                </div>
                <span className="text-slate-500 text-xs">Parking</span>
              </div>
            </div>
          </div>

          {/* Investment Metrics */}
          {property.investment_grade && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">Investment Analysis</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-slate-600 text-sm">Rental Yield</div>
                  <div className="text-slate-900 font-bold">{property.roi}%</div>
                </div>
                <div>
                  <div className="text-slate-600 text-sm">Property Views</div>
                  <div className="text-slate-900 font-bold">{property.views}</div>
                </div>
                <div>
                  <div className="text-slate-600 text-sm">Saved Count</div>
                  <div className="text-slate-900 font-bold">{property.saved}</div>
                </div>
                <div>
                  <div className="text-slate-600 text-sm">Market Demand</div>
                  <div className="text-emerald-600 font-bold">High</div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Property Overview</h2>
            <p className="text-slate-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="text-slate-600 text-sm font-medium mb-1">Availability</div>
              <div className="text-slate-900 font-bold flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>{property.availability}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <div className="text-slate-600 text-sm font-medium mb-1">Security Deposit</div>
              <div className="text-slate-900 font-bold">P{property.deposit.toLocaleString()}</div>
            </div>
          </div>

          {/* Premium Features */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Premium Features</h2>
            <div className="grid grid-cols-2 gap-2">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-slate-700 bg-slate-50 rounded-xl p-3">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Luxury Amenities */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Building Amenities</h2>
            <div className="grid grid-cols-2 gap-2">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-slate-700 bg-white rounded-xl p-3 border border-slate-200">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Agent Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Exclusive Agent</h2>
              {property.agent.verified && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold">
                {property.agent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900">{property.agent.name}</div>
                <div className="flex items-center space-x-2 text-slate-600 text-sm mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span>{property.agent.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{property.agent.properties} properties</span>
                  <span>•</span>
                  <span>{property.agent.response_time} response</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <a 
                href={`tel:${property.agent.phone}`}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all active:scale-95 text-sm"
              >
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </a>
              <button 
                onClick={() => setShowContactForm(true)}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95 text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Similar Premium Properties */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Similar Investments</h2>
              <div className="flex items-center space-x-1 text-blue-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Premium</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {similarProperties.map((prop) => (
                <div 
                  key={prop.id}
                  onClick={() => router.push(`/property/${prop.id}`)}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">
                          {prop.title}
                        </h3>
                        {prop.premium && (
                          <div className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                            PREMIUM
                          </div>
                        )}
                      </div>
                      <div className="text-blue-600 font-bold text-sm mb-1">
                        P{prop.price.toLocaleString()}/month
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600 text-xs">
                        <span>{prop.beds} bed</span>
                        <span>•</span>
                        <span>{prop.baths} bath</span>
                        <span>•</span>
                        <span>{prop.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Premium Bottom Action Bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-[calc(100%-2.5rem)] max-w-sm">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border border-white/20 px-4 py-3">
          <div className="flex space-x-3">
            <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all active:scale-95 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Schedule Tour</span>
            </button>
            <button 
              onClick={() => setShowContactForm(true)}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95 text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contact Agent</span>
            </button>
          </div>
        </div>
      </div>

      {/* Premium Contact Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 md:items-center">
          <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[80vh] overflow-y-auto md:rounded-3xl native-scroll">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Contact Agent</h3>
                  <p className="text-slate-600 text-sm">Get exclusive information</p>
                </div>
                <button 
                  onClick={() => setShowContactForm(false)}
                  className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                    placeholder="+267 71 123 456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Your Message
                    <span className="text-slate-500 font-normal ml-1">(Optional)</span>
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500 resize-none"
                    placeholder="I'm interested in this premium property and would like to schedule an exclusive viewing..."
                    defaultValue="Hi, I'm interested in this premium property and would like to learn more about investment opportunities."
                  />
                </div>
                
                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95">
                  Send Secure Message
                </button>
              </div>
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