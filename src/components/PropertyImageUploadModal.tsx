// src/components/PropertyImageUploadModal.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const UploadIcon = dynamic(() => import('lucide-react').then(mod => mod.Upload));
const ImageIcon = dynamic(() => import('lucide-react').then(mod => mod.Image));
const XIcon = dynamic(() => import('lucide-react').then(mod => mod.X));
const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle));
const AlertCircleIcon = dynamic(() => import('lucide-react').then(mod => mod.AlertCircle));

interface Property {
  id: string;
  title: string;
  location: string;
  images: string[];
}

interface PropertyImageUploadModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onImagesUploaded: (imageUrls: string[], uploadedCount: number) => void;
  onUploadError: (error: string) => void;
}

export default function PropertyImageUploadModal({ 
  property, 
  isOpen, 
  onClose, 
  onImagesUploaded, 
  onUploadError 
}: PropertyImageUploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const resetState = () => {
    setUploading(false);
    setProgress(0);
    setUploadedCount(0);
    setDragActive(false);
    setSelectedFiles([]);
    setUploadedFiles([]);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleImageUpload = async (files: FileList) => {
    if (!property) return;
    
    try {
      setUploading(true);
      setUploadedCount(0);
      setProgress(0);
      setSelectedFiles(Array.from(files));

      const supabase = createClient();
      const uploadedUrls: string[] = [];

      // Get current property to preserve existing images
      const { data: currentProperty } = await supabase
        .from('properties')
        .select('images')
        .eq('id', property.id)
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
        const fileName = `${property.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

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
          setUploadedFiles(prev => [...prev, file.name]);
          setProgress(((i + 1) / files.length) * 100);

        } catch (fileError) {
          console.error(`Failed to upload ${file.name}:`, fileError);
          failedUploads++;
        }
      }

      // Show summary of upload results
      if (failedUploads > 0) {
        onUploadError(`${failedUploads} file${failedUploads > 1 ? 's' : ''} failed to upload.`);
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
        .eq('id', property.id);

      if (updateError) throw updateError;

      // Pass both the image URLs and count for better feedback
      onImagesUploaded(allImages, successfulUploads);
      
      // Auto-close after success with delay
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error: any) {
      console.error('Error uploading images:', error);
      onUploadError(error.message || 'Upload failed due to an unexpected error');
    } finally {
      setUploading(false);
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
    <AnimatePresence>
      {isOpen && property && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <UploadIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Upload Property Images</h2>
                    <p className="text-purple-100 text-sm">
                      {property.title} • {property.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  disabled={uploading}
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto">
                  
                  {/* Upload Area */}
                  <motion.div
                    className={`p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                      dragActive
                        ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg'
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
                        className="mx-auto w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner"
                      >
                        {uploading ? (
                          <div className="relative">
                            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center text-purple-600 font-bold text-lg"
                            >
                              {uploadedCount}
                            </motion.div>
                          </div>
                        ) : dragActive ? (
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          >
                            <UploadIcon className="w-10 h-10 text-purple-600" />
                          </motion.div>
                        ) : (
                          <ImageIcon className="w-10 h-10 text-purple-600" />
                        )}
                      </motion.div>
                      
                      {/* Dynamic Text Content */}
                      <motion.h3
                        key={uploading ? 'uploading' : 'ready'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-semibold text-gray-900 text-2xl mb-3"
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
                        className="text-gray-600 text-lg mb-6"
                      >
                        {uploading 
                          ? `Processing your images... ${Math.round(progress)}% complete`
                          : dragActive
                          ? 'Release to upload your images instantly'
                          : 'Drag & drop images here or click to browse files'
                        }
                      </motion.p>
                      
                      {/* File Input */}
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileInput}
                          disabled={uploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          id="property-image-upload-modal"
                        />
                        <motion.label
                          htmlFor="property-image-upload-modal"
                          whileHover={!uploading ? { scale: 1.02 } : {}}
                          whileTap={!uploading ? { scale: 0.98 } : {}}
                          className={`block w-full py-4 px-8 rounded-xl transition-all duration-200 font-semibold text-lg ${
                            uploading 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-inner' 
                              : 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer shadow-lg shadow-purple-500/25'
                          }`}
                        >
                          {uploading ? '🔄 Uploading...' : '📁 Choose Images to Upload'}
                        </motion.label>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      {uploading && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-8 space-y-4"
                        >
                          <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden">
                            <motion.div 
                              className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full relative"
                              style={{ width: `${progress}%` }}
                            >
                              <motion.div
                                animate={{ x: ['0%', '100%'] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              />
                            </motion.div>
                          </div>
                          <div className="flex justify-between text-base text-gray-600 font-medium">
                            <span>🔄 Processing files...</span>
                            <span>{Math.round(progress)}% Complete</span>
                          </div>
                          
                          {/* File List */}
                          {uploadedFiles.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-4 max-h-32 overflow-y-auto">
                              <p className="font-medium text-gray-700 mb-2">Uploaded files:</p>
                              <div className="space-y-1">
                                {uploadedFiles.map((fileName, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center space-x-2 text-sm text-green-600"
                                  >
                                    <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{fileName}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Feature Highlights */}
                      {!uploading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-8 grid grid-cols-3 gap-6 text-base text-gray-500"
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">📷</div>
                            <div className="font-semibold">Multiple Formats</div>
                            <div className="text-sm">JPG, PNG, WEBP</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl mb-2">🚀</div>
                            <div className="font-semibold">Fast Upload</div>
                            <div className="text-sm">10MB Max per file</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl mb-2">⚡</div>
                            <div className="font-semibold">Bulk Upload</div>
                            <div className="text-sm">Select multiple files</div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Current Images Preview */}
                  {property.images && property.images.length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-semibold text-gray-900 text-lg mb-4">
                        📁 Current Images ({property.images.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {property.images.slice(0, 8).map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Property image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg shadow-sm"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                          </div>
                        ))}
                        {property.images.length > 8 && (
                          <div className="bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-medium">
                            +{property.images.length - 8} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm">
                    {uploading 
                      ? 'Please wait while we upload your images...' 
                      : 'Select multiple images to upload at once'
                    }
                  </p>
                  <button
                    onClick={handleClose}
                    disabled={uploading}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {uploading ? 'Cancel Upload' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}