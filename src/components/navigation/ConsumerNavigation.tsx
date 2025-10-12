'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load icons
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const HeartIcon = dynamic(() => import('lucide-react').then(mod => mod.Heart));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const TruckIcon = dynamic(() => import('lucide-react').then(mod => mod.Truck));
const WrenchIcon = dynamic(() => import('lucide-react').then(mod => mod.Wrench));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));

interface ConsumerNavigationProps {
  mobile?: boolean;
}

export default function ConsumerNavigation({ mobile = false }: ConsumerNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/consumer/dashboard',
      icon: HomeIcon,
      description: 'Your overview',
      exact: true
    },
    {
      label: 'Search',
      href: '/consumer/search',
      icon: SearchIcon,
      description: 'Find properties',
      exact: false
    },
    {
      label: 'Saved',
      href: '/consumer/saved',
      icon: HeartIcon,
      description: 'Your favorites',
      exact: false
    },
    {
      label: 'Bookings',
      href: '/consumer/booking',
      icon: CalendarIcon,
      description: 'Your reservations',
      exact: false
    },
    {
      label: 'Moving',
      href: '/consumer/moving',
      icon: TruckIcon,
      description: 'Moving services',
      exact: false
    },
    {
      label: 'Services',
      href: '/consumer/services',
      icon: WrenchIcon,
      description: 'Home services',
      exact: false
    },
    {
      label: 'Profile',
      href: '/consumer/profile',
      icon: UserIcon,
      description: 'Account settings',
      exact: false
    }
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  // Mobile Navigation
  if (mobile) {
    return (
      <nav className="space-y-1 p-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.href, item.exact);
          
          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                active
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                active ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <IconComponent className="w-4 h-4 flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </button>
          );
        })}
      </nav>
    );
  }

  // Desktop Navigation - Fixed positioning
  return (
    <nav className="hidden lg:flex items-center justify-center space-x-1 bg-white border-b border-gray-200 px-6 py-2">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const active = isActive(item.href, item.exact);
        
        return (
          <motion.button
            key={item.href}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavigation(item.href)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
              active
                ? 'text-blue-700 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <IconComponent className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
            
            {active && (
              <motion.div
                layoutId="activeNavIndicator"
                className="absolute inset-0 rounded-xl border-2 border-blue-200"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}