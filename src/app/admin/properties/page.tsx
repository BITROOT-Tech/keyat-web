// src/app/admin/properties/page.tsx - COMPLETE
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import PropertyImageUpload from '@/components/PropertyImageUpload';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const ImageIcon = dynamic(() => import('lucide-react').then(mod => mod.Image));
const UploadIcon = dynamic(() => import('lucide-react').then(mod => mod.Upload));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const FilterIcon = dynamic(() => import('lucide-react').then(mod => mod.Filter));
const EyeIcon = dynamic(() => import('lucide-react').then(mod => mod.Eye));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const BedIcon = dynamic(() => import('lucide-react').then(mod => mod.Bed));
const BathIcon = dynamic(() => import('lucide-react').then(mod => mod.Bath));

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
  created_at: string;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
    }
  };

  const handleImagesUploaded = (imageUrls: string[]) => {
    if (selectedProperty) {
      setProperties(prev => prev.map(prop => 
        prop.id === selectedProperty.id 
          ? { ...prop, images: imageUrls }
          : prop
      ));
      setSelectedProperty(null);
    }
    fetchProperties(); // Refresh data
  };

  // Filter properties based on search and status
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-64"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
          </div>
          
          {/* Filters Skeleton */}
          <div className="flex space-x-4">
            <div className="h-12 bg-gray-200 rounded-lg w-80"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-48"></div>
          </div>

          {/* Properties Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
          <p className="text-gray-600 mt-1">
            Manage {properties.length} properties • {filteredProperties.length} filtered
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BuildingIcon className="h-5 w-5 text-purple-500" />
          <span>Admin Access</span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search */}
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </motion.div>

      {/* Image Upload Section */}
      {selectedProperty && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border-2 border-purple-200 shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Upload Images for Property
              </h2>
              <p className="text-gray-600 mt-1">{selectedProperty.title}</p>
            </div>
            <button
              onClick={() => setSelectedProperty(null)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          <PropertyImageUpload 
            propertyId={selectedProperty.id}
            onImagesUploaded={handleImagesUploaded}
          />
        </motion.div>
      )}

      {/* Properties Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProperties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Property Image/Placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No images uploaded</p>
                </div>
              )}
              
              {/* Image Count Badge */}
              <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                {property.images?.length || 0} images
              </div>
              
              {/* Status Badge */}
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium capitalize ${
                property.status === 'available' 
                  ? 'bg-green-500 text-white'
                  : property.status === 'rented'
                  ? 'bg-blue-500 text-white'
                  : 'bg-orange-500 text-white'
              }`}>
                {property.status}
              </div>
            </div>

            {/* Property Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
                  {property.title}
                </h3>
                <div className="flex items-center space-x-1 text-gray-600 mt-1">
                  <MapPinIcon className="h-3 w-3 flex-shrink-0" />
                  <span className="text-sm truncate">{property.location}</span>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <BedIcon className="h-4 w-4" />
                    <span>{property.beds} bed</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BathIcon className="h-4 w-4" />
                    <span>{property.baths} bath</span>
                  </div>
                  <div>
                    <span>{property.area} sqft</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  P{property.price?.toLocaleString()}
                  <span className="text-sm font-normal text-gray-600">/mo</span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(property.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setSelectedProperty(property)}
                className="flex-1 bg-purple-600 text-white py-2.5 px-4 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 text-sm font-medium group/btn"
              >
                <UploadIcon className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                <span>Upload Images</span>
              </button>
              
              <button 
                onClick={() => window.open(`/consumer/property/${property.id}`, '_blank')}
                className="px-4 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center text-sm font-medium"
              >
                <EyeIcon className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-200"
        >
          <BuildingIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || statusFilter !== 'all' ? 'No properties found' : 'No Properties Yet'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria or filters to find properties.'
              : 'Properties will appear here once landlords create listings in the system.'
            }
          </p>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}