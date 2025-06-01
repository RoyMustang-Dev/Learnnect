import React from 'react';
import { TrendingUp, Calendar, Target, Award, BookOpen, Clock } from 'lucide-react';

interface UserProfile {
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

interface ProgressContentProps {
  userProfile: UserProfile;
}

const ProgressContent: React.FC<ProgressContentProps> = ({ userProfile }) => {
  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const totalLessons = userProfile.enrolledCourses.reduce((sum, course) => sum + course.totalLessons, 0) +
                      userProfile.completedCourses.reduce((sum, course) => sum + course.totalLessons, 0);
  
  const completedLessons = userProfile.enrolledCourses.reduce((sum, course) => sum + course.completedLessons, 0) +
                          userProfile.completedCourses.reduce((sum, course) => sum + course.totalLessons, 0);

  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Mock weekly progress data
  const weeklyProgress = [
    { day: 'Mon', xp: 120 },
    { day: 'Tue', xp: 80 },
    { day: 'Wed', xp: 200 },
    { day: 'Thu', xp: 150 },
    { day: 'Fri', xp: 90 },
    { day: 'Sat', xp: 180 },
    { day: 'Sun', xp: 110 }
  ];

  const maxXp = Math.max(...weeklyProgress.map(d => d.xp));

  return (
    <div className="space-y-6">
      {/* Progress Overview - Mobile responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <ProgressCard
          title="Overall Progress"
          value={`${Math.round(overallProgress)}%`}
          icon={<Target className="w-6 h-6" />}
          color="neon-cyan"
        />
        <ProgressCard
          title="Current Level"
          value={userProfile.level.toString()}
          icon={<TrendingUp className="w-6 h-6" />}
          color="neon-magenta"
        />
        <ProgressCard
          title="Total XP"
          value={userProfile.xp.toLocaleString()}
          icon={<Award className="w-6 h-6" />}
          color="neon-blue"
        />
        <ProgressCard
          title="Badges Earned"
          value={userProfile.badges.length.toString()}
          icon={<Award className="w-6 h-6" />}
          color="neon-pink"
        />
      </div>

      {/* Weekly Activity Chart - Mobile responsive */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
        <h3 className="text-lg sm:text-xl font-bold text-neon-cyan mb-6 flex items-center space-x-2">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Weekly Activity</span>
        </h3>
        
        <div className="flex items-end justify-between space-x-2 sm:space-x-4 h-32 sm:h-40">
          {weeklyProgress.map((day, index) => (
            <div key={day.day} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-neon-cyan to-neon-magenta rounded-t-lg transition-all duration-500 hover:scale-105"
                style={{
                  height: `${(day.xp / maxXp) * 100}%`,
                  minHeight: '8px',
                  boxShadow: '0 0 10px rgba(0,255,255,0.3)'
                }}
              ></div>
              <span className="text-xs sm:text-sm text-cyan-200/80 mt-2">{day.day}</span>
              <span className="text-xs text-cyan-200/60">{day.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Course Progress - Mobile responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Active Courses */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
          <h3 className="text-lg sm:text-xl font-bold text-neon-cyan mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Active Courses</span>
          </h3>
          
          <div className="space-y-4">
            {userProfile.enrolledCourses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-medium text-sm sm:text-base">{course.title}</h4>
                  <span className="text-neon-cyan text-sm font-bold">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-neon-cyan to-neon-magenta h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${course.progress}%`,
                      boxShadow: '0 0 8px rgba(0,255,255,0.4)'
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-cyan-200/60">
                  <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                  <span>{course.estimatedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Collection */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
          <h3 className="text-lg sm:text-xl font-bold text-neon-cyan mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Badge Collection</span>
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {userProfile.badges.map((badge) => (
              <div 
                key={badge.id} 
                className="group relative bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 hover:border-neon-cyan/50 transition-all duration-200 cursor-pointer"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${getBadgeColor(badge.rarity)} flex items-center justify-center text-lg sm:text-2xl mb-2 mx-auto`}>
                  {badge.icon}
                </div>
                <h4 className="text-white font-medium text-xs sm:text-sm text-center">{badge.name}</h4>
                <p className="text-cyan-200/60 text-xs text-center mt-1">{badge.rarity}</p>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                  {badge.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Card Component
const ProgressCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'neon-cyan': return 'text-neon-cyan border-neon-cyan/50';
      case 'neon-magenta': return 'text-neon-magenta border-neon-magenta/50';
      case 'neon-blue': return 'text-neon-blue border-neon-blue/50';
      case 'neon-pink': return 'text-neon-pink border-neon-pink/50';
      default: return 'text-neon-cyan border-neon-cyan/50';
    }
  };

  return (
    <div className={`bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 hover:${getColorClasses(color).split(' ')[1]} transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-cyan-200/80 text-sm mb-1">{title}</p>
          <p className={`text-2xl sm:text-3xl font-bold ${getColorClasses(color).split(' ')[0]}`}>{value}</p>
        </div>
        <div className={`${getColorClasses(color).split(' ')[0]} opacity-80`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default ProgressContent;
