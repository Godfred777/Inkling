'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPreferences } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Globe, Clock, Loader2, Check, Sun, Moon } from 'lucide-react';

interface PreferencesSettingsProps {
  onSave: (data: Partial<UserPreferences>) => Promise<void>;
}

export function PreferencesSettings({ onSave }: PreferencesSettingsProps) {
  const { user, updatePreferences, isLoading } = useAuth();
  const [hasChanges, setHasChanges] = useState(false);
  const [success, setSuccess] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      taskUpdates: true,
      projectUpdates: true,
    },
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  useEffect(() => {
    // Sync with current theme from DOM
    const isDark = document.documentElement.classList.contains('dark');
    setPreferences(prev => ({
      ...prev,
      theme: isDark ? 'dark' : 'light',
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    
    try {
      await onSave(preferences);
      setSuccess('Preferences saved successfully!');
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  };

  const handleNotificationChange = (key: keyof UserPreferences['notifications'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <Card className="p-6">
        <h3 className="text-lg font-display font-semibold text-on-surface mb-4">
          Appearance
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPreferences({ ...preferences, theme: 'light' });
                  setHasChanges(true);
                  document.documentElement.classList.remove('dark');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  preferences.theme === 'light'
                    ? 'border-primary bg-primary/10'
                    : 'border-on-surface-variant/20 bg-surface-container hover:border-on-surface-variant/40'
                }`}
              >
                <div className="text-center">
                  <Sun className="w-8 h-8 mx-auto mb-2 text-warning" />
                  <span className="text-sm font-medium">Light</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreferences({ ...preferences, theme: 'dark' });
                  setHasChanges(true);
                  document.documentElement.classList.add('dark');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  preferences.theme === 'dark'
                    ? 'border-primary bg-primary/10'
                    : 'border-on-surface-variant/20 bg-surface-container hover:border-on-surface-variant/40'
                }`}
              >
                <div className="text-center">
                  <Moon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">Dark</span>
                </div>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Choose your preferred theme.
            </p>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-display font-semibold text-on-surface">
            Notifications
          </h3>
        </div>
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface font-medium">Email Notifications</p>
              <p className="text-sm text-on-surface-variant">Receive updates via email</p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationChange('email', !preferences.notifications.email)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.notifications.email ? 'bg-primary' : 'bg-surface-container-high'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-on-primary rounded-full transition-transform ${
                  preferences.notifications.email ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface font-medium">Push Notifications</p>
              <p className="text-sm text-on-surface-variant">Browser notifications for updates</p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationChange('push', !preferences.notifications.push)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.notifications.push ? 'bg-primary' : 'bg-surface-container-high'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-on-primary rounded-full transition-transform ${
                  preferences.notifications.push ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Task Updates */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface font-medium">Task Updates</p>
              <p className="text-sm text-on-surface-variant">Notifications for task changes</p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationChange('taskUpdates', !preferences.notifications.taskUpdates)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.notifications.taskUpdates ? 'bg-primary' : 'bg-surface-container-high'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-on-primary rounded-full transition-transform ${
                  preferences.notifications.taskUpdates ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Project Updates */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface font-medium">Project Updates</p>
              <p className="text-sm text-on-surface-variant">Notifications for project activity</p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationChange('projectUpdates', !preferences.notifications.projectUpdates)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.notifications.projectUpdates ? 'bg-primary' : 'bg-surface-container-high'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-on-primary rounded-full transition-transform ${
                  preferences.notifications.projectUpdates ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Regional Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-display font-semibold text-on-surface">
            Regional Settings
          </h3>
        </div>
        <div className="space-y-4">
          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-on-surface mb-2">
              Language
            </label>
            <select
              id="language"
              value={preferences.language}
              onChange={(e) => { setPreferences({ ...preferences, language: e.target.value }); setHasChanges(true); }}
              className="block w-full px-4 py-3 bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            >
              <option value="en">English</option>
              <option value="es">Español (Coming Soon)</option>
              <option value="fr">Français (Coming Soon)</option>
              <option value="de">Deutsch (Coming Soon)</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-on-surface mb-2">
              Timezone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-on-surface-variant" />
              </div>
              <select
                id="timezone"
                value={preferences.timezone}
                onChange={(e) => { setPreferences({ ...preferences, timezone: e.target.value }); setHasChanges(true); }}
                className="block w-full pl-10 pr-4 py-3 bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
              >
                <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                  {Intl.DateTimeFormat().resolvedOptions().timeZone} (Auto-detected)
                </option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3">
          {success && (
            <div className="flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded-lg">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
