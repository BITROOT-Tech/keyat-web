// src/app/landlord/settings/page.tsx - SETTINGS
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Bell, Shield, CreditCard, HelpCircle,
  LogOut, ArrowRight, Check, Moon, Sun,
  Mail, Phone, MapPin, Building2, Globe,
  Eye, EyeOff, Key
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    rentReminders: true,
    maintenanceAlerts: true,
    newInquiries: true,
  });

  const profileData = {
    firstName: 'John',
    lastName: 'Landlord',
    email: 'john.landlord@email.com',
    phone: '+267 71 234 567',
    company: 'Premium Properties Ltd.',
    address: 'CBD, Gaborone, Botswana',
    joinDate: '2022-08-15',
    verified: true
  };

  const securitySettings = {
    twoFactor: false,
    lastLogin: '2024-02-20 14:30',
    loginAttempts: 1,
    passwordChanged: '2024-01-15'
  };

  const handleSaveProfile = () => {
    // Implement save functionality
    alert('Profile updated successfully!');
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 safe-area-padding">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-5 pt-6 pb-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600">Manage your account and preferences</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-100 rounded-xl p-1">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'billing', label: 'Billing', icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                  activeTab === id 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-5 pb-24">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue={profileData.firstName}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue={profileData.lastName}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={profileData.email}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue={profileData.phone}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                  <input
                    type="text"
                    defaultValue={profileData.company}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    defaultValue={profileData.address}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Preferences</h3>
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-slate-900">Dark Mode</div>
                  <div className="text-slate-600 text-sm">Switch between light and dark themes</div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    darkMode ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    darkMode ? 'transform translate-x-7' : 'transform translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-slate-200">
                <div>
                  <div className="font-medium text-slate-900">Language</div>
                  <div className="text-slate-600 text-sm">English (US)</div>
                </div>
                <button className="text-blue-600 font-medium flex items-center space-x-1">
                  <span>Change</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <div>
                    <div className="font-medium text-slate-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-slate-600 text-sm">
                      {key === 'email' && 'Receive notifications via email'}
                      {key === 'push' && 'Receive push notifications'}
                      {key === 'sms' && 'Receive SMS notifications'}
                      {key === 'rentReminders' && 'Get reminded about upcoming rent payments'}
                      {key === 'maintenanceAlerts' && 'Get alerts for maintenance requests'}
                      {key === 'newInquiries' && 'Get notified about new rental inquiries'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(key)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      value ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      value ? 'transform translate-x-7' : 'transform translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-slate-900">Two-Factor Authentication</div>
                    <div className="text-slate-600 text-sm">Add an extra layer of security to your account</div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-slate-200">
                  <div>
                    <div className="font-medium text-slate-900">Change Password</div>
                    <div className="text-slate-600 text-sm">Last changed {new Date(securitySettings.passwordChanged).toLocaleDateString()}</div>
                  </div>
                  <button className="text-blue-600 font-medium flex items-center space-x-1">
                    <Key className="h-4 w-4" />
                    <span>Change</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="text-slate-900">Last Login</div>
                  <div className="text-slate-600">{new Date(securitySettings.lastLogin).toLocaleString()}</div>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <div className="text-slate-900">Login Attempts</div>
                  <div className="text-slate-600">{securitySettings.loginAttempts} this week</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Settings */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Billing Information</h3>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-900 mb-2">No Payment Methods</h4>
                <p className="text-slate-600 mb-4">Add a payment method to get started with premium features</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95">
                  Add Payment Method
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Subscription</h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Free Plan</h4>
                <p className="text-slate-600 mb-4">Upgrade to access premium features</p>
                <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all active:scale-95">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
