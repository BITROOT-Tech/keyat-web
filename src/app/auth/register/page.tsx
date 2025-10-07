// src/app/auth/register/page.tsx - CLEAN PROFESSIONAL VERSION
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// Professional Notification Component
const Notification = ({ type, text, onClose, show, action }: { 
  type: string; 
  text: string; 
  onClose: () => void;
  show: boolean;
  action?: { label: string; onClick: () => void };
}) => {
  useEffect(() => {
    if (show && type !== 'loading') {
      const timer = setTimeout(onClose, 6000);
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
      <div className={`flex items-center space-x-4 px-6 py-4 rounded-xl text-white shadow-lg border ${styles[type as keyof typeof styles]} min-w-80 max-w-md backdrop-blur-sm`}>
        <span className="text-xl flex-shrink-0">{icons[type as keyof typeof icons]}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-tight">{text}</p>
          {action && (
            <button 
              onClick={action.onClick}
              className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors font-medium"
            >
              {action.label}
            </button>
          )}
        </div>
        <button 
          onClick={onClose}
          className="ml-2 hover:scale-110 transition-transform flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Professional Email Confirmation Modal
const EmailConfirmationModal = ({ show, email, onResend, onClose }: {
  show: boolean;
  email: string;
  onResend: () => void;
  onClose: () => void;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl p-6 mx-4 max-w-md w-full shadow-xl animate-scale-in">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-2xl text-white">📧</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Check Your Email!
          </h3>
          
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            We've sent a confirmation link to <strong>{email}</strong>. 
            Click the link to verify your account and start using Keyat.
          </p>

          <div className="bg-blue-50 rounded-lg p-3 mb-4 text-left">
            <div className="flex items-start space-x-2 text-sm text-blue-800">
              <span>💡</span>
              <div>
                <p className="font-medium mb-1">Didn't receive the email?</p>
                <ul className="text-xs space-y-1">
                  <li>• Check your spam folder</li>
                  <li>• Verify your email address</li>
                  <li>• Wait a few minutes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Close
            </button>
            <button
              onClick={onResend}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm text-sm"
            >
              Resend Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'tenant',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ 
    type: string; 
    text: string; 
    show: boolean;
    action?: { label: string; onClick: () => void };
  }>({ type: '', text: '', show: false });
  const [showEmailModal, setShowEmailModal] = useState(false);

  const supabase = createClient();

  const showNotification = (type: string, text: string, action?: { label: string; onClick: () => void }) => {
    setNotification({ type, text, show: true, action });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showNotification('loading', 'Creating your account...');

    if (formData.password !== formData.confirmPassword) {
      showNotification('error', 'Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      showNotification('error', 'Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      showNotification('error', 'Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            user_type: formData.userType,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          showNotification('error', 'Account already exists. Please sign in.', {
            label: 'Go to Login',
            onClick: () => window.location.href = '/auth/login'
          });
        } else {
          showNotification('error', error.message);
        }
      } else {
        showNotification('success', 'Account created successfully!');
        setShowEmailModal(true);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          userType: 'tenant',
          agreeToTerms: false
        });
      }
    } catch (error: unknown) {
      showNotification('error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: formData.email,
    });

    if (error) {
      showNotification('error', error.message);
    } else {
      showNotification('success', 'Confirmation email sent!');
      setShowEmailModal(false);
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
        action={notification.action}
      />

      {/* Email Confirmation Modal */}
      <EmailConfirmationModal 
        show={showEmailModal}
        email={formData.email}
        onResend={resendConfirmation}
        onClose={() => setShowEmailModal(false)}
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
            Join Keyat
          </h2>
          <p className="text-gray-600 text-sm">
            Start your real estate journey today
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                I want to...
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                disabled={loading}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 bg-white font-medium text-sm"
              >
                <option value="tenant">🏠 Rent or Buy Properties</option>
                <option value="landlord">💰 List My Properties</option>
                <option value="agent">🤝 Work as an Agent</option>
                <option value="service_provider">🔧 Provide Services</option>
              </select>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 bg-white text-sm"
                  placeholder="First name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 bg-white text-sm"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 bg-white text-sm"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">+267</span>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className="block w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 bg-white text-sm"
                  placeholder="71 123 456"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 bg-white text-sm"
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 bg-white text-sm"
                placeholder="Confirm your password"
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                disabled={loading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5 flex-shrink-0 disabled:opacity-50"
              />
              <label htmlFor="agreeToTerms" className="block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium hover:underline">
                  Privacy Policy
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  By creating an account, you agree to our terms and acknowledge our privacy policy.
                </p>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating account...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Create Keyat Account</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors hover:underline"
              >
                Sign in to your account
              </Link>
            </p>
          </div>

          {/* Botswana Features */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center space-x-2 text-sm mb-2">
              <span className="text-base">🇧🇼</span>
              <span className="font-medium text-gray-700">Built for Botswana</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 text-center">
              <div className="flex flex-col items-center">
                <span className="text-base">💰</span>
                <span>Orange Money</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base">📱</span>
                <span>Mascom MyZaka</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base">🔒</span>
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}