// src/app/page.tsx
'use client';

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Enhanced Navigation - Mobile First */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Keyat
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                href="/search" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
              >
                Properties
              </Link>
              <Link 
                href="/agents" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
              >
                Agents
              </Link>
              <Link 
                href="/services" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
              >
                Services
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                href="/auth/login" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-green-700 shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/search" 
                  className="px-4 py-3 text-gray-700 hover:text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🏠 Properties
                </Link>
                <Link 
                  href="/agents" 
                  className="px-4 py-3 text-gray-700 hover:text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🤝 Agents
                </Link>
                <Link 
                  href="/services" 
                  className="px-4 py-3 text-gray-700 hover:text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔧 Services
                </Link>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <Link 
                    href="/auth/login" 
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🔐 Login
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="block mx-4 mt-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl font-medium text-center hover:from-blue-700 hover:to-green-700 shadow-lg transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Complete
              <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Real Estate Solution
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Find your perfect home, connect with trusted agents, and access all property services in one platform. 
              <span className="block text-blue-600 font-semibold mt-2">Powered by BITROOT</span>
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-2 mb-8 border border-white/20">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="🏠 Search properties in Gaborone, Francistown, Maun..."
                    className="w-full px-6 py-4 border-0 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500 text-lg shadow-sm"
                  />
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 shadow-lg transition-all duration-200 transform hover:scale-105 text-lg">
                  Search
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { icon: "🏠", text: "2,000+ Properties" },
                { icon: "🤝", text: "100+ Verified Agents" },
                { icon: "💰", text: "Orange Money & MyZaka" },
                { icon: "🇧🇼", text: "Across Botswana" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-white/20 flex items-center space-x-2 transition-all duration-200 hover:shadow-xl"
                >
                  <span className="text-lg">{stat.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{stat.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/auth/register" 
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-green-700 shadow-2xl transition-all duration-200 transform hover:scale-105 text-lg flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <span>🚀</span>
              </Link>
              <Link 
                href="/search" 
                className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-2xl font-semibold border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-200 text-lg flex items-center space-x-2"
              >
                <span>Browse Properties</span>
                <span>🔍</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Grid */}
      <section className="py-16 md:py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything Real Estate in <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">One Platform</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From finding your dream home to managing your property investments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📍",
                title: "Property Rentals",
                description: "Short-term and long-term rentals across Botswana",
                features: ["Student accommodation", "Corporate housing", "Vacation homes"],
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: "🏠",
                title: "Property Sales", 
                description: "Buy, sell, or invest in Botswana real estate",
                features: ["Residential & commercial", "Land sales", "Property auctions"],
                color: "from-green-500 to-green-600"
              },
              {
                icon: "🤝",
                title: "Agent Network",
                description: "Connect with verified real estate professionals", 
                features: ["Verified agents", "Ratings & reviews", "Commission management"],
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: "🚛",
                title: "Moving Services",
                description: "Professional moving and transport solutions",
                features: ["Local & inter-city moves", "Furniture delivery", "Storage solutions"],
                color: "from-orange-500 to-orange-600"
              },
              {
                icon: "🔧", 
                title: "Property Services",
                description: "Maintenance and care for your property",
                features: ["Repairs & maintenance", "Cleaning services", "Security solutions"],
                color: "from-red-500 to-red-600"
              },
              {
                icon: "💰",
                title: "Financial Services",
                description: "Financial solutions for your property needs",
                features: ["Mortgage applications", "Property insurance", "Rent-to-own options"],
                color: "from-yellow-500 to-yellow-600"
              }
            ].map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl text-white">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Botswana Cities */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-blue-500 to-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Serving All Major Cities in <span className="text-yellow-300">Botswana</span>
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Find properties and services across the country
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: "🏙️", city: "Gaborone", description: "Capital City" },
              { icon: "🏢", city: "Francistown", description: "Second City" },
              { icon: "🦓", city: "Maun", description: "Tourism Hub" },
              { icon: "🐘", city: "Kasane", description: "Chobe Gateway" },
              { icon: "💎", city: "Jwaneng", description: "Diamond Town" },
              { icon: "🏞️", city: "Lobatse", description: "Agricultural Hub" },
              { icon: "⚡", city: "Selebi-Phikwe", description: "Mining Town" },
              { icon: "🌅", city: "Palapye", description: "Growing City" }
            ].map((city, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group cursor-pointer"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{city.icon}</div>
                <h3 className="font-bold text-lg mb-1">{city.city}</h3>
                <p className="text-blue-100 text-sm opacity-90">{city.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Find Your <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Perfect Property</span>?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of Batswana who trust Keyat for their real estate needs. 
            Available in English and Setswana with local payment methods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/auth/register" 
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-green-700 shadow-2xl transition-all duration-200 transform hover:scale-105 text-lg flex items-center space-x-3"
            >
              <span>Get Started Today</span>
              <span>🎯</span>
            </Link>
            <Link 
              href="/search" 
              className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200 text-lg flex items-center space-x-3"
            >
              <span>Browse Properties</span>
              <span>🏠</span>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span>🔒</span>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>Verified Listings</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🇧🇼</span>
              <span>Made for Botswana</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="ml-3 text-xl font-bold">Keyat</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Botswana's first comprehensive real estate super app. Your complete property solution powered by BITROOT.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">For Tenants/Buyers</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/search" className="hover:text-white transition-colors">🏠 Find Properties</Link></li>
                <li><Link href="/agents" className="hover:text-white transition-colors">🤝 Find Agents</Link></li>
                <li><Link href="/mortgage" className="hover:text-white transition-colors">💰 Apply for Mortgage</Link></li>
                <li><Link href="/moving" className="hover:text-white transition-colors">🚛 Moving Services</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">For Landlords/Agents</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/list-property" className="hover:text-white transition-colors">📈 List Property</Link></li>
                <li><Link href="/agent-dashboard" className="hover:text-white transition-colors">📊 Agent Dashboard</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">🔧 Property Services</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">📈 View Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Contact & Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">📍 <span>Gaborone, Botswana</span></li>
                <li className="flex items-center space-x-2">📞 <span>+267 71 123 456</span></li>
                <li className="flex items-center space-x-2">✉️ <span>support@keyat.co.bw</span></li>
                <li className="flex items-center space-x-2">🕒 <span>Mon-Fri: 8AM-6PM</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Keyat. Powered by BITROOT. All rights reserved.</p>
            <p className="mt-2 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span>💰 Accepting Orange Money, Mascom MyZaka</span>
              <span>🌐 Available in English & Setswana</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}