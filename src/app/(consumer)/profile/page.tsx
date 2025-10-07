// src/app/(consumer)/profile/page.tsx - COMPLETE PROFESSIONAL VERSION
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  Heart, 
  Home, 
  Eye, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  Edit3,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Check
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

interface Stats {
  savedProperties: number;
  viewedProperties: number;
  searches: number;
  contacts: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const router = useRouter();
  const supabase = createClient();

  const [stats, setStats] = useState<Stats>({
    savedProperties: 0,
    viewedProperties: 0,
    searches: 0,
    contacts: 0
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setUser(profile);
          setEditForm({
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone: profile.phone,
            location: profile.location,
            bio: profile.bio
          });
        }

        // Mock stats - replace with real data
        setStats({
          savedProperties: 12,
          viewedProperties: 24,
          searches: 18,
          contacts: 8
        });

      } catch (error) {
        console.error('Error in profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router, supabase]);

  const handleSaveProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', session.user.id);

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        setUser(prev => prev ? { ...prev, ...editForm } : null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile', color: 'blue' },
    { id: 'saved', icon: Heart, label: 'Saved', color: 'red' },
    { id: 'activity', icon: Eye, label: 'Activity', color: 'green' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'gray' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
            <button 
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mx-4 mt-4 mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                  <Camera className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">{user?.bio || 'Keyat User'}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user?.location || 'Gaborone, Botswana'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {new Date(user?.created_at || '').getFullYear()}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.savedProperties}</div>
                <div className="text-gray-600 text-sm">Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.viewedProperties}</div>
                <div className="text-gray-600 text-sm">Viewed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.searches}</div>
                <div className="text-gray-600 text-sm">Searches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.contacts}</div>
                <div className="text-gray-600 text-sm">Contacts</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row mx-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              {menuItems.map(({ id, icon: Icon, label, color }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    activeTab === id 
                      ? `bg-${color}-50 text-${color}-600 border border-${color}-200` 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={editForm.first_name || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={editForm.last_name || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="+267 71 123 456"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Gaborone, Botswana"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        rows={3}
                        value={editForm.bio || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-2"
                      >
                        <Check className="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="text-gray-900">{user?.first_name} {user?.last_name}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="text-gray-900 flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{user?.email}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <div className="text-gray-900 flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{user?.phone || 'Not provided'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <div className="text-gray-900 flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{user?.location || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <div className="text-gray-900">{user?.bio || 'No bio provided'}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                        {user?.user_type || 'Tenant'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Saved Properties</h3>
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No saved properties yet</h4>
                  <p className="text-gray-600 mb-4">Properties you save will appear here for easy access.</p>
                  <button 
                    onClick={() => router.push('/search')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Browse Properties
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <Eye className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Viewed property</div>
                      <div className="text-sm text-gray-600">Modern Apartment in Gaborone</div>
                      <div className="text-xs text-gray-500">2 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <Heart className="h-5 w-5 text-red-600" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Saved property</div>
                      <div className="text-sm text-gray-600">Spacious Family House</div>
                      <div className="text-xs text-gray-500">1 day ago</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <Home className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Contacted agent</div>
                      <div className="text-sm text-gray-600">Sarah Johnson - Luxury Villa</div>
                      <div className="text-xs text-gray-500">3 days ago</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="text-sm text-gray-700">Property alerts</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="text-sm text-gray-700">Agent messages</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">Marketing emails</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Privacy</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        <span className="text-sm text-gray-700">Show profile to agents</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">Allow property recommendations</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}