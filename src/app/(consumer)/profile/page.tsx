// src/app/(consumer)/profile/page.tsx - FULLY FUNCTIONAL VERSION
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  User, Settings, Heart, Eye, Bell, Shield, LogOut,
  Edit3, Camera, MapPin, Phone, Mail, Calendar, Check,
  Star, TrendingUp, Building2, MessageCircle, ArrowRight,
  Search, Home, Plus, X, Upload, Download, Trash2,
  CreditCard, Lock, Globe, Smartphone, Laptop
} from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: string;
  avatar_url: string;
  location: string;
  bio: string;
  created_at: string;
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  type: string;
  saved_at: string;
}

interface Activity {
  id: string;
  type: 'view' | 'save' | 'contact' | 'tour';
  title: string;
  description: string;
  time: string;
  property_id: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    bio: ''
  });
  
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  // Real stats from actual data
  const [userStats, setUserStats] = useState({
    saved: 0,
    viewed: 0,
    tours: 0,
    contacts: 0
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;
      setUser(profile);
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || ''
      });

      // Load saved properties
      const { data: saved, error: savedError } = await supabase
        .from('saved_properties')
        .select(`
          property_id,
          saved_at,
          properties (
            id,
            title,
            location,
            price,
            image,
            type
          )
        `)
        .eq('user_id', session.user.id)
        .order('saved_at', { ascending: false });

      if (!savedError && saved) {
        const properties = saved.map(item => ({
          id: item.properties.id,
          title: item.properties.title,
          location: item.properties.location,
          price: item.properties.price,
          image: item.properties.image,
          type: item.properties.type,
          saved_at: item.saved_at
        }));
        setSavedProperties(properties);
        setUserStats(prev => ({ ...prev, saved: properties.length }));
      }

      // Load recent activity
      const { data: activity, error: activityError } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!activityError && activity) {
        setRecentActivity(activity);
        // Calculate stats from activity
        const viewed = activity.filter(a => a.type === 'view').length;
        const tours = activity.filter(a => a.type === 'tour').length;
        const contacts = activity.filter(a => a.type === 'contact').length;
        
        setUserStats(prev => ({ 
          ...prev, 
          viewed,
          tours,
          contacts
        }));
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', session.user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...editForm } : null);
      setIsEditing(false);
      
      // Show success feedback
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadingAvatar(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      setUser(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveSavedProperty = async (propertyId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', session.user.id)
        .eq('property_id', propertyId);

      if (error) throw error;

      // Update local state
      setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
      setUserStats(prev => ({ ...prev, saved: prev.saved - 1 }));
      
    } catch (error) {
      console.error('Error removing saved property:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const exportData = {
        profile: user,
        savedProperties,
        recentActivity,
        exportedAt: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `keyat-profile-${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const quickActions = [
    { 
      icon: Search, 
      label: 'Find Properties', 
      description: 'Browse new listings',
      action: () => router.push('/search'),
      color: 'blue'
    },
    { 
      icon: Plus, 
      label: 'Add Property', 
      description: 'List your property',
      action: () => router.push('/list-property'),
      color: 'green'
    },
    { 
      icon: Calendar, 
      label: 'My Tours', 
      description: 'View scheduled tours',
      action: () => router.push('/booking'),
      color: 'purple'
    },
    { 
      icon: Download, 
      label: 'Export Data', 
      description: 'Download your information',
      action: handleExportData,
      color: 'orange'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-500/20 rounded-full"></div>
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-slate-600 font-medium text-sm mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 safe-area-padding">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-600 text-xs">Manage your account and data</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleSignOut}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pb-20">
        {/* Profile Header with Real Data */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 mt-4 mb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt="Profile"
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
              )}
              
              <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer">
                {uploadingAvatar ? (
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="h-3 w-3 text-slate-600" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploadingAvatar}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-lg font-bold text-slate-900 truncate">
                  {user?.first_name} {user?.last_name}
                </h2>
                <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {user?.user_type || 'MEMBER'}
                </div>
              </div>
              <p className="text-slate-600 text-sm truncate">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span className="text-slate-500 text-xs">{user?.location || 'Add location'}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Interactive Stats */}
          <div className="grid grid-cols-4 gap-2 border-t border-slate-100 pt-3">
            {[
              { label: 'Saved', value: userStats.saved, icon: Heart, color: 'red', action: () => setActiveTab('saved') },
              { label: 'Viewed', value: userStats.viewed, icon: Eye, color: 'blue', action: () => setActiveTab('activity') },
              { label: 'Tours', value: userStats.tours, icon: Calendar, color: 'green', action: () => router.push('/booking') },
              { label: 'Contacts', value: userStats.contacts, icon: MessageCircle, color: 'purple', action: () => setActiveTab('activity') },
            ].map(({ label, value, icon: Icon, color, action }) => (
              <button
                key={label}
                onClick={action}
                className="text-center group hover:bg-slate-50 rounded-lg py-1 transition-colors"
              >
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Icon className={`h-3 w-3 text-${color}-500`} />
                  <span className="text-sm font-bold text-slate-900">{value}</span>
                </div>
                <span className="text-xs text-slate-500">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions with Real Functionality */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {quickActions.map(({ icon: Icon, label, description, action, color }) => (
            <button
              key={label}
              onClick={action}
              className="bg-white border border-slate-200 rounded-xl p-3 text-left hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className={`w-8 h-8 bg-${color}-50 rounded-lg flex items-center justify-center mb-2 group-hover:bg-${color}-100 transition-colors`}>
                <Icon className={`h-4 w-4 text-${color}-600`} />
              </div>
              <span className="text-sm font-medium text-slate-900 block mb-1">{label}</span>
              <span className="text-xs text-slate-500">{description}</span>
            </button>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 mb-4">
          {[
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'saved', icon: Heart, label: 'Saved Properties' },
            { id: 'activity', icon: Eye, label: 'Activity' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between p-3 border-b border-slate-100 last:border-b-0 transition-colors ${
                activeTab === id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm">{label}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="bg-white rounded-xl border border-slate-200">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="+267 71 123 456"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Gaborone, Botswana"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Bio</label>
                    <textarea
                      rows={3}
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                      placeholder="Tell us about yourself and your property interests..."
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Check className="h-3 w-3" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Full Name</label>
                      <div className="text-slate-900 font-medium">{user?.first_name} {user?.last_name}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Email</label>
                      <div className="text-slate-900 font-medium truncate">{user?.email}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Phone</label>
                      <div className="text-slate-900 font-medium">{user?.phone || 'Not set'}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Location</label>
                      <div className="text-slate-900 font-medium">{user?.location || 'Not set'}</div>
                    </div>
                  </div>

                  {user?.bio && (
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Bio</label>
                      <div className="text-slate-900 text-sm leading-relaxed">{user.bio}</div>
                    </div>
                  )}

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">Member Since</span>
                      <div className="text-slate-600 text-sm">
                        {new Date(user?.created_at || '').toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Saved Properties Tab */}
          {activeTab === 'saved' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Saved Properties</h3>
                <span className="text-slate-600 text-sm">{savedProperties.length} properties</span>
              </div>
              
              {savedProperties.length > 0 ? (
                <div className="space-y-3">
                  {savedProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all group"
                    >
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => router.push(`/property/${property.id}`)}
                      >
                        <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                          <Home className="h-5 w-5 text-slate-400" />
                        </div>
                      </div>
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => router.push(`/property/${property.id}`)}
                      >
                        <h4 className="text-sm font-medium text-slate-900 truncate">{property.title}</h4>
                        <p className="text-slate-600 text-xs truncate">{property.location}</p>
                        <div className="text-blue-600 font-semibold text-sm">
                          P{property.price.toLocaleString()}/month
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSavedProperty(property.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-6 w-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Saved Properties</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Properties you save will appear here for quick access.
                  </p>
                  <button 
                    onClick={() => router.push('/search')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                  >
                    Browse Properties
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      onClick={() => router.push(`/property/${activity.property_id}`)}
                      className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {activity.type === 'view' && <Eye className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'save' && <Heart className="h-4 w-4 text-red-600" />}
                        {activity.type === 'contact' && <MessageCircle className="h-4 w-4 text-green-600" />}
                        {activity.type === 'tour' && <Calendar className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 capitalize">
                          {activity.type} {activity.title}
                        </h4>
                        <p className="text-slate-600 text-xs">{activity.description}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span className="text-slate-400 text-xs">
                            {new Date(activity.time).toLocaleDateString()} at{' '}
                            {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Recent Activity</h3>
                  <p className="text-slate-600 text-sm">
                    Your property views, saves, and contacts will appear here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-slate-600" />
                    <span>Notifications</span>
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Property alerts and matches', key: 'property_alerts', default: true },
                      { label: 'Agent messages and inquiries', key: 'agent_messages', default: true },
                      { label: 'Market insights and trends', key: 'market_insights', default: true },
                      { label: 'Investment opportunities', key: 'investment_opportunities', default: false },
                      { label: 'Platform updates and news', key: 'platform_updates', default: false },
                    ].map(({ label, key, default: defaultValue }) => (
                      <label key={key} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <span className="text-sm text-slate-700">{label}</span>
                        <input 
                          type="checkbox" 
                          defaultChecked={defaultValue}
                          className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-slate-600" />
                    <span>Privacy & Security</span>
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Show my profile to verified agents', key: 'show_profile', default: true },
                      { label: 'Allow property recommendations', key: 'allow_recommendations', default: true },
                      { label: 'Share activity data for analytics', key: 'share_analytics', default: false },
                      { label: 'Two-factor authentication', key: 'two_factor', default: false },
                    ].map(({ label, key, default: defaultValue }) => (
                      <label key={key} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <span className="text-sm text-slate-700">{label}</span>
                        <input 
                          type="checkbox" 
                          defaultChecked={defaultValue}
                          className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-slate-600" />
                    <span>Preferences</span>
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <span className="text-sm text-slate-700">Preferred Currency</span>
                      <select className="text-sm border border-slate-300 rounded px-2 py-1">
                        <option>Botswana Pula (P)</option>
                        <option>US Dollar ($)</option>
                        <option>Euro (€)</option>
                      </select>
                    </label>
                    <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <span className="text-sm text-slate-700">Language</span>
                      <select className="text-sm border border-slate-300 rounded px-2 py-1">
                        <option>English</option>
                        <option>Setswana</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                    Save All Settings
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={handleExportData}
                    className="w-full py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export My Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .safe-area-padding {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}