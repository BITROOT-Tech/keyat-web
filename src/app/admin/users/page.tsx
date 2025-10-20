// src/app/admin/users/page.tsx - COMPLETE WITH INTELLIGENT PRIORITY
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface User {
  id: string;
  user_type: 'administrator' | 'landlord' | 'agent' | 'tenant' | 'service';
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  id_verified: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'administrator' | 'landlord' | 'agent' | 'tenant' | 'service'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Intelligent priority system
  const getPriorityMessage = () => {
    const unverifiedCount = users.filter(u => !u.id_verified).length;
    const unverifiedLandlords = users.filter(u => !u.id_verified && u.user_type === 'landlord').length;
    const recentUsers = users.filter(u => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(u.created_at) > oneWeekAgo;
    }).length;

    // Priority 1: Unverified landlords (most critical - affects properties)
    if (unverifiedLandlords > 0) {
      return ` ${unverifiedLandlords} landlords need verification 🚨`;
    }
    
    // Priority 2: Recent growth (business health indicator)
    if (recentUsers >= 3) {
      return ` ${recentUsers} new this week 📈`;
    }
    
    // Priority 3: General unverified users
    if (unverifiedCount > 0) {
      return ` ${unverifiedCount} need verification`;
    }
    
    // All good
    return ' All caught up ✅';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    
    const matchesType = typeFilter === 'all' || user.user_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getUserTypeConfig = (userType: string) => {
    const configs = {
      administrator: { color: 'bg-purple-100 text-purple-800', icon: '👑' },
      landlord: { color: 'bg-blue-100 text-blue-800', icon: '🏠' },
      agent: { color: 'bg-orange-100 text-orange-800', icon: '🤵' },
      tenant: { color: 'bg-green-100 text-green-800', icon: '👤' },
      service: { color: 'bg-gray-100 text-gray-800', icon: '⚙️' }
    };
    return configs[userType as keyof typeof configs] || configs.tenant;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-padding">
        <div className="p-4 space-y-4">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-7 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          {/* Search & Filter Skeleton */}
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Users Skeleton */}
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-padding">
      <div className="p-4 space-y-4">
        {/* Header - Clean & Simple with Intelligent Priority */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 text-sm">
              {filteredUsers.length} users •{getPriorityMessage()}
            </p>
          </div>
        </div>

        {/* Search & Filter - Single Column */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All User Types</option>
            <option value="administrator">Admins</option>
            <option value="landlord">Landlords</option>
            <option value="agent">Agents</option>
            <option value="tenant">Tenants</option>
            <option value="service">Service</option>
          </select>
        </div>

        {/* Users List - Clean Cards */}
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const typeConfig = getUserTypeConfig(user.user_type);

            return (
              <div key={user.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start space-x-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xs">
                      {user.first_name[0]}{user.last_name[0]}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {user.first_name} {user.last_name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                        {typeConfig.icon}
                      </span>
                      {!user.id_verified && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          ❌
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm">📱 {user.phone}</p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">{user.bio}</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col space-y-1">
                    <button 
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View user details"
                    >
                      👁️
                    </button>
                    {!user.id_verified && (
                      <button 
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Verify user ID"
                      >
                        ✅
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {searchQuery || typeFilter !== 'all' ? 'No users found' : 'No Users'}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {searchQuery || typeFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Users will appear here when they register'
              }
            </p>
            {(searchQuery || typeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}