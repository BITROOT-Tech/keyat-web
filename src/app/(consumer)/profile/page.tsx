// src/app/(consumer)/profile/page.tsx - CLEAN PROFESSIONAL VERSION
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  User, Settings, Heart, Eye, Bell, Shield, LogOut,
  Edit3, Camera, MapPin, Phone, Mail, Calendar, Check,
  Download, Trash2, CreditCard, Lock, Globe
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
  
  const router = useRouter();
  const supabase = createClient();

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
      
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => prev ? { ...prev, avatar_url: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleExportData = async () => {
    try {
      const exportData = {
        profile: user,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Professional Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-backdrop-blur:bg-card/60 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">My Profile</h1>
                <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
              </div>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Profile Header - Clean and Focused */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt="Profile"
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-xl font-semibold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
              )}
              
              <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 w-7 h-7 bg-background border border-border rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer">
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-semibold text-foreground mb-1">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-muted-foreground text-sm mb-2">{user?.email}</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user?.location || 'Add location'}</span>
                </div>
                <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                  {user?.user_type || 'MEMBER'}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent transition-colors font-medium"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Member Since */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Member since</span>
              <span className="text-foreground font-medium">
                {new Date(user?.created_at || '').toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Clean and Purposeful */}
        <div className="bg-card border rounded-xl">
          {[
            { id: 'profile', icon: User, label: 'Personal Information' },
            { id: 'preferences', icon: Settings, label: 'Preferences' },
            { id: 'privacy', icon: Shield, label: 'Privacy & Security' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between p-4 border-b border-border last:border-b-0 transition-colors ${
                activeTab === id ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary opacity-0 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Dynamic Content - Clean and Focused */}
        <div className="bg-card border rounded-xl">
          {/* Personal Information Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <div className="px-3 py-2 bg-muted border border-border rounded-lg text-muted-foreground">
                      {user?.email}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Contact support to change your email address</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                      placeholder="+267 71 123 456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                      placeholder="Gaborone, Botswana"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                    <textarea
                      rows={4}
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground resize-none"
                      placeholder="Tell us about yourself and your property interests..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">This helps us recommend better properties for you</p>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 px-4 border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
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
                      <label className="block text-sm text-muted-foreground mb-2">First Name</label>
                      <div className="text-foreground font-medium">{user?.first_name}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Last Name</label>
                      <div className="text-foreground font-medium">{user?.last_name}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                      <div className="text-foreground font-medium">{user?.email}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Phone Number</label>
                      <div className="text-foreground font-medium">{user?.phone || 'Not set'}</div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-muted-foreground mb-2">Location</label>
                      <div className="text-foreground font-medium">{user?.location || 'Not set'}</div>
                    </div>
                  </div>

                  {user?.bio && (
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Bio</label>
                      <div className="text-foreground leading-relaxed bg-muted rounded-lg p-4">
                        {user.bio}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span>Notifications</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Property alerts and matches', key: 'property_alerts', default: true },
                    { label: 'Agent messages and inquiries', key: 'agent_messages', default: true },
                    { label: 'Market insights and trends', key: 'market_insights', default: true },
                    { label: 'Investment opportunities', key: 'investment_opportunities', default: false },
                    { label: 'Platform updates and news', key: 'platform_updates', default: false },
                  ].map(({ label, key, default: defaultValue }) => (
                    <label key={key} className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                      <span className="text-foreground">{label}</span>
                      <input 
                        type="checkbox" 
                        defaultChecked={defaultValue}
                        className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/20"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <span>Preferences</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Preferred Currency</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground">
                      <option>Botswana Pula (P)</option>
                      <option>US Dollar ($)</option>
                      <option>Euro (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground">
                      <option>English</option>
                      <option>Setswana</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Security Tab */}
          {activeTab === 'privacy' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <span>Privacy Settings</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Show my profile to verified agents', key: 'show_profile', default: true },
                    { label: 'Allow property recommendations', key: 'allow_recommendations', default: true },
                    { label: 'Share activity data for analytics', key: 'share_analytics', default: false },
                  ].map(({ label, key, default: defaultValue }) => (
                    <label key={key} className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                      <span className="text-foreground">{label}</span>
                      <input 
                        type="checkbox" 
                        defaultChecked={defaultValue}
                        className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/20"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span>Security</span>
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors text-left">
                    <div>
                      <div className="text-foreground font-medium">Two-Factor Authentication</div>
                      <div className="text-muted-foreground text-sm">Add an extra layer of security</div>
                    </div>
                    <div className="text-muted-foreground">Not enabled</div>
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors text-left">
                    <div>
                      <div className="text-foreground font-medium">Change Password</div>
                      <div className="text-muted-foreground text-sm">Update your password regularly</div>
                    </div>
                    <div className="text-muted-foreground">••••••••</div>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors text-left"
                >
                  <div>
                    <div className="text-foreground font-medium">Export My Data</div>
                    <div className="text-muted-foreground text-sm">Download all your personal information</div>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-destructive/10 text-destructive rounded-lg transition-colors text-left">
                  <div>
                    <div className="font-medium">Delete Account</div>
                    <div className="text-destructive/70 text-sm">Permanently remove your account and data</div>
                  </div>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}