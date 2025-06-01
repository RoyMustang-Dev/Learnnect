import React, { useState } from 'react';
import { User, Mail, Calendar, Settings, Edit3, Save, X, Camera, Bell, Shield, Palette } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  badges: Badge[];
  enrolledCourses: Course[];
  completedCourses: Course[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

interface Course {
  id: string;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

interface ProfileContentProps {
  userProfile: UserProfile;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ userProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: userProfile.name,
    email: userProfile.email
  });
  const [activeSection, setActiveSection] = useState<'profile' | 'preferences' | 'notifications' | 'privacy'>('profile');

  const handleSave = () => {
    // In a real app, this would make an API call
    console.log('Saving profile:', editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({
      name: userProfile.name,
      email: userProfile.email
    });
    setIsEditing(false);
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header - Mobile responsive */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative group">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-neon-cyan mx-auto sm:mx-0"
                style={{boxShadow: '0 0 20px rgba(0,255,255,0.3)'}}
              />
              <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* User Info */}
            <div className="text-center sm:text-left">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-cyan-200/50 focus:border-neon-cyan focus:outline-none w-full sm:w-auto"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-cyan-200/50 focus:border-neon-cyan focus:outline-none w-full sm:w-auto"
                    placeholder="Email Address"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold text-neon-cyan mb-1">{userProfile.name}</h1>
                  <p className="text-cyan-200/80 mb-2">{userProfile.email}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-cyan-200/60">
                    <span>Level {userProfile.level}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{userProfile.xp.toLocaleString()} XP</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{userProfile.badges.length} Badges</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Edit Button */}
          <div className="flex justify-center sm:justify-end space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 rounded-lg hover:bg-neon-cyan/30 transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings Navigation - Mobile responsive */}
      <div className="flex flex-wrap gap-2 p-2 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'preferences', label: 'Preferences', icon: Settings },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'privacy', label: 'Privacy', icon: Shield }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id as any)}
            className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
              activeSection === id
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                : 'text-cyan-200/80 hover:bg-white/10 hover:text-neon-cyan'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      {activeSection === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Learning Stats */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <h3 className="text-lg font-bold text-neon-cyan mb-4">Learning Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-cyan-200/80">Courses Enrolled</span>
                <span className="text-white font-bold">{userProfile.enrolledCourses.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-200/80">Courses Completed</span>
                <span className="text-white font-bold">{userProfile.completedCourses.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-200/80">Total XP Earned</span>
                <span className="text-white font-bold">{userProfile.xp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-200/80">Current Level</span>
                <span className="text-white font-bold">Level {userProfile.level}</span>
              </div>
            </div>
          </div>

          {/* Badge Showcase */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <h3 className="text-lg font-bold text-neon-cyan mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {userProfile.badges.slice(0, 4).map((badge) => (
                <div key={badge.id} className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getBadgeColor(badge.rarity)} flex items-center justify-center text-lg`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{badge.name}</p>
                    <p className="text-cyan-200/60 text-xs">{badge.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    badge.rarity === 'legendary' ? 'bg-yellow-400/20 text-yellow-400' :
                    badge.rarity === 'epic' ? 'bg-purple-400/20 text-purple-400' :
                    badge.rarity === 'rare' ? 'bg-blue-400/20 text-blue-400' :
                    'bg-gray-400/20 text-gray-400'
                  }`}>
                    {badge.rarity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'preferences' && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
          <h3 className="text-lg font-bold text-neon-cyan mb-6">Learning Preferences</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Preferred Learning Time</label>
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-neon-cyan focus:outline-none">
                <option value="morning">Morning (6AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 6PM)</option>
                <option value="evening">Evening (6PM - 12AM)</option>
                <option value="night">Night (12AM - 6AM)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Difficulty Preference</label>
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-neon-cyan focus:outline-none">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="mixed">Mixed Levels</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Daily Learning Goal</label>
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-neon-cyan focus:outline-none">
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'notifications' && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
          <h3 className="text-lg font-bold text-neon-cyan mb-6">Notification Settings</h3>
          <div className="space-y-4">
            {[
              { id: 'course-updates', label: 'Course Updates', description: 'New lessons and course announcements' },
              { id: 'achievements', label: 'Achievements', description: 'Badge unlocks and level ups' },
              { id: 'reminders', label: 'Learning Reminders', description: 'Daily learning goal reminders' },
              { id: 'leaderboard', label: 'Leaderboard', description: 'Weekly ranking updates' }
            ].map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{setting.label}</p>
                  <p className="text-cyan-200/60 text-sm">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'privacy' && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
          <h3 className="text-lg font-bold text-neon-cyan mb-6">Privacy Settings</h3>
          <div className="space-y-4">
            {[
              { id: 'profile-visibility', label: 'Profile Visibility', description: 'Show your profile on leaderboards' },
              { id: 'progress-sharing', label: 'Progress Sharing', description: 'Allow others to see your learning progress' },
              { id: 'badge-display', label: 'Badge Display', description: 'Show your badges publicly' },
              { id: 'activity-status', label: 'Activity Status', description: 'Show when you\'re online' }
            ].map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{setting.label}</p>
                  <p className="text-cyan-200/60 text-sm">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
