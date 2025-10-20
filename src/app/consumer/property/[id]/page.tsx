// src/app/consumer/property/[id]/page.tsx - COMPLETE FIXED VERSION
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  status: string;
  beds: number;
  baths: number;
  area: number;
  description: string;
  created_at: string;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
  };

  const handleNextImage = () => {
    if (!property?.images) return;
    const nextIndex = (selectedImage + 1) % property.images.length;
    setSelectedImage(nextIndex);
    scrollToImage(nextIndex);
  };

  const handlePrevImage = () => {
    if (!property?.images) return;
    const prevIndex = selectedImage === 0 ? property.images.length - 1 : selectedImage - 1;
    setSelectedImage(prevIndex);
    scrollToImage(prevIndex);
  };

  const scrollToImage = (index: number) => {
    const container = scrollContainerRef.current;
    if (container) {
      const imageElement = container.children[index] as HTMLElement;
      if (imageElement) {
        imageElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container && property?.images) {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const newIndex = Math.round(scrollLeft / containerWidth);
      
      if (newIndex !== selectedImage && newIndex >= 0 && newIndex < property.images.length) {
        setSelectedImage(newIndex);
      }
    }
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/consumer/home');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center safe-area-padding">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center safe-area-padding">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-4">This property doesn't exist or was removed.</p>
          <button
            onClick={handleBackClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 safe-area-padding-top">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium active:scale-95 transition-transform"
          >
            <span className="text-lg">←</span>
            <span>Back to Properties</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto safe-area-padding-bottom">
        <div className="bg-white">
          {property.images && property.images.length > 0 ? (
            <div className="relative">
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onScroll={handleScroll}
              >
                {property.images.map((image, index) => (
                  <div 
                    key={index}
                    id={`image-${index}`}
                    className="flex-shrink-0 w-full snap-center"
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-80 object-cover"
                    />
                  </div>
                ))}
              </div>

              {property.images.length > 1 && (
                <>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(index);
                          scrollToImage(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedImage === index ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {property.images.length}
                  </div>

                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all active:scale-95"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all active:scale-95"
                  >
                    →
                  </button>
                </>
              )}

              {property.images.length > 1 && (
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(index);
                          scrollToImage(index);
                        }}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all active:scale-95 ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🏠</div>
                <p>No images available</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-b-xl border border-gray-200 border-t-0">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <span className="text-base sm:text-lg">📍 {property.location}</span>
                </div>
              </div>
              <div className="text-left sm:text-right mt-4 sm:mt-0">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  P{property.price?.toLocaleString()}
                </div>
                <div className="text-gray-600">per month</div>
              </div>
            </div>

            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
              property.status === 'available' ? 'bg-green-100 text-green-800' :
              property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{property.beds}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Bedrooms</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{property.baths}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Bathrooms</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{property.area}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Sq Ft</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {property.description || 'This property offers comfortable living in a great location. Contact us for more details and to schedule a viewing.'}
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Interested?</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-blue-600 text-white py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center text-sm sm:text-base active:scale-95">
                  Contact Landlord
                </button>
                <button className="flex-1 bg-white text-blue-600 py-3 px-4 sm:px-6 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors font-medium text-center text-sm sm:text-base active:scale-95">
                  Schedule Viewing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .safe-area-padding {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }
        .safe-area-padding-top {
          padding-top: env(safe-area-inset-top);
        }
        .safe-area-padding-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}