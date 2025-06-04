import React, { useState } from 'react';
import { UserProfile, Skill } from '../../services/userDataService';
import { Zap, Edit3, Save, X, Plus, Trash2, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userDataService } from '../../services/userDataService';

interface SkillsSectionProps {
  userProfile: UserProfile;
  onUpdate: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  userProfile,
  onUpdate,
  isEditing,
  onEditToggle
}) => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>(userProfile.skills || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await userDataService.updateUserProfile(user.id, { skills });
      await onUpdate();
      onEditToggle();
    } catch (error) {
      console.error('Error updating skills:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSkills(userProfile.skills || []);
    onEditToggle();
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      endorsements: 0,
      level: 'beginner',
      category: ''
    };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-yellow-400';
      case 'intermediate': return 'text-orange-400';
      case 'advanced': return 'text-blue-400';
      case 'expert': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getLevelStars = (level: string) => {
    switch (level) {
      case 'beginner': return 1;
      case 'intermediate': return 2;
      case 'advanced': return 3;
      case 'expert': return 4;
      default: return 1;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <Zap className="h-4 w-4 text-neon-cyan" />
          </div>
          <h2 className="text-xl font-bold text-white">Skills</h2>
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
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={skill.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">Skill {index + 1}</h3>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  placeholder="Skill name"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <input
                  type="text"
                  value={skill.category || ''}
                  onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                  placeholder="Category (e.g., Programming, Design)"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={skill.level || 'beginner'}
                  onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <input
                  type="number"
                  value={skill.endorsements || 0}
                  onChange={(e) => updateSkill(skill.id, 'endorsements', parseInt(e.target.value) || 0)}
                  placeholder="Endorsements"
                  min="0"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
            </div>
          ))}
          
          <button
            onClick={addSkill}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors w-full justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add Skill</span>
          </button>
        </div>
      ) : (
        <div>
          {userProfile.skills && userProfile.skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProfile.skills.map((skill) => (
                <div key={skill.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30 hover:border-neon-cyan/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">{skill.name}</h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < getLevelStars(skill.level || 'beginner')
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {skill.category && (
                    <p className="text-gray-400 text-sm mb-2">{skill.category}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium capitalize ${getLevelColor(skill.level || 'beginner')}`}>
                      {skill.level || 'Beginner'}
                    </span>
                    {skill.endorsements && skill.endorsements > 0 && (
                      <span className="text-xs text-gray-400">
                        {skill.endorsements} endorsement{skill.endorsements !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">Show your skills</p>
              <p className="text-gray-500 text-sm mb-4">
                Add skills to showcase your expertise and get endorsed by others
              </p>
              <button
                onClick={onEditToggle}
                className="px-4 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Add Skills
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
