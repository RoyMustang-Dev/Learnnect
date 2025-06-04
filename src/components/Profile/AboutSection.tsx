import React, { useState } from 'react';
import { UserProfile } from '../../services/userDataService';
import { Edit3, Save, X, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userDataService } from '../../services/userDataService';

interface AboutSectionProps {
  userProfile: UserProfile;
  onUpdate: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  userProfile,
  onUpdate,
  isEditing,
  onEditToggle
}) => {
  const { user } = useAuth();
  const [about, setAbout] = useState(userProfile.about || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await userDataService.updateUserProfile(user.id, { about });
      await onUpdate();
      onEditToggle();
    } catch (error) {
      console.error('Error updating about section:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setAbout(userProfile.about || '');
    onEditToggle();
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <User className="h-4 w-4 text-neon-cyan" />
          </div>
          <h2 className="text-xl font-bold text-white">About</h2>
        </div>
        
        {!isEditing ? (
          <button
            onClick={onEditToggle}
            className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-3 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write about yourself, your professional background, achievements, and what you're passionate about..."
            rows={8}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 resize-none"
          />
          <div className="mt-2 text-sm text-gray-400">
            {about.length}/2000 characters
          </div>
        </div>
      ) : (
        <div>
          {userProfile.about ? (
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {userProfile.about}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">Tell people about yourself</p>
              <p className="text-gray-500 text-sm mb-4">
                Share your professional story, achievements, and what drives you
              </p>
              <button
                onClick={onEditToggle}
                className="px-4 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Add About Section
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutSection;
