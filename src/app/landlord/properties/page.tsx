// src/app/landlord/properties/page.tsx - PROPERTIES MANAGEMENT
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, Plus, Filter, Search, Eye, Edit, MoreVertical,
  MapPin, Bed, Bath, Square, Car, Calendar, Wallet,
  CheckCircle, XCircle, Clock, TrendingUp, Sparkles
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  tenants: number;
  beds: number;
  baths: number;
  sqft: number;
  parking: number;
  image: string;
  lastRentPayment: string;
  nextPayment: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  roi: number;
  views: number;
  inquiries: number;
}

export default function PropertiesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const properties: Property[] = [
    {
      id: '1',
      title: 'The Residences • Block 9',
      location: 'CBD, Gaborone',
      type: 'Luxury Apartment',
      price: 14500,
      status: 'occupied',
      tenants: 2,
      beds: 2,
      baths: 2.5,
      sqft: 1700,
      parking: 2,
      image: '/api/placeholder/300/200',
      lastRentPayment: '2024-02-01',
      nextPayment: '2024-03-01',
      paymentStatus: 'paid',
      roi: 8.2,
      views: 247,
      inquiries: 12
    },
    {
      id: '2',
      title: 'Phakalane Executive Villa',
      location: 'Phakalane Golf Estate',
      type: 'Executive Villa',
      price: 25000,
      status: 'occupied',
      tenants: 5,
      beds: 5,
      baths: 4,
      sqft: 3400,
      parking: 3,
      image: '/api/placeholder/300/200',
      lastRentPayment: '2024-02-05',
      nextPayment: '2024-03-05',
      paymentStatus: 'pending',
      roi: 9.1,
      views: 189,
      inquiries: 8
    },
    {
      id: '3',
      title: 'City Center Studio',
      location: 'Main Mall, Gaborone',
      type: 'Studio Apartment',
      price: 4800,
      status: 'vacant',
      tenants: 0,
      beds: 1,
      baths: 1,
      sqft: 500,
      parking: 1,
      image: '/api/placeholder/300/200',
      lastRentPayment: 'N/A',
      nextPayment: 'N/A',
      paymentStatus: 'pending',
      roi: 6.5,
      views: 156,
      inquiries: 5
    },
    {
      id: '4',
      title: 'Riverwalk Townhouse',
      location: 'Riverwalk, Gaborone',
      type: 'Townhouse',
      price: 9800,
      status: 'maintenance',
      tenants: 0,
      beds: 3,
      baths: 2,
      sqft: 1200,
      parking: 2,
      image: '/api/placeholder/300/200',
      lastRentPayment: 'N/A',
      nextPayment: 'N/A',
      paymentStatus: 'pending',
      roi: 7.2,
      views: 89,
      inquiries: 3
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'vacant': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'occupied': return <CheckCircle className="h-4 w-4" />;
      case 'vacant': return <XCircle className="h-4 w-4" />;
      case 'maintenance': return <Clock className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-high': return b.price - a.price;
      case 'price-low': return a.price - b.price;
      case 'roi': return b.roi - a.roi;
      case 'recent':
      default: return new Date(b.lastRentPayment).getTime() - new Date(a.lastRentPayment).getTime();
    }
  });

  const stats = {
    total: properties.length,
    occupied: properties.filter(p => p.status === 'occupied').length,
    vacant: properties.filter(p => p.status === 'vacant').length,
    maintenance: properties.filter(p => p.status === 'maintenance').length,
    totalRevenue: properties.reduce((sum, p) => sum + (p.status === 'occupied' ? p.price : 0), 0)
  };

  return (
    <div className="min-h-screen bg-slate-50 safe-area-padding">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
              <p className="text-slate-600">Manage your property portfolio</p>
            </div>
            <button 
              onClick={() => router.push('/landlord/properties/new')}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all active:scale-95 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Property</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-slate-600 text-sm">Total</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-700">{stats.occupied}</div>
              <div className="text-emerald-600 text-sm">Occupied</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{stats.vacant}</div>
              <div className="text-blue-600 text-sm">Vacant</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="text-2xl font-bold text-amber-700">{stats.maintenance}</div>
              <div className="text-amber-600 text-sm">Maintenance</div>
            </div>
            <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
              <div className="text-2xl font-bold text-violet-700">P{stats.totalRevenue.toLocaleString()}</div>
              <div className="text-violet-600 text-sm">Monthly</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                placeholder="Search properties..."
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
              >
                <option value="all">All Status</option>
                <option value="occupied">Occupied</option>
                <option value="vacant">Vacant</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
              >
                <option value="recent">Recently Added</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="roi">Highest ROI</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 pb-24">
        {/* Properties Grid */}
        <div className="grid gap-4">
          {sortedProperties.map((property) => (
            <div 
              key={property.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => router.push(`/landlord/properties/${property.id}`)}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Property Image */}
                <div className="w-full md:w-48 h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-12 w-12 text-slate-400" />
                </div>

                {/* Property Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{property.title}</h3>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(property.status)}`}>
                          {getStatusIcon(property.status)}
                          <span>{property.status.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{property.location}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        P{property.price.toLocaleString()}
                        <span className="text-slate-500 text-sm font-normal">/month</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-600 font-bold text-sm">{property.roi}% ROI</span>
                      </div>
                    </div>
                  </div>

                  {/* Property Features */}
                  <div className="flex items-center gap-6 text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span className="font-medium">{property.beds} beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span className="font-medium">{property.baths} baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      <span className="font-medium">{property.sqft.toLocaleString()} sqft</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span className="font-medium">{property.parking} parking</span>
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-600 text-sm mb-1">Tenants</div>
                      <div className="text-slate-900 font-bold">{property.tenants} / 1</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-600 text-sm mb-1">Next Payment</div>
                      <div className="text-slate-900 font-bold text-sm">
                        {property.nextPayment === 'N/A' ? 'N/A' : new Date(property.nextPayment).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-600 text-sm mb-1">Views</div>
                      <div className="text-slate-900 font-bold">{property.views}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-slate-600 text-sm mb-1">Inquiries</div>
                      <div className="text-slate-900 font-bold">{property.inquiries}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/landlord/properties/${property.id}`);
                      }}
                      className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/landlord/properties/${property.id}/edit`);
                      }}
                      className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search criteria or add a new property.</p>
            <button 
              onClick={() => router.push('/landlord/properties/new')}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Add Your First Property</span>
            </button>
          </div>
        )}
      </main>

      <style jsx global>{`
        .safe-area-padding {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
