// src/components/admin/Sidebar.tsx - COMPLETE PRODUCTION VERSION
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load icons
const BarChart3Icon = dynamic(() => import('lucide-react').then(mod => mod.BarChart3));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const UsersIcon = dynamic(() => import('lucide-react').then(mod => mod.Users));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const BellIcon = dynamic(() => import('lucide-react').then(mod => mod.Bell));
const FileTextIcon = dynamic(() => import('lucide-react').then(mod => mod.FileText));
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const LogOutIcon = dynamic(() => import('lucide-react').then(mod => mod.LogOut));
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const DollarSignIcon = dynamic(() => import('lucide-react').then(mod => mod.DollarSign));
const WrenchIcon = dynamic(() => import('lucide-react').then(mod => mod.Wrench));

interface AdminSidebarProps {
  user?: any;
  notificationCount?: number;
}

export default function AdminSidebar({ user, notificationCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      icon: BarChart3Icon,
      label: 'Dashboard',
      href: '/admin/dashboard',
      active: pathname === '/admin/dashboard',
      description: 'Business analytics'
    },
    {
      icon: BuildingIcon,
      label: 'Properties',
      href: '/admin/properties',
      active: pathname?.startsWith('/admin/properties'),
      description: 'Manage listings'
    },
    {
      icon: FileTextIcon,
      label: 'Applications',
      href: '/admin/applications',
      active: pathname?.startsWith('/admin/applications'),
      description: 'Rental applications'
    },
    {
      icon: UsersIcon,
      label: 'Users',
      href: '/admin/users',
      active: pathname?.startsWith('/admin/users'),
      description: 'User management'
    },
    {
      icon: DollarSignIcon,
      label: 'Finance',
      href: '/admin/finance',
      active: pathname?.startsWith('/admin/finance'),
      description: 'Revenue & payments'
    },
    {
      icon: WrenchIcon,
      label: 'Maintenance',
      href: '/admin/maintenance',
      active: pathname?.startsWith('/admin/maintenance'),
      description: 'Property maintenance'
    },
    {
      icon: BellIcon,
      label: 'Notifications',
      href: '/admin/notifications',
      active: pathname?.startsWith('/admin/notifications'),
      description: 'System alerts',
      badge: notificationCount > 0 ? notificationCount : undefined
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30"
    >
      <div className="flex flex-col h-full bg-white/95 backdrop-blur-sm border-r border-gray-200/80">
        
        {/* Header */}
        <div className="h-32">
          <div className="px-6 py-4 border-b border-gray-200/80">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Keyat</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-3 border-b border-gray-200/80 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-medium">
                  {user?.first_name?.[0] || user?.email?.[0] || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {user?.first_name || user?.email || 'Administrator'}
                </p>
                <p className="text-gray-600 text-xs truncate">Super Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-4 py-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
              Navigation
            </h3>
            <div className="space-y-2">
              {navItems.map(({ icon: Icon, label, href, active, description, badge }) => (
                <motion.button
                  key={label}
                  onClick={() => handleNavigation(href)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group relative ${
                    active
                      ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    active ? 'bg-purple-100' : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{label}</p>
                      {badge && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center font-bold">
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                  </div>
                  
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200/80">
          <div className="p-3 space-y-1 bg-gray-50/50">
            <button
              onClick={() => router.push('/admin/settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group ${
                pathname?.startsWith('/admin/settings')
                  ? 'bg-gray-100 text-gray-700 border border-gray-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-gray-200 group-hover:bg-gray-300 transition-colors">
                <SettingsIcon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Settings</p>
                <p className="text-xs text-gray-500">System configuration</p>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50 group"
            >
              <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                <LogOutIcon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">Sign Out</p>
                <p className="text-xs text-red-500">Log out of admin panel</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}