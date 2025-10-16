// lib/supabase/properties.ts
import { createClient } from './client';

export interface PropertyFilters {
  searchQuery?: string;
  locations?: string[];
  priceRange?: { min?: number; max?: number };
  bedrooms?: number;
  propertyTypes?: string[];
  amenities?: string[];
}

export async function getFeaturedProperties(limit: number = 6) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'available')
      .eq('listing_type', 'rent')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

export async function searchProperties(filters: PropertyFilters = {}, sortBy: string = 'relevance') {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'available')
      .eq('listing_type', 'rent');

    // Apply search filter
    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%`);
    }

    // Apply location filters
    if (filters.locations && filters.locations.length > 0) {
      query = query.in('location', filters.locations);
    }

    // Apply price range filters
    if (filters.priceRange?.min) {
      query = query.gte('price', filters.priceRange.min);
    }
    if (filters.priceRange?.max) {
      query = query.lte('price', filters.priceRange.max);
    }

    // Apply bedroom filter
    if (filters.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms);
    }

    // Apply property type filters
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      query = query.in('type', filters.propertyTypes);
    }

    // Apply amenities filter (if features array exists)
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(amenity => {
        query = query.contains('features', [amenity]);
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'featured':
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        break;
      default:
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
}

export async function getPropertyById(id: string) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        landlord:profiles!landlord_id(first_name, last_name, phone, id_verified),
        agent:profiles!agent_id(first_name, last_name, phone, id_verified)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    throw error;
  }
}

export async function getPropertyLocations() {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('properties')
      .select('location')
      .eq('status', 'available');

    if (error) throw error;
    
    // Extract unique locations
    const locations = [...new Set(data?.map(property => property.location).filter(Boolean))];
    return locations.sort();
  } catch (error) {
    console.error('Error fetching property locations:', error);
    return [];
  }
}

export async function getPropertyTypes() {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('properties')
      .select('type')
      .eq('status', 'available');

    if (error) throw error;
    
    // Extract unique types
    const types = [...new Set(data?.map(property => property.type).filter(Boolean))];
    return types.sort();
  } catch (error) {
    console.error('Error fetching property types:', error);
    return [];
  }
}