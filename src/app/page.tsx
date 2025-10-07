// src/app/page.tsx - COMPLETE PROFESSIONAL VERSION
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// 🚀 CLEAN SPLASH SCREEN - PROFESSIONAL
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing platform...');

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 36);

    const statusMessages = [
      'Initializing platform...',
      'Loading property database...',
      'Verifying security protocols...',
      'Connecting payment systems...',
      'Ready to launch!'
    ];

    let currentStatus = 0;
    const statusInterval = setInterval(() => {
      if (currentStatus < statusMessages.length - 1) {
        currentStatus++;
        setStatus(statusMessages[currentStatus]);
      }
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [onComplete]);

  const handleSkip = () => {
    localStorage.setItem('hasVisitedKeyat', 'true');
    localStorage.setItem('lastVisitKeyat', Date.now().toString());
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Keyat
          </h1>
          <p className="text-gray-600 text-center text-sm mt-2">
            Real Estate Platform
          </p>
        </div>
      </div>

      {/* Footer with Progress - Fixed at Bottom */}
      <div className="w-full max-w-md px-8 pb-8">
        {/* Status Message */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            {status}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Skip button */}
        {progress < 100 && (
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Skip
            </button>
          </div>
        )}

        {/* Branding */}
        <div className="text-center pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs text-gray-400">
              powered by
            </span>
            <span className="text-sm font-semibold text-gray-800">
              BITROOT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Clean background
const CleanBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gray-50/50"></div>
      <div className="absolute inset-0 clean-grid-bg opacity-30"></div>
    </div>
  );
};

// Professional Header Component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
        : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-none">
                Keyat
              </span>
              <span className="text-[10px] text-gray-500 leading-none -mt-0.5">Powered by BITROOT</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm py-2">
              Features
            </a>
            <a href="#stats" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm py-2">
              Progress
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm py-2">
              Testimonials
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm py-2">
              Pricing
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/auth/login" 
              className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 text-sm"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register" 
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 text-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}></span>
              <span className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm py-2">
                Features
              </a>
              <a href="#stats" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm py-2">
                Progress
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm py-2">
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm py-2">
                Pricing
              </a>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <Link 
                  href="/auth/login" 
                  className="px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 text-center"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 text-center"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Professional Footer Component
