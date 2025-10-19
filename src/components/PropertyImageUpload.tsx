// src/components/PropertyImageUpload.tsx - COMPLETE & IMPROVED
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const UploadIcon = dynamic(() => import('lucide-react').then(mod => mod.Upload));
const ImageIcon = dynamic(() => import('lucide-react').then(mod => mod.Image));
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle));

interface PropertyImageUploadProps {
  propertyId: string;
  onImagesUploaded: (imageUrls: string[]) => void;
}

export default function PropertyImageUpload({ propertyId, onImagesUploaded }: PropertyImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setUploadedCount(0);
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const supabase = createClient();
      const uploadedUrls: string[] = [];

      // Get current property to preserve existing images
      const { data: currentProperty } = await supabase
        .from('properties')
        .select('images')
        .eq('id', propertyId)
        .single();

      const existingImages = currentProperty?.images || [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, file);

        if (error) {
          console.error('Upload error:', error);
          alert(`Failed to upload "${file.name}": ${error.message}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
        setUploadedCount(i + 1);
        setProgress(((i + 1) / files.length) * 100);
      }

      if (uploadedUrls.length === 0) {
        alert('No images were successfully uploaded.');
        return;
      }

      // Combine existing images with new ones
      const allImages = [...existingImages, ...uploadedUrls];

      // Update property with combined image URLs
      const { error: updateError } = await supabase
        .from('properties')
        .update({ images: allImages })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      onImagesUploaded(allImages);
      
      // Success message
      alert(`🎉 Successfully uploaded ${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''}!`);

    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setProgress(0);
      setUploadedCount(0);
      // Reset file input
      if (event.target) event.target.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 border-2 border-dashed border-purple-300 rounded-2xl bg-purple-50/30 hover:bg-purple-50/50 transition-colors duration-300"
    >
      <div className="text-center">
        {/* Icon */}
        <motion.div
          animate={{ scale: uploading ? 0.9 : 1 }}
          className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4"
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <UploadIcon className="w-6 h-6 text-purple-600" />
          )}
        </motion.div>
        
        {/* Text Content */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2">
          {uploading ? 'Uploading Images...' : 'Upload Property Images'}
        </h3>
        <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
          {uploading 
            ? `Uploading ${uploadedCount} image${uploadedCount !== 1 ? 's' : ''}... Please don't close this window.`
            : 'Drag and drop images here, or click to browse. Supports JPG, PNG, WEBP.'
          }
        </p>
        
        {/* File Input */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="property-image-upload"
          />
          <label
            htmlFor="property-image-upload"
            className={`block w-full py-4 px-6 border-2 border-dashed border-purple-400 rounded-xl transition-all duration-200 ${
              uploading 
                ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                : 'bg-white hover:bg-purple-50 hover:border-purple-500 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-center space-x-2 text-purple-700">
              <ImageIcon className="h-5 w-5" />
              <span className="font-medium">
                {uploading ? 'Uploading...' : 'Choose Images'}
              </span>
            </div>
          </label>
        </div>
        
        {/* Progress Bar */}
        {uploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 space-y-2"
          >
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Uploading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>
        )}

        {/* Help Text */}
        {!uploading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-500 mt-4"
          >
            📷 Supports JPG, PNG, WEBP • 🚀 Max 10MB per image • ⚡ Multiple selection allowed
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}