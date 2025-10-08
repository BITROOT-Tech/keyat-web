// src/app/(consumer)/services/page.tsx - PREMIUM NATIVE VERSION
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Truck, Wrench, Hammer, PaintBucket, Sparkles, Shield,
  Zap, Clock, Star, MapPin, Calendar, CheckCircle,
  ArrowRight, Crown, BadgeCheck, TrendingUp, Users
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: any;
  priceRange: string;
  duration: string;
  rating: number;
  reviews: number;
  featured: boolean;
  category: string;
  providers: number;
}

interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  rating: number;
  completedJobs: number;
  responseTime: string;
  price: string;
  image: string;
  verified: boolean;
  premium: boolean;
}

export default function ServicesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: Service[] = [
    {
      id: '1',
      title: 'Premium Moving Services',
      description: 'Professional relocation with packing, transportation, and unpacking services. Full insurance coverage.',
      icon: Truck,
      priceRange: 'P1,500 - P5,000',
      duration: '2-6 hours',
      rating: 4.9,
      reviews: 247,
      featured: true,
      category: 'moving',
      providers: 28
    },
    {
      id: '2',
      title: 'Home Maintenance',
      description: 'Comprehensive home repairs and maintenance from licensed professionals.',
      icon: Wrench,
      priceRange: 'P500 - P3,000',
      duration: '1-4 hours',
      rating: 4.7,
      reviews: 189,
      featured: false,
      category: 'maintenance',
      providers: 42
    },
    {
      id: '3',
      title: 'Renovation & Construction',
      description: 'Complete home renovation services with architectural consultation.',
      icon: Hammer,
      priceRange: 'P5,000 - P50,000+',
      duration: '1-4 weeks',
      rating: 4.8,
      reviews: 156,
      featured: true,
      category: 'renovation',
      providers: 15
    },
    {
      id: '4',
      title: 'Professional Painting',
      description: 'Interior and exterior painting with premium materials and finishes.',
      icon: PaintBucket,
      priceRange: 'P2,000 - P8,000',
      duration: '1-3 days',
      rating: 4.6,
      reviews: 134,
      featured: false,
      category: 'painting',
      providers: 23
    },
    {
      id: '5',
      title: 'Deep Cleaning',
      description: 'Thorough cleaning services for move-in/move-out or regular maintenance.',
      icon: Sparkles,
      priceRange: 'P800 - P2,500',
      duration: '2-5 hours',
      rating: 4.5,
      reviews: 298,
      featured: false,
      category: 'cleaning',
      providers: 37
    },
    {
      id: '6',
      title: 'Security Installation',
      description: 'Professional security system installation and smart home integration.',
      icon: Shield,
      priceRange: 'P3,000 - P15,000',
      duration: '3-8 hours',
      rating: 4.9,
      reviews: 89,
      featured: true,
      category: 'security',
      providers: 12
    }
  ];

  const serviceProviders: ServiceProvider[] = [
    {
      id: '1',
      name: 'Elite Movers BW',
      service: 'Premium Moving',
      rating: 4.9,
      completedJobs: 423,
      responseTime: '< 2 hours',
      price: 'From P1,800',
      image: '/api/placeholder/100/100',
      verified: true,
      premium: true
    },
    {
      id: '2',
      name: 'Pro Maintenance Team',
      service: 'Home Maintenance',
      rating: 4.7,
      completedJobs: 287,
      responseTime: '< 4 hours',
      price: 'From P600',
      image: '/api/placeholder/100/100',
      verified: true,
      premium: false
    },
    {
      id: '3',
      name: 'Luxury Renovators',
      service: 'Renovation & Construction',
      rating: 4.8,
      completedJobs: 156,
      responseTime: '< 24 hours',
      price: 'From P8,000',
      image: '/api/placeholder/100/100',
      verified: true,
      premium: true
    }
  ];

  const categories = [
    { id: 'all', label: 'All Services', icon: Sparkles },
    { id: 'moving', label: 'Moving', icon: Truck },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'renovation', label: 'Renovation', icon: Hammer },
    { id: 'painting', label: 'Painting', icon: PaintBucket },
    { id: 'cleaning', label: 'Cleaning', icon: Sparkles },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  const ServiceCard = ({ service }: { service: Service }) => {
    const Icon = service.icon;
    
    return (
      <div 
        onClick={() => setSelectedService(service)}
        className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              service.featured 
                ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                : 'bg-gradient-to-br from-blue-600 to-cyan-500'
            }`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{service.title}</h3>
              {service.featured && (
                <div className="flex items-center space-x-1 mt-1">
                  <Crown className="h-3 w-3 text-amber-500" />
                  <span className="text-amber-600 text-xs font-bold">FEATURED</span>
                </div>
              )}
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {service.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-slate-600 text-xs mb-1">Price Range</div>
            <div className="text-slate-900 font-bold text-sm">{service.priceRange}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-slate-600 text-xs mb-1">Duration</div>
            <div className="text-slate-900 font-bold text-sm">{service.duration}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-amber-500 fill-current" />
              <span className="text-slate-900 font-bold text-sm">{service.rating}</span>
            </div>
            <span className="text-slate-500 text-xs">({service.reviews} reviews)</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-600 text-xs">
            <Users className="h-3 w-3" />
            <span>{service.providers} providers</span>
          </div>
        </div>
      </div>
    );
  };

  const ProviderCard = ({ provider }: { provider: ServiceProvider }) => (
    <div 
      onClick={() => router.push(`/services/provider/${provider.id}`)}
      className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center">
          <div className="text-slate-900 font-bold text-sm">
            {provider.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-bold text-slate-900 text-sm truncate">{provider.name}</h4>
            {provider.verified && (
              <BadgeCheck className="h-4 w-4 text-blue-600" />
            )}
            {provider.premium && (
              <div className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                PREMIUM
              </div>
            )}
          </div>
          <p className="text-slate-600 text-xs">{provider.service}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center space-x-1 text-slate-600 text-xs">
          <Star className="h-3 w-3 text-amber-500 fill-current" />
          <span className="font-medium">{provider.rating}</span>
        </div>
        <div className="text-slate-600 text-xs">
          <span className="font-medium">{provider.completedJobs}</span> jobs
        </div>
        <div className="flex items-center space-x-1 text-slate-600 text-xs">
          <Clock className="h-3 w-3" />
          <span>{provider.responseTime}</span>
        </div>
        <div className="text-blue-600 font-bold text-xs">
          {provider.price}
        </div>
      </div>

      <button className="w-full py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm">
        Request Quote
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 safe-area-padding">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 supports-backdrop-blur:bg-white/60">
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Professional Services</h1>
              <p className="text-slate-600 text-sm">Premium home services in Botswana</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-blue-600 font-bold text-lg">50+</div>
              <div className="text-blue-700 text-xs font-medium">Services</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <div className="text-emerald-600 font-bold text-lg">200+</div>
              <div className="text-emerald-700 text-xs font-medium">Providers</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <div className="text-amber-600 font-bold text-lg">4.8</div>
              <div className="text-amber-700 text-xs font-medium">Avg Rating</div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 pb-24">
        {/* Category Navigation */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-300 flex-shrink-0 ${
                  activeCategory === id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm whitespace-nowrap">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Available Services</h2>
            <span className="text-slate-600 text-sm">{filteredServices.length} services</span>
          </div>
          
          <div className="space-y-4">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        {/* Featured Providers */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Featured Providers</h2>
            <div className="flex items-center space-x-1 text-blue-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Top Rated</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {serviceProviders.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Choose Service', description: 'Select from 50+ professional services', icon: Sparkles },
              { step: 2, title: 'Get Quotes', description: 'Receive quotes from verified providers', icon: Zap },
              { step: 3, title: 'Book & Pay', description: 'Secure booking with protected payments', icon: Shield },
              { step: 4, title: 'Enjoy Service', description: 'Professional service with quality guarantee', icon: CheckCircle }
            ].map(({ step, title, description, icon: Icon }) => (
              <div key={step} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {step}
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
                  <p className="text-slate-600 text-xs">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 md:items-center">
          <div className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto md:rounded-3xl native-scroll">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedService.title}</h3>
                  <p className="text-slate-600 text-sm">Professional service details</p>
                </div>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Service Overview */}
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-slate-600 text-sm mb-1">Price Range</div>
                      <div className="text-slate-900 font-bold">{selectedService.priceRange}</div>
                    </div>
                    <div>
                      <div className="text-slate-600 text-sm mb-1">Duration</div>
                      <div className="text-slate-900 font-bold">{selectedService.duration}</div>
                    </div>
                    <div>
                      <div className="text-slate-600 text-sm mb-1">Rating</div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                        <span className="text-slate-900 font-bold">{selectedService.rating}</span>
                        <span className="text-slate-600 text-sm">({selectedService.reviews})</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-600 text-sm mb-1">Providers</div>
                      <div className="text-slate-900 font-bold">{selectedService.providers} available</div>
                    </div>
                  </div>
                </div>

                {/* Service Description */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Service Description</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedService.description}</p>
                </div>

                {/* What's Included */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">What's Included</h4>
                  <div className="space-y-2">
                    {[
                      'Professional certified providers',
                      'Quality guaranteed work',
                      'Insurance coverage',
                      'Free quotes and consultations',
                      'Flexible scheduling',
                      'Post-service support'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-slate-700">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all active:scale-95">
                    Compare Providers
                  </button>
                  <button className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .safe-area-padding {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .native-scroll {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
}