// src/app/auth/login/page.tsx - FIXED COLORS
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// LAZY LOAD ICONS - NO ERRORS!
const HomeIcon = dynamic(() => import('lucide-react').then(mod => mod.Home));
const BuildingIcon = dynamic(() => import('lucide-react').then(mod => mod.Building2));
const UserCheckIcon = dynamic(() => import('lucide-react').then(mod => mod.UserCheck));
const ShieldIcon = dynamic(() => import('lucide-react').then(mod => mod.Shield));
const LogInIcon = dynamic(() => import('lucide-react').then(mod => mod.LogIn));
const BadgeCheckIcon = dynamic(() => import('lucide-react').then(mod => mod.BadgeCheck));
const MapPinIcon = dynamic(() => import('lucide-react').then(mod => mod.MapPin));
const EyeIcon = dynamic(() => import('lucide-react').then(mod => mod.Eye));
const EyeOffIcon = dynamic(() => import('lucide-react').then(mod => mod.EyeOff));
const WrenchIcon = dynamic(() => import('lucide-react').then(mod => mod.Wrench));
const UserCogIcon = dynamic(() => import('lucide-react').then(mod => mod.UserCog));
const ZapIcon = dynamic(() => import('lucide-react').then(mod => mod.Zap));
const SettingsIcon = dynamic(() => import('lucide-react').then(mod => mod.Settings));
const ChevronUpIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronUp));
const ChevronDownIcon = dynamic(() => import('lucide-react').then(mod => mod.ChevronDown));
const PlayIcon = dynamic(() => import('lucide-react').then(mod => mod.Play));

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [detectedUserType, setDetectedUserType] = useState<string>('');
  const [autoFillInProgress, setAutoFillInProgress] = useState(false);
  const [devToolsCollapsed, setDevToolsCollapsed] = useState(false);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // KILL HORIZONTAL SCROLL
  useEffect(() => {
    document.documentElement.classList.add('overflow-x-hidden');
    document.body.classList.add('overflow-x-hidden');
    
    return () => {
      document.documentElement.classList.remove('overflow-x-hidden');
      document.body.classList.remove('overflow-x-hidden');
    };
  }, []);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // 🎯 FIXED: SERVICE PROVIDER BUG - Changed from 'service-provider' to 'service_provider'
  useEffect(() => {
    if (!formData.email) {
      setDetectedUserType('');
      return;
    }

    const email = formData.email.toLowerCase();
    if (email.includes('tenant') || email.includes('renter')) {
      setDetectedUserType('tenant');
    } else if (email.includes('landlord') || email.includes('owner')) {
      setDetectedUserType('landlord');
    } else if (email.includes('agent') || email.includes('realtor')) {
      setDetectedUserType('agent');
    } else if (email.includes('service') || email.includes('repair') || email.includes('provider') || email.includes('maintenance')) {
      setDetectedUserType('service_provider'); // 🚨 CRITICAL FIX: Changed to underscore
    } else if (email.includes('admin') || email.includes('administrator')) {
      setDetectedUserType('admin');
    } else {
      setDetectedUserType('');
    }
  }, [formData.email]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🎯 FIXED: PROPER REDIRECT LOGIC FOR ALL USER TYPES
  const getDashboardPath = (userType: string): string => {
    const paths: Record<string, string> = {
      'tenant': '/consumer/home',
      'landlord': '/landlord/dashboard', 
      'agent': '/agent/dashboard',
      'service_provider': '/service-provider/dashboard', // 🚨 FIXED: Matches middleware
      'admin': '/admin/dashboard'
    };
    return paths[userType] || '/consumer/home';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    setTouched({ email: true, password: true });
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email before signing in');
        }
        throw error;
      }

      if (data.user) {
        // 🎯 FIXED: Use consistent redirect logic
        const userType = detectedUserType || data.user.user_metadata?.user_type || 'tenant';
        const redirectPath = getDashboardPath(userType);
        
        console.log(`🔐 Login successful! Redirecting ${userType} to: ${redirectPath}`);
        
        // 🚀 HARD REDIRECT - NO REACT ROUTER ISSUES
        window.location.href = redirectPath;
      }

    } catch (error: any) {
      setSubmitError(error.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (submitError) setSubmitError('');
  };

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // 🎯 FIXED: PROPER QUICK LOGIN REDIRECTS
  const handleQuickLogin = async (email: string, userType: string) => {
    if (autoFillInProgress) return;
    
    setAutoFillInProgress(true);
    
    // Quick fill
    setFormData({
      email: email,
      password: 'Password123!'
    });
    
    // Small delay to show the fields were filled
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setAutoFillInProgress(false);
    setLoading(true);
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'Password123!'
      });

      if (error) throw error;

      if (data.user) {
        // 🎯 FIXED: Use proper redirect logic for quick login too
        const redirectPath = getDashboardPath(userType);
        
        console.log(`🚀 Quick login redirecting ${userType} to: ${redirectPath}`);
        window.location.href = redirectPath;
      }
    } catch (error: any) {
      setSubmitError(error.message);
      setLoading(false);
    }
  };

  // 🎨 FIXED: CORRECT COLORS MATCHING DASHBOARD SYSTEM
  const userTypes = [
    { 
      value: 'tenant',
      label: 'Tenant', 
      icon: HomeIcon,
      testAccount: 'tenant@keyat.co.bw',
      badgeColor: 'bg-blue-500', // 🔵 Consumer Blue
      redirectPath: '/consumer/home'
    },
    { 
      value: 'landlord',
      label: 'Landlord', 
      icon: BuildingIcon,
      testAccount: 'landlord@keyat.co.bw',
      badgeColor: 'bg-green-500', // 🟢 Landlord Green
      redirectPath: '/landlord/dashboard'
    },
    { 
      value: 'agent',
      label: 'Agent', 
      icon: UserCheckIcon,
      testAccount: 'agent@keyat.co.bw',
      badgeColor: 'bg-cyan-500', // 🟦 Agent Cyan (FIXED: was purple)
      redirectPath: '/agent/dashboard'
    },
    { 
      value: 'service_provider', // 🚨 FIXED: Changed to underscore
      label: 'Service', 
      icon: WrenchIcon,
      testAccount: 'service@keyat.co.bw',
      badgeColor: 'bg-indigo-500', // 🟪 Service Provider Indigo (FIXED: was orange)
      redirectPath: '/service-provider/dashboard'
    },
    { 
      value: 'admin',
      label: 'Admin', 
      icon: UserCogIcon,
      testAccount: 'admin@keyat.co.bw',
      badgeColor: 'bg-purple-500', // 🟣 Admin Purple
      redirectPath: '/admin/dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-cyan-50/5 overflow-hidden">
      {/* COLLAPSIBLE DEV TOOLS - TOP RIGHT CORNER */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50">
          {/* COLLAPSIBLE PANEL */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ 
              opacity: devToolsCollapsed ? 0.9 : 1,
              scale: devToolsCollapsed ? 0.95 : 1 
            }}
            className={`bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden ${
              devToolsCollapsed ? 'w-12 h-12' : 'w-80'
            } transition-all duration-300`}
          >
            {/* HEADER - ALWAYS VISIBLE */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDevToolsCollapsed(!devToolsCollapsed)}
              // 🎨 FIXED: Admin purple for dev tools header
              className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <ZapIcon className="w-4 h-4" />
                {!devToolsCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    className="text-left"
                  >
                    <h3 className="font-semibold text-sm">Dev Tools</h3>
                    <p className="text-purple-100 text-xs">Quick login access</p>
                  </motion.div>
                )}
              </div>
              <motion.div
                animate={{ rotate: devToolsCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronUpIcon className="w-4 h-4" />
              </motion.div>
            </motion.button>

            {/* EXPANDED CONTENT */}
            <AnimatePresence>
              {!devToolsCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4"
                >
                  {/* QUICK LOGIN BUTTONS */}
                  <div className="space-y-2 mb-3">
                    {userTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <motion.button
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleQuickLogin(type.testAccount, type.value)}
                          disabled={loading || autoFillInProgress}
                          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${type.badgeColor} rounded-lg flex items-center justify-center`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-medium text-gray-900 text-sm">{type.label}</h4>
                              <p className="text-gray-500 text-xs">{type.testAccount}</p>
                              <p className="text-gray-400 text-xs">→ {type.redirectPath}</p>
                            </div>
                          </div>
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <PlayIcon className="w-3 h-3 text-gray-600 group-hover:text-blue-600" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* PASSWORD INFO */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-700 font-medium">Password:</span>
                      <code className="text-xs bg-white px-2 py-1 rounded border border-blue-200 text-blue-700 font-mono">
                        Password123!
                      </code>
                    </div>
                  </div>

                  {/* STATUS INDICATOR */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-medium ${
                      loading ? 'text-orange-600' : 
                      autoFillInProgress ? 'text-blue-600' : 
                      'text-green-600'
                    }`}>
                      {loading ? 'Signing in...' : 
                       autoFillInProgress ? 'Filling...' : 
                       'Ready'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* MAIN LOGIN CONTENT */}
      <div className="min-h-screen flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          
          {/* HEADER */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 w-full"
          >
            <div className="flex items-center justify-center space-x-3 mb-6 w-full">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-lg font-bold text-white">K</span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900">Keyat</h1>
                <p className="text-gray-500 text-xs">Real Estate Platform</p>
              </div>
            </div>

            <div className="mb-2 w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-sm">
                Sign in to your Keyat account
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 mt-4 w-full">
              <div className="flex items-center space-x-1">
                <BadgeCheckIcon className="w-3 h-3 text-green-500" />
                <span className="text-gray-500 text-xs">Verified</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPinIcon className="w-3 h-3 text-blue-500" />
                <span className="text-gray-500 text-xs">Botswana</span>
              </div>
              <div className="flex items-center space-x-1">
                <ShieldIcon className="w-3 h-3 text-blue-500" />
                <span className="text-gray-500 text-xs">Secure</span>
              </div>
            </div>
          </motion.div>

          {/* SMART DETECTION */}
          {detectedUserType && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2"
            >
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <BadgeCheckIcon className="w-3 h-3 text-blue-600" />
              </div>
              <p className="text-sm text-blue-700 font-medium">
                Detected: <span className="capitalize">{detectedUserType.replace('_', ' ')}</span> account
              </p>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                → {getDashboardPath(detectedUserType)}
              </span>
            </motion.div>
          )}

          {/* MAIN LOGIN FORM */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-6 w-full"
          >
            <form onSubmit={handleSubmit} className="space-y-5 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleInputBlur('email')}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-base ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <Link 
                    href="/auth/reset-password" 
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleInputBlur('password')}
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-base pr-12 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">
                    {submitError}
                  </p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogInIcon className="w-4 h-4" />
                    <span>Sign in to Account</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* FOOTER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6 w-full"
          >
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link 
                href="/auth/register" 
                className="text-blue-600 font-semibold hover:underline"
              >
                Create account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}