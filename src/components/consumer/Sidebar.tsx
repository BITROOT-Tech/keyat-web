// src/components/consumer/Sidebar.tsx - OPTIMIZED
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CONSUMER_NAV_CONFIG, getActiveState } from '@/lib/constants/navigation-consumer';

// Lazy load icons
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const FileTextIcon = dynamic(() => import('lucide-react').then(mod => mod.FileText));
const MessageSquareIcon = dynamic(() => import('lucide-react').then(mod => mod.MessageSquare));
const LogOutIcon = dynamic(() => import('lucide-react').then(mod => mod.LogOut));
const MenuIcon = dynamic(() => import('lucide-react').then(mod => mod.Menu));
const XIcon = dynamic(() => import('lucide-react').then(mod => mod.X));

interface SidebarProps {
  user?: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileSidebarOpen]);

  // 🎯 USING CONFIG: Navigation items - Only primary navigation
  const navItems = [
    ...CONSUMER_NAV_CONFIG.CORE_NAV_ITEMS,
    ...CONSUMER_NAV_CONFIG.SIDEBAR_EXTENSIONS
  ].map(item => ({
    ...item,
    active: getActiveState(pathname, item)
  }));

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    setMobileSidebarOpen(false);
  };

  // Sidebar content component
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-white/95 backdrop-blur-sm border-r border-gray-200/80 ${
      isMobile ? 'w-80' : ''
    }`}>
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <HomeIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Keyat</h1>
              <p className="text-xs text-gray-500">Rentals</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XIcon className="h-5 w-5 text-gray-600" />
            </button>
          )}
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

      {/* Main Navigation - Only Primary Items */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-4 py-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
            Navigation
          </h3>
          <div className="space-y-2">
            {navItems.map(({ icon: Icon, label, href, active, description }) => (
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
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="px-4 py-4 border-t border-gray-200/80">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="text-xs text-green-700 font-medium">Favorites</p>
                <p className="text-lg font-bold text-green-900">12</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <HeartIcon className="h-4 w-4 text-green-600" />
              </div>
            </div>
            
            <div className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-xs text-blue-700 font-medium">Applications</p>
                <p className="text-lg font-bold text-blue-900">3</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileTextIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section - Only Logout */}
      <div className="p-3 border-t border-gray-200/80 space-y-1 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200"
        >
          <div className="p-2 rounded-lg bg-red-100">
            <LogOutIcon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Sign Out</p>
            <p className="text-xs text-red-500">Log out of your account</p>
          </div>
        </button>

        {/* App Version */}
        <div className="px-3 pt-2">
          <p className="text-xs text-gray-400 text-center">
            Keyat v1.0.0
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30"
      >
        <SidebarContent />
      </motion.div>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isMobile && mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden"
            >
              <SidebarContent isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE MENU TOGGLE BUTTON */}
      {isMobile && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 left-6 z-30 bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all"
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6" />
        </motion.button>
      )}
    </>
  );
}