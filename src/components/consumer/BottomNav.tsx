'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Lazy load icons
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));

export default function ConsumerBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // Hide bottom nav on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
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
      active: pathname === '/consumer/dashboard'
    },
    { 
      icon: SearchIcon, 
      label: 'Search', 
      href: '/consumer/search',
      active: pathname?.startsWith('/consumer/search')
    },
    { 
      icon: HeartIcon, 
      label: 'Saved', 
      href: '/consumer/saved',
      active: pathname?.startsWith('/consumer/saved')
    },
    { 
      icon: CalendarIcon, 
      label: 'Bookings', 
      href: '/consumer/booking',
      active: pathname?.startsWith('/consumer/booking')
    },
    { 
      icon: UserIcon, 
      label: 'Profile', 
      href: '/consumer/profile',
      active: pathname?.startsWith('/consumer/profile')
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 safe-area-bottom z-50 shadow-lg">
      <div className="px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map(({ icon: Icon, label, href, active }) => (
            <button
              key={label}
              onClick={() => handleNavigation(href)}
              className={`flex flex-col items-center p-1 transition-all duration-200 min-w-0 flex-1 touch-manipulation ${
                active 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  active ? 'bg-blue-50 shadow-sm' : 'hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              <span className="text-xs mt-1 font-medium truncate max-w-[60px]">
                {label}
              </span>
              
              {active && (
                <motion.div
                  layoutId="activeBottomNav"
                  className="h-1 w-6 bg-blue-600 rounded-full mt-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}