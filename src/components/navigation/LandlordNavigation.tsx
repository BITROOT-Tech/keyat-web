// src/components/navigation/LandlordNavigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { memo } from 'react';
import dynamic from 'next/dynamic';

const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));

const LANDLORD_NAV_ITEMS = [
  { 
    id: 'dashboard',
    icon: HomeIcon,
    label: 'Dashboard',
    href: '/landlord/dashboard',
    match: (path: string) => path === '/landlord/dashboard' || path === '/landlord'
  },
  { 
    id: 'properties',
    icon: BuildingIcon,
    label: 'Properties', 
    href: '/landlord/properties',
    match: (path: string) => path.startsWith('/landlord/properties')
  },
  { 
    id: 'tenants',
    icon: UsersIcon, 
    label: 'Tenants',
    href: '/landlord/tenants',
    match: (path: string) => path.startsWith('/landlord/tenants')
  },
  { 
    id: 'earnings',
    icon: DollarSignIcon,
    label: 'Earnings', 
    href: '/landlord/earnings',
    match: (path: string) => path.startsWith('/landlord/earnings')
  },
  { 
    id: 'profile',
    icon: UserIcon,
    label: 'Profile',
    href: '/landlord/profile', 
    match: (path: string) => path.startsWith('/landlord/profile')
  }
] as const;

function LandlordNavigation() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/75 z-40 safe-bottom">
      <div className="px-2 py-3 max-w-lg mx-auto">
        <div className="flex justify-around items-center">
          {LANDLORD_NAV_ITEMS.map((item) => {
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
                    ? 'text-purple-600 bg-purple-50/80 shadow-sm' 
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

export default memo(LandlordNavigation);
