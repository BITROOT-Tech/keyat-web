// src/components/admin/Header.tsx - COMPLETE PRODUCTION VERSION
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load icons
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const BellIcon = dynamic(() => import('lucide-react').then(mod => mod.Bell));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const LogOutIcon = dynamic(() => import('lucide-react').then(mod => mod.LogOut));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const BarChart3Icon = dynamic(() => import('lucide-react').then(mod => mod.BarChart3));
const MenuIcon = dynamic(() => import('lucide-react').then(mod => mod.Menu));
const RefreshCwIcon = dynamic(() => import('lucide-react').then(mod => mod.RefreshCw));

interface AdminHeaderProps {
  user?: any;
  notifications?: number;
}

export default function AdminHeader({ user, notifications = 0 }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  const handleRefresh = () => {
    setRefreshing(true);
    // Dispatch custom event for dashboard to refresh
    window.dispatchEvent(new CustomEvent('refreshDashboard'));
    // Also do a hard refresh if on current page
    if (pathname === '/admin/dashboard') {
      window.location.reload();
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Admin-specific menu options
  const adminMenuOptions = [
    { 
      icon: BarChart3Icon, 
      label: 'Dashboard', 
      action: () => handleQuickAction('/admin/dashboard'),
      description: 'Analytics overview',
      active: pathname === '/admin/dashboard'
    },
    { 
      icon: BuildingIcon, 
      label: 'Properties', 
      action: () => handleQuickAction('/admin/properties'),
      description: 'Manage all listings',
      active: pathname?.startsWith('/admin/properties')
    },
    { 
      icon: UsersIcon, 
      label: 'Users', 
      action: () => handleQuickAction('/admin/users'),
      description: 'User management',
      active: pathname?.startsWith('/admin/users')
    },
    { 
      icon: BellIcon, 
      label: 'Notifications', 
      action: () => handleQuickAction('/admin/notifications'),
      description: `${notifications} pending`,
      badge: notifications > 0 ? notifications.toString() : undefined,
      active: pathname?.startsWith('/admin/notifications')
    },
  ];

  const mobileMenuOptions = [
    { 
      icon: BarChart3Icon, 
      label: 'Dashboard', 
      action: () => handleQuickAction('/admin/dashboard'),
      active: pathname === '/admin/dashboard'
    },
    { 
      icon: BuildingIcon, 
      label: 'Properties', 
      action: () => handleQuickAction('/admin/properties'),
      active: pathname?.startsWith('/admin/properties')
    },
    { 
      icon: UsersIcon, 
      label: 'Users', 
      action: () => handleQuickAction('/admin/users'),
      active: pathname?.startsWith('/admin/users')
    },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-50 safe-area-top"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Mobile Menu */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            {isMobile && (
              <div className="relative mr-2" ref={mobileMenuRef}>
                <motion.button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Admin menu"
                >
                  <MenuIcon className="h-5 w-5 text-gray-600" />
                </motion.button>

                <AnimatePresence>
                  {showMobileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/80 py-2 z-50"
                    >
                      {user && (
                        <>
                          <div className="px-4 py-3 border-b border-gray-200/80">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">A</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">
                                  {user?.first_name || 'Admin'}
                                </p>
                                <p className="text-gray-600 text-xs truncate">Administrator</p>
                              </div>
                            </div>
                          </div>

                          <div className="py-1">
                            {mobileMenuOptions.map(({ icon: Icon, label, action, active }) => (
                              <motion.button
                                key={label}
                                onClick={action}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                                  active 
                                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className={`p-2 rounded-lg ${
                                  active ? 'bg-purple-100' : 'bg-gray-100'
                                }`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span className="font-medium">{label}</span>
                              </motion.button>
                            ))}
                          </div>

                          {/* Mobile Logout */}
                          <div className="border-t border-gray-200/80 mt-1 pt-1">
                            <motion.button
                              onClick={handleLogout}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <div className="p-2 rounded-lg bg-red-100">
                                <LogOutIcon className="h-4 w-4" />
                              </div>
                              <span className="font-medium">Sign Out</span>
                            </motion.button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Brand */}
            <motion.button
              onClick={() => router.push('/admin/dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900 leading-none">Keyat</h1>
                <p className="text-gray-500 text-xs leading-none mt-0.5">Admin</p>
              </div>
            </motion.button>
          </div>

          {/* Right: User Controls */}
          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Refresh data"
            >
              <RefreshCwIcon className={`h-5 w-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>

            {/* Notifications */}
            <motion.button
              onClick={() => router.push('/admin/notifications')}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

            {/* User Menu */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Admin menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  {!isMobile && (
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.first_name || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/80 py-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200/80">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">A</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {user?.first_name || 'Administrator'}
                            </p>
                            <p className="text-gray-600 text-xs truncate">
                              {user?.email}
                            </p>
                            <p className="text-green-600 text-xs font-medium mt-0.5">
                              ● Super Admin
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Admin Menu Options */}
                      <div className="py-1">
                        {adminMenuOptions.map(({ icon: Icon, label, action, description, badge, active }) => (
                          <motion.button
                            key={label}
                            onClick={action}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors group ${
                              active ? 'bg-purple-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`p-2 rounded-lg transition-colors ${
                              active 
                                ? 'bg-purple-100 group-hover:bg-purple-200' 
                                : 'bg-gray-100 group-hover:bg-white'
                            }`}>
                              <Icon className="h-4 w-4 flex-shrink-0" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center justify-between">
                                <span className={`font-medium truncate ${active ? 'text-purple-700' : 'text-gray-700'}`}>
                                  {label}
                                </span>
                                {badge && (
                                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                                    {badge}
                                  </span>
                                )}
                              </div>
                              {description && (
                                <p className={`text-xs truncate mt-0.5 ${
                                  active ? 'text-purple-600' : 'text-gray-500'
                                }`}>
                                  {description}
                                </p>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      {/* Settings & Logout */}
                      <div className="border-t border-gray-200/80 mt-1 space-y-1">
                        <motion.button
                          onClick={() => handleQuickAction('/admin/settings')}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-white transition-colors">
                            <SettingsIcon className="h-4 w-4 flex-shrink-0" />
                          </div>
                          <span className="font-medium truncate">Settings</span>
                        </motion.button>

                        <motion.button
                          onClick={handleLogout}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
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
      </div>
    </motion.header>
  );
}