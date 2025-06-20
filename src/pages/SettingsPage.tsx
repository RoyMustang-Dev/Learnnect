import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userDataService, UserProfile } from '../services/userDataService';
import { 
  Bell, 
  Mail, 
  Moon, 
  Sun, 
  Monitor,
  Globe,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    newsletter: true,
    theme: 'auto' as 'light' | 'dark' | 'auto',
    language: 'en',
    twoFactorEnabled: false
  });

  // Additional state for modals and actions
  const [showDataDownload, setShowDataDownload] = useState(false);
  const [showSessionManager, setShowSessionManager] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Load user profile and settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) return;

      try {
        const profile = await userDataService.getUserProfile(user.id);
        if (profile) {
          setUserProfile(profile);
          setSettings({
            notifications: profile.preferences?.notifications ?? true,
            newsletter: profile.preferences?.newsletter ?? true,
            theme: profile.preferences?.theme ?? 'auto',
            language: profile.preferences?.language ?? 'en',
            twoFactorEnabled: profile.preferences?.twoFactorEnabled ?? false
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setMessage({ type: 'error', text: 'Failed to load settings' });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user?.id]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    setMessage(null);

    try {
      await userDataService.updateUserProfile(user.id, {
        preferences: settings
      });

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadData = async () => {
    if (!user?.id) return;

    setDownloading(true);
    try {
      // Simulate data download
      const userData = {
        profile: userProfile,
        settings: settings,
        exportDate: new Date().toISOString(),
        userId: user.id
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `learnnect-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Data downloaded successfully!' });
    } catch (error) {
      console.error('Error downloading data:', error);
      setMessage({ type: 'error', text: 'Failed to download data' });
    } finally {
      setDownloading(false);
    }
  };

  const handleToggle2FA = () => {
    if (settings.twoFactorEnabled) {
      // Disable 2FA
      handleSettingChange('twoFactorEnabled', false);
      setMessage({ type: 'success', text: 'Two-factor authentication disabled' });
    } else {
      // Enable 2FA - in a real app, this would open a setup modal
      setMessage({ type: 'success', text: 'Two-factor authentication setup initiated. Check your email for instructions.' });
      handleSettingChange('twoFactorEnabled', true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-neon-cyan mx-auto mb-4" />
          <p className="text-cyan-200">Loading settings...</p>
        </div>
      </div>
    );
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'Auto', icon: Monitor }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black py-6 sm:py-12 pt-24 sm:pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 text-neon-cyan" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">Manage your preferences and account settings</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-300' 
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Notifications */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-neon-cyan" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Notifications</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm sm:text-base">Push Notifications</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Receive notifications about course updates and progress</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-cyan/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm sm:text-base">Newsletter</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Receive our weekly newsletter with learning tips and new courses</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.newsletter}
                    onChange={(e) => handleSettingChange('newsletter', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-cyan/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-neon-cyan" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-3 text-sm sm:text-base">Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSettingChange('theme', option.value)}
                        className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
                          settings.theme === option.value
                            ? 'bg-neon-cyan/10 border-neon-cyan/50 text-neon-cyan'
                            : 'bg-gray-700/50 border-gray-600/50 text-gray-400 hover:border-gray-500/50'
                        }`}
                      >
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" />
                        <div className="text-xs sm:text-sm font-medium">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-neon-cyan" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Language & Region</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-3 text-sm sm:text-base">Language</h3>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 text-sm sm:text-base"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-neon-cyan" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Account Security</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm sm:text-base">Two-Factor Authentication</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={handleToggle2FA}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base font-medium ${
                    settings.twoFactorEnabled
                      ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/50'
                      : 'bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/50'
                  }`}
                >
                  {settings.twoFactorEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm sm:text-base">Login Sessions</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Manage your active login sessions</p>
                </div>
                <button
                  onClick={() => setMessage({ type: 'success', text: 'Session management feature coming soon!' })}
                  className="px-3 sm:px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  Manage
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm sm:text-base">Download Data</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Download a copy of your account data</p>
                </div>
                <button
                  onClick={handleDownloadData}
                  disabled={downloading}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <span>Download</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-neon-cyan to-cyan-400 text-black font-semibold rounded-xl hover:from-cyan-400 hover:to-neon-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <Save className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
