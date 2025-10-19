// src/app/admin/properties/page.tsx - COMPLETE WITH MODAL
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import PropertyImageUploadModal from '@/components/PropertyImageUploadModal';
import { motion, AnimatePresence } from 'framer-motion';
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
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle));
const XIcon = dynamic(() => import('lucide-react').then(mod => mod.X));
const AlertCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.AlertCircle));
const PlusIcon = dynamic(() => import('lucide-react').then(mod => mod.Plus));

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

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: number;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const addNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      timestamp: Date.now()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

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
      addNotification('error', 'Fetch Error', 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUploadModal = (property: Property) => {
    setSelectedProperty(property);
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedProperty(null);
  };

  const handleImagesUploaded = (imageUrls: string[], uploadedCount: number) => {
    if (selectedProperty) {
      setProperties(prev => prev.map(prop => 
        prop.id === selectedProperty.id 
          ? { ...prop, images: imageUrls }
          : prop
      ));
      
      // Show success notification
      addNotification(
        'success', 
        '🎉 Upload Successful!', 
        `Added ${uploadedCount} image${uploadedCount > 1 ? 's' : ''} to "${selectedProperty.title}"`
      );
    }
    fetchProperties(); // Refresh data
  };

  const handleUploadError = (error: string, propertyTitle: string) => {
    addNotification('error', '❌ Upload Failed', `Failed to upload images for "${propertyTitle}": ${error}`);
  };

  // Filter properties based on search and status
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats for the header
  const stats = {
    total: properties.length,
    withImages: properties.filter(p => p.images && p.images.length > 0).length,
    withoutImages: properties.filter(p => !p.images || p.images.length === 0).length,
    available: properties.filter(p => p.status === 'available').length,
  };

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
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-2xl"></div>
            ))}
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
      {/* Notification Stack */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`rounded-2xl p-4 shadow-xl border-l-4 backdrop-blur-sm ${
                notification.type === 'success'
                  ? 'bg-green-50 border-green-500 text-green-800'
                  : notification.type === 'error'
                  ? 'bg-red-50 border-red-500 text-red-800'
                  : 'bg-blue-50 border-blue-500 text-blue-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 ${
                  notification.type === 'success' ? 'text-green-500' :
                  notification.type === 'error' ? 'text-red-500' :
                  'text-blue-500'
                }`}>
                  {notification.type === 'success' && <CheckCircleIcon className="h-5 w-5" />}
                  {notification.type === 'error' && <AlertCircleIcon className="h-5 w-5" />}
                  {notification.type === 'info' && <AlertCircleIcon className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <p className="text-sm mt-0.5 opacity-90">{notification.message}</p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity p-1"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600 mt-1">Total Properties</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <BuildingIcon className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.withImages}</p>
              <p className="text-sm text-gray-600 mt-1">With Images</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <ImageIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.withoutImages}</p>
              <p className="text-sm text-gray-600 mt-1">Need Images</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircleIcon className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
              <p className="text-sm text-gray-600 mt-1">Available</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </motion.div>

      {/* Properties Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProperties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group relative"
          >
            {/* Quick Image Status */}
            <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
              property.images && property.images.length > 0 
                ? 'bg-green-500 text-white' 
                : 'bg-orange-500 text-white'
            }`}>
              {property.images?.length || 0} 📷
            </div>

            {/* Property Image/Placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-medium">No images uploaded</p>
                  <p className="text-gray-400 text-xs mt-1">Click upload to add images</p>
                </div>
              )}
              
              {/* Status Badge */}
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium capitalize shadow-sm ${
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
                onClick={() => handleOpenUploadModal(property)}
                className="flex-1 bg-purple-600 text-white py-2.5 px-4 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 text-sm font-medium group/btn shadow-lg shadow-purple-500/25"
              >
                <UploadIcon className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                <span>Upload Images</span>
              </button>
              
              <button 
                onClick={() => window.open(`/consumer/property/${property.id}`, '_blank')}
                className="px-4 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center text-sm font-medium shadow-sm"
                title="View property details"
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
          className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          <BuildingIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || statusFilter !== 'all' ? 'No properties found' : 'No Properties Yet'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
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
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/25 font-medium"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      )}

      {/* Image Upload Modal */}
      <PropertyImageUploadModal
        property={selectedProperty}
        isOpen={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onImagesUploaded={handleImagesUploaded}
        onUploadError={(error) => handleUploadError(error, selectedProperty?.title || 'Unknown property')}
      />
    </div>
  );
}