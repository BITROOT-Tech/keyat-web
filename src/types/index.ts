export type UserType = 'tenant' | 'landlord' | 'agent' | 'service_provider' | 'admin';

export type PropertyType = 'rental' | 'sale' | 'commercial' | 'land' | 'student_housing';

export type PropertyStatus = 'available' | 'booked' | 'maintenance' | 'inactive';

export interface Profile {
  id: string;
  user_type: UserType;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  property_type: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  location: string;
  city: string;
  landlord_id: string;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}
