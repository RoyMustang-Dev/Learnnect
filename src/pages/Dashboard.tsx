import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  BarChart2,
  Clock,
  Award,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Play,
  Target,
  TrendingUp,
  Calendar,
  Star,
  Zap,
  Users,
  Trophy,
  User,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userDataService, UserProfile } from '../services/userDataService';
import DashboardStats from '../components/Dashboard/DashboardStats';
import CourseProgress from '../components/Dashboard/CourseProgress';
import NotificationsSection from '../components/Dashboard/NotificationsSection';

// Note: All course data is now dynamically loaded from user profile
// Only Data Science, AI, ML & Generative AI courses are supported

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) return;

      try {
        const profile = await userDataService.getUserProfile(user.id);
        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user?.id]);

  // Format date to display as "Nov 15, 2023"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate days remaining until deadline
  const getDaysRemaining = (dateStr: string) => {
    const today = new Date();
    const dueDate = new Date(dateStr);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-neon-cyan mx-auto mb-4" />
          <p className="text-cyan-200">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-cyan/5 via-transparent to-neon-magenta/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/3 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/3 rounded-full blur-3xl"></div>

      <div className="relative z-10 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta">
                  Welcome back, {userProfile?.displayName || user?.name || 'Learner'}!
                </h1>
                <p className="mt-2 text-cyan-100/80 text-base sm:text-lg">
                  Continue your learning journey
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Stats */}
          <div className="mb-6 sm:mb-8">
            <DashboardStats userProfile={userProfile} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Continue Learning Section */}
            <div className="lg:col-span-2">
              <CourseProgress userProfile={userProfile} />

              {/* Recent Achievements - Now Dynamic */}
              {userProfile?.accomplishments && userProfile.accomplishments.length > 0 && (
                <div
                  className="relative p-6 rounded-2xl border border-white/10 mt-8"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }}
                >
                  <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-6">
                    Recent Achievements
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {userProfile.accomplishments.slice(0, 4).map((accomplishment, index) => (
                      <div
                        key={accomplishment.id}
                        className="relative p-4 rounded-xl border border-white/10 bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{accomplishment.title}</h3>
                            <p className="text-cyan-200/70 text-xs">{accomplishment.description}</p>
                            {accomplishment.date && (
                              <p className="text-cyan-300/50 text-xs mt-1">{formatDate(accomplishment.date)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <div
                className="relative p-6 rounded-2xl border border-white/10"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
                  Upcoming Deadlines
                </h2>

                {/* Dynamic Deadlines based on enrolled courses */}
                {userProfile?.enrolledCourses && userProfile.enrolledCourses.length > 0 ? (
                  <div className="space-y-3">
                    {/* Filter for Data Science/AI/ML courses only */}
                    {userProfile.enrolledCourses
                      .filter(course =>
                        course.category?.toLowerCase().includes('data science') ||
                        course.category?.toLowerCase().includes('ai') ||
                        course.category?.toLowerCase().includes('ml') ||
                        course.category?.toLowerCase().includes('machine learning') ||
                        course.category?.toLowerCase().includes('generative ai')
                      )
                      .slice(0, 3)
                      .map((course, index) => (
                        <div key={course.id || index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <h4 className="text-white font-medium text-sm">{course.title}</h4>
                          <p className="text-gray-400 text-xs mt-1">Next milestone coming soon</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">Progress: {course.progress || 0}%</span>
                            <span className="text-xs text-neon-cyan">Continue →</span>
                          </div>
                        </div>
                      ))}

                    {userProfile.enrolledCourses.filter(course =>
                      course.category?.toLowerCase().includes('data science') ||
                      course.category?.toLowerCase().includes('ai') ||
                      course.category?.toLowerCase().includes('ml') ||
                      course.category?.toLowerCase().includes('machine learning') ||
                      course.category?.toLowerCase().includes('generative ai')
                    ).length === 0 && (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">No relevant courses</p>
                        <p className="text-gray-500 text-xs mt-1">Enroll in Data Science, AI, ML or Generative AI courses</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No enrolled courses</p>
                    <p className="text-gray-500 text-xs mt-1">Enroll in Data Science, AI, ML or Generative AI courses</p>
                  </div>
                )}
              </div>

              {/* Notifications Section */}
              <NotificationsSection className="mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
