// src/components/PropertyImageUpload.tsx - WITH BETTER FEEDBACK
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const UploadIcon = dynamic(() => import('lucide-react').then(mod => mod.Upload));
const ImageIcon = dynamic(() => import('lucide-react').then(mod => mod.Image));
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle));
const AlertCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.AlertCircle));

interface PropertyImageUploadProps {
  propertyId: string;
  onImagesUploaded: (imageUrls: string[], uploadedCount: number) => void;
  onUploadError: (error: string) => void;
}

export default function PropertyImageUpload({ propertyId, onImagesUploaded, onUploadError }: PropertyImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = async (files: FileList) => {
    try {
      setUploading(true);
      setUploadedCount(0);
      setProgress(0);

      const supabase = createClient();
      const uploadedUrls: string[] = [];

      // Get current property to preserve existing images
      const { data: currentProperty } = await supabase
        .from('properties')
        .select('images')
        .eq('id', propertyId)
        .single();

      const existingImages = currentProperty?.images || [];

      let successfulUploads = 0;
      let failedUploads = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          console.warn(`File "${file.name}" is too large. Skipping.`);
          failedUploads++;
          continue;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.warn(`File "${file.name}" is not an image. Skipping.`);
          failedUploads++;
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        try {
          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from('property-images')
            .upload(fileName, file);

          if (error) {
            console.error('Upload error:', error);
            failedUploads++;
            continue;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          uploadedUrls.push(publicUrl);
          successfulUploads++;
          setUploadedCount(successfulUploads);
          setProgress(((i + 1) / files.length) * 100);

        } catch (fileError) {
          console.error(`Failed to upload ${file.name}:`, fileError);
          failedUploads++;
        }
      }

      // Show summary of upload results
      if (failedUploads > 0) {
        onUploadError(`${failedUploads} file${failedUploads > 1 ? 's' : ''} failed to upload. Check console for details.`);
      }

      if (uploadedUrls.length === 0) {
        onUploadError('No images were successfully uploaded. Please check file sizes and formats.');
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

      // Pass both the image URLs and count for better feedback
      onImagesUploaded(allImages, successfulUploads);

    } catch (error: any) {
      console.error('Error uploading images:', error);
      onUploadError(error.message || 'Upload failed due to an unexpected error');
    } finally {
      setUploading(false);
      setProgress(0);
      setUploadedCount(0);
      setDragActive(false);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ${
        dragActive
          ? 'border-purple-500 bg-purple-100 scale-105 shadow-lg'
          : uploading
          ? 'border-purple-300 bg-purple-50/50'
          : 'border-purple-300 bg-purple-50/30 hover:bg-purple-50/50 hover:border-purple-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="text-center">
        {/* Animated Icon */}
        <motion.div
          animate={{ 
            scale: uploading ? [1, 1.1, 1] : dragActive ? 1.1 : 1,
            rotate: dragActive ? 5 : 0
          }}
          transition={{ duration: 0.5, repeat: uploading ? Infinity : 0 }}
          className="mx-auto w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner"
        >
          {uploading ? (
            <div className="relative">
              <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center text-purple-600 text-xs font-bold"
              >
                {uploadedCount}
              </motion.div>
            </div>
          ) : dragActive ? (
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <UploadIcon className="w-8 h-8 text-purple-600" />
            </motion.div>
          ) : (
            <ImageIcon className="w-8 h-8 text-purple-600" />
          )}
        </motion.div>
        
        {/* Dynamic Text Content */}
        <motion.h3
          key={uploading ? 'uploading' : 'ready'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-gray-900 text-xl mb-2"
        >
          {uploading 
            ? `📤 Uploading ${uploadedCount} Image${uploadedCount !== 1 ? 's' : ''}...`
            : dragActive
            ? '🎉 Drop to Upload!'
            : '📸 Upload Property Images'
          }
        </motion.h3>

        <motion.p
          key={uploading ? 'uploading-desc' : 'ready-desc'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 text-sm mb-6 max-w-sm mx-auto"
        >
          {uploading 
            ? `Processing your images... ${Math.round(progress)}% complete`
            : dragActive
            ? 'Release to upload your images instantly'
            : 'Drag & drop images here or click to browse files'
          }
        </motion.p>
        
        {/* File Input with Enhanced Styling */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="property-image-upload"
          />
          <motion.label
            htmlFor="property-image-upload"
            whileHover={!uploading ? { scale: 1.02 } : {}}
            whileTap={!uploading ? { scale: 0.98 } : {}}
            className={`block w-full py-4 px-6 rounded-xl transition-all duration-200 font-medium ${
              uploading 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-inner' 
                : 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer shadow-lg shadow-purple-500/25'
            }`}
          >
            {uploading ? '🔄 Uploading...' : '📁 Choose Images'}
          </motion.label>
        </div>
        
        {/* Enhanced Progress Bar */}
        {uploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3"
          >
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <motion.div
                  animate={{ x: ['0%', '100%'] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>🔄 Processing files...</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
          </motion.div>
        )}

        {/* Feature Highlights */}
        {!uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid grid-cols-3 gap-3 text-xs text-gray-500"
          >
            <div className="text-center">
              <div className="font-semibold">📷</div>
              <div>JPG, PNG, WEBP</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">🚀</div>
              <div>10MB Max</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">⚡</div>
              <div>Bulk Upload</div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}