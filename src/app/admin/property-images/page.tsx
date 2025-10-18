// src/app/admin/property-images/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import PropertyImageUpload from '@/components/PropertyImageUpload';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
}

export default function PropertyImagesAdmin() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string>('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, location, price, images')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const handleImagesUploaded = () => {
    fetchProperties(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">Loading properties...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Property Images</h1>
        
        {/* Property Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Property to Add Images
          </label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a property...</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.title} - {property.location} (P{property.price})
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload for Selected Property */}
        {selectedProperty && (
          <div className="mb-8">
            <PropertyImageUpload 
              propertyId={selectedProperty}
              onImagesUploaded={handleImagesUploaded}
            />
          </div>
        )}

        {/* Properties List with Images */}
        <div className="grid gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                  <p className="text-gray-600">{property.location} • P{property.price}</p>
                </div>
                <button
                  onClick={() => setSelectedProperty(property.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Images
                </button>
              </div>

              {/* Display Existing Images */}
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`${property.title} image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No images uploaded yet</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}