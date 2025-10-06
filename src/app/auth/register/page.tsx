// src/app/auth/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Enhanced Notification Component
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
    success: '🎉',
    error: '❌',
    info: '💡',
    loading: '⏳'
  };

  const styles = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 border-emerald-600',
    error: 'bg-gradient-to-r from-red-500 to-rose-600 border-rose-600',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-600 border-cyan-600',
    loading: 'bg-gradient-to-r from-purple-500 to-indigo-600 border-indigo-600'
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
      <div className={`flex items-center space-x-4 px-6 py-4 rounded-2xl text-white shadow-2xl border ${styles[type]} min-w-80 max-w-md backdrop-blur-sm`}>
        <span className="text-2xl flex-shrink-0">{icons[type]}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight">{text}</p>
          {action && (
            <button 
              onClick={action.onClick}
              className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors font-medium"
            >
              {action.label}
            </button>
          )}
        </div>
        <button 
          onClick={onClose}
          className="ml-2 hover:scale-110 transition-transform flex-shrink-0 text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Email Confirmation Modal
const EmailConfirmationModal = ({ show, email, onResend, onClose }: {
  show: boolean;
  email: string;
  onResend: () => void;
  onClose: () => void;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 mx-4 max-w-md w-full shadow-2xl animate-scale-in">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl">📧</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Check Your Email!
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            We've sent a confirmation link to <strong>{email}</strong>. 
            Click the link to verify your account and start using Keyat.
          </p>

          <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-start space-x-3 text-sm text-blue-800">
              <span>💡</span>
              <div>
                <p className="font-semibold mb-2">Didn't receive the email?</p>
                <ul className="space-y-1 text-xs">
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
              className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onResend}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all shadow-lg"
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
    } catch (error) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-1/2 -right-20 w-60 h-60 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-4000"></div>
      </div>

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

          {/* Header */}
          <div className="mt-8 text-center animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              Join Keyat
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-light">
              Start your real estate journey today
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up animation-delay-300">
          <div className="bg-white/80 backdrop-blur-lg py-8 px-6 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* User Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  I want to...
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  disabled={loading}
                  className="block w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 bg-white/50 backdrop-blur-sm font-medium"
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
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 bg-white/50 backdrop-blur-sm"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 bg-white/50 backdrop-blur-sm"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium">+267</span>
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
                    className="block w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 bg-white/50 backdrop-blur-sm"
                    placeholder="71 123 456"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 bg-white/50 backdrop-blur-sm"
                  placeholder="Create a password (min. 6 characters)"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 bg-white/50 backdrop-blur-sm"
                  placeholder="Confirm your password"
                />
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded-lg mt-1 flex-shrink-0 disabled:opacity-50"
                />
                <label htmlFor="agreeToTerms" className="block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-semibold hover:underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-semibold hover:underline">
                    Privacy Policy
                  </a>
                  <p className="text-xs text-gray-500 mt-2">
                    By creating an account, you agree to our terms and acknowledge our privacy policy.
                  </p>
                </label>
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
                      <span>Creating account...</span>
                    </span>
                  ) : (
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>Create Keyat Account</span>
                      <span className="group-hover:translate-x-1 transition-transform">🚀</span>
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/auth/login" 
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors hover:underline"
                >
                  Sign in to your account
                </Link>
              </p>
            </div>

            {/* Botswana Features */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-2xl border border-blue-500/20">
              <div className="flex items-center justify-center space-x-2 text-sm mb-2">
                <span className="text-lg">🇧🇼</span>
                <span className="font-semibold text-gray-700">Built for Botswana</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-lg">💰</span>
                  <span>Orange Money</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg">📱</span>
                  <span>Mascom MyZaka</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg">🔒</span>
                  <span>Secure</span>
                </div>
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
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}