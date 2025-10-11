'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Building2, 
  UserCheck, 
  Settings,
  Shield,
  Check,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  MapPin
} from 'lucide-react';

// ADD THIS TO YOUR ROOT LAYOUT TO PREVENT THIS BULLSHIT
// <html lang="en" className="overflow-x-hidden">
// <body className="overflow-x-hidden">

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', userType: 'tenant', agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  // KILL HORIZONTAL SCROLL ON MOUNT
  useEffect(() => {
    document.documentElement.classList.add('overflow-x-hidden');
    document.body.classList.add('overflow-x-hidden');
    
    return () => {
      document.documentElement.classList.remove('overflow-x-hidden');
      document.body.classList.remove('overflow-x-hidden');
    };
  }, []);

  const nextStep = () => {
    setDirection(1);
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const userTypes = [
    { 
      value: 'tenant',
      label: 'Find Properties', 
      icon: Home,
      description: 'Rent or buy your perfect home',
      color: 'blue'
    },
    { 
      value: 'landlord', 
      label: 'List Properties', 
      icon: Building2,
      description: 'Manage your rental portfolio', 
      color: 'emerald'
    },
    { 
      value: 'agent',
      label: 'Agent Services', 
      icon: UserCheck,
      description: 'Grow your real estate business',
      color: 'violet'
    },
    { 
      value: 'service',
      label: 'Service Provider', 
      icon: Settings,
      description: 'Connect with property clients',
      color: 'amber'
    }
  ];

  return (
    // CONTAINER THAT CAN'T SCROLL HORIZONTAL
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-cyan-50/5 overflow-hidden">
      {/* MAIN WRAPPER WITH HARD CONTAINMENT */}
      <div className="w-screen min-h-screen flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-md mx-auto">
          
          {/* HEADER - CONTAINED */}
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
                Start Your Property Journey
              </h2>
              <p className="text-gray-600 text-sm">
                Join Botswana's fastest growing real estate community
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

          {/* MAIN CARD - HARD WIDTH CONSTRAINT */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-6 w-full max-w-md mx-auto"
          >
            {/* PROGRESS - FIXED WIDTH */}
            <div className="flex items-center justify-center mb-8 w-full">
              <div className="flex items-center space-x-8 max-w-full">
                {[1, 2, 3].map((step, index) => (
                  <div key={step} className="flex items-center flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300 flex-shrink-0 ${
                      index === currentStep
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : index < currentStep
                        ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {index < currentStep ? <Check className="w-4 h-4" /> : step}
                    </div>
                    {index < 2 && (
                      <div className={`w-6 h-1 mx-2 transition-all duration-300 flex-shrink-0 ${
                        index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: direction * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 w-full"
              >
                {/* STEP 1: GRID FIX */}
                {currentStep === 0 && (
                  <div className="space-y-6 w-full">
                    <div className="text-center w-full">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Choose Your Path</h3>
                      <p className="text-gray-600 text-sm">How will you use Keyat?</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {userTypes.map((type) => {
                        const IconComponent = type.icon;
                        const isActive = formData.userType === type.value;
                        
                        return (
                          <motion.button
                            key={type.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, userType: type.value }));
                              setTimeout(nextStep, 200);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 w-full ${
                              isActive
                                ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-500/20'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex flex-col items-center text-center space-y-2 w-full">
                              <div className={`p-2 rounded-lg transition-colors duration-200 ${
                                isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="space-y-1 w-full">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                  {type.label}
                                </h4>
                                <p className="text-gray-600 text-xs leading-tight">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: FORM FIX */}
                {currentStep === 1 && (
                  <div className="space-y-5 w-full">
                    <div className="text-center w-full">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Information</h3>
                      <p className="text-gray-600 text-sm">We'll use this for your account</p>
                    </div>

                    <div className="space-y-4 w-full">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-base"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-base"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-base"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <div className="flex w-full">
                        <span className="inline-flex items-center px-4 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-gray-700 text-sm font-medium flex-shrink-0">
                          +267
                        </span>
                        <input
                          type="tel"
                          className="flex-1 min-w-0 px-4 py-3 bg-white border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-base"
                          placeholder="71 123 456"
                          maxLength={8}
                          required
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-1">8-digit Botswana mobile number</p>
                    </div>

                    <div className="flex gap-3 pt-2 w-full">
                      <button
                        onClick={prevStep}
                        className="flex-1 px-4 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        onClick={nextStep}
                        className="flex-1 px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: SECURITY FIX */}
                {currentStep === 2 && (
                  <div className="space-y-5 w-full">
                    <div className="text-center w-full">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Account Security</h3>
                      <p className="text-gray-600 text-sm">Create your login credentials</p>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-base"
                        placeholder="Create secure password"
                        required
                      />
                      <div className="mt-2 w-full">
                        <div className="flex justify-between text-xs text-gray-500 mb-1 w-full">
                          <span>Password strength</span>
                          <span className="font-medium text-green-600">Strong</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full w-4/5 transition-all duration-300" />
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-base"
                        placeholder="Re-enter your password"
                        required
                      />
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 w-full">
                      <input 
                        type="checkbox" 
                        className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                        required
                      />
                      <label className="text-sm text-gray-700 flex-1">
                        I agree to the{' '}
                        <Link href="#" className="text-blue-600 font-medium hover:underline">
                          Terms and Conditions
                        </Link>
                        {' '}and{' '}
                        <Link href="#" className="text-blue-600 font-medium hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <div className="flex gap-3 pt-2 w-full">
                      <button
                        onClick={prevStep}
                        className="flex-1 px-4 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25">
                        <Shield className="w-4 h-4" />
                        <span>Create Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* FOOTER - CONTAINED */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6 w-full"
          >
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}