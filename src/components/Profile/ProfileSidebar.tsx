import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../services/userDataService';
import { profileStrengthService, ProfileStrengthAnalysis } from '../../services/profileStrengthService';
import { analyticsService, ProfileAnalytics } from '../../services/analyticsService';
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
  BarChart3,
  Loader2
} from 'lucide-react';

interface ProfileSidebarProps {
  userProfile: UserProfile;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ userProfile }) => {
  const [profileStrength, setProfileStrength] = useState<ProfileStrengthAnalysis | null>(null);
  const [analytics, setAnalytics] = useState<ProfileAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);

        // Calculate dynamic profile strength
        const strengthAnalysis = profileStrengthService.calculateProfileStrength(userProfile);
        setProfileStrength(strengthAnalysis);

        // Load real analytics data
        if (userProfile.uid) {
          const analyticsData = await analyticsService.getProfileAnalytics(userProfile.uid);
          setAnalytics(analyticsData);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [userProfile]);

  const profileCompleteness = profileStrength?.overallScore || 0;

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

  const getStrengthLevelText = (level: string) => {
    const levelMap = {
      'weak': '🔴 Needs Work',
      'fair': '🟡 Fair',
      'good': '🟢 Good',
      'strong': '💪 Strong',
      'excellent': '⭐ Excellent'
    };
    return levelMap[level as keyof typeof levelMap] || level;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-neon-cyan" />
            <span className="ml-2 text-gray-300">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

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
          
          {profileStrength && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Strength Level</span>
                <span className="text-sm font-medium text-white">
                  {getStrengthLevelText(profileStrength.strengthLevel)}
                </span>
              </div>

              {profileStrength.recommendations.length > 0 && (
                <div className="text-xs text-gray-400">
                  <p className="font-medium mb-1">Top recommendations:</p>
                  <ul className="space-y-1">
                    {profileStrength.recommendations.slice(0, 2).map((rec, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span className="text-neon-cyan">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
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
            <span className="font-bold text-neon-cyan">{analytics?.profileViews || 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">Search appearances</span>
            </div>
            <span className="font-bold text-neon-cyan">{analytics?.searchAppearances || 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">Messages sent</span>
            </div>
            <span className="font-bold text-neon-cyan">{analytics?.messagesSent || 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">Connection requests</span>
            </div>
            <span className="font-bold text-neon-cyan">{analytics?.connectionRequests || 0}</span>
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