const Footer = () => {
  return (
    <footer className="relative z-10 bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Keyat</span>
                <div className="text-xs text-gray-400 -mt-0.5">Powered by BITROOT</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The next-generation real estate platform transforming property transactions with cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">Instagram</span>
                📷
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Testimonials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Case Studies</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Community</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Partners</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Keyat. Powered by BITROOT. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Optimized animated counter
const AnimatedCounter = ({ end, duration = 1800 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounter();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounter = () => {
    const startTime = Date.now();
    
    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
      const currentCount = Math.floor(easeOut(progress) * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  return (
    <span ref={ref} className="font-bold tabular-nums">
      {count.toLocaleString()}+
    </span>
  );
};

// Professional feature card
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  index 
}: { 
  icon: string; 
  title: string; 
  description: string; 
  index: number; 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`group relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } hover:-translate-y-1`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-2xl mb-3 text-blue-600">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

// User type selector
const UserTypeSelector = () => {
  const [selectedType, setSelectedType] = useState('tenant');
  
  const userTypes = [
    { 
      id: 'tenant', 
      label: 'Tenant/Buyer', 
      icon: '👤', 
      description: 'Find perfect properties'
    },
    { 
      id: 'landlord', 
      label: 'Property Owner', 
      icon: '🏠', 
      description: 'Manage your listings'
    },
    { 
      id: 'agent', 
      label: 'Real Estate Agent', 
      icon: '🤝', 
      description: 'Grow your business'
    },
    { 
      id: 'service_provider', 
      label: 'Service Provider', 
      icon: '🔧', 
      description: 'Offer your services'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12 max-w-4xl mx-auto">
      {userTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => setSelectedType(type.id)}
          className={`relative p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
            selectedType === type.id
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="text-2xl mb-2">{type.icon}</div>
          <div className="font-semibold text-xs mb-1 leading-tight">{type.label}</div>
          <div className={`text-xs leading-tight ${
            selectedType === type.id ? 'text-white/90' : 'text-gray-500'
          }`}>
            {type.description}
          </div>
        </button>
      ))}
    </div>
  );
};

// Testimonial Component
const TestimonialCard = ({ 
  name, 
  role, 
  content, 
  avatar 
}: { 
  name: string; 
  role: string; 
  content: string; 
  avatar: string; 
}) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
        {avatar}
      </div>
      <div>
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-sm text-gray-600">{role}</div>
      </div>
    </div>
    <p className="text-gray-600 text-sm leading-relaxed">"{content}"</p>
  </div>
);

// 🎯 MAIN PAGE COMPONENT
export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedKeyat');
    const lastVisit = localStorage.getItem('lastVisitKeyat');
    const currentVersion = '1.0.0';
    const savedVersion = localStorage.getItem('keyatVersion');
    
    const shouldShowSplash = !hasVisited || 
      (lastVisit && Date.now() - parseInt(lastVisit) > 7 * 24 * 60 * 60 * 1000) ||
      savedVersion !== currentVersion;

    setShowSplash(shouldShowSplash);
    setMounted(true);

    if (!shouldShowSplash) {
      localStorage.setItem('lastVisitKeyat', Date.now().toString());
    }
  }, []);

  const handleSplashComplete = () => {
    localStorage.setItem('hasVisitedKeyat', 'true');
    localStorage.setItem('lastVisitKeyat', Date.now().toString());
    localStorage.setItem('keyatVersion', '1.0.0');
    setShowSplash(false);
  };

  const handleEarlyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setEmail('');
  };

  // REALISTIC STARTUP NUMBERS
  const stats = [
    { number: 127, label: 'Properties Listed' },
    { number: 84, label: 'Active Users' },
    { number: 23, label: 'Verified Agents' },
    { number: 3, label: 'Cities Live' }
  ];

  const features = [
    {
      icon: '💳',
      title: 'Multiple Payment Options',
      description: 'Seamless payments with local and international payment methods'
    },
    {
      icon: '🔒',
      title: 'Secure & Verified',
      description: 'All properties and professionals are thoroughly verified'
    },
    {
      icon: '📱',
      title: 'Mobile First Design',
      description: 'Beautiful experience optimized for all devices'
    },
    {
      icon: '🚀',
      title: 'Instant Notifications',
      description: 'Real-time updates on properties and inquiries'
    },
    {
      icon: '🏆',
      title: 'Professional Network',
      description: 'Connect with verified real estate professionals'
    },
    {
      icon: '💬',
      title: 'Direct Communication',
      description: 'Secure messaging with property owners and agents'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Property Owner',
      content: 'Keyat helped me rent out my property in just 3 days. The platform is incredibly intuitive and the support team is amazing!',
      avatar: 'SM'
    },
    {
      name: 'David K.',
      role: 'Real Estate Agent',
      content: 'As an agent, Keyat has transformed how I manage listings and connect with clients. The commission tracking is a game-changer.',
      avatar: 'DK'
    },
    {
      name: 'Lisa T.',
      role: 'Tenant',
      content: 'Found my dream apartment through Keyat. The verification process gave me confidence, and the payment system was seamless.',
      avatar: 'LT'
    }
  ];

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <CleanBackground />
      <Header />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium mb-6">
                🚀 Next-Generation Real Estate
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-gray-900">
                  Smart Property
                </span>
                <br />
                <span className="text-blue-600">
                  Management Platform
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Discover, transact, and manage properties seamlessly with our intelligent platform. 
                Powered by cutting-edge technology for a superior real estate experience.
              </p>
            </div>

            <div className="mb-12">
              <UserTypeSelector />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
              <Link 
                href="/auth/register" 
                className="group relative px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center space-x-2 text-sm">
                  <span>Start Free Trial</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </span>
              </Link>
              
              <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 bg-white text-sm">
                View Demo
              </button>
            </div>

            <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                    <AnimatedCounter end={stat.number} />
                  </div>
                  <div className="text-gray-600 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Platform Features
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Everything you need for modern real estate transactions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              What Our Users Say
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Join thousands of satisfied users transforming their real estate experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                avatar={testimonial.avatar}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative z-10 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-6">
              Join our growing community of property professionals and seekers
            </p>
            
            <form onSubmit={handleEarlyAccess} className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for early access"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>Joining...</span>
                  </div>
                ) : (
                  'Get Early Access'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />

      {/* Clean animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .clean-grid-bg {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}