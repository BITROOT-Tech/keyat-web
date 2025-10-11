// lib/constants.ts - Application constants

export const USER_ROLES = {
  TENANT: 'tenant',
  LANDLORD: 'landlord', 
  AGENT: 'agent',
  SERVICE: 'service',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const PROPERTY_TYPES = {
  APARTMENT: 'apartment',
  HOUSE: 'house',
  TOWNHOUSE: 'townhouse',
  CONDO: 'condo',
  COMMERCIAL: 'commercial'
} as const;

export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  RENTED: 'rented', 
  MAINTENANCE: 'maintenance',
  UNAVAILABLE: 'unavailable'
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed', 
  CANCELLED: 'cancelled'
} as const;

export const BOTSWANA_CITIES = [
  'Gaborone',
  'Francistown', 
  'Molepolole',
  'Maun',
  'Serowe',
  'Selibe Phikwe',
  'Kanye',
  'Mahalapye',
  'Mochudi',
  'Lobatse'
];

export const AMENITIES = [
  'pool',
  'gym',
  'parking',
  'security',
  'wifi',
  'air_conditioning',
  'furnished',
  'garden',
  'balcony',
  'elevator'
];

export const SERVICE_TYPES = [
  'moving_services',
  'cleaning',
  'maintenance', 
  'plumbing',
  'electrical',
  'painting',
  'pest_control'
];

// Test account constants for easy reference
export const TEST_ACCOUNTS = {
  TENANT: {
    email: 'tenant@keyat.co.bw',
    password: 'Password123!',
    id: '11111111-1111-1111-1111-111111111111'
  },
  LANDLORD: {
    email: 'landlord@keyat.co.bw',
    password: 'Password123!', 
    id: '22222222-2222-2222-2222-222222222222'
  },
  AGENT: {
    email: 'agent@keyat.co.bw',
    password: 'Password123!',
    id: '33333333-3333-3333-3333-333333333333'
  },
  SERVICE: {
    email: 'service@keyat.co.bw',
    password: 'Password123!',
    id: '44444444-4444-4444-4444-444444444444'
  },
  ADMIN: {
    email: 'admin@keyat.co.bw',
    password: 'Password123!',
    id: '55555555-5555-5555-5555-555555555555'
  }
} as const;