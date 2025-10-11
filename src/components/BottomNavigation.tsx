// app/components/BottomNavigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { memo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// LAZY LOAD ICONS
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));

const NAV_ITEMS = [
  { 
    id: 'home',
    icon: HomeIcon,
    label: 'Home',
    href: '/consumer/dashboard',
    match: (path: string) => path === '/consumer/dashboard' || path === '/consumer'
  },
  { 
    id: 'search',
    icon: SearchIcon, 
    label: 'Search',
    href: '/consumer/search',
    match: (path: string) => path.startsWith('/consumer/search')
  },
  { 
    id: 'saved',
    icon: HeartIcon,
    label: 'Saved', 
    href: '/consumer/saved',
    match: (path: string) => path.startsWith('/consumer/saved')
  },
  { 
    id: 'profile',
    icon: UserIcon,
    label: 'Profile',
    href: '/consumer/profile', 
    match: (path: string) => path.startsWith('/consumer/profile')
  }
] as const;

function BottomNavigation() {
  const pathname = usePathname();
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/75 z-40 safe-bottom"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="px-2 py-3 max-w-lg mx-auto">
        <div className="flex justify-around items-center">
          {NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex flex-col items-center p-3 min-w-[80px] rounded-2xl transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${isActive 
                    ? 'text-blue-600 bg-blue-50/80 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
                prefetch={true}
              >
                <div className={`
                  relative p-2 rounded-xl transition-all duration-200
                  ${isActive ? 'scale-110' : 'scale-100'}
                `}>
                  <Icon className="w-5 h-5" />
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                
                <span className={`
                  text-xs font-medium mt-1 transition-all duration-200
                  ${isActive ? 'scale-105 opacity-100' : 'scale-100 opacity-90'}
                `}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default memo(BottomNavigation);