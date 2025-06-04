import React from 'react';
import { UserProfile } from '../../services/userDataService';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar, 
  Award, 
  BookOpen, 
  Briefcase,
  GraduationCap,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';

interface ProfileSidebarProps {
  userProfile: UserProfile;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ userProfile }) => {
  // Calculate profile completeness
  const calculateProfileCompleteness = () => {
    const fields = [
      userProfile.displayName,
      userProfile.headline,
      userProfile.about,
      userProfile.location,
      userProfile.currentPosition,
      userProfile.company,
      userProfile.experience?.length,
      userProfile.education?.length,
      userProfile.skills?.length,
      userProfile.photoURL
    ];
    
    const completedFields = fields.filter(field => 
      field && (typeof field === 'string' ? field.trim() : field > 0)
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompleteness = calculateProfileCompleteness();

  // Mock analytics data (in a real app, this would come from your analytics service)
  const analytics = {
    profileViews: 127,
    searchAppearances: 45,
    connections: 234,
    endorsements: 18
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCompletionBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-400';
    if (percentage >= 60) return 'bg-yellow-400';
    if (percentage >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Profile Strength */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-neon-cyan" />
          </div>
          <h3 className="text-lg font-bold text-white">Profile Strength</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Completeness</span>
            <span className={`font-bold ${getCompletionColor(profileCompleteness)}`}>
              {profileCompleteness}%
            </span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getCompletionBgColor(profileCompleteness)}`}
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
          
          <div className="text-sm text-gray-400">
            {profileCompleteness < 100 && (
              <p>Complete your profile to increase visibility and opportunities.</p>
            )}
            {profileCompleteness === 100 && (
              <p>🎉 Your profile is complete! Great job!</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Analytics */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-neon-cyan" />
          </div>
          <h3 className="text-lg font-bold text-white">Analytics</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">Profile views</span>
            </div>
            <span className="font-bold text-neon-cyan">{analytics.profileViews}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">Search appearances</span>
            </div>
            <span className="font-bold text-neon-cyan">{analytics.searchAppearances}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">Connections</span>
            </div>
            <span className="font-bold text-neon-cyan">{analytics.connections}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">Endorsements</span>
            </div>
            <span className="font-bold text-neon-cyan">{analytics.endorsements}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-neon-cyan" />
          </div>
          <h3 className="text-lg font-bold text-white">Quick Stats</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Briefcase className="h-6 w-6 text-neon-cyan" />
            </div>
            <div className="text-xl font-bold text-white">
              {userProfile.experience?.length || 0}
            </div>
            <div className="text-xs text-gray-400">Experience</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <GraduationCap className="h-6 w-6 text-neon-cyan" />
            </div>
            <div className="text-xl font-bold text-white">
              {userProfile.education?.length || 0}
            </div>
            <div className="text-xs text-gray-400">Education</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 text-neon-cyan" />
            </div>
            <div className="text-xl font-bold text-white">
              {userProfile.skills?.length || 0}
            </div>
            <div className="text-xs text-gray-400">Skills</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-neon-cyan" />
            </div>
            <div className="text-xl font-bold text-white">
              {userProfile.certifications?.length || 0}
            </div>
            <div className="text-xs text-gray-400">Certificates</div>
          </div>
        </div>
      </div>

      {/* Learning Progress (EdTech specific) */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-neon-cyan" />
          </div>
          <h3 className="text-lg font-bold text-white">Learning Journey</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Enrolled Courses</span>
            <span className="font-bold text-neon-cyan">
              {userProfile.enrolledCourses?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Completed Courses</span>
            <span className="font-bold text-green-400">
              {userProfile.completedCourses?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Certificates Earned</span>
            <span className="font-bold text-yellow-400">
              {userProfile.certificates?.length || 0}
            </span>
          </div>
          
          {userProfile.enrolledCourses && userProfile.enrolledCourses.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-2">Overall Progress</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-neon-cyan to-neon-blue h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((userProfile.completedCourses?.length || 0) / userProfile.enrolledCourses.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Member Since */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
            <Calendar className="h-4 w-4 text-neon-cyan" />
          </div>
          <h3 className="text-lg font-bold text-white">Member Since</h3>
        </div>
        
        <div className="text-gray-300">
          {userProfile.createdAt ? (
            new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })
          ) : (
            'Recently joined'
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
