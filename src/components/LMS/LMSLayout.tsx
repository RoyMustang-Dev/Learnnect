import React, { useState, useEffect } from 'react';
import { User, Trophy, Target, BookOpen, Award, TrendingUp, Bell, Settings } from 'lucide-react';
import CoursesContent from './CoursesContent';
import ProgressContent from './ProgressContent';
import LeaderboardContent from './LeaderboardContent';
import ProfileContent from './ProfileContent';

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

interface LeaderboardEntry {
  rank: number;
  user: {
    name: string;
    avatar: string;
    level: number;
  };
  xp: number;
  weeklyXp: number;
}

type TabType = 'dashboard' | 'courses' | 'progress' | 'leaderboard' | 'profile';

const LMSLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Mock data - In real app, this would come from API
  useEffect(() => {
    // Simulate API call
    const mockUserProfile: UserProfile = {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      level: 12,
      xp: 2450,
      xpToNextLevel: 550,
      badges: [
        { id: '1', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', rarity: 'common', unlockedAt: new Date() },
        { id: '2', name: 'Data Explorer', description: 'Complete 5 Data Science courses', icon: '📊', rarity: 'rare', unlockedAt: new Date() },
        { id: '3', name: 'AI Pioneer', description: 'Master AI fundamentals', icon: '🤖', rarity: 'epic', unlockedAt: new Date() }
      ],
      enrolledCourses: [
        { id: '1', title: 'Advanced Machine Learning', progress: 65, totalLessons: 20, completedLessons: 13, category: 'AI & ML', difficulty: 'advanced', estimatedTime: '8 weeks' },
        { id: '2', title: 'Data Visualization with Python', progress: 30, totalLessons: 15, completedLessons: 5, category: 'Data Science', difficulty: 'intermediate', estimatedTime: '6 weeks' }
      ],
      completedCourses: [
        { id: '3', title: 'Introduction to Data Science', progress: 100, totalLessons: 12, completedLessons: 12, category: 'Data Science', difficulty: 'beginner', estimatedTime: '4 weeks' }
      ]
    };

    const mockLeaderboard: LeaderboardEntry[] = [
      { rank: 1, user: { name: 'Sarah Chen', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', level: 18 }, xp: 4200, weeklyXp: 320 },
      { rank: 2, user: { name: 'Alex Johnson', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', level: 12 }, xp: 2450, weeklyXp: 180 },
      { rank: 3, user: { name: 'Marcus Williams', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', level: 15 }, xp: 3100, weeklyXp: 150 }
    ];

    setUserProfile(mockUserProfile);
    setLeaderboard(mockLeaderboard);
  }, []);



  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black">
      {/* Mobile-first responsive container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with user info - Mobile optimized */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-neon-cyan"
                style={{boxShadow: '0 0 20px rgba(0,255,255,0.3)'}}
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-neon-cyan" style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>
                  Welcome back, {userProfile.name}!
                </h1>
                <p className="text-cyan-200/80 text-sm sm:text-base">Level {userProfile.level} • {userProfile.xp} XP</p>
              </div>
            </div>

            {/* XP Progress Bar - Mobile responsive */}
            <div className="w-full sm:w-64">
              <div className="flex justify-between text-sm text-cyan-200/80 mb-1">
                <span>Level {userProfile.level}</span>
                <span>{userProfile.xpToNextLevel} XP to next level</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-neon-cyan to-neon-magenta h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(userProfile.xp / (userProfile.xp + userProfile.xpToNextLevel)) * 100}%`,
                    boxShadow: '0 0 10px rgba(0,255,255,0.5)'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Mobile responsive */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-4 p-2 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Target },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'progress', label: 'Progress', icon: TrendingUp },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'profile', label: 'Profile', icon: User }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
                  activeTab === id
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                    : 'text-cyan-200/80 hover:bg-white/10 hover:text-neon-cyan'
                }`}
                style={activeTab === id ? {boxShadow: '0 0 15px rgba(0,255,255,0.3)'} : {}}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardContent userProfile={userProfile} />
          )}
          {activeTab === 'courses' && (
            <CoursesContent userProfile={userProfile} />
          )}
          {activeTab === 'progress' && (
            <ProgressContent userProfile={userProfile} />
          )}
          {activeTab === 'leaderboard' && (
            <LeaderboardContent leaderboard={leaderboard} />
          )}
          {activeTab === 'profile' && (
            <ProfileContent userProfile={userProfile} />
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Quick Stats */}
      <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard title="Courses Enrolled" value={userProfile.enrolledCourses.length} icon="📚" />
        <StatCard title="Courses Completed" value={userProfile.completedCourses.length} icon="✅" />
        <StatCard title="Badges Earned" value={userProfile.badges.length} icon="🏆" />
      </div>

      {/* Recent Badges */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
        <h3 className="text-lg font-bold text-neon-cyan mb-4">Recent Badges</h3>
        <div className="space-y-3">
          {userProfile.badges.slice(0, 3).map((badge) => (
            <div key={badge.id} className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getBadgeColor(badge.rarity)} flex items-center justify-center text-lg`}>
                {badge.icon}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{badge.name}</p>
                <p className="text-cyan-200/60 text-xs">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{ title: string; value: number; icon: string }> = ({ title, value, icon }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-neon-cyan/50 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-cyan-200/80 text-sm">{title}</p>
          <p className="text-2xl font-bold text-neon-cyan">{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
};

export default LMSLayout;
