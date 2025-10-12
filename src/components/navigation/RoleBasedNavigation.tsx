// src/components/navigation/RoleBasedNavigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// Define props interface for all navigation components
interface NavigationComponentProps {
  mobile?: boolean;
}

// Lazy load navigation components
const ConsumerNavigation = dynamic(() => import('./ConsumerNavigation')) as ComponentType<NavigationComponentProps>;
const LandlordNavigation = dynamic(() => import('./LandlordNavigation')) as ComponentType<NavigationComponentProps>;
const AgentNavigation = dynamic(() => import('./AgentNavigation')) as ComponentType<NavigationComponentProps>;
const ServiceProviderNavigation = dynamic(() => import('./ServiceProviderNavigation')) as ComponentType<NavigationComponentProps>;
const AdminNavigation = dynamic(() => import('./AdminNavigation')) as ComponentType<NavigationComponentProps>;

// Lazy load icons
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const UserCheckIcon = dynamic(() => import('lucide-react').then(mod => mod.UserCheck));
const WrenchIcon = dynamic(() => import('lucide-react').then(mod => mod.Wrench));
const UserCogIcon = dynamic(() => import('lucide-react').then(mod => mod.UserCog));
const LogOutIcon = dynamic(() => import('lucide-react').then(mod => mod.LogOut));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const UserIcon = dynamic(() => import('lucide-react').then(mod => mod.User));
const BellIcon = dynamic(() => import('lucide-react').then(mod => mod.Bell));
const SearchIcon = dynamic(() => import('lucide-react').then(mod => mod.Search));
const MenuIcon = dynamic(() => import('lucide-react').then(mod => mod.Menu));
const XIcon = dynamic(() => import('lucide-react').then(mod => mod.X));
const ChevronDownIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronDown));

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'tenant' | 'landlord' | 'agent' | 'service-provider' | 'admin';
  avatar_url?: string;
}

interface RoleInfo {
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
}

type NavigationComponentMap = {
  [key: string]: ComponentType<NavigationComponentProps>;
};

export default function RoleBasedNavigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications] = useState(3);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser(profile);
        } else {
          setUser({
            id: session.user.id,
            first_name: session.user.user_metadata?.first_name || session.user.email?.split('@')[0] || 'User',
            last_name: session.user.user_metadata?.last_name || '',
            email: session.user.email || 'user@example.com',
            user_type: session.user.user_metadata?.user_type || 'tenant'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  const getCurrentRole = (): string => {
    if (!user) return 'tenant';
    if (pathname?.startsWith('/consumer')) return 'tenant';
    if (pathname?.startsWith('/landlord')) return 'landlord';
    if (pathname?.startsWith('/agent')) return 'agent';
    if (pathname?.startsWith('/service-provider')) return 'service-provider';
    if (pathname?.startsWith('/admin')) return 'admin';
    return user.user_type || 'tenant';
  };

  const getRoleDisplayInfo = (role: string): RoleInfo => {
    const roleInfoMap = {
      tenant: { 
        label: 'Tenant', 
        icon: HomeIcon, 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-50', 
        borderColor: 'border-blue-200' 
      },
      landlord: { 
        label: 'Landlord', 
        icon: BuildingIcon, 
        color: 'text-green-600', 
        bgColor: 'bg-green-50', 
        borderColor: 'border-green-200' 
      },
      agent: { 
        label: 'Agent', 
        icon: UserCheckIcon, 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-50', 
        borderColor: 'border-purple-200' 
      },
      'service-provider': { 
        label: 'Service Provider', 
        icon: WrenchIcon, 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-50', 
        borderColor: 'border-orange-200' 
      },
      admin: { 
        label: 'Admin', 
        icon: UserCogIcon, 
        color: 'text-red-600', 
        bgColor: 'bg-red-50', 
        borderColor: 'border-red-200' 
      }
    };
    
    return roleInfoMap[role as keyof typeof roleInfoMap] || roleInfoMap.tenant;
  };

  const getUserInitial = (): string => {
    if (!user) return 'U';
    const firstNameInitial = user.first_name?.[0]?.toUpperCase();
    const emailInitial = user.email?.[0]?.toUpperCase();
    return firstNameInitial || emailInitial || 'U';
  };

  const getUserDisplayName = (): string => {
    if (!user) return 'User';
    return user.first_name || user.email?.split('@')[0] || 'User';
  };

  // Always get a role - never null
  const currentRole = getCurrentRole();
  const roleInfo = getRoleDisplayInfo(currentRole);

  const navigationComponents: NavigationComponentMap = {
    tenant: ConsumerNavigation,
    landlord: LandlordNavigation,
    agent: AgentNavigation,
    'service-provider': ServiceProviderNavigation,
    admin: AdminNavigation
  };

  const NavigationComponent = navigationComponents[currentRole] || ConsumerNavigation;

  const renderIcon = (IconComponent: React.ComponentType<any> | undefined, className: string) => {
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
  };

  // Show skeleton while loading
  if (loading) {
    return <NavigationSkeleton />;
  }

  const userInitial = getUserInitial();
  const userDisplayName = getUserDisplayName();

  return (
    <>
      {/* Clean Desktop Navigation */}
      <nav className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-semibold text-gray-900">Keyat</h1>
                  <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg ${roleInfo.bgColor} ${roleInfo.borderColor}`}>
                    {renderIcon(roleInfo.icon, `w-3.5 h-3.5 ${roleInfo.color}`)}
                    <span className={`text-xs font-medium ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Navigation */}
            <div className="flex-1 max-w-2xl mx-8">
              <NavigationComponent />
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <SearchIcon className="w-4 h-4" />
              </button>

              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="w-4 h-4" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {notifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {userInitial}
                    </span>
                  </div>
                  <ChevronDownIcon className={`w-3 h-3 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    >
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900 text-sm">
                          {userDisplayName}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <UserIcon className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <SettingsIcon className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOutIcon className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MenuIcon className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">K</span>
                </div>
                <span className="font-semibold text-gray-900 text-sm">Keyat</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="w-4 h-4" />
                {notifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border border-white" />
                )}
              </button>

              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-xs font-medium">
                  {userInitial}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">K</span>
                    </div>
                    <div>
                      <h1 className="font-semibold text-gray-900">Keyat</h1>
                      <p className="text-gray-500 text-xs">Real Estate</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {userInitial}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {userDisplayName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  <NavigationComponent mobile={true} />
                </div>

                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile User Menu */}
      <AnimatePresence>
        {userMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-4 right-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 lg:hidden"
          >
            <div className="space-y-1">
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                <UserIcon className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                <SettingsIcon className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <LogOutIcon className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Skeleton Loader
function NavigationSkeleton() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex-1 max-w-2xl mx-8">
            <div className="flex space-x-6 justify-center">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}