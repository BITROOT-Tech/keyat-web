// src/lib/constants/navigation-consumer.ts
'use client';

import {
  Home,
  Search,
  Calendar,
  Truck,
  Wrench,
  Heart,
  Map,
  TrendingUp,
  User,
  Bell,
  Settings,
  LogOut,
  MapPin,
  Menu,
  X,
  LucideIcon
} from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  description: string;
  activePaths: string[];
}

export interface UserMenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  description: string;
  action?: () => void;
  badge?: string;
}

export interface ConsumerNavConfig {
  CORE_NAV_ITEMS: NavItem[];
  SIDEBAR_EXTENSIONS: NavItem[];
  USER_MENU_ITEMS: UserMenuItem[];
  SEARCH_SUGGESTIONS: { label: string; query: string; }[];
}

export const CONSUMER_NAV_CONFIG: ConsumerNavConfig = {
  CORE_NAV_ITEMS: [
    { 
      icon: Search, 
      label: 'Search', 
      href: '/consumer/search',
      description: 'Find properties',
      activePaths: ['/consumer/search', '/consumer/property']
    },
    { 
      icon: Calendar, 
      label: 'Tours', 
      href: '/consumer/tours',
      description: 'Schedule viewings',
      activePaths: ['/consumer/tours']
    },
    { 
      icon: Home, 
      label: 'Home', 
      href: '/consumer/home',
      description: 'Dashboard',
      activePaths: ['/consumer/home']
    },
    { 
      icon: Truck, 
      label: 'Move-in', 
      href: '/consumer/move-in',
      description: 'Moving services',
      activePaths: ['/consumer/move-in']
    },
    { 
      icon: Wrench, 
      label: 'Services', 
      href: '/consumer/services',
      description: 'Home maintenance',
      activePaths: ['/consumer/services']
    }
  ],

  SIDEBAR_EXTENSIONS: [
    { 
      icon: Heart, 
      label: 'Favorites', 
      href: '/consumer/saved',
      description: 'Saved properties',
      activePaths: ['/consumer/saved']
    },
    { 
      icon: Map, 
      label: 'Explore', 
      href: '/consumer/explore',
      description: 'Map view',
      activePaths: ['/consumer/explore']
    },
    { 
      icon: TrendingUp, 
      label: 'Trending', 
      href: '/consumer/trending',
      description: 'Popular areas',
      activePaths: ['/consumer/trending']
    }
  ],

  USER_MENU_ITEMS: [
    { 
      icon: User, 
      label: 'My Profile', 
      href: '/consumer/profile',
      description: 'Personal information'
    },
    { 
      icon: Heart, 
      label: 'Favorites', 
      href: '/consumer/saved',
      description: 'Saved properties'
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      href: '/consumer/notifications',
      description: 'Alerts and updates'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      href: '/consumer/settings',
      description: 'Preferences'
    }
  ],

  SEARCH_SUGGESTIONS: [
    { label: 'Apartments in CBD', query: 'apartment CBD Gaborone' },
    { label: 'Houses in Phakalane', query: 'house Phakalane' },
    { label: '2 Bedroom flats', query: '2 bedroom flat' },
    { label: 'Pet friendly', query: 'pet friendly' },
    { label: 'With parking', query: 'parking included' }
  ]
};

export const isActiveNavItem = (currentPath: string, activePaths: string[]): boolean => {
  if (!currentPath) return false;
  if (activePaths.includes('/consumer/home')) {
    return currentPath === '/consumer/home';
  }
  return activePaths.some(path => currentPath.startsWith(path));
};

export const getActiveState = (currentPath: string, item: NavItem): boolean => {
  return isActiveNavItem(currentPath, item.activePaths);
};