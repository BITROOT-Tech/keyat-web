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
const TargetIcon = dynamic(() => import('lucide-react').then(mod => mod.Target));
const MessageSquareIcon = dynamic(() => import('lucide-react').then(mod => mod.MessageSquare));
const FileTextIcon = dynamic(() => import('lucide-react').then(mod => mod.FileText));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));

interface SidebarProps {
  user?: any;
}

export default function AgentSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      icon: HomeIcon,
      label: 'Dashboard',
      href: '/agent/dashboard',
      active: pathname === '/agent/dashboard',
      description: 'Business overview'
    },
    {
      icon: BuildingIcon,
      label: 'My Listings',
      href: '/agent/properties',
      active: pathname?.startsWith('/agent/properties'),
      description: 'Manage properties'
    },
    {
      icon: PlusIcon,
      label: 'Add Listing',
      href: '/agent/properties/new',
      active: pathname?.startsWith('/agent/properties/new'),
      description: 'Create new listing'
    },
    {
      icon: UsersIcon,
      label: 'Clients',
      href: '/agent/clients',
      active: pathname?.startsWith('/agent/clients'),
      description: 'Manage clients'
    },
    {
      icon: DollarSignIcon,
      label: 'Commissions',
      href: '/agent/commissions',
      active: pathname?.startsWith('/agent/commissions'),
      description: 'View earnings'
    },
    {
      icon: CalendarIcon,
      label: 'Viewings',
      href: '/agent/viewings',
      active: pathname?.startsWith('/agent/viewings'),
      description: 'Property tours'
    },
    {
      icon: TargetIcon,
      label: 'Performance',
      href: '/agent/performance',
      active: pathname?.startsWith('/agent/performance'),
      description: 'Sales analytics'
    },
    {
      icon: MessageSquareIcon,
      label: 'Inquiries',
      href: '/agent/inquiries',
      active: pathname?.startsWith('/agent/inquiries'),
      description: 'Client messages'
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
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <TargetIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Keyat</h1>
              <p className="text-xs text-gray-500">Agent</p>
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
                  ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                active ? 'bg-cyan-100' : 'bg-gray-100'
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
            onClick={() => router.push('/agent/profile')}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
              pathname?.startsWith('/agent/profile')
                ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.first_name?.[0] || user?.email?.[0] || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user?.first_name || 'Agent'}
              </p>
              <p className="text-xs text-gray-500 truncate">View Profile</p>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}