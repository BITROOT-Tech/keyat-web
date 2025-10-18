// src/components/PropertyImageUpload.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PropertyImageUploadProps {
  propertyId: string;
  onImagesUploaded: (imageUrls: string[]) => void;
}

export default function PropertyImageUpload({ propertyId, onImagesUploaded }: PropertyImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const supabase = createClient();
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${propertyId}/${Math.random()}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
        setProgress(((i + 1) / files.length) * 100);
      }

      // Update property with image URLs
      const { error: updateError } = await supabase
        .from('properties')
        .update({ images: uploadedUrls })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      onImagesUploaded(uploadedUrls);
      alert('Images uploaded successfully!');

    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-3">Upload Property Images</h3>
      
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      {uploading && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Uploading... {Math.round(progress)}%</p>
        </div>
      )}
    </div>
  );
}