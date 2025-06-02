import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userDataService, UserProfile } from '../../services/userDataService';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  Target,
  Award,
  Calendar,
  BarChart3
} from 'lucide-react';

interface DashboardStatsProps {
  userProfile: UserProfile | null;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userProfile }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    certificates: 0,
    totalHours: 0,
    averageProgress: 0,
    streak: 0,
    lastActivity: null as Date | null
  });

  useEffect(() => {
    if (userProfile) {
      const enrolledCount = userProfile.enrolledCourses?.length || 0;
      const completedCount = userProfile.completedCourses?.length || 0;
      const certificatesCount = userProfile.certificates?.length || 0;
      const inProgressCount = enrolledCount - completedCount;

      // Calculate average progress
      const progressValues = Object.values(userProfile.learningProgress || {});
      const averageProgress = progressValues.length > 0 
        ? progressValues.reduce((sum, progress) => sum + progress, 0) / progressValues.length 
        : 0;

      // Estimate total hours (assuming 2 hours per course on average)
      const totalHours = completedCount * 2 + inProgressCount * 1;

      // Mock streak calculation (would be calculated from actual activity data)
      const streak = Math.floor(Math.random() * 30) + 1;

      setStats({
        totalCourses: enrolledCount,
        completedCourses: completedCount,
        inProgressCourses: inProgressCount,
        certificates: certificatesCount,
        totalHours,
        averageProgress: Math.round(averageProgress),
        streak,
        lastActivity: userProfile.lastLoginAt?.toDate?.() || new Date()
      });
    }
  }, [userProfile]);

  const statCards = [
    {
      title: 'Enrolled Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Completed',
      value: stats.completedCourses,
      icon: Trophy,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'In Progress',
      value: stats.inProgressCourses,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      title: 'Certificates',
      value: stats.certificates,
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Learning Hours',
      value: `${stats.totalHours}h`,
      icon: BarChart3,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20'
    },
    {
      title: 'Avg Progress',
      value: `${stats.averageProgress}%`,
      icon: TrendingUp,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20'
    },
    {
      title: 'Learning Streak',
      value: `${stats.streak} days`,
      icon: Target,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    {
      title: 'Last Activity',
      value: stats.lastActivity ? new Date(stats.lastActivity).toLocaleDateString() : 'Never',
      icon: Calendar,
      color: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-300">
              {stat.title}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
