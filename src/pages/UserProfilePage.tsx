import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userDataService, UserProfile } from '../services/userDataService';
import { userActivityService } from '../services/userActivityService';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Camera, 
  Save, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Edit3
} from 'lucide-react';

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: ''
  });

  // Load user profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) return;

      try {
        const profile = await userDataService.getUserProfile(user.id);
        if (profile) {
          setUserProfile(profile);
          setFormData({
            displayName: profile.displayName || '',
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || '',
            dateOfBirth: profile.dateOfBirth || ''
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Track field edits
    if (user?.email) {
      userActivityService.trackActivity(
        'profile_field_edit',
        `Field: ${name}, Value: ${value ? 'updated' : 'cleared'}`,
        user.email
      );
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    setMessage(null);

    try {
      // Track profile update attempt
      if (user?.email) {
        await userActivityService.trackProfileUpdate('personal_information', user.email);
      }

      await userDataService.updateUserProfile(user.id, {
        displayName: formData.displayName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth
      });

      // Reload profile data
      const updatedProfile = await userDataService.getUserProfile(user.id);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }

      // Track successful profile update
      if (user?.email) {
        await userActivityService.trackActivity(
          'profile_save_success',
          `Updated fields: ${Object.keys(formData).filter(key => formData[key as keyof typeof formData]).join(', ')}`,
          user.email
        );
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);

      // Track failed profile update
      if (user?.email) {
        await userActivityService.trackError('profile_save_failed', error instanceof Error ? error.message : 'Unknown error', user.email);
      }

      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-neon-cyan mx-auto mb-4" />
          <p className="text-cyan-200">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Profile</h1>
          <p className="text-gray-400">Manage your personal information and preferences</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta p-0.5">
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                      {userProfile?.photoURL ? (
                        <img 
                          src={userProfile.photoURL} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 bg-neon-cyan text-black p-2 rounded-full hover:bg-cyan-400 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* Basic Info */}
                <h2 className="text-xl font-semibold text-white mb-1">
                  {userProfile?.displayName || 'User'}
                </h2>
                <p className="text-gray-400 mb-2">{userProfile?.email}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                  {userProfile?.role || 'Student'}
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neon-cyan">
                      {userProfile?.enrolledCourses?.length || 0}
                    </div>
                    <div className="text-sm text-gray-400">Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neon-magenta">
                      {userProfile?.completedCourses?.length || 0}
                    </div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                <button
                  onClick={() => {
                    const newEditingState = !isEditing;
                    setIsEditing(newEditingState);

                    // Track edit mode toggle
                    if (user?.email) {
                      userActivityService.trackButtonClick(
                        newEditingState ? 'profile_edit_start' : 'profile_edit_cancel',
                        user.email
                      );
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your display name"
                    />
                  </div>
                </div>

                {/* First & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={userProfile?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-xl text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-cyan to-cyan-400 text-black font-semibold rounded-xl hover:from-cyan-400 hover:to-neon-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Save className="h-5 w-5" />
                      )}
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
