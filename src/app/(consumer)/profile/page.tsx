// src/app/(consumer)/profile/page.tsx - MOBILE-FIRST PROFESSIONAL VERSION
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  User, Settings, Heart, Eye, Bell, Shield, LogOut,
  Edit3, Camera, MapPin, Phone, Check,
  Download, Trash2, Lock, Globe, ArrowLeft
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

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUser(profile);
        setEditForm({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          location: profile.location || '',
          bio: profile.bio || ''
        });
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
      if (!session || !user) return;

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
      <div className="min-h-screen bg-background flex items-center justify-center safe-area-inset">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 safe-area-inset">
      {/* Mobile-Optimized Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 sticky top-0 z-50 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-accent rounded-lg transition-colors active:scale-95 touch-manipulation"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold text-foreground truncate">My Profile</h1>
                <p className="text-muted-foreground text-sm truncate">Account settings</p>
              </div>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="p-2 hover:bg-accent rounded-lg transition-colors active:scale-95 touch-manipulation"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Mobile-Optimized Tabs - FIXED HIERARCHY */}
          <div className="bg-muted rounded-lg p-1">
            <div className="flex">
              {[
                { id: 'profile', icon: User, label: 'Profile' },
                { id: 'privacy', icon: Shield, label: 'Privacy' }, // MOVED UP - more important
                { id: 'preferences', icon: Settings, label: 'Prefs' }, // SHORTENED for mobile
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 py-2 px-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center space-x-1 touch-manipulation ${
                    activeTab === id 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Profile Header - Mobile Optimized */}
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt="Profile"
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-lg font-semibold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
              )}
              
              <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95 touch-manipulation">
                <Camera className="h-3 w-3 text-muted-foreground" />
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
              <h2 className="text-lg font-semibold text-foreground truncate mb-1">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-muted-foreground text-sm truncate mb-1">{user?.email}</p>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs truncate">{user?.location || 'Add location'}</span>
                </div>
                <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-medium">
                  {user?.user_type || 'MEMBER'}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 border border-border text-foreground rounded-lg hover:bg-accent transition-colors active:scale-95 text-sm font-medium touch-manipulation whitespace-nowrap"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Member Since - Mobile Optimized */}
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Member since</span>
              <span className="text-foreground font-medium">
                {new Date(user?.created_at || '').toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Content - Mobile Optimized */}
        <div className="bg-card border rounded-xl">
          {/* Personal Information Tab */}
          {activeTab === 'profile' && (
            <div className="p-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">First Name</label>
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Last Name</label>
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Email</label>
                    <div className="px-3 py-2 bg-muted border border-border rounded-lg text-muted-foreground text-sm">
                      {user?.email}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Contact support to change email</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm"
                      placeholder="+267 71 123 456"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm"
                      placeholder="Gaborone, Botswana"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Bio</label>
                    <textarea
                      rows={3}
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm resize-none"
                      placeholder="About you and property interests..."
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 px-3 border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors active:scale-95 text-sm touch-manipulation"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-2 px-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors active:scale-95 flex items-center justify-center space-x-1 text-sm touch-manipulation"
                    >
                      <Check className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">First Name</label>
                      <div className="text-foreground font-medium truncate">{user?.first_name}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Last Name</label>
                      <div className="text-foreground font-medium truncate">{user?.last_name}</div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-muted-foreground mb-1">Email</label>
                      <div className="text-foreground font-medium truncate">{user?.email}</div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-muted-foreground mb-1">Phone</label>
                      <div className="text-foreground font-medium">{user?.phone || 'Not set'}</div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-muted-foreground mb-1">Location</label>
                      <div className="text-foreground font-medium">{user?.location || 'Not set'}</div>
                    </div>
                  </div>

                  {user?.bio && (
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Bio</label>
                      <div className="text-foreground text-sm leading-relaxed bg-muted rounded-lg p-3">
                        {user.bio}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Privacy & Security Tab - MOVED UP in hierarchy */}
          {activeTab === 'privacy' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span>Privacy</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Show profile to agents', key: 'show_profile', default: true },
                    { label: 'Property recommendations', key: 'allow_recommendations', default: true },
                    { label: 'Share analytics data', key: 'share_analytics', default: false },
                  ].map(({ label, key, default: defaultValue }) => (
                    <label key={key} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors cursor-pointer active:scale-95 touch-manipulation">
                      <span className="text-sm text-foreground">{label}</span>
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
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Security</span>
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors text-left active:scale-95 touch-manipulation">
                    <div>
                      <div className="text-sm font-medium text-foreground">Two-Factor Auth</div>
                      <div className="text-muted-foreground text-xs">Extra security layer</div>
                    </div>
                    <div className="text-muted-foreground text-xs">Off</div>
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors text-left active:scale-95 touch-manipulation">
                    <div>
                      <div className="text-sm font-medium text-foreground">Change Password</div>
                      <div className="text-muted-foreground text-xs">Update regularly</div>
                    </div>
                    <div className="text-muted-foreground text-xs">••••••••</div>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-border space-y-2">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors text-left active:scale-95 touch-manipulation"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">Export Data</div>
                    <div className="text-muted-foreground text-xs">Download your information</div>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </button>

                <button className="w-full flex items-center justify-between p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors text-left active:scale-95 touch-manipulation">
                  <div>
                    <div className="text-sm font-medium">Delete Account</div>
                    <div className="text-destructive/70 text-xs">Remove account and data</div>
                  </div>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab - MOVED DOWN in hierarchy */}
          {activeTab === 'preferences' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span>Notifications</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Property alerts', key: 'property_alerts', default: true },
                    { label: 'Agent messages', key: 'agent_messages', default: true },
                    { label: 'Market insights', key: 'market_insights', default: true },
                    { label: 'Investment opportunities', key: 'investment_opportunities', default: false },
                    { label: 'Platform updates', key: 'platform_updates', default: false },
                  ].map(({ label, key, default: defaultValue }) => (
                    <label key={key} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors cursor-pointer active:scale-95 touch-manipulation">
                      <span className="text-sm text-foreground">{label}</span>
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
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>Preferences</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Currency</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm">
                      <option>Botswana Pula (P)</option>
                      <option>US Dollar ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Language</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground text-sm">
                      <option>English</option>
                      <option>Setswana</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors active:scale-95 text-sm touch-manipulation">
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-40 safe-area-bottom">
        <div className="px-4 py-2">
          <div className="flex justify-around items-center">
            {[
              { icon: Heart, label: 'Home', active: false, href: '/dashboard' },
              { icon: Eye, label: 'Search', active: false, href: '/search' },
              { icon: User, label: 'Profile', active: true, href: '/profile' },
            ].map(({ icon: Icon, label, active, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className={`flex flex-col items-center p-2 transition-all duration-200 min-w-0 flex-1 touch-manipulation ${
                  active 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                  active ? 'bg-primary/10' : 'hover:bg-accent'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 font-medium truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}