import React, { useState } from 'react';
import { UserProfile, VolunteerExperience } from '../../services/userDataService';
import { Heart, Edit3, Save, X, Plus, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userDataService } from '../../services/userDataService';

interface VolunteerSectionProps {
  userProfile: UserProfile;
  onUpdate: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const VolunteerSection: React.FC<VolunteerSectionProps> = ({
  userProfile,
  onUpdate,
  isEditing,
  onEditToggle
}) => {
  const { user } = useAuth();
  const [volunteerExperience, setVolunteerExperience] = useState<VolunteerExperience[]>(userProfile.volunteerExperience || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await userDataService.updateUserProfile(user.id, { volunteerExperience });
      await onUpdate();
      onEditToggle();
    } catch (error) {
      console.error('Error updating volunteer experience:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setVolunteerExperience(userProfile.volunteerExperience || []);
    onEditToggle();
  };

  const addVolunteerExperience = () => {
    const newExperience: VolunteerExperience = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      cause: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    };
    setVolunteerExperience([...volunteerExperience, newExperience]);
  };

  const updateVolunteerExperience = (id: string, field: keyof VolunteerExperience, value: any) => {
    setVolunteerExperience(volunteerExperience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeVolunteerExperience = (id: string) => {
    setVolunteerExperience(volunteerExperience.filter(exp => exp.id !== id));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <Heart className="h-4 w-4 text-neon-cyan" />
          </div>
          <h2 className="text-xl font-bold text-white">Volunteer Experience</h2>
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
        <div className="space-y-6">
          {volunteerExperience.map((exp, index) => (
            <div key={exp.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">Volunteer Experience {index + 1}</h3>
                <button
                  onClick={() => removeVolunteerExperience(exp.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={exp.organization}
                  onChange={(e) => updateVolunteerExperience(exp.id, 'organization', e.target.value)}
                  placeholder="Organization"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => updateVolunteerExperience(exp.id, 'role', e.target.value)}
                  placeholder="Role"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  value={exp.cause || ''}
                  onChange={(e) => updateVolunteerExperience(exp.id, 'cause', e.target.value)}
                  placeholder="Cause"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateVolunteerExperience(exp.id, 'startDate', e.target.value)}
                  placeholder="Start Date"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="month"
                  value={exp.endDate || ''}
                  onChange={(e) => updateVolunteerExperience(exp.id, 'endDate', e.target.value)}
                  placeholder="End Date"
                  disabled={exp.isCurrent}
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 disabled:opacity-50"
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={exp.isCurrent}
                    onChange={(e) => {
                      updateVolunteerExperience(exp.id, 'isCurrent', e.target.checked);
                      if (e.target.checked) {
                        updateVolunteerExperience(exp.id, 'endDate', '');
                      }
                    }}
                    className="rounded border-gray-500 text-neon-cyan focus:ring-neon-cyan/50"
                  />
                  <span>I currently volunteer here</span>
                </label>
              </div>
              
              <textarea
                value={exp.description || ''}
                onChange={(e) => updateVolunteerExperience(exp.id, 'description', e.target.value)}
                placeholder="Describe your volunteer work and impact..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 resize-none"
              />
            </div>
          ))}
          
          <button
            onClick={addVolunteerExperience}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors w-full justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add Volunteer Experience</span>
          </button>
        </div>
      ) : (
        <div>
          {userProfile.volunteerExperience && userProfile.volunteerExperience.length > 0 ? (
            <div className="space-y-6">
              {userProfile.volunteerExperience.map((exp) => (
                <div key={exp.id} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                    <p className="text-neon-cyan font-medium">{exp.organization}</p>
                    
                    <div className="flex items-center space-x-4 text-gray-400 text-sm mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate || '')}
                        </span>
                      </div>
                      {exp.cause && (
                        <>
                          <span>·</span>
                          <span>{exp.cause}</span>
                        </>
                      )}
                    </div>
                    
                    {exp.description && (
                      <p className="text-gray-300 mt-3 leading-relaxed whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">Add volunteer experience</p>
              <p className="text-gray-500 text-sm mb-4">
                Share your volunteer work and community involvement
              </p>
              <button
                onClick={onEditToggle}
                className="px-4 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Add Volunteer Experience
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerSection;
