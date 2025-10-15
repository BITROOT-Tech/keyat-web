// src/components/consumer/Sidebar.tsx - COMPLETE & ENHANCED
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

interface SidebarProps {
  user?: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      icon: HomeIcon,
      label: 'Dashboard',
      href: '/consumer/dashboard',
      active: pathname === '/consumer/dashboard',
      description: 'Overview'
    },
    {
      icon: SearchIcon,
      label: 'Property Search',
      href: '/consumer/search',
      active: pathname?.startsWith('/consumer/search'),
      description: 'Find homes',
      badge: 'New'
    },
    {
      icon: MapIcon,
      label: 'Explore Map',
      href: '/consumer/explore',
      active: pathname?.startsWith('/consumer/explore'),
      description: 'Location view'
    },
    {
      icon: HeartIcon,
      label: 'Saved Properties',
      href: '/consumer/saved',
      active: pathname?.startsWith('/consumer/saved'),
      description: 'Your favorites'
    },
    {
      icon: CalendarIcon,
      label: 'My Bookings',
      href: '/consumer/booking',
      active: pathname?.startsWith('/consumer/booking'),
      description: 'Viewings & tours'
    },
    {
      icon: TrendingUpIcon,
      label: 'Search History',
      href: '/consumer/history',
      active: pathname?.startsWith('/consumer/history'),
      description: 'Recent searches'
    },
    {
      icon: BellIcon,
      label: 'Notifications',
      href: '/consumer/notifications',
      active: pathname?.startsWith('/consumer/notifications'),
      description: 'Alerts & updates'
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
      {/* Sidebar component */}
      <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
        {/* Sidebar header */}
        <div className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b border-gray-200">
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
        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
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

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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
                    <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              </div>
            </motion.button>
          ))}
        </nav>

        {/* Footer section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => router.push('/consumer/settings')}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
              pathname?.startsWith('/consumer/settings')
                ? 'bg-gray-50 text-gray-700 border border-gray-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="p-2 rounded-lg bg-gray-100">
              <SettingsIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Settings</p>
              <p className="text-xs text-gray-500 mt-0.5">Preferences</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 text-red-600 hover:bg-red-50"
          >
            <div className="p-2 rounded-lg bg-red-100">
              <LogOutIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Sign Out</p>
              <p className="text-xs text-red-500 mt-0.5">Log out of account</p>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}