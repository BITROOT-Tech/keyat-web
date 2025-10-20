// src/app/admin/properties/page.tsx - FIXED MOBILE LAYOUT
'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import PropertyImageUploadModal from '@/components/PropertyImageUploadModal';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  landlord_id: string;
  status: 'available' | 'rented' | 'maintenance';
  beds: number;
  baths: number;
  area: number;
  created_at: string;
}

type StatusFilter = 'all' | 'available' | 'rented' | 'maintenance';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProperties();
  };

  const handleOpenUploadModal = (property: Property) => {
    setSelectedProperty(property);
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedProperty(null);
  };

  const handleImagesUploaded = () => {
    fetchProperties();
  };

  // Memoized filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [properties, searchQuery, statusFilter]);

  // Intelligent priority system for header
  const getPriorityMessage = () => {
    const propertiesNeedingImages = properties.filter(p => !p.images || p.images.length === 0).length;
    const maintenanceProperties = properties.filter(p => p.status === 'maintenance').length;
    const vacantProperties = properties.filter(p => p.status === 'available').length;

    // Priority 1: Properties in maintenance (urgent - affects revenue and tenant satisfaction)
    if (maintenanceProperties > 0) {
      return ` ${maintenanceProperties} in maintenance 🚨`;
    }
    
    // Priority 2: Properties needing images (affects conversion rates and listing quality)
    if (propertiesNeedingImages > 0) {
      return ` ${propertiesNeedingImages} need images`;
    }
    
    // Priority 3: Vacant properties (business opportunity - potential revenue)
    if (vacantProperties > 5) {
      return ` ${vacantProperties} vacant 💰`;
    }
    
    // All good
    return ' All properties optimized ✅';
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      available: { color: 'bg-green-50 text-green-700 border-green-200', icon: '✅' },
      rented: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🔒' },
      maintenance: { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: '🔧' }
    };
    return configs[status as keyof typeof configs] || { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '❓' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-padding">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-7 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex space-x-4 pt-2">
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-padding">
      <div className="p-4 space-y-4">
        {/* Header - Clean & Actionable with Intelligent Priority */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600 text-sm mt-1">
              <span className="font-medium">{filteredProperties.length}</span> of <span className="font-medium">{properties.length}</span> properties •{getPriorityMessage()}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 bg-white rounded-xl border border-gray-200 active:scale-95 transition-all hover:bg-gray-50"
            title="Refresh properties"
          >
            <span className={`text-base ${refreshing ? 'animate-spin' : ''}`}>
              {refreshing ? '🔄' : '🔄'}
            </span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3.5 border border-gray-300 rounded-xl bg-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">All Properties</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Properties List */}
        <div className="space-y-3">
          {filteredProperties.map((property) => {
            const statusConfig = getStatusConfig(property.status);
            
            return (
              <div 
                key={property.id} 
                className="bg-white rounded-xl border border-gray-200 overflow-hidden active:scale-[0.998] transition-transform hover:shadow-sm"
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                    {/* Property Image */}
                    <div className="flex-shrink-0 relative self-start">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                        {property.images && property.images.length > 0 ? (
                          <img 
                            src={property.images[0]} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xl">🏠</span>
                        )}
                      </div>
                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-white ${
                        property.images && property.images.length > 0 
                          ? 'bg-green-500 text-white' 
                          : 'bg-orange-500 text-white'
                      }`}>
                        {property.images?.length || 0}
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 space-y-2 sm:space-y-0">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight mb-1">
                            {property.title}
                          </h3>
                          <p className="text-gray-600 text-xs flex items-center">
                            <span className="mr-1.5">📍</span>
                            <span className="truncate">{property.location}</span>
                          </p>
                        </div>
                        <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color} self-start`}>
                          <span className="text-xs">{statusConfig.icon}</span>
                          <span className="capitalize">{property.status}</span>
                        </div>
                      </div>

                      {/* Property Specs */}
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <span>🛏️</span>
                          <span>{property.beds}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <span>🚿</span>
                          <span>{property.baths}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <span>📐</span>
                          <span>{property.area?.toLocaleString()} sq ft</span>
                        </div>
                      </div>

                      {/* Price & Actions - Stack on mobile, row on larger screens */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div>
                          <p className="text-base font-bold text-blue-600">
                            P{property.price?.toLocaleString()}
                            <span className="text-gray-600 text-sm font-normal ml-1">/month</span>
                          </p>
                        </div>
                        
                        {/* Action Buttons - Full width on mobile, auto width on larger screens */}
                        <div className="flex space-x-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleOpenUploadModal(property)}
                            className="flex-1 sm:flex-none bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium active:scale-95 transition-transform hover:bg-blue-700 flex items-center justify-center space-x-1.5 shadow-sm"
                          >
                            <span>📤</span>
                            <span>Upload</span>
                          </button>
                          
                          <button 
                            onClick={() => window.open(`/consumer/property/${property.id}`, '_blank')}
                            className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium active:scale-95 transition-transform hover:bg-gray-200 flex items-center justify-center space-x-1.5"
                          >
                            <span>👁️</span>
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No properties found' : 'No properties yet'}
            </h3>
            <p className="text-gray-600 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Properties will appear here once they are added to the system'
              }
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium active:scale-95 transition-transform hover:bg-blue-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      <PropertyImageUploadModal
        property={selectedProperty}
        isOpen={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onImagesUploaded={handleImagesUploaded}
        onUploadError={(error) => console.error('Upload error:', error)}
      />
    </div>
  );
}