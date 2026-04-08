'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {AppLayout} from '@/components/layout/AppLayout';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { PreferencesSettings } from '@/components/settings/PreferencesSettings';
import { GroupsSettings } from '@/components/settings/GroupsSettings';
import { User, Shield, Settings, LogOut, Loader2 } from 'lucide-react';

type SettingsTab = 'profile' | 'account' | 'preferences' | 'groups';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, updateProfile, updatePreferences, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'account', label: 'Account', icon: <Shield className="h-5 w-5" /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings className="h-5 w-5" /> },
    { id: 'groups', label: 'Groups', icon: <User className="h-5 w-5" /> },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    logout();
    router.push('/login');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-surface">
        {/* Header */}
        <Header
          title="Settings"
          subtitle="Manage your account and preferences"
        />

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <Card className="lg:col-span-1 p-4 h-fit">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-on-surface-variant/10">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-error hover:bg-error/10 transition-all disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <LogOut className="h-5 w-5" />
                  )}
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <ProfileSettings
                  onSave={async (data) => {
                    await updateProfile({ name: data.name, email: data.email });
                  }}
                />
              )}
              {activeTab === 'account' && (
                <AccountSettings
                  onChangePassword={async (current, newPass) => {
                    await changePassword(current, newPass);
                  }}
                />
              )}
              {activeTab === 'preferences' && (
                <PreferencesSettings
                  onSave={async (data) => {
                    await updatePreferences(data);
                  }}
                />
              )}
              {activeTab === 'groups' && (
                <GroupsSettings />
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
