// src/components/consumer/BottomNav.tsx - COMPLETE & ALWAYS VISIBLE ON MOBILE
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Lazy load icons
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const MapIcon = dynamic(() => import('lucide-react').then(mod => mod.Map));
const BellIcon = dynamic(() => import('lucide-react').then(mod => mod.Bell));

export default function ConsumerBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check screen size and ensure component is mounted
  useEffect(() => {
    setMounted(true);
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // Changed to 1024 to be more inclusive
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const navItems = [
    { 
      icon: HomeIcon, 
      label: 'Home', 
      href: '/consumer/dashboard',
      active: pathname === '/consumer/dashboard',
      description: 'Dashboard'
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
      icon: MapIcon, 
      label: 'Explore', 
      href: '/consumer/explore',
      active: pathname?.startsWith('/consumer/explore'),
      description: 'Map view'
    },
    { 
      icon: HeartIcon, 
      label: 'Saved', 
      href: '/consumer/saved',
      active: pathname?.startsWith('/consumer/saved'),
      description: 'Favorites',
      count: 3 // Example count
    },
    { 
      icon: CalendarIcon, 
      label: 'Bookings', 
      href: '/consumer/booking',
      active: pathname?.startsWith('/consumer/booking'),
      description: 'Viewings'
    },
    { 
      icon: UserIcon, 
      label: 'Profile', 
      href: '/consumer/profile',
      active: pathname?.startsWith('/consumer/profile'),
      description: 'Account'
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50 lg:hidden">
        <div className="px-2 py-3">
          <div className="flex justify-around items-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center p-1 min-w-0 flex-1">
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-8 mt-1 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  // Always show on mobile, hide on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 safe-area-bottom z-50 shadow-2xl shadow-black/10"
        style={{
          // Ensure it's always above other content
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          zIndex: 50
        }}
      >
        {/* Subtle top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />
        
        <div className="px-1 py-2">
          <div className="flex justify-around items-center">
            {navItems.map(({ icon: Icon, label, href, active, badge, count }) => (
              <motion.button
                key={label}
                onClick={() => handleNavigation(href)}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center p-1 transition-all duration-200 min-w-0 flex-1 touch-manipulation relative ${
                  active 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
              >
                {/* Badge for new features */}
                {badge && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none shadow-sm"
                  >
                    {badge}
                  </motion.span>
                )}

                {/* Count badge for saved items */}
                {count && count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none shadow-sm"
                  >
                    {count}
                  </motion.span>
                )}

                {/* Icon container with enhanced styling */}
                <motion.div
                  className={`relative p-2 rounded-xl transition-all duration-200 border-2 ${
                    active 
                      ? 'bg-blue-50 border-blue-200 shadow-md shadow-blue-500/20' 
                      : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                  }`}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-600'}`} />
                  
                  {/* Active indicator pulse */}
                  {active && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-blue-400"
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ 
                        opacity: [0, 0.3, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    />
                  )}
                </motion.div>

                {/* Label with better typography */}
                <motion.span
                  className={`text-xs mt-1 font-semibold truncate max-w-[70px] px-1 ${
                    active ? 'text-blue-600' : 'text-gray-600'
                  }`}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {label}
                </motion.span>
                
                {/* Active indicator bar */}
                {active && (
                  <motion.div
                    layoutId="activeBottomNav"
                    className="h-1 w-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-1 shadow-sm shadow-blue-500/30"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 30,
                      delay: 0.1 
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Safe area spacer for devices with home indicators */}
        <div className="h-1 bg-transparent safe-area-bottom" />
      </motion.nav>
    </AnimatePresence>
  );
}