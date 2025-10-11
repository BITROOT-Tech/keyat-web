// src/app/auth/login/page.tsx - BATTLE-HARDENED SINGLE PAGE
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { validateEmail, validateRequired } from '@/lib/validators';
import { USER_ROLES, TEST_ACCOUNTS } from '@/lib/constants';

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
  const [detectedUserType, setDetectedUserType] = useState<string>('');
  
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // AUTO-DETECT USER TYPE FROM EMAIL - SMART UX
  useEffect(() => {
    if (!formData.email) {
      setDetectedUserType('');
      return;
    }

    const email = formData.email.toLowerCase();
    if (email.includes('tenant') || email.includes('renter')) {
      setDetectedUserType(USER_ROLES.TENANT);
    } else if (email.includes('landlord') || email.includes('owner')) {
      setDetectedUserType(USER_ROLES.LANDLORD);
    } else if (email.includes('agent') || email.includes('realtor')) {
      setDetectedUserType(USER_ROLES.AGENT);
    } else if (email.includes('service') || email.includes('repair')) {
      setDetectedUserType(USER_ROLES.SERVICE);
    } else if (email.includes('admin')) {
      setDetectedUserType(USER_ROLES.ADMIN);
    } else {
      setDetectedUserType('');
    }
  }, [formData.email]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validateRequired(formData.password, 'Password');
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Mark all fields as touched
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
          throw new Error('Invalid email or password. Please try again.');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email before signing in.');
        }
        throw error;
      }

      if (data.user) {
        // SMART REDIRECT: Use detected type OR fallback to metadata
        const userType = detectedUserType || data.user.user_metadata?.user_type || USER_ROLES.TENANT;
        const redirectPath = userType === USER_ROLES.TENANT 
          ? '/consumer/dashboard' 
          : `/${userType}/dashboard`;
        
        console.log('Login successful, redirecting to:', redirectPath);
        router.push(redirectPath);
        router.refresh();
      }

    } catch (error: any) {
      setSubmitError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (submitError) setSubmitError('');
  };

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // QUICK LOGIN - BATTLE-TESTED
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
        const redirectPath = userType === USER_ROLES.TENANT 
          ? '/consumer/dashboard' 
          : `/${userType}/dashboard`;
        
        console.log('Quick login successful, redirecting to:', redirectPath);
        window.location.href = redirectPath;
      }
    } catch (error: any) {
      setSubmitError(error.message);
      setLoading(false);
    }
  };

  const userTypes = [
    { 
      value: USER_ROLES.TENANT,
      label: 'Tenant', 
      icon: '🔍',
      testAccount: TEST_ACCOUNTS.TENANT.email
    },
    { 
      value: USER_ROLES.LANDLORD,
      label: 'Landlord', 
      icon: '🏠',
      testAccount: TEST_ACCOUNTS.LANDLORD.email
    },
    { 
      value: USER_ROLES.AGENT,
      label: 'Agent', 
      icon: '🤝',
      testAccount: TEST_ACCOUNTS.AGENT.email
    },
    { 
      value: USER_ROLES.SERVICE,
      label: 'Service', 
      icon: '🔧',
      testAccount: TEST_ACCOUNTS.SERVICE.email
    },
    { 
      value: USER_ROLES.ADMIN,
      label: 'Admin', 
      icon: '⚡',
      testAccount: TEST_ACCOUNTS.ADMIN.email
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/* HEADER - PROFESSIONAL */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-base">K</span>
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-gray-900 block">Keyat</span>
              <span className="text-xs text-gray-500 block -mt-1">Real Estate</span>
            </div>
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* DEVELOPMENT QUICK LOGIN - PROMINENT BUT CLEAN */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800 font-semibold mb-3 flex items-center justify-center">
              <span className="mr-2">⚡</span>
              Development Quick Access
              <span className="ml-2">⚡</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {userTypes.slice(0, 3).map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleQuickLogin(type.testAccount, type.value)}
                  disabled={loading}
                  className={`
                    text-xs font-medium py-2 px-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1
                    ${loading 
                      ? 'bg-blue-200 text-blue-600 cursor-not-allowed' 
                      : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 hover:shadow-sm hover:border-blue-300'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {userTypes.slice(3).map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleQuickLogin(type.testAccount, type.value)}
                  disabled={loading}
                  className={`
                    text-xs font-medium py-2 px-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1
                    ${loading 
                      ? 'bg-blue-200 text-blue-600 cursor-not-allowed' 
                      : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 hover:shadow-sm hover:border-blue-300'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-3 text-center font-medium">
              Password: <code className="bg-white px-2 py-1 rounded border border-blue-200 font-mono">Password123!</code>
            </p>
          </div>
        )}

        {/* SMART USER TYPE DETECTION INDICATOR */}
        {detectedUserType && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-sm">🎯</span>
            </div>
            <p className="text-sm text-green-700 font-medium">
              Detected: <span className="capitalize">{detectedUserType}</span> account
            </p>
          </div>
        )}

        {/* SINGLE FORM - PROFESSIONAL & CLEAN */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address *
            </label>
            <input
              ref={emailRef}
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleInputBlur('email')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                <span className="mr-1">⚠</span>
                {errors.email}
              </p>
            )}
          </div>

          <div>
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
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleInputBlur('password')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                <span className="mr-1">⚠</span>
                {errors.password}
              </p>
            )}
          </div>

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 font-medium flex items-center">
                <span className="mr-2">❌</span>
                {submitError}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Sign in to account</span>
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link 
              href="/auth/register" 
              className="text-blue-600 hover:text-blue-500 font-semibold underline transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}