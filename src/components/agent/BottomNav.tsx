'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load icons
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const TargetIcon = dynamic(() => import('lucide-react').then(mod => mod.Target));

export default function AgentBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { 
      icon: HomeIcon, 
      label: 'Dashboard', 
      href: '/agent/dashboard',
      active: pathname === '/agent/dashboard'
    },
    { 
      icon: BuildingIcon, 
      label: 'Listings', 
      href: '/agent/properties',
      active: pathname?.startsWith('/agent/properties')
    },
    { 
      icon: UsersIcon, 
      label: 'Clients', 
      href: '/agent/clients',
      active: pathname?.startsWith('/agent/clients')
    },
    { 
      icon: TargetIcon, 
      label: 'Performance', 
      href: '/agent/performance',
      active: pathname?.startsWith('/agent/performance')
    },
    { 
      icon: UserIcon, 
      label: 'Profile', 
      href: '/agent/profile',
      active: pathname?.startsWith('/agent/profile')
    },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 safe-area-bottom z-40"
    >
      <div className="px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map(({ icon: Icon, label, href, active }) => (
            <motion.button
              key={label}
              onClick={() => router.push(href)}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center p-2 transition-all duration-200 min-w-0 flex-1 touch-manipulation ${
                active 
                  ? 'text-cyan-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${
                active ? 'bg-cyan-50' : 'hover:bg-gray-100'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1 font-medium truncate max-w-[70px]">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}