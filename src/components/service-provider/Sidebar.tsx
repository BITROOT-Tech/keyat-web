//src\components\service-provider\Sidebar.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load icons
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const WrenchIcon = dynamic(() => import('lucide-react').then(mod => mod.Wrench));
const PlusIcon = dynamic(() => import('lucide-react').then(mod => mod.Plus));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const StarIcon = dynamic(() => import('lucide-react').then(mod => mod.Star));
const ClockIcon = dynamic(() => import('lucide-react').then(mod => mod.Clock));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));

interface SidebarProps {
  user?: any;
}

export default function ServiceProviderSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      icon: HomeIcon,
      label: 'Dashboard',
      href: '/service-provider/dashboard',
      active: pathname === '/service-provider/dashboard',
      description: 'Business overview'
    },
    {
      icon: WrenchIcon,
      label: 'Services',
      href: '/service-provider/services',
      active: pathname?.startsWith('/service-provider/services'),
      description: 'Manage services'
    },
    {
      icon: PlusIcon,
      label: 'Add Service',
      href: '/service-provider/services/new',
      active: pathname?.startsWith('/service-provider/services/new'),
      description: 'Create new service'
    },
    {
      icon: CalendarIcon,
      label: 'Schedule',
      href: '/service-provider/schedule',
      active: pathname?.startsWith('/service-provider/schedule'),
      description: 'View calendar'
    },
    {
      icon: UsersIcon,
      label: 'Clients',
      href: '/service-provider/clients',
      active: pathname?.startsWith('/service-provider/clients'),
      description: 'Manage clients'
    },
    {
      icon: DollarSignIcon,
      label: 'Earnings',
      href: '/service-provider/earnings',
      active: pathname?.startsWith('/service-provider/earnings'),
      description: 'View revenue'
    },
    {
      icon: StarIcon,
      label: 'Portfolio',
      href: '/service-provider/portfolio',
      active: pathname?.startsWith('/service-provider/portfolio'),
      description: 'Showcase work'
    },
    {
      icon: ClockIcon,
      label: 'Requests',
      href: '/service-provider/requests',
      active: pathname?.startsWith('/service-provider/requests'),
      description: 'Service requests'
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40"
    >
      {/* Sidebar component */}
      <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
        {/* Sidebar header */}
        <div className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <WrenchIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Keyat</h1>
              <p className="text-xs text-gray-500">Service Provider</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href, active, description }) => (
            <motion.button
              key={label}
              onClick={() => handleNavigation(href)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 touch-manipulation ${
                active
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                active ? 'bg-indigo-100' : 'bg-gray-100'
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              </div>
            </motion.button>
          ))}
        </nav>

        {/* User profile footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <button
            onClick={() => router.push('/service-provider/profile')}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
              pathname?.startsWith('/service-provider/profile')
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.first_name?.[0] || user?.email?.[0] || 'S'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user?.first_name || 'Service Provider'}
              </p>
              <p className="text-xs text-gray-500 truncate">View Profile</p>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}