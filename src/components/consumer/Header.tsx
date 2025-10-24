// src/components/consumer/Header.tsx - UPDATED WITH CONFIG
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { CONSUMER_NAV_CONFIG } from '@/lib/constants/navigation-consumer';

// Lazy load icons from config
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const BellIcon = dynamic(() => import('lucide-react').then(mod => mod.Bell));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const LogOutIcon = dynamic(() => import('lucide-react').then(mod => mod.LogOut));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));

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
  const [isMobile, setIsMobile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
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
  };

  // 🎯 USING CONFIG: User menu options
  const userMenuOptions = CONSUMER_NAV_CONFIG.USER_MENU_ITEMS.map(item => ({
    ...item,
    action: () => handleQuickAction(item.href),
    badge: item.label === 'Notifications' && notifications > 0 ? notifications.toString() : undefined
  }));

  // 🎯 USING CONFIG: Search suggestions
  const searchSuggestions = CONSUMER_NAV_CONFIG.SEARCH_SUGGESTIONS;

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
      <div className="px-4 py-3 lg:px-6">
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
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div className={`text-left ${isMobile ? 'block' : 'lg:hidden'}`}>
                <h1 className="text-xl font-bold text-gray-900 leading-none">Keyat</h1>
                <p className="text-gray-500 text-xs leading-none mt-0.5">Rentals</p>
              </div>
            </button>
          </motion.div>

          {/* DESKTOP PAGE TITLE */}
          {!isMobile && (
            <div className="flex-1 ml-6">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm">Welcome back, {user?.first_name || 'User'}</p>
            </div>
          )}

          {/* USER CONTROLS */}
          <div className="flex items-center space-x-2 flex-shrink-0">
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

            {/* USER MENU */}
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
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  
                  {!isMobile && (
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900 leading-none">
                        {user?.first_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 leading-none mt-0.5">
                        {user?.email?.split('@')[0]}
                      </p>
                    </div>
                  )}
                </motion.button>

                {/* USER MENU DROPDOWN */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/80 py-2 z-50"
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

                      {/* USER MENU OPTIONS FROM CONFIG */}
                      <div className="py-1">
                        {userMenuOptions.map(({ icon: Icon, label, action, description, badge }) => (
                          <motion.button
                            key={label}
                            onClick={action}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation group relative"
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
              </div>
            )}
          </div>
        </div>

        {/* SEARCH BAR */}
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
              placeholder={isMobile ? "Search properties..." : "Search apartments, locations, amenities..."}
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

          {/* SEARCH SUGGESTIONS FROM CONFIG */}
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