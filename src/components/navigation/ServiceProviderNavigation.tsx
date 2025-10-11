// src/components/navigation/ServiceProviderNavigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { memo } from 'react';
import dynamic from 'next/dynamic';

const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const BriefcaseIcon = dynamic(() => import('lucide-react').then(mod => mod.Briefcase));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));

const SERVICE_PROVIDER_NAV_ITEMS = [
  { 
    id: 'dashboard',
    icon: HomeIcon,
    label: 'Dashboard',
    href: '/service-provider/dashboard',
    match: (path: string) => path === '/service-provider/dashboard' || path === '/service-provider'
  },
  { 
    id: 'jobs',
    icon: BriefcaseIcon,
    label: 'Jobs', 
    href: '/service-provider/jobs',
    match: (path: string) => path.startsWith('/service-provider/jobs')
  },
  { 
    id: 'schedule',
    icon: CalendarIcon, 
    label: 'Schedule',
    href: '/service-provider/schedule',
    match: (path: string) => path.startsWith('/service-provider/schedule')
  },
  { 
    id: 'earnings',
    icon: DollarSignIcon,
    label: 'Earnings', 
    href: '/service-provider/earnings',
    match: (path: string) => path.startsWith('/service-provider/earnings')
  },
  { 
    id: 'profile',
    icon: UserIcon,
    label: 'Profile',
    href: '/service-provider/profile', 
    match: (path: string) => path.startsWith('/service-provider/profile')
  }
] as const;

function ServiceProviderNavigation() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/75 z-40 safe-bottom">
      <div className="px-2 py-3 max-w-lg mx-auto">
        <div className="flex justify-around items-center">
          {SERVICE_PROVIDER_NAV_ITEMS.map((item) => {
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
                    ? 'text-orange-600 bg-orange-50/80 shadow-sm' 
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

export default memo(ServiceProviderNavigation);
