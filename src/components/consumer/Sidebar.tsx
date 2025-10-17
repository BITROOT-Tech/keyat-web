// src/components/consumer/Sidebar.tsx - FIXED WITH EXPLICIT HEIGHTS
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load icons
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const MapIcon = dynamic(() => import('lucide-react').then(mod => mod.Map));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const TrendingUpIcon = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp));
const BellIcon = dynamic(() => import('lucide-react').then(mod => mod.Bell));
const LogOutIcon = dynamic(() => import('lucide-react').then(mod => mod.LogOut));
const TruckIcon = dynamic(() => import('lucide-react').then(mod => mod.Truck));
const WrenchIcon = dynamic(() => import('lucide-react').then(mod => mod.Wrench));

interface SidebarProps {
  user?: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 🎯 UPDATED NAV ITEMS TO MATCH BOTTOM NAV STRUCTURE
  const navItems = [
    {
      icon: HomeIcon,
      label: 'Home',
      href: '/consumer/home',
      active: pathname === '/consumer/home',
      description: 'Dashboard overview'
    },
    {
      icon: SearchIcon,
      label: 'Search',
      href: '/consumer/search',
      active: pathname?.startsWith('/consumer/search') || pathname?.startsWith('/consumer/property'),
      description: 'Find properties',
      badge: 'New'
    },
    {
      icon: CalendarIcon,
      label: 'Tours',
      href: '/consumer/tours',
      active: pathname?.startsWith('/consumer/tours'),
      description: 'Schedule viewings'
    },
    {
      icon: TruckIcon,
      label: 'Move-in',
      href: '/consumer/move-in',
      active: pathname?.startsWith('/consumer/move-in'),
      description: 'Moving services',
      badge: 'Hot'
    },
    {
      icon: WrenchIcon,
      label: 'Services',
      href: '/consumer/services',
      active: pathname?.startsWith('/consumer/services'),
      description: 'Home maintenance'
    },
    {
      icon: HeartIcon,
      label: 'Favorites',
      href: '/consumer/saved',
      active: pathname?.startsWith('/consumer/saved'),
      description: 'Saved properties'
    },
    {
      icon: MapIcon,
      label: 'Explore',
      href: '/consumer/explore',
      active: pathname?.startsWith('/consumer/explore'),
      description: 'Map view'
    },
    {
      icon: TrendingUpIcon,
      label: 'Trending',
      href: '/consumer/trending',
      active: pathname?.startsWith('/consumer/trending'),
      description: 'Popular areas'
    },
  ];

  const secondaryItems = [
    {
      icon: BellIcon,
      label: 'Notifications',
      href: '/consumer/notifications',
      active: pathname?.startsWith('/consumer/notifications'),
      description: 'Alerts & updates'
    },
    {
      icon: UserIcon,
      label: 'Profile',
      href: '/consumer/profile',
      active: pathname?.startsWith('/consumer/profile'),
      description: 'Account settings'
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40"
    >
      {/* 🎯 FIXED: Simple height-based layout */}
      <div className="flex flex-col h-full bg-white/95 backdrop-blur-sm border-r border-gray-200/80">
        
        {/* Top sections - fixed small height */}
        <div className="h-32"> {/* ~128px fixed height */}
          {/* Sidebar header */}
          <div className="px-6 py-4 border-b border-gray-200/80">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <HomeIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Keyat</h1>
                <p className="text-xs text-gray-500">Rentals</p>
              </div>
            </div>
          </div>

          {/* User welcome section */}
          <div className="px-6 py-3 border-b border-gray-200/80 bg-blue-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {user?.first_name || 'Welcome back'}
                </p>
                <p className="text-gray-600 text-xs truncate">
                  {user?.email || 'Ready to find your home?'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 🎯 FIXED: Main Navigation - TALL section with explicit height */}
        <div className="flex-1 overflow-y-auto min-h-0"> {/* Takes remaining space */}
          <div className="px-4 py-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
              Main Navigation
            </h3>
            <div className="space-y-2">
              {navItems.map(({ icon: Icon, label, href, active, description, badge }) => (
                <motion.button
                  key={label}
                  onClick={() => handleNavigation(href)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 touch-manipulation ${
                    active
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    active ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{label}</p>
                      {badge && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                          badge === 'Hot' 
                            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                            : 'bg-amber-500 text-white'
                        }`}>
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* 🎯 FIXED: Bottom sections - SMALL fixed height */}
        <div className="h-48 flex-shrink-0"> {/* ~192px fixed height */}
          {/* Account section - COMPACT */}
          <div className="px-4 py-3 border-t border-gray-200/80">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Account
            </h3>
            <div className="space-y-1">
              {secondaryItems.map(({ icon: Icon, label, href, active, description }) => (
                <motion.button
                  key={label}
                  onClick={() => handleNavigation(href)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    active
                      ? 'bg-gray-50 text-gray-700 border border-gray-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-gray-100">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Footer section - COMPACT */}
          <div className="p-3 border-t border-gray-200/80 space-y-1 bg-gray-50/50">
            <button
              onClick={() => router.push('/consumer/settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                pathname?.startsWith('/consumer/settings')
                  ? 'bg-gray-100 text-gray-700 border border-gray-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-gray-200">
                <SettingsIcon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Settings</p>
                <p className="text-xs text-gray-500">Preferences</p>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50"
            >
              <div className="p-1.5 rounded-lg bg-red-100">
                <LogOutIcon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Sign Out</p>
                <p className="text-xs text-red-500">Log out of account</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}