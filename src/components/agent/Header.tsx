'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load icons
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const BellIcon = dynamic(() => import('lucide-react').then(mod => mod.Bell));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const TargetIcon = dynamic(() => import('lucide-react').then(mod => mod.Target));
const LogOutIcon = dynamic(() => import('lucide-react').then(mod => mod.LogOut));

interface AgentHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickSearch: () => void;
  notifications?: number;
  user?: any;
}

export default function AgentHeader({ 
  searchQuery, 
  onSearchChange, 
  onQuickSearch, 
  notifications = 0,
  user 
}: AgentHeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check screen size for desktop user menu
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onQuickSearch();
    }
  };

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const userMenuOptions = [
    { icon: UserIcon, label: 'My Profile', action: () => router.push('/agent/profile') },
    { icon: BuildingIcon, label: 'Listings', action: () => router.push('/agent/properties') },
    { icon: DollarSignIcon, label: 'Commissions', action: () => router.push('/agent/commissions') },
    { icon: UsersIcon, label: 'Clients', action: () => router.push('/agent/clients') },
    { icon: TargetIcon, label: 'Performance', action: () => router.push('/agent/performance') },
    { icon: SettingsIcon, label: 'Settings', action: () => router.push('/agent/settings') },
    { icon: LogOutIcon, label: 'Sign Out', action: handleLogout, destructive: true }
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-30 safe-area-top"
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          {/* BRAND/LOGO */}
          <div className="flex-shrink-0">
            <motion.h1 
              className="text-xl font-bold text-gray-900"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Keyat
            </motion.h1>
          </div>

          {/* DESKTOP: User Menu | MOBILE: Notifications Only */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <motion.button
              onClick={() => router.push('/agent/notifications')}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                />
              )}
            </motion.button>

            {/* DESKTOP USER MENU */}
            {!isMobile && user && (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-medium">
                      {user?.first_name?.[0] || user?.email?.[0] || 'A'}
                    </span>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/80 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-200/80">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {user?.first_name || 'Agent'}
                        </p>
                        <p className="text-gray-600 text-xs truncate">
                          {user?.email}
                        </p>
                        {user?.license_number && (
                          <p className="text-gray-500 text-xs mt-1">
                            License: {user.license_number}
                          </p>
                        )}
                      </div>

                      <div className="py-1">
                        {userMenuOptions.map(({ icon: Icon, label, action, destructive }) => (
                          <motion.button
                            key={label}
                            onClick={() => {
                              action();
                              setShowUserMenu(false);
                            }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors touch-manipulation ${
                              destructive 
                                ? 'text-red-600 hover:bg-red-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* SEARCH BAR - PRIMARY ACTION */}
        <motion.div 
          className="relative"
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties, clients, locations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full pl-10 pr-4 py-3 bg-gray-100/80 border-0 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all placeholder-gray-500 touch-manipulation shadow-sm"
            aria-label="Search properties and clients"
          />
        </motion.div>
      </div>
    </motion.header>
  );
}