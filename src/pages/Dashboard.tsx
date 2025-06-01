import React, { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
                  Welcome back, {user?.name || 'Learner'}!
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div
              className="relative p-6 rounded-2xl border border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(0,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-200 text-sm font-medium">Courses Enrolled</p>
                  <p className="text-2xl font-bold text-neon-cyan">2</p>
                </div>
                <BookOpen className="h-8 w-8 text-neon-cyan" />
              </div>
            </div>

            <div
              className="relative p-6 rounded-2xl border border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(255,0,255,0.1) 0%, rgba(255,0,255,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-magenta-200 text-sm font-medium">Lessons Completed</p>
                  <p className="text-2xl font-bold text-neon-magenta">26</p>
                </div>
                <CheckCircle className="h-8 w-8 text-neon-magenta" />
              </div>
            </div>

            <div
              className="relative p-6 rounded-2xl border border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(0,245,255,0.1) 0%, rgba(0,245,255,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Learning Hours</p>
                  <p className="text-2xl font-bold text-neon-blue">32.5</p>
                </div>
                <Clock className="h-8 w-8 text-neon-blue" />
              </div>
            </div>

            <div
              className="relative p-6 rounded-2xl border border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,128,0.1) 0%, rgba(0,255,128,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Achievements</p>
                  <p className="text-2xl font-bold text-neon-green">8</p>
                </div>
                <Trophy className="h-8 w-8 text-neon-green" />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Continue Learning Section */}
            <div className="lg:col-span-2">
              <div
                className="relative p-6 rounded-2xl border border-white/10 mb-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta">
                    Continue Learning
                  </h2>
                  <Link
                    to="/lms/courses"
                    className="text-neon-cyan hover:text-cyan-300 transition-colors text-sm font-medium flex items-center"
                  >
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {enrolledCourses.map(course => (
                    <div
                      key={course.id}
                      className="relative p-4 rounded-xl border border-white/10 hover:border-neon-cyan/50 transition-all duration-300 group"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-white mb-1">{course.title}</h3>
                          <p className="text-cyan-200/70 text-sm mb-2">{course.instructor}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex-grow mr-4">
                              <div className="flex justify-between text-xs text-cyan-300/60 mb-1">
                                <span>{course.progress}% complete</span>
                                <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-neon-cyan to-neon-blue h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 hover:from-neon-cyan/30 hover:to-neon-blue/30 text-neon-cyan border border-neon-cyan/30 rounded-lg transition-all duration-200 group-hover:scale-105">
                              <Play className="h-4 w-4 mr-2" />
                              Continue
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div
                className="relative p-6 rounded-2xl border border-white/10"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-6">
                  Recent Achievements
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="space-y-3">
                  {upcomingDeadlines.map(deadline => (
                    <div
                      key={deadline.id}
                      className="p-3 rounded-lg border border-white/10 bg-white/5"
                    >
                      <h3 className="font-medium text-white text-sm mb-1">{deadline.title}</h3>
                      <p className="text-cyan-200/70 text-xs mb-2">{deadline.course}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-300/60 text-xs">{formatDate(deadline.dueDate)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          getDaysRemaining(deadline.dueDate) <= 2
                            ? 'bg-red-500/20 text-red-300'
                            : getDaysRemaining(deadline.dueDate) <= 5
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {getDaysRemaining(deadline.dueDate)} days
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div
                className="relative p-6 rounded-2xl border border-white/10"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
                  Quick Actions
                </h2>

                <div className="space-y-3">
                  <Link
                    to="/lms/courses"
                    className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <BookOpen className="h-5 w-5 text-neon-cyan mr-3" />
                    <span className="text-white text-sm group-hover:text-neon-cyan transition-colors">Browse Courses</span>
                  </Link>

                  <Link
                    to="/lms/progress"
                    className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <BarChart2 className="h-5 w-5 text-neon-magenta mr-3" />
                    <span className="text-white text-sm group-hover:text-neon-magenta transition-colors">View Progress</span>
                  </Link>

                  <Link
                    to="/lms/leaderboard"
                    className="flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <Trophy className="h-5 w-5 text-neon-blue mr-3" />
                    <span className="text-white text-sm group-hover:text-neon-blue transition-colors">Leaderboard</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
