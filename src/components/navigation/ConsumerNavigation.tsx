// src/components/navigation/ConsumerNavigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { memo } from 'react';
import dynamic from 'next/dynamic';

const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const CompassIcon = dynamic(() => import('lucide-react').then(mod => mod.Compass));

const CONSUMER_NAV_ITEMS = [
  { 
    id: 'home',
    icon: HomeIcon,
    label: 'Home',
    href: '/consumer/dashboard',
    match: (path: string) => path === '/consumer/dashboard' || path === '/consumer'
  },
  { 
    id: 'explore',
    icon: CompassIcon,
    label: 'Explore', 
    href: '/consumer/explore',
    match: (path: string) => path.startsWith('/consumer/explore')
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

function ConsumerNavigation() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/75 z-40 safe-bottom">
      <div className="px-2 py-3 max-w-lg mx-auto">
        <div className="flex justify-around items-center">
          {CONSUMER_NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex flex-col items-center p-2 min-w-[70px] rounded-2xl transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${isActive 
                    ? 'text-blue-600 bg-blue-50/80 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
                prefetch={true}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default memo(ConsumerNavigation);
