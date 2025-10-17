// src/components/consumer/Header.tsx - OPTIMIZED VERSION
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
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const LogOutIcon = dynamic(() => import('lucide-react').then(mod => mod.LogOut));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const TrendingUpIcon = dynamic(() => import('lucide-react').then(mod => mod.TrendingUp));
const MenuIcon = dynamic(() => import('lucide-react').then(mod => mod.Menu));

interface ConsumerHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickSearch: () => void;
  notifications?: number;
  user?: any;
  showLocationFilter?: boolean;
  onLocationFilterClick?: () => void;
}

export default function ConsumerHeader({ 
  searchQuery, 
  onSearchChange, 
  onQuickSearch, 
  notifications = 0,
  user,
  showLocationFilter = false,
  onLocationFilterClick
}: ConsumerHeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onQuickSearch();
      searchRef.current?.blur();
    }
  };

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const handleQuickAction = (path: string) => {
    router.push(path);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  // 🎯 OPTIMIZED: User menu options (account management only)
  const userMenuOptions = [
    { 
      icon: UserIcon, 
      label: 'My Profile', 
      action: () => handleQuickAction('/consumer/profile'),
      description: 'Personal information'
    },
    { 
      icon: BellIcon, 
      label: 'Notifications', 
      action: () => handleQuickAction('/consumer/notifications'),
      description: `${notifications} new alerts`,
      badge: notifications > 0 ? notifications.toString() : undefined
    },
    { 
      icon: CalendarIcon, 
      label: 'My Tours', 
      action: () => handleQuickAction('/consumer/tours'),
      description: 'Viewing schedule'
    },
    { 
      icon: HeartIcon, 
      label: 'Favorites', 
      action: () => handleQuickAction('/consumer/saved'),
      description: 'Saved properties'
    },
    { 
      icon: TrendingUpIcon, 
      label: 'Trending', 
      action: () => handleQuickAction('/consumer/trending'),
      description: 'Popular areas'
    },
    { 
      icon: SettingsIcon, 
      label: 'Settings', 
      action: () => handleQuickAction('/consumer/settings'),
      description: 'Preferences'
    },
  ];

  // 🎯 OPTIMIZED: Mobile menu (user account actions only - no navigation redundancy)
  const mobileMenuOptions = [
    { 
      icon: UserIcon, 
      label: 'My Profile', 
      action: () => handleQuickAction('/consumer/profile')
    },
    { 
      icon: BellIcon, 
      label: 'Notifications', 
      action: () => handleQuickAction('/consumer/notifications'),
      badge: notifications > 0 ? notifications.toString() : undefined
    },
    { 
      icon: SettingsIcon, 
      label: 'Settings', 
      action: () => handleQuickAction('/consumer/settings')
    },
  ];

  // Quick search suggestions
  const searchSuggestions = [
    { label: 'Apartments in CBD', query: 'apartment CBD Gaborone' },
    { label: 'Houses in Phakalane', query: 'house Phakalane' },
    { label: '2 Bedroom flats', query: '2 bedroom flat' },
    { label: 'Pet friendly', query: 'pet friendly' },
    { label: 'With parking', query: 'parking included' }
  ];

  const handleSuggestionClick = (query: string) => {
    onSearchChange(query);
    setTimeout(() => {
      onQuickSearch();
      setSearchFocused(false);
    }, 100);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-40 safe-area-top"
    >
      <div className="px-4 py-3">
        {/* TOP ROW - BRAND & USER CONTROLS */}
        <div className="flex items-center justify-between mb-3">
          {/* BRAND/LOGO */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => router.push('/consumer/home')}
              className="flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <HomeIcon className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900 leading-none">Keyat</h1>
                <p className="text-gray-500 text-xs leading-none mt-0.5">Rentals</p>
              </div>
            </button>
          </motion.div>

          {/* USER CONTROLS */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            {/* MOBILE HAMBURGER MENU */}
            {isMobile && (
              <div className="relative" ref={mobileMenuRef}>
                <motion.button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                  aria-label="Account menu"
                >
                  <MenuIcon className="h-5 w-5 text-gray-600" />
                </motion.button>

                <AnimatePresence>
                  {showMobileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/80 py-2 z-50"
                    >
                      {/* USER INFO HEADER */}
                      {user && (
                        <>
                          <div className="px-4 py-3 border-b border-gray-200/80">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">
                                  {user?.first_name || 'User'}
                                </p>
                                <p className="text-gray-600 text-xs truncate">
                                  {user?.email}
                                </p>
                                <p className="text-green-600 text-xs font-medium mt-0.5">
                                  ● Active now
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 🎯 OPTIMIZED: Mobile menu options (account actions only) */}
                          <div className="py-1">
                            {mobileMenuOptions.map(({ icon: Icon, label, action, badge }) => (
                              <motion.button
                                key={label}
                                onClick={action}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation group relative"
                              >
                                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-white transition-colors">
                                  <Icon className="h-4 w-4 flex-shrink-0" />
                                </div>
                                <span className="font-medium truncate">{label}</span>
                                {badge && (
                                  <span className="absolute right-4 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                                    {badge}
                                  </span>
                                )}
                              </motion.button>
                            ))}
                          </div>

                          <div className="border-t border-gray-200/80 my-1" />

                          {/* LOGOUT */}
                          <motion.button
                            onClick={handleLogout}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors touch-manipulation group"
                          >
                            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                              <LogOutIcon className="h-4 w-4 flex-shrink-0" />
                            </div>
                            <span className="font-medium truncate">Sign Out</span>
                          </motion.button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* MOBILE SEARCH TOGGLE */}
            {isMobile && (
              <motion.button
                onClick={() => searchRef.current?.focus()}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                aria-label="Search"
              >
                <SearchIcon className="h-5 w-5 text-gray-600" />
              </motion.button>
            )}

            {/* NOTIFICATIONS */}
            <motion.button
              onClick={() => router.push('/consumer/notifications')}
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

            {/* USER MENU - DESKTOP & MOBILE PROFILE AVATAR */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm relative">
                    <span className="text-white text-sm font-medium">
                      {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                    </span>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                </motion.button>

                {/* DESKTOP USER MENU */}
                {!isMobile && (
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/80 py-2 z-50"
                      >
                        {/* USER INFO HEADER */}
                        <div className="px-4 py-3 border-b border-gray-200/80">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">
                                {user?.first_name || 'User'}
                              </p>
                              <p className="text-gray-600 text-xs truncate">
                                {user?.email}
                              </p>
                              <p className="text-green-600 text-xs font-medium mt-0.5">
                                ● Active now
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 🎯 OPTIMIZED: User menu options */}
                        <div className="py-1 max-h-96 overflow-y-auto">
                          {userMenuOptions.map(({ icon: Icon, label, action, description, badge }) => (
                            <motion.button
                              key={label}
                              onClick={action}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation group"
                            >
                              <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-white transition-colors">
                                <Icon className="h-4 w-4 flex-shrink-0" />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium truncate">{label}</span>
                                  {badge && (
                                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                                      {badge}
                                    </span>
                                  )}
                                </div>
                                {description && (
                                  <p className="text-gray-500 text-xs truncate mt-0.5">
                                    {description}
                                  </p>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        {/* LOGOUT */}
                        <div className="border-t border-gray-200/80 mt-1">
                          <motion.button
                            onClick={handleLogout}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors touch-manipulation group"
                          >
                            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                              <LogOutIcon className="h-4 w-4 flex-shrink-0" />
                            </div>
                            <span className="font-medium truncate">Sign Out</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SEARCH BAR WITH SUGGESTIONS */}
        <div className="relative">
          <motion.div 
            className="relative"
            animate={{ scale: searchFocused ? 1.02 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search apartments, locations, amenities..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full pl-10 pr-20 py-3 bg-gray-100/80 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-500 touch-manipulation shadow-sm"
              aria-label="Search properties"
            />
            
            {/* SEARCH ACTIONS */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {showLocationFilter && onLocationFilterClick && (
                <motion.button
                  onClick={onLocationFilterClick}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors touch-manipulation"
                  aria-label="Filter by location"
                >
                  <MapPinIcon className="h-4 w-4 text-gray-600" />
                </motion.button>
              )}
              
              <motion.button
                onClick={onQuickSearch}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors touch-manipulation"
                aria-label="Search"
              >
                <SearchIcon className="h-4 w-4 text-white" />
              </motion.button>
            </div>
          </motion.div>

          {/* SEARCH SUGGESTIONS */}
          <AnimatePresence>
            {searchFocused && searchQuery.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200/80 py-2 z-30"
              >
                <div className="px-3 py-2 border-b border-gray-200/80">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Quick Searches
                  </p>
                </div>
                <div className="py-1">
                  {searchSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(suggestion.query)}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation"
                    >
                      <SearchIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{suggestion.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}