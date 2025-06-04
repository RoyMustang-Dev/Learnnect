import React, { useState } from 'react';
import { UserProfile } from '../../services/userDataService';
import { Trophy, Edit3, Save, X, Plus, Trash2, Calendar, BookOpen, Users, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userDataService } from '../../services/userDataService';

interface AccomplishmentsSectionProps {
  userProfile: UserProfile;
  onUpdate: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

const AccomplishmentsSection: React.FC<AccomplishmentsSectionProps> = ({
  userProfile,
  onUpdate,
  isEditing,
  onEditToggle
}) => {
  const { user } = useAuth();
  const [accomplishments, setAccomplishments] = useState(userProfile.accomplishments || {
    honors: [],
    courses: [],
    organizations: [],
    patents: []
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'honors' | 'courses' | 'organizations' | 'patents'>('honors');

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await userDataService.updateUserProfile(user.id, { accomplishments });
      await onUpdate();
      onEditToggle();
    } catch (error) {
      console.error('Error updating accomplishments:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setAccomplishments(userProfile.accomplishments || {
      honors: [],
      courses: [],
      organizations: [],
      patents: []
    });
    onEditToggle();
  };

  const addHonor = () => {
    const newHonor = {
      id: Date.now().toString(),
      title: '',
      issuer: '',
      issueDate: '',
      description: ''
    };
    setAccomplishments(prev => ({
      ...prev,
      honors: [...(prev.honors || []), newHonor]
    }));
  };

  const addCourse = () => {
    const newCourse = {
      id: Date.now().toString(),
      name: '',
      number: '',
      associatedWith: ''
    };
    setAccomplishments(prev => ({
      ...prev,
      courses: [...(prev.courses || []), newCourse]
    }));
  };

  const addOrganization = () => {
    const newOrg = {
      id: Date.now().toString(),
      name: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false
    };
    setAccomplishments(prev => ({
      ...prev,
      organizations: [...(prev.organizations || []), newOrg]
    }));
  };

  const addPatent = () => {
    const newPatent = {
      id: Date.now().toString(),
      title: '',
      patentOffice: '',
      patentNumber: '',
      issueDate: '',
      description: '',
      inventors: []
    };
    setAccomplishments(prev => ({
      ...prev,
      patents: [...(prev.patents || []), newPatent]
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const tabs = [
    { id: 'honors', label: 'Honors & Awards', icon: Trophy, count: accomplishments.honors?.length || 0 },
    { id: 'courses', label: 'Courses', icon: BookOpen, count: accomplishments.courses?.length || 0 },
    { id: 'organizations', label: 'Organizations', icon: Users, count: accomplishments.organizations?.length || 0 },
    { id: 'patents', label: 'Patents', icon: FileText, count: accomplishments.patents?.length || 0 }
  ];

  const hasAnyAccomplishments = 
    (accomplishments.honors?.length || 0) > 0 ||
    (accomplishments.courses?.length || 0) > 0 ||
    (accomplishments.organizations?.length || 0) > 0 ||
    (accomplishments.patents?.length || 0) > 0;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <Trophy className="h-4 w-4 text-neon-cyan" />
          </div>
          <h2 className="text-xl font-bold text-white">Accomplishments</h2>
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

      {hasAnyAccomplishments || isEditing ? (
        <>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-600/30">
            {tabs.map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === id
                    ? 'bg-neon-cyan/20 text-neon-cyan border-b-2 border-neon-cyan'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {count > 0 && (
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          <div className="min-h-[200px]">
            {activeTab === 'honors' && (
              <div>
                {isEditing && (
                  <button
                    onClick={addHonor}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors mb-4"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Honor/Award</span>
                  </button>
                )}
                
                {accomplishments.honors && accomplishments.honors.length > 0 ? (
                  <div className="space-y-4">
                    {accomplishments.honors.map((honor) => (
                      <div key={honor.id} className="bg-gray-700/30 rounded-lg p-4">
                        <h3 className="font-semibold text-white">{honor.title}</h3>
                        <p className="text-neon-cyan">{honor.issuer}</p>
                        <p className="text-gray-400 text-sm">{formatDate(honor.issueDate)}</p>
                        {honor.description && (
                          <p className="text-gray-300 mt-2">{honor.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">No honors or awards added yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                {isEditing && (
                  <button
                    onClick={addCourse}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors mb-4"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Course</span>
                  </button>
                )}
                
                {accomplishments.courses && accomplishments.courses.length > 0 ? (
                  <div className="space-y-4">
                    {accomplishments.courses.map((course) => (
                      <div key={course.id} className="bg-gray-700/30 rounded-lg p-4">
                        <h3 className="font-semibold text-white">{course.name}</h3>
                        {course.number && <p className="text-gray-400">Course Number: {course.number}</p>}
                        {course.associatedWith && <p className="text-neon-cyan">{course.associatedWith}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">No courses added yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'organizations' && (
              <div>
                {isEditing && (
                  <button
                    onClick={addOrganization}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors mb-4"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Organization</span>
                  </button>
                )}
                
                {accomplishments.organizations && accomplishments.organizations.length > 0 ? (
                  <div className="space-y-4">
                    {accomplishments.organizations.map((org) => (
                      <div key={org.id} className="bg-gray-700/30 rounded-lg p-4">
                        <h3 className="font-semibold text-white">{org.name}</h3>
                        {org.position && <p className="text-neon-cyan">{org.position}</p>}
                        <div className="flex items-center space-x-1 text-gray-400 text-sm mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDate(org.startDate)} - {org.isCurrent ? 'Present' : formatDate(org.endDate || '')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">No organizations added yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'patents' && (
              <div>
                {isEditing && (
                  <button
                    onClick={addPatent}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors mb-4"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Patent</span>
                  </button>
                )}
                
                {accomplishments.patents && accomplishments.patents.length > 0 ? (
                  <div className="space-y-4">
                    {accomplishments.patents.map((patent) => (
                      <div key={patent.id} className="bg-gray-700/30 rounded-lg p-4">
                        <h3 className="font-semibold text-white">{patent.title}</h3>
                        <p className="text-neon-cyan">{patent.patentOffice}</p>
                        <p className="text-gray-400">Patent Number: {patent.patentNumber}</p>
                        <p className="text-gray-400 text-sm">{formatDate(patent.issueDate)}</p>
                        {patent.description && (
                          <p className="text-gray-300 mt-2">{patent.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">No patents added yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">Showcase your accomplishments</p>
          <p className="text-gray-500 text-sm mb-4">
            Add honors, awards, courses, organizations, and patents
          </p>
          <button
            onClick={onEditToggle}
            className="px-4 py-2 bg-neon-cyan text-black rounded-lg hover:bg-cyan-400 transition-colors"
          >
            Add Accomplishments
          </button>
        </div>
      )}
    </div>
  );
};

export default AccomplishmentsSection;
