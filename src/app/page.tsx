// src/app/page.tsx - FINAL BATTLE-TESTED VERSION
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BattleTestedLanding() {
  const [mounted, setMounted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Auto-rotate hero slides
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Battle-tested content
  const heroSlides = [
    {
      title: "Botswana's Real Estate Revolution",
      subtitle: "Find, rent, and manage properties with Orange Money integration across all devices",
      cta: "Browse Properties",
      href: "/search",
      gradient: "from-blue-600 to-blue-700",
      stats: ["5+ Cities", "Verified Listings", "24/7 Support"]
    },
    {
      title: "For Property Owners & Agents", 
      subtitle: "Professional tools for managing your portfolio with instant payment processing",
      cta: "List Property Free",
      href: "/auth/register",
      gradient: "from-green-600 to-green-700",
      stats: ["0% Commission", "Instant Payments", "Tenant Management"]
    },
    {
      title: "Secure Mobile Payments",
      subtitle: "Orange Money, Mascom MyZaka, and bank transfers with enterprise security",
      cta: "Payment Options", 
      href: "/payments",
      gradient: "from-purple-600 to-purple-700",
      stats: ["🟠 Orange Money", "💜 Mascom MyZaka", "🔒 Bank Security"]
    }
  ];

  const features = [
    {
      icon: "🟠",
      title: "Orange Money Integration",
      description: "Secure rental payments through Botswana's most trusted mobile money platform"
    },
    {
      icon: "✅", 
      title: "Verified Properties",
      description: "Every listing and professional verified for your safety and peace of mind"
    },
    {
      icon: "📱",
      title: "Mobile-First Design",
      description: "Optimized for smartphones with full desktop capabilities for professionals"
    },
    {
      icon: "🏙️",
      title: "Nationwide Coverage",
      description: "Properties across Gaborone, Francistown, Maun, and major cities"
    },
    {
      icon: "🤝",
      title: "Agent Network", 
      description: "Connect with verified real estate professionals across Botswana"
    },
    {
      icon: "🔒",
      title: "Bank-Level Security",
      description: "Military-grade encryption for all payments and personal data"
    }
  ];

  const cities = [
    { name: "Gaborone", properties: "50+", emoji: "🏙️" },
    { name: "Francistown", properties: "30+", emoji: "🏘️" }, 
    { name: "Maun", properties: "25+", emoji: "🌅" },
    { name: "Palapye", properties: "15+", emoji: "🏠" },
    { name: "Serowe", properties: "12+", emoji: "🌄" },
    { name: "Mahalapye", properties: "10+", emoji: "🛣️" }
  ];

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Browse Properties", href: "/search" },
        { name: "List Property", href: "/auth/register" },
        { name: "For Agents", href: "/agent/dashboard" },
        { name: "For Landlords", href: "/landlord/dashboard" }
      ]
    },
    {
      title: "Company", 
      links: [
        { name: "About BITROOT", href: "https://bitroot.tech" },
        { name: "Contact", href: "/contact" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Payment Help", href: "/payments/help" },
        { name: "Safety Tips", href: "/safety" },
        { name: "Contact Support", href: "/support" }
      ]
    }
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center safe-area-padding">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Keyat Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Responsive Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 safe-area-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-none">Keyat</span>
                <span className="text-xs text-gray-500 leading-none -mt-0.5">Powered by BITROOT</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
                Features
              </a>
              <a href="#cities" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
                Cities
              </a>
              <a href="#payments" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
                Payments
              </a>
              <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
                Browse Properties
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link 
                href="/auth/login" 
                className="px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 text-sm touch-manipulation"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-all text-sm hidden sm:block touch-manipulation"
              >
                List Property
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gray-50 pt-20 safe-area-padding">
        {/* Mobile-Optimized Hero Section */}
        <section className="py-8 lg:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              {/* Hero Content */}
              <div className="text-center lg:text-left mb-8 lg:mb-0">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium mb-4">
                  🇧🇼 Botswana's Real Estate Platform
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Find Your Perfect<br />
                  <span className="text-blue-600">Property in Botswana</span>
                </h1>
                
                <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Rent, buy, or list properties with secure Orange Money payments. 
                  Verified listings across Botswana on mobile and desktop.
                </p>

                {/* Mobile-optimized CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                  <Link
                    href="/search"
                    className="px-6 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all text-center text-sm touch-manipulation active:scale-95"
                  >
                    🔍 Browse Properties
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-6 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all text-center text-sm touch-manipulation active:scale-95"
                  >
                    🏠 List Property Free
                  </Link>
                </div>

                {/* Mobile Stats */}
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto lg:mx-0 lg:grid-cols-4 lg:max-w-md">
                  {["5+ Cities", "100% Verified", "24/7 Support", "🟠 Payments"].map((stat) => (
                    <div key={stat} className="text-center lg:text-left bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-sm font-bold text-blue-600">{stat}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Visual - Mobile optimized */}
              <div className="relative">
                <div className={`bg-gradient-to-br ${heroSlides[activeSlide].gradient} rounded-2xl p-6 text-white shadow-xl`}>
                  <div className="flex justify-center space-x-2 mb-4">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all touch-manipulation ${
                          index === activeSlide ? 'bg-white w-4' : 'bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <h2 className="text-xl font-bold mb-3 leading-tight">
                    {heroSlides[activeSlide].title}
                  </h2>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    {heroSlides[activeSlide].subtitle}
                  </p>
                  <Link
                    href={heroSlides[activeSlide].href}
                    className="w-full bg-white text-gray-900 font-bold py-3 px-6 rounded-xl text-center block active:scale-95 transition-transform touch-manipulation text-sm"
                  >
                    {heroSlides[activeSlide].cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile-optimized Features Grid */}
        <section id="features" className="py-12 lg:py-24 bg-white px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                Built for Botswana's Market
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm lg:text-base">
                Technology solutions designed specifically for Botswana's unique real estate landscape
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-gray-50 rounded-xl p-4 lg:p-6 border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="text-2xl lg:text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile-optimized Cities Section */}
        <section id="cities" className="py-12 lg:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                Nationwide Coverage
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm lg:text-base">
                Properties across Botswana's major cities and towns
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {cities.map((city) => (
                <Link
                  key={city.name}
                  href={`/search?location=${city.name}`}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all active:scale-95 touch-manipulation group"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{city.emoji}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{city.properties} properties</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-blue-600 transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Methods - Mobile optimized */}
        <section id="payments" className="py-12 lg:py-24 bg-gray-50 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Secure Payment Methods
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm lg:text-base">
              Multiple payment options with enterprise-grade security
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
              <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 rounded-xl border border-orange-200 shadow-sm w-full sm:w-auto">
                <span className="text-xl">🟠</span>
                <span className="font-bold text-orange-700 text-sm">Orange Money</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-xl border border-purple-200 shadow-sm w-full sm:w-auto">
                <span className="text-xl">💜</span>
                <span className="font-bold text-purple-700 text-sm">Mascom MyZaka</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-200 shadow-sm w-full sm:w-auto">
                <span className="text-xl">🏦</span>
                <span className="font-bold text-green-700 text-sm">Bank Transfers</span>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA - Mobile optimized */}
        <section className="py-12 lg:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl lg:rounded-3xl p-6 lg:p-12 text-white text-center shadow-xl">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-sm lg:text-base">
                Join Botswana's fastest growing real estate platform
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <Link
                  href="/auth/register"
                  className="bg-white text-blue-600 font-bold py-4 px-6 rounded-xl text-center active:scale-95 transition-transform touch-manipulation shadow-lg text-sm"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/search"
                  className="border-2 border-white text-white font-bold py-4 px-6 rounded-xl text-center active:scale-95 transition-transform touch-manipulation text-sm"
                >
                  Browse Properties
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 text-blue-200 text-xs lg:text-sm">
                {["No upfront costs", "Verified listings", "24/7 support"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span>✅</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Professional Footer - No amateur links */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 safe-area-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="text-xl font-bold">Keyat</span>
              </div>
              <p className="text-gray-400 text-sm">
                Botswana's complete real estate platform powered by BITROOT Technology Ecosystem.
              </p>
            </div>
            
            {/* Real Links - No amateur placeholders */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4 text-sm">{section.title}</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="hover:text-white transition-colors text-xs">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-xs">
              © 2024 Keyat. Powered by BITROOT Technology Ecosystem. Building Botswana's digital future.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}