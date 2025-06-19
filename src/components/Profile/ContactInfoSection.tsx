import React, { useState } from 'react';
import { UserProfile } from '../../services/userDataService';
import { Contact, Edit3, Save, X, Mail, Phone, Globe, MapPin, Github, Twitter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userDataService } from '../../services/userDataService';
import { getPhoneValidationError } from '../../utils/validation';

interface ContactInfoSectionProps {
  userProfile: UserProfile;
  onUpdate: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  userProfile,
  onUpdate,
  isEditing,
  onEditToggle
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone: userProfile.phone || '',
    website: userProfile.website || '',
    socialLinks: {
      twitter: userProfile.socialLinks?.twitter || '',
      github: userProfile.socialLinks?.github || '',
      portfolio: userProfile.socialLinks?.portfolio || '',
      blog: userProfile.socialLinks?.blog || ''
    },
    showEmail: userProfile.showEmail ?? true,
    showPhone: userProfile.showPhone ?? true
  });
  const [saving, setSaving] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));

      // Validate phone number
      if (name === 'phone' && value.trim()) {
        const error = getPhoneValidationError(value);
        setPhoneError(error);
      } else if (name === 'phone') {
        setPhoneError('');
      }
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await userDataService.updateUserProfile(user.id, {
        phone: formData.phone,
        website: formData.website,
        socialLinks: formData.socialLinks,
        showEmail: formData.showEmail,
        showPhone: formData.showPhone
      });
      
      await onUpdate();
      onEditToggle();
    } catch (error) {
      console.error('Error updating contact info:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      phone: userProfile.phone || '',
      website: userProfile.website || '',
      socialLinks: {
        twitter: userProfile.socialLinks?.twitter || '',
        github: userProfile.socialLinks?.github || '',
        portfolio: userProfile.socialLinks?.portfolio || '',
        blog: userProfile.socialLinks?.blog || ''
      },
      showEmail: userProfile.showEmail ?? true,
      showPhone: userProfile.showPhone ?? true
    });
    onEditToggle();
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <Contact className="h-4 w-4 text-neon-cyan" />
          </div>
          <h2 className="text-lg font-bold text-white">Contact Info</h2>
        </div>
        
        {!isEditing ? (
          <button
            onClick={onEditToggle}
            className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <Edit3 className="h-3 w-3" />
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-3 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              <Save className="h-3 w-3" />
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {/* Basic Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone number (e.g., +91 9876543210)"
              className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                phoneError
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-gray-600/50 focus:ring-neon-cyan/50'
              }`}
            />
            {phoneError && (
              <p className="mt-1 text-xs text-red-400">
                {phoneError}
              </p>
            )}
            {formData.phone && !phoneError && (
              <p className="mt-1 text-xs text-green-400">
                ✓ Valid phone number
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Social Links</label>
            <div className="space-y-3">

              <input
                type="url"
                name="social.github"
                value={formData.socialLinks.github}
                onChange={handleInputChange}
                placeholder="GitHub profile URL"
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              />
              <input
                type="url"
                name="social.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleInputChange}
                placeholder="Twitter profile URL"
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              />
              <input
                type="url"
                name="social.portfolio"
                value={formData.socialLinks.portfolio}
                onChange={handleInputChange}
                placeholder="Portfolio URL"
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              />
              <input
                type="url"
                name="social.blog"
                value={formData.socialLinks.blog}
                onChange={handleInputChange}
                placeholder="Blog URL"
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Privacy</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  name="showEmail"
                  checked={formData.showEmail}
                  onChange={handleInputChange}
                  className="rounded border-gray-500 text-neon-cyan focus:ring-neon-cyan/50"
                />
                <span className="text-sm">Show email address</span>
              </label>
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  name="showPhone"
                  checked={formData.showPhone}
                  onChange={handleInputChange}
                  className="rounded border-gray-500 text-neon-cyan focus:ring-neon-cyan/50"
                />
                <span className="text-sm">Show phone number</span>
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Email */}
          {userProfile.showEmail !== false && userProfile.email && (
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">{userProfile.email}</span>
            </div>
          )}

          {/* Phone */}
          {userProfile.showPhone !== false && userProfile.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">{userProfile.phone}</span>
            </div>
          )}

          {/* Location */}
          {userProfile.location && (
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">{userProfile.location}</span>
            </div>
          )}

          {/* Website */}
          {userProfile.website && (
            <div className="flex items-center space-x-3">
              <Globe className="h-4 w-4 text-gray-400" />
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

          {/* Social Links */}
          {userProfile.socialLinks && (
            <div className="space-y-2">

              {userProfile.socialLinks.github && (
                <div className="flex items-center space-x-3">
                  <Github className="h-4 w-4 text-gray-400" />
                  <a 
                    href={userProfile.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:text-cyan-300 transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              )}
              {userProfile.socialLinks.twitter && (
                <div className="flex items-center space-x-3">
                  <Twitter className="h-4 w-4 text-gray-400" />
                  <a 
                    href={userProfile.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:text-cyan-300 transition-colors"
                  >
                    Twitter
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!userProfile.phone && !userProfile.website && !userProfile.socialLinks && (
            <div className="text-center py-4">
              <Contact className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No contact information added</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactInfoSection;
