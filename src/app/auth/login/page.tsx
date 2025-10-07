// src/app/auth/login/page.tsx - CLEAN PROFESSIONAL VERSION
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// Professional Notification Component
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
    loading: 'bg-blue-600 border-blue-700'
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-white shadow-lg border ${styles[type as keyof typeof styles]} min-w-80 max-w-md`}>
        <span className="text-lg">{icons[type as keyof typeof icons]}</span>
        <span className="flex-1 font-medium text-sm">{text}</span>
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
    } catch (error: unknown) {
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Notification Popup */}
      <Notification 
        type={notification.type} 
        text={notification.text} 
        show={notification.show}
        onClose={hideNotification}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Professional Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">Keyat</span>
              <div className="h-1 w-full bg-blue-600 rounded-full mt-1"></div>
            </div>
          </Link>
        </div>

        {/* Header */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome back
          </h2>
          <p className="text-gray-600 text-sm">
            Continue your real estate journey
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-lg sm:px-10 border border-gray-200">
          {/* User Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'tenant', label: 'Tenant/Buyer', icon: '👤' },
                { value: 'landlord', label: 'Landlord', icon: '🏠' },
                { value: 'agent', label: 'Agent', icon: '🤝' },
                { value: 'service_provider', label: 'Service Provider', icon: '🔧' }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setUserType(type.value)}
                  disabled={loading}
                  className={`relative p-3 border rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
                    userType === type.value
                      ? 'border-blue-500 bg-blue-50 shadow-sm scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-xl">{type.icon}</span>
                    <span className={`text-xs font-medium ${
                      userType === type.value ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {type.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 bg-white text-sm"
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-gray-400">✉️</span>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 bg-white text-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-gray-400">🔒</span>
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Sign in to Keyat</span>
                    <span>→</span>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 font-medium text-sm"
              >
                <span className="mr-2">🔗</span>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 font-medium text-sm"
              >
                <span className="mr-2">🔗</span>
                Facebook
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                href="/auth/register" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors hover:underline"
              >
                Create your Keyat account
              </Link>
            </p>
          </div>

          {/* Botswana Features */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center space-x-2 text-sm mb-2">
              <span className="text-base">🇧🇼</span>
              <span className="font-medium text-gray-700">Botswana's Real Estate Platform</span>
            </div>
            <div className="flex justify-center space-x-4 text-xs text-gray-600">
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
  );
}