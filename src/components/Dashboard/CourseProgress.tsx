import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userDataService, UserProfile } from '../../services/userDataService';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen,
  BarChart3,
  ArrowRight,
  Trophy
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  lessons: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

interface CourseProgressProps {
  userProfile: UserProfile | null;
}

// Mock course data - in real app, this would come from a courses service
const mockCourses: Course[] = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'Learn the basics of React including components, props, and state management.',
    thumbnail: '/api/placeholder/300/200',
    duration: '8 hours',
    lessons: 24,
    difficulty: 'Beginner',
    category: 'Frontend'
  },
  {
    id: 'javascript-advanced',
    title: 'Advanced JavaScript',
    description: 'Deep dive into advanced JavaScript concepts and modern ES6+ features.',
    thumbnail: '/api/placeholder/300/200',
    duration: '12 hours',
    lessons: 36,
    difficulty: 'Advanced',
    category: 'Programming'
  },
  {
    id: 'node-backend',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js and Express.',
    thumbnail: '/api/placeholder/300/200',
    duration: '10 hours',
    lessons: 30,
    difficulty: 'Intermediate',
    category: 'Backend'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Principles',
    description: 'Master the fundamentals of user interface and user experience design.',
    thumbnail: '/api/placeholder/300/200',
    duration: '6 hours',
    lessons: 18,
    difficulty: 'Beginner',
    category: 'Design'
  }
];

const CourseProgress: React.FC<CourseProgressProps> = ({ userProfile }) => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (userProfile) {
      // Filter courses based on enrolled courses
      const enrolled = mockCourses.filter(course => 
        userProfile.enrolledCourses?.includes(course.id)
      );
      setEnrolledCourses(enrolled);
      setCourseProgress(userProfile.learningProgress || {});
    }
  }, [userProfile]);

  const updateProgress = async (courseId: string, newProgress: number) => {
    if (!user?.id) return;

    try {
      await userDataService.updateLearningProgress(user.id, courseId, newProgress);
      setCourseProgress(prev => ({
        ...prev,
        [courseId]: newProgress
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'from-green-500 to-emerald-500';
    if (progress >= 75) return 'from-blue-500 to-cyan-500';
    if (progress >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-slate-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Advanced': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (enrolledCourses.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Enrolled Courses</h3>
        <p className="text-gray-400 mb-6">Start your learning journey by enrolling in a course!</p>
        <Link
          to="/courses"
          className="inline-block px-6 py-3 bg-gradient-to-r from-neon-cyan to-cyan-400 text-black font-semibold rounded-xl hover:from-cyan-400 hover:to-neon-cyan transition-all duration-300"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Courses</h2>
        <span className="text-gray-400">{enrolledCourses.length} enrolled</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrolledCourses.map((course) => {
          const progress = courseProgress[course.id] || 0;
          const isCompleted = progress >= 100;

          return (
            <div
              key={course.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300"
            >
              {/* Course Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                    {isCompleted && (
                      <Trophy className="h-5 w-5 text-yellow-400" />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{course.description}</p>
                  
                  {/* Course Meta */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isCompleted ? (
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => updateProgress(course.id, Math.min(progress + 10, 100))}
                      className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/20 rounded-lg transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span className="text-sm">Continue</span>
                    </button>
                  )}
                </div>

                <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                  <span className="text-sm">View Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Progress Update (for demo) */}
              {!isCompleted && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Quick update:</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateProgress(course.id, Math.min(progress + 25, 100))}
                        className="px-2 py-1 bg-gray-700/50 hover:bg-gray-700 rounded text-white transition-colors"
                      >
                        +25%
                      </button>
                      <button
                        onClick={() => updateProgress(course.id, Math.min(progress + 50, 100))}
                        className="px-2 py-1 bg-gray-700/50 hover:bg-gray-700 rounded text-white transition-colors"
                      >
                        +50%
                      </button>
                      <button
                        onClick={() => updateProgress(course.id, 100)}
                        className="px-2 py-1 bg-green-600/50 hover:bg-green-600 rounded text-white transition-colors"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseProgress;
