import React, { useState } from 'react';
import { UserProfile, Language } from '../../services/userDataService';
import { Globe, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userDataService } from '../../services/userDataService';

interface LanguagesSectionProps {
  userProfile: UserProfile;
  onUpdate: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  userProfile,
  onUpdate,
  isEditing,
  onEditToggle
}) => {
  const { user } = useAuth();
  const [languages, setLanguages] = useState<Language[]>(userProfile.languages || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await userDataService.updateUserProfile(user.id, { languages });
      await onUpdate();
      onEditToggle();
    } catch (error) {
      console.error('Error updating languages:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLanguages(userProfile.languages || []);
    onEditToggle();
  };

  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'elementary'
    };
    setLanguages([...languages, newLanguage]);
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    setLanguages(languages.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'elementary': return 'text-yellow-400';
      case 'limited': return 'text-orange-400';
      case 'professional': return 'text-blue-400';
      case 'full': return 'text-green-400';
      case 'native': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <Globe className="h-4 w-4 text-neon-cyan" />
          </div>
          <h2 className="text-xl font-bold text-white">Languages</h2>
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
          {languages.map((lang, index) => (
            <div key={lang.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">Language {index + 1}</h3>
                <button
                  onClick={() => removeLanguage(lang.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={lang.name}
                  onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                  placeholder="Language"
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
                <select
                  value={lang.proficiency}
                  onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                >
                  <option value="elementary">Elementary proficiency</option>
                  <option value="limited">Limited working proficiency</option>
                  <option value="professional">Professional working proficiency</option>
                  <option value="full">Full professional proficiency</option>
                  <option value="native">Native or bilingual proficiency</option>
                </select>
              </div>
            </div>
          ))}
          
          <button
            onClick={addLanguage}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors w-full justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add Language</span>
          </button>
        </div>
      ) : (
        <div>
          {userProfile.languages && userProfile.languages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.languages.map((lang) => (
                <div key={lang.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                  <h3 className="font-semibold text-white mb-2">{lang.name}</h3>
                  <span className={`text-sm font-medium capitalize ${getProficiencyColor(lang.proficiency)}`}>
                    {lang.proficiency.replace('_', ' ')} proficiency
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">Add languages you speak</p>
              <p className="text-gray-500 text-sm mb-4">
                Showcase your language skills to connect with a global audience
              </p>
              <button
                onClick={onEditToggle}
                className="px-4 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Add Languages
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguagesSection;
