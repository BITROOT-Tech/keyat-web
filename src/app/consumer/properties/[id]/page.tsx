// src/app/consumer/property/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const ArrowLeftIcon = dynamic(() => import('lucide-react').then(mod => mod.ArrowLeft));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const BedIcon = dynamic(() => import('lucide-react').then(mod => mod.Bed));
const BathIcon = dynamic(() => import('lucide-react').then(mod => mod.Bath));
const SquareIcon = dynamic(() => import('lucide-react').then(mod => mod.Square));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const ShareIcon = dynamic(() => import('lucide-react').then(mod => mod.Share));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const PhoneIcon = dynamic(() => import('lucide-react').then(mod => mod.Phone));
const MessageCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.MessageCircle));
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  landlord_id: string;
  status: string;
  beds: number;
  baths: number;
  area: number;
  description: string;
  amenities: string[];
  created_at: string;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const propertyId = params.id as string;

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactLandlord = () => {
    // TODO: Implement contact logic
    alert('Contact landlord functionality coming soon!');
  };

  const handleScheduleViewing = () => {
    // TODO: Implement scheduling logic
    alert('Schedule viewing functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"></div>
          <div className="h-96 bg-gray-200"></div>
          <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/consumer/home')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'bg-rose-50 text-rose-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <HeartIcon className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        {property.images && property.images.length > 0 ? (
          <>
            {/* Main Image */}
            <div className="h-96 lg:h-[500px] bg-gray-200">
              <img
                src={property.images[selectedImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="flex space-x-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all ${
                          selectedImage === index 
                            ? 'border-blue-500 shadow-lg' 
                            : 'border-white hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-96 lg:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">🏠</div>
              <p className="text-lg font-medium">No images available</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Property Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {property.status === 'available' && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Available
                  </span>
                )}
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Verified <ShieldIcon className="h-3 w-3 inline ml-1" />
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              
              <div className="flex items-center space-x-1 text-gray-600 mb-4">
                <MapPinIcon className="h-4 w-4" />
                <span className="text-lg">{property.location}</span>
              </div>

              {/* Property Stats */}
              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <BedIcon className="h-5 w-5" />
                  <span>{property.beds} bedroom{property.beds !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BathIcon className="h-5 w-5" />
                  <span>{property.baths} bathroom{property.baths !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SquareIcon className="h-5 w-5" />
                  <span>{property.area} sqft</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-lg leading-relaxed">
                {property.description || 'A beautiful property located in a prime area. This well-maintained home offers modern amenities and comfortable living spaces perfect for families and professionals alike.'}
              </p>
            </div>

            {/* Price & Actions */}
            <div className="lg:w-80 mt-6 lg:mt-0 lg:ml-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    P{property.price?.toLocaleString()}
                  </div>
                  <div className="text-gray-600">per month</div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleContactLandlord}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <PhoneIcon className="h-5 w-5" />
                    <span>Contact Landlord</span>
                  </button>
                  
                  <button
                    onClick={handleScheduleViewing}
                    className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl border border-blue-600 hover:bg-blue-50 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <CalendarIcon className="h-5 w-5" />
                    <span>Schedule Viewing</span>
                  </button>
                  
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2">
                    <MessageCircleIcon className="h-5 w-5" />
                    <span>Send Message</span>
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                    <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>4.8 • 24 reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Amenities & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Amenities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                'WiFi', 'Parking', 'Security', 'Swimming Pool',
                'Gym', 'Garden', 'Balcony', 'Air Conditioning'
              ].map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Property Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Property Type</span>
                <span className="font-medium">Apartment</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Furnishing</span>
                <span className="font-medium">Furnished</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Available From</span>
                <span className="font-medium">Immediately</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Minimum Stay</span>
                <span className="font-medium">12 months</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map & Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
          <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
            <div className="text-center text-blue-800">
              <MapPinIcon className="h-12 w-12 mx-auto mb-2" />
              <p className="font-medium">{property.location}</p>
              <p className="text-sm">Map integration coming soon</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}