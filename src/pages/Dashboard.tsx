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

// Mock data for enrolled courses
const enrolledCourses = [
  {
    id: '1',
    title: 'Introduction to Data Science',
    instructor: 'Dr. Sarah Johnson',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    progress: 65,
    category: 'Data Science',
    totalLessons: 24,
    completedLessons: 16,
    nextLesson: 'Data Visualization with Python'
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    instructor: 'Prof. David Chen',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    progress: 30,
    category: 'AI & ML',
    totalLessons: 32,
    completedLessons: 10,
    nextLesson: 'Neural Network Basics'
  }
];

// Mock data for upcoming deadlines
const upcomingDeadlines = [
  {
    id: '1',
    title: 'Project Submission: Data Visualization',
    course: 'Introduction to Data Science',
    dueDate: '2023-11-15',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Quiz: Neural Networks',
    course: 'Machine Learning Fundamentals',
    dueDate: '2023-11-18',
    priority: 'medium'
  }
];

// Mock data for achievements
const achievements = [
  {
    id: '1',
    title: 'Fast Learner',
    description: 'Completed 5 lessons in a single day',
    date: '2023-10-28',
    icon: <Clock className="h-6 w-6" />,
    color: 'from-neon-cyan to-neon-blue'
  },
  {
    id: '2',
    title: 'Perfect Score',
    description: 'Scored 100% on a quiz',
    date: '2023-11-05',
    icon: <Trophy className="h-6 w-6" />,
    color: 'from-neon-magenta to-neon-pink'
  }
];

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
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta">
                  Welcome back, {userProfile?.displayName || user?.name || 'Learner'}!
                </h1>
                <p className="mt-2 text-cyan-100/80 text-lg">
                  Continue your learning journey
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Stats */}
          <div className="mb-8">
            <DashboardStats userProfile={userProfile} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Continue Learning Section */}
            <div className="lg:col-span-2">
              <CourseProgress userProfile={userProfile} />

              {/* Recent Achievements */}
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
                  {achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`relative p-4 rounded-xl border border-white/10 bg-gradient-to-r ${achievement.color}/10`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{achievement.title}</h3>
                          <p className="text-cyan-200/70 text-xs">{achievement.description}</p>
                          <p className="text-cyan-300/50 text-xs mt-1">{formatDate(achievement.date)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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

                {/* Check if user has enrolled courses */}
                {userProfile?.enrolledCourses && userProfile.enrolledCourses.length > 0 ? (
                  <div className="space-y-3">
                    {/* This will be populated with real LMS data in the future */}
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No upcoming deadlines</p>
                      <p className="text-gray-500 text-xs mt-1">Deadlines will appear here when available from your LMS</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No enrolled courses</p>
                    <p className="text-gray-500 text-xs mt-1">Enroll in courses to see upcoming deadlines</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
