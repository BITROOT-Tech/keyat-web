'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { 
  Home, 
  Building2, 
  UserCheck, 
  Settings,
  Shield,
  LogIn,
  BadgeCheck,
  MapPin,
  Eye,
  EyeOff
} from 'lucide-react';

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
  
  const emailRef = useRef<HTMLInputElement>(null);

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

  // SMART USER TYPE DETECTION
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
    } else if (email.includes('service') || email.includes('repair')) {
      setDetectedUserType('service');
    } else if (email.includes('admin')) {
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
        const userType = detectedUserType || data.user.user_metadata?.user_type || 'tenant';
        const redirectPath = userType === 'tenant' 
          ? '/consumer/dashboard' 
          : `/${userType}/dashboard`;
        
        router.push(redirectPath);
        router.refresh();
      }

    } catch (error: any) {
      setSubmitError(error.message || 'Failed to sign in');
    } finally {
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

  // BATTLE-TESTED QUICK LOGIN
  const handleQuickLogin = async (email: string, userType: string) => {
    setLoading(true);
    setSubmitError('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'Password123!'
      });

      if (error) throw error;

      if (data.user) {
        const redirectPath = userType === 'tenant' 
          ? '/consumer/dashboard' 
          : `/${userType}/dashboard`;
        
        window.location.href = redirectPath;
      }
    } catch (error: any) {
      setSubmitError(error.message);
      setLoading(false);
    }
  };

  const userTypes = [
    { 
      value: 'tenant',
      label: 'Tenant', 
      icon: Home,
      testAccount: 'tenant@keyat.co.bw'
    },
    { 
      value: 'landlord',
      label: 'Landlord', 
      icon: Building2,
      testAccount: 'landlord@keyat.co.bw'
    },
    { 
      value: 'agent',
      label: 'Agent', 
      icon: UserCheck,
      testAccount: 'agent@keyat.co.bw'
    },
    { 
      value: 'service',
      label: 'Service', 
      icon: Settings,
      testAccount: 'service@keyat.co.bw'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-cyan-50/5 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          
          {/* HEADER - MATCHES REGISTER PERFECTLY */}
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
                <BadgeCheck className="w-3 h-3 text-green-500" />
                <span className="text-gray-500 text-xs">Verified</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-blue-500" />
                <span className="text-gray-500 text-xs">Botswana</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-blue-500" />
                <span className="text-gray-500 text-xs">Secure</span>
              </div>
            </div>
          </motion.div>

          {/* DEVELOPMENT QUICK LOGIN - PROFESSIONAL */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm"
            >
              <p className="text-sm font-semibold text-blue-800 mb-3 text-center">
                Development Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                {userTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <motion.button
                      key={type.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleQuickLogin(type.testAccount, type.value)}
                      disabled={loading}
                      className="flex items-center space-x-2 px-3 py-2 bg-white text-blue-700 text-xs font-medium rounded-lg border border-blue-200 hover:bg-blue-50 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IconComponent className="w-3 h-3" />
                      <span>{type.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              <p className="text-xs text-blue-600 mt-3 text-center font-medium">
                Password: <code className="bg-white px-2 py-1 rounded border border-blue-200 font-mono text-xs">Password123!</code>
              </p>
            </motion.div>
          )}

          {/* SMART DETECTION - PROFESSIONAL */}
          {detectedUserType && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2"
            >
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <BadgeCheck className="w-3 h-3 text-blue-600" />
              </div>
              <p className="text-sm text-blue-700 font-medium">
                Detected: <span className="capitalize">{detectedUserType}</span> account
              </p>
            </motion.div>
          )}

          {/* MAIN LOGIN CARD - BATTLE-TESTED */}
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
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    <LogIn className="w-4 h-4" />
                    <span>Sign in to Account</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* FOOTER - MATCHES REGISTER */}
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