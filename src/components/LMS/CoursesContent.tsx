import React, { useState } from 'react';
import { Play, Clock, BarChart, CheckCircle, Lock, Star } from 'lucide-react';

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

interface UserProfile {
  enrolledCourses: Course[];
  completedCourses: Course[];
}

interface CoursesContentProps {
  userProfile: UserProfile;
}

const CoursesContent: React.FC<CoursesContentProps> = ({ userProfile }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'enrolled' | 'completed'>('all');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Data Science': return 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50';
      case 'AI & ML': return 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/50';
      case 'Generative AI': return 'bg-neon-blue/20 text-neon-blue border-neon-blue/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const allCourses = [...userProfile.enrolledCourses, ...userProfile.completedCourses];
  const filteredCourses = activeFilter === 'all' ? allCourses : 
                         activeFilter === 'enrolled' ? userProfile.enrolledCourses : 
                         userProfile.completedCourses;

  return (
    <div className="space-y-6">
      {/* Filter Tabs - Mobile responsive */}
      <div className="flex flex-wrap gap-2 sm:gap-4 p-2 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10">
        {[
          { id: 'all', label: 'All Courses', count: allCourses.length },
          { id: 'enrolled', label: 'In Progress', count: userProfile.enrolledCourses.length },
          { id: 'completed', label: 'Completed', count: userProfile.completedCourses.length }
        ].map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setActiveFilter(id as any)}
            className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
              activeFilter === id
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                : 'text-cyan-200/80 hover:bg-white/10 hover:text-neon-cyan'
            }`}
            style={activeFilter === id ? {boxShadow: '0 0 15px rgba(0,255,255,0.3)'} : {}}
          >
            <span>{label}</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{count}</span>
          </button>
        ))}
      </div>

      {/* Courses Grid - Mobile-first responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-cyan-200 mb-2">No courses found</h3>
          <p className="text-cyan-200/60">
            {activeFilter === 'enrolled' && "You haven't enrolled in any courses yet."}
            {activeFilter === 'completed' && "You haven't completed any courses yet."}
            {activeFilter === 'all' && "No courses available."}
          </p>
        </div>
      )}
    </div>
  );
};

// Course Card Component
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const isCompleted = course.progress === 100;
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Data Science': return 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50';
      case 'AI & ML': return 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/50';
      case 'Generative AI': return 'bg-neon-blue/20 text-neon-blue border-neon-blue/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-neon-cyan/50 transition-all duration-300 group">
      {/* Course Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(course.category)}`}>
              {course.category}
            </span>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
            {course.title}
          </h3>
        </div>
        {isCompleted && (
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
        )}
      </div>

      {/* Course Stats */}
      <div className="flex items-center justify-between text-sm text-cyan-200/80 mb-4">
        <div className="flex items-center space-x-1">
          <BarChart className="w-4 h-4" />
          <span>{course.completedLessons}/{course.totalLessons} lessons</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{course.estimatedTime}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-cyan-200/80 mb-2">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                : 'bg-gradient-to-r from-neon-cyan to-neon-magenta'
            }`}
            style={{
              width: `${course.progress}%`,
              boxShadow: isCompleted 
                ? '0 0 10px rgba(34, 197, 94, 0.5)' 
                : '0 0 10px rgba(0,255,255,0.5)'
            }}
          ></div>
        </div>
      </div>

      {/* Action Button */}
      <button className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
        isCompleted
          ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
          : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 hover:bg-neon-cyan/30'
      }`}>
        {isCompleted ? (
          <>
            <Star className="w-4 h-4" />
            <span>Review Course</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Continue Learning</span>
          </>
        )}
      </button>
    </div>
  );
};

export default CoursesContent;
