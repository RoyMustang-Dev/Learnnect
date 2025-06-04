import React, { useState } from 'react';
import { UserProfile } from '../../services/userDataService';
import { Camera, Edit3, Save, X, MapPin, Building, Globe, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userDataService } from '../../services/userDataService';

interface ProfileHeaderProps {
  userProfile: UserProfile;
  onUpdate: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  onUpdate,
  isEditing,
  onEditToggle
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: userProfile.firstName || '',
    lastName: userProfile.lastName || '',
    headline: userProfile.headline || '',
    location: userProfile.location || '',
    industry: userProfile.industry || '',
    currentPosition: userProfile.currentPosition || '',
    company: userProfile.company || '',
    website: userProfile.website || ''
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await userDataService.updateUserProfile(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        headline: formData.headline,
        location: formData.location,
        industry: formData.industry,
        currentPosition: formData.currentPosition,
        company: formData.company,
        website: formData.website,
        displayName: `${formData.firstName} ${formData.lastName}`.trim()
      });
      
      await onUpdate();
      onEditToggle();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userProfile.firstName || '',
      lastName: userProfile.lastName || '',
      headline: userProfile.headline || '',
      location: userProfile.location || '',
      industry: userProfile.industry || '',
      currentPosition: userProfile.currentPosition || '',
      company: userProfile.company || '',
      website: formData.website || ''
    });
    onEditToggle();
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-neon-cyan/20 via-neon-blue/20 to-neon-purple/20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10" />
        <button className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/20 transition-colors">
          <Camera className="h-4 w-4" />
        </button>
      </div>

      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Profile Picture */}
        <div className="absolute -top-16 left-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta p-1">
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                {userProfile.photoURL ? (
                  <img 
                    src={userProfile.photoURL} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center text-white text-2xl font-bold">
                    {userProfile.displayName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 bg-neon-cyan text-black p-2 rounded-full hover:bg-cyan-400 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end pt-4">
          {!isEditing ? (
            <button
              onClick={onEditToggle}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="mt-8 ml-40">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                placeholder="Professional headline"
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  placeholder="Current Position"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="Industry"
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Website"
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {userProfile.displayName || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'User'}
              </h1>
              {userProfile.headline && (
                <p className="text-xl text-gray-300 mb-3">{userProfile.headline}</p>
              )}
              {(userProfile.currentPosition || userProfile.company) && (
                <div className="flex items-center text-gray-400 mb-2">
                  <Building className="h-4 w-4 mr-2" />
                  <span>
                    {userProfile.currentPosition}
                    {userProfile.currentPosition && userProfile.company && ' at '}
                    {userProfile.company}
                  </span>
                </div>
              )}
              {userProfile.location && (
                <div className="flex items-center text-gray-400 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{userProfile.location}</span>
                </div>
              )}
              {userProfile.website && (
                <div className="flex items-center text-gray-400 mb-4">
                  <Globe className="h-4 w-4 mr-2" />
                  <a 
                    href={userProfile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:text-cyan-300 transition-colors"
                  >
                    {userProfile.website}
                  </a>
                </div>
              )}
              
              {/* Quick Contact */}
              <div className="flex space-x-4 mt-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>Message</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <span>Connect</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
