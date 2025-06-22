import React from 'react';
import { ArrowRight, Target, TrendingUp, Award, Clock, Users } from 'lucide-react';
import { allCourses } from '../../data/coursesData';

interface LearningPathRecommendationsProps {
  currentCourseId: string;
  currentCourseCategory: string;
}

const LearningPathRecommendations: React.FC<LearningPathRecommendationsProps> = ({ 
  currentCourseId, 
  currentCourseCategory 
}) => {
  // Define learning paths based on categories
  const getLearningPath = (category: string, currentId: string) => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('data science') || categoryLower.includes('ai') || categoryLower.includes('machine learning')) {
      return {
        pathName: 'AI & Data Science Mastery Path 🤖',
        description: 'Become an AI expert with this comprehensive learning journey',
        courses: ['16', '14', '112', '113', '114', '118', '120'],
        color: 'from-blue-500 to-purple-500'
      };
    }
    
    if (categoryLower.includes('web') || categoryLower.includes('frontend') || categoryLower.includes('full stack')) {
      return {
        pathName: 'Full Stack Developer Path 💻',
        description: 'Master modern web development from frontend to backend',
        courses: ['15', '17', '115', '116', '20'],
        color: 'from-green-500 to-cyan-500'
      };
    }
    
    if (categoryLower.includes('cloud') || categoryLower.includes('devops')) {
      return {
        pathName: 'Cloud & DevOps Engineer Path ☁️',
        description: 'Build scalable, reliable systems in the cloud',
        courses: ['13', '14', '116', '20', '118'],
        color: 'from-orange-500 to-red-500'
      };
    }
    
    if (categoryLower.includes('cyber') || categoryLower.includes('security')) {
      return {
        pathName: 'Cybersecurity Specialist Path 🔒',
        description: 'Protect digital assets and become a security expert',
        courses: ['13', '21', '116', '20'],
        color: 'from-red-500 to-pink-500'
      };
    }
    
    if (categoryLower.includes('mobile') || categoryLower.includes('app')) {
      return {
        pathName: 'Mobile App Developer Path 📱',
        description: 'Create amazing mobile experiences',
        courses: ['15', '17', '19', '115'],
        color: 'from-purple-500 to-pink-500'
      };
    }
    
    // Default path for other categories
    return {
      pathName: 'Technology Professional Path 🚀',
      description: 'Build a strong foundation in modern technology',
      courses: ['11', '12', '15', '16', '14'],
      color: 'from-cyan-500 to-blue-500'
    };
  };

  const path = getLearningPath(currentCourseCategory, currentCourseId);
  
  // Get course details for the path
  const pathCourses = path.courses.map(courseId => {
    const course = allCourses.find(c => c.courseId === courseId);
    return course ? {
      ...course,
      isCurrentCourse: courseId === currentCourseId,
      isCompleted: false, // This would come from user progress in a real app
      isUnlocked: true // This would be based on prerequisites in a real app
    } : null;
  }).filter(Boolean);

  const currentCourseIndex = pathCourses.findIndex(course => course?.isCurrentCourse);
  
  // Get next recommended courses
  const getNextCourses = () => {
    if (currentCourseIndex === -1) return pathCourses.slice(0, 3);
    return pathCourses.slice(currentCourseIndex + 1, currentCourseIndex + 4);
  };

  const nextCourses = getNextCourses();

  // Alternative paths based on current course
  const getAlternativePaths = () => {
    const alternatives = [];
    
    if (!currentCourseCategory.toLowerCase().includes('data science')) {
      alternatives.push({
        name: 'Switch to AI & Data Science 🤖',
        description: 'High-demand field with excellent growth prospects',
        startCourse: '112',
        icon: '🧠',
        salary: '₹12-25 LPA',
        growth: '+35%'
      });
    }
    
    if (!currentCourseCategory.toLowerCase().includes('web')) {
      alternatives.push({
        name: 'Explore Web Development 💻',
        description: 'Create amazing web applications and websites',
        startCourse: '115',
        icon: '🌐',
        salary: '₹8-16 LPA',
        growth: '+25%'
      });
    }
    
    if (!currentCourseCategory.toLowerCase().includes('cloud')) {
      alternatives.push({
        name: 'Master Cloud Computing ☁️',
        description: 'Build scalable applications in the cloud',
        startCourse: '116',
        icon: '☁️',
        salary: '₹12-24 LPA',
        growth: '+38%'
      });
    }
    
    return alternatives.slice(0, 2);
  };

  const alternativePaths = getAlternativePaths();

  return (
    <div className="space-y-8">
      {/* Current Learning Path */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-neon-cyan/30">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="h-6 w-6 text-neon-cyan" />
          <h2 className="text-2xl font-bold text-neon-cyan">Your Learning Path</h2>
        </div>
        
        <div className={`bg-gradient-to-r ${path.color} p-6 rounded-xl mb-6`}>
          <h3 className="text-2xl font-bold text-white mb-2">{path.pathName}</h3>
          <p className="text-white/90">{path.description}</p>
        </div>

        {/* Path Progress */}
        <div className="space-y-4">
          {pathCourses.map((course, index) => (
            <div
              key={course?.courseId}
              className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 ${
                course?.isCurrentCourse
                  ? 'bg-neon-cyan/10 border-neon-cyan/50'
                  : course?.isCompleted
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-gray-700/30 border-gray-600/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                course?.isCurrentCourse
                  ? 'bg-neon-cyan text-black'
                  : course?.isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  course?.isCurrentCourse ? 'text-neon-cyan' : 'text-white'
                }`}>
                  {course?.courseDisplayName}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course?.duration}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course?.level}</span>
                  </span>
                </div>
              </div>
              
              {course?.isCurrentCourse && (
                <div className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm font-medium">
                  Current
                </div>
              )}
              
              {!course?.isCurrentCourse && (
                <a
                  href={`/courses/${course?.courseId}`}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                >
                  View Course
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Recommended Courses */}
      {nextCourses.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-green-400/30">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-6 w-6 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400">What's Next? 🎯</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nextCourses.map((course, index) => (
              <div
                key={course?.courseId}
                className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50 hover:border-green-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">{course?.courseDisplayName}</h3>
                  <div className="text-2xl">
                    {index === 0 ? '🎯' : index === 1 ? '🚀' : '⭐'}
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {course?.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {course?.duration} • {course?.level}
                  </div>
                  <a
                    href={`/courses/${course?.courseId}`}
                    className="flex items-center space-x-1 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <span className="text-sm">Start</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alternative Career Paths */}
      {alternativePaths.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-purple-400/30">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-400">Explore Other Paths 🌟</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alternativePaths.map((altPath, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/30"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">{altPath.icon}</span>
                  <h3 className="font-bold text-white">{altPath.name}</h3>
                </div>
                
                <p className="text-gray-300 mb-4">{altPath.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">
                    <div>💰 {altPath.salary}</div>
                    <div>📈 {altPath.growth} growth</div>
                  </div>
                </div>
                
                <a
                  href={`/courses/${altPath.startCourse}`}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  <span>Explore Path</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPathRecommendations;
