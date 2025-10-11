// src/app/auth/register/page.tsx - COMPLETELY FIXED
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { validateEmail, validatePhone, validatePassword, validateRequired } from '@/lib/validators';
import { USER_ROLES, TEST_ACCOUNTS } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'tenant' as string,
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  
  const firstNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Auto-focus first field on step change
  useEffect(() => {
    if (currentStep === 1) {
      setTimeout(() => firstNameRef.current?.focus(), 300);
    } else if (currentStep === 2) {
      setTimeout(() => passwordRef.current?.focus(), 300);
    }
  }, [currentStep]);

  // Enhanced validation using our new validators
  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'firstName':
        return validateRequired(value, 'First name');
      case 'lastName':
        return validateRequired(value, 'Last name');
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        return value !== formData.password ? 'Passwords do not match' : '';
      case 'userType':
        return !value ? 'Please select an account type' : '';
      case 'agreeToTerms':
        return !value ? 'You must agree to the terms and conditions' : '';
      default:
        return '';
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) {
      const error = validateField('userType', formData.userType);
      if (error) newErrors.userType = error;
    }
    
    if (step === 1) {
      const fields = ['firstName', 'lastName', 'email', 'phone'];
      fields.forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        if (error) {
          newErrors[field] = error;
          setTouched(prev => ({ ...prev, [field]: true }));
        }
      });
    }
    
    if (step === 2) {
      const fields = ['password', 'confirmPassword', 'agreeToTerms'];
      fields.forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        if (error) {
          newErrors[field] = error;
          setTouched(prev => ({ ...prev, [field]: true }));
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Mark all fields as touched to show errors
    const allFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'agreeToTerms', 'userType'];
    const allTouched = allFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
    
    if (!validateStep(2)) {
      setCurrentStep(2);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const formattedPhone = `+267${formData.phone.replace(/\s/g, '')}`;

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            phone: formattedPhone,
            user_type: formData.userType,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error('User already registered');
      }

      if (data.user) {
        // Redirect based on user type
        const redirectPath = formData.userType === 'tenant' ? '/dashboard' : `/${formData.userType}/dashboard`;
        router.push(`/auth/confirm?email=${encodeURIComponent(formData.email)}&redirect=${redirectPath}`);
      }

    } catch (error: any) {
      setSubmitError(
        error.message.includes('already registered') 
          ? 'An account with this email already exists. Please sign in.'
          : 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation for touched fields
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
    
    if (submitError) setSubmitError('');
  };

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 2));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Enhanced password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '', width: '0%' };
    
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^a-zA-Z\d]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    
    const strengths = [
      { label: 'Very Weak', color: 'bg-red-500', width: '20%' },
      { label: 'Weak', color: 'bg-orange-500', width: '40%' },
      { label: 'Fair', color: 'bg-yellow-500', width: '60%' },
      { label: 'Good', color: 'bg-blue-500', width: '80%' },
      { label: 'Strong', color: 'bg-green-500', width: '100%' }
    ];
    
    return { ...strengths[strength - 1] || strengths[0], strength };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Enhanced user types with constants - FIXED TYPE ISSUES
  const userTypes = [
    { 
      value: USER_ROLES.TENANT as string,
      label: 'Looking to Rent or Buy', 
      icon: '🔍', 
      description: 'Find properties',
      testAccount: TEST_ACCOUNTS.TENANT.email
    },
    { 
      value: USER_ROLES.LANDLORD as string,
      label: 'Property Owner', 
      icon: '🏠', 
      description: 'List and manage properties',
      testAccount: TEST_ACCOUNTS.LANDLORD.email
    },
    { 
      value: USER_ROLES.AGENT as string,
      label: 'Real Estate Agent', 
      icon: '🤝', 
      description: 'Professional services',
      testAccount: TEST_ACCOUNTS.AGENT.email
    },
    { 
      value: USER_ROLES.SERVICE as string,
      label: 'Service Provider', 
      icon: '🔧', 
      description: 'Maintenance & repairs',
      testAccount: TEST_ACCOUNTS.SERVICE.email
    }
  ];

  const steps = [
    {
      title: "Create your account",
      subtitle: "Choose how you'll use Keyat",
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3">
            {userTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  handleInputChange('userType', type.value);
                  setTimeout(nextStep, 150);
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 group ${
                  formData.userType === type.value
                    ? 'border-blue-500 bg-blue-50 shadow-sm scale-[1.02]'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`text-2xl p-2 rounded-lg transition-colors ${
                    formData.userType === type.value ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    {type.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 text-sm">{type.label}</h3>
                    <p className="text-gray-600 text-xs mt-0.5">{type.description}</p>
                    {/* Show test account info in dev */}
                    {process.env.NODE_ENV === 'development' && (
                      <p className="text-blue-600 text-xs mt-1 font-mono">
                        Test: {type.testAccount}
                      </p>
                    )}
                  </div>
                  {formData.userType === type.value && (
                    <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          {errors.userType && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{errors.userType}</p>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Your information",
      subtitle: "We'll use this to create your account",
      component: (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First name *
              </label>
              <input
                ref={firstNameRef}
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onBlur={() => handleInputBlur('firstName')}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onBlur={() => handleInputBlur('lastName')}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleInputBlur('email')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone number *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 bg-gray-50 border border-r-0 border-gray-300 rounded-l-xl text-gray-700 text-sm font-medium">
                +267
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleInputBlur('phone')}
                className={`flex-1 px-4 py-3 border border-l-0 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="71 123 456"
                maxLength={8}
              />
            </div>
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Enter your 8-digit Botswana number
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Account security",
      subtitle: "Choose a strong password",
      component: (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              ref={passwordRef}
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleInputBlur('password')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="At least 8 characters with letters and numbers"
            />
            
            {/* Enhanced Password Strength Indicator */}
            {formData.password && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Password strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.strength <= 2 ? 'text-red-600' :
                    passwordStrength.strength === 3 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className={`${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                    ✓ 8+ characters
                  </div>
                  <div className={`${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    ✓ Lowercase letter
                  </div>
                  <div className={`${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    ✓ Uppercase letter
                  </div>
                  <div className={`${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
                    ✓ Number
                  </div>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm password *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onBlur={() => handleInputBlur('confirmPassword')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your password again"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.confirmPassword}</p>
            )}
          </div>

          <div className={`flex items-start space-x-4 p-4 rounded-xl border transition-all duration-200 ${
            errors.agreeToTerms ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              onBlur={() => handleInputBlur('agreeToTerms')}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700 flex-1">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500 font-medium underline">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500 font-medium underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-600 font-medium -mt-3">{errors.agreeToTerms}</p>
          )}

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 font-medium">{submitError}</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
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
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-600">
            {steps[currentStep].subtitle}
          </p>
        </div>

        {/* Improved Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-8">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  index === currentStep
                    ? 'border-blue-600 bg-blue-600 text-white scale-110'
                    : index < currentStep
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {steps[currentStep].component}
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-blue-600 hover:text-blue-500 font-medium underline transition-colors"
            >
              Sign in here
            </Link>
          </p>
          {/* Development helper */}
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-gray-500 mt-2">
              Test password: <code className="bg-gray-100 px-1 rounded">Password123!</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}