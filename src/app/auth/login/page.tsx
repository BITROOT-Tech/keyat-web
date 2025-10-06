// src/app/auth/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client'; // FIXED: Use createClient instead of direct import

// Modern Notification Component
const Notification = ({ type, text, onClose, show }: { 
  type: string; 
  text: string; 
  onClose: () => void;
  show: boolean;
}) => {
  useEffect(() => {
    if (show && type !== 'loading') {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, type, onClose]);

  if (!show) return null;

  const icons = {
    success: '✅',
    error: '❌',
    info: '💡',
    loading: '⏳'
  };

  const styles = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-blue-500 border-blue-600',
    loading: 'bg-purple-500 border-purple-600'
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
      <div className={`flex items-center space-x-3 px-6 py-4 rounded-2xl text-white shadow-2xl border ${styles[type as keyof typeof styles]} min-w-80 max-w-md`}>
        <span className="text-xl">{icons[type as keyof typeof icons]}</span>
        <span className="flex-1 font-medium">{text}</span>
        <button 
          onClick={onClose}
          className="ml-2 hover:scale-110 transition-transform"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('tenant');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: string; text: string; show: boolean }>({ 
    type: '', 
    text: '', 
    show: false 
  });

  // FIXED: Create supabase client instance
  const supabase = createClient();

  const showNotification = (type: string, text: string) => {
    setNotification({ type, text, show: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showNotification('loading', 'Signing you in...');

    if (!email || !password) {
      showNotification('error', 'Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          showNotification('error', 'Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          showNotification('error', 'Please confirm your email before logging in');
        } else {
          showNotification('error', error.message);
        }
      } else {
        showNotification('success', 'Welcome back! Redirecting...');
        
        // Update user type in profile
        if (data.user) {
          await supabase
            .from('profiles')
            .update({ user_type: userType })
            .eq('id', data.user.id);
        }
        
        setTimeout(() => {
          window.location.href = `/dashboard`;
        }, 2000);
      }
    } catch (error: unknown) { // FIXED: Added type annotation
      showNotification('error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    showNotification('loading', `Connecting with ${provider}...`);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      showNotification('error', error.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showNotification('error', 'Please enter your email address first');
      return;
    }

    setLoading(true);
    showNotification('loading', 'Sending reset instructions...');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      showNotification('error', error.message);
    } else {
      showNotification('success', 'Password reset sent to your email!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Notification Popup */}
      <Notification 
        type={notification.type} 
        text={notification.text} 
        show={notification.show}
        onClose={hideNotification}
      />

      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Enhanced Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Keyat
                </span>
                <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full mt-1"></div>
              </div>
            </Link>
          </div>

          {/* Header with Animation */}
          <div className="mt-8 text-center animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              Welcome back
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-light">
              Continue your real estate journey
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up animation-delay-300">
          <div className="bg-white/80 backdrop-blur-lg py-8 px-6 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/20">
            {/* User Type Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'tenant', label: 'Tenant/Buyer', icon: '👤', color: 'blue' },
                  { value: 'landlord', label: 'Landlord', icon: '🏠', color: 'green' },
                  { value: 'agent', label: 'Agent', icon: '🤝', color: 'purple' },
                  { value: 'service_provider', label: 'Service Provider', icon: '🔧', color: 'orange' }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setUserType(type.value)}
                    disabled={loading}
                    className={`relative p-4 border-2 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
                      userType === type.value
                        ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg scale-105`
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-2xl">{type.icon}</span>
                      <span className={`text-xs font-semibold ${
                        userType === type.value ? `text-${type.color}-700` : 'text-gray-600'
                      }`}>
                        {type.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <span className="text-gray-400 text-lg">✉️</span>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <span className="text-gray-400 text-lg">🔒</span>
                  </div>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded-lg disabled:opacity-50"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 font-medium">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-4 px-4 border-2 border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {loading ? (
                    <span className="flex items-center space-x-2 relative z-10">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </span>
                  ) : (
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>Sign in to Keyat</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-gray-300 rounded-2xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-300 disabled:opacity-50 font-semibold"
                >
                  <span className="text-xl mr-2">🔗</span>
                  Google
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-gray-300 rounded-2xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-300 disabled:opacity-50 font-semibold"
                >
                  <span className="text-xl mr-2">🔗</span>
                  Facebook
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '} {/* FIXED: Escaped apostrophe */}
                <Link 
                  href="/auth/register" 
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors hover:underline"
                >
                  Create your Keyat account
                </Link>
              </p>
            </div>

            {/* Botswana Features */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-2xl border border-blue-500/20">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <span className="text-lg">🇧🇼</span>
                <span className="font-semibold text-gray-700">Botswana&apos;s Real Estate Platform</span> {/* FIXED: Escaped apostrophe */}
              </div>
              <div className="flex justify-center space-x-6 mt-2 text-xs text-gray-600">
                <span>💰 Orange Money</span>
                <span>•</span>
                <span>📱 Mascom MyZaka</span>
                <span>•</span>
                <span>🔒 Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}