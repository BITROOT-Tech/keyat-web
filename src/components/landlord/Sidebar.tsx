'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load icons
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const PlusIcon = dynamic(() => import('lucide-react').then(mod => mod.Plus));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const BarChartIcon = dynamic(() => import('lucide-react').then(mod => mod.BarChart3));
const CalendarIcon = dynamic(() => import('lucide-react').then(mod => mod.Calendar));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));

interface SidebarProps {
  user?: any;
}

export default function LandlordSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      icon: HomeIcon,
      label: 'Dashboard',
      href: '/landlord/dashboard',
      active: pathname === '/landlord/dashboard',
      description: 'Property overview'
    },
    {
      icon: BuildingIcon,
      label: 'My Properties',
      href: '/landlord/properties',
      active: pathname?.startsWith('/landlord/properties'),
      description: 'Manage listings'
    },
    {
      icon: PlusIcon,
      label: 'Add Property',
      href: '/landlord/properties/new',
      active: pathname?.startsWith('/landlord/properties/new'),
      description: 'Create new listing'
    },
    {
      icon: UsersIcon,
      label: 'Tenants',
      href: '/landlord/tenants',
      active: pathname?.startsWith('/landlord/tenants'),
      description: 'Manage tenants'
    },
    {
      icon: DollarSignIcon,
      label: 'Finances',
      href: '/landlord/finances',
      active: pathname?.startsWith('/landlord/finances'),
      description: 'Income & expenses'
    },
    {
      icon: CalendarIcon,
      label: 'Bookings',
      href: '/landlord/bookings',
      active: pathname?.startsWith('/landlord/bookings'),
      description: 'Viewings & tours'
    },
    {
      icon: BarChartIcon,
      label: 'Analytics',
      href: '/landlord/analytics',
      active: pathname?.startsWith('/landlord/analytics'),
      description: 'Performance insights'
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
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <BuildingIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Keyat</h1>
              <p className="text-xs text-gray-500">Landlord</p>
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
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                active ? 'bg-green-100' : 'bg-gray-100'
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
            onClick={() => router.push('/landlord/profile')}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
              pathname?.startsWith('/landlord/profile')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.first_name?.[0] || user?.email?.[0] || 'L'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user?.first_name || 'Landlord'}
              </p>
              <p className="text-xs text-gray-500 truncate">View Profile</p>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}