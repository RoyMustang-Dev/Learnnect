import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, Users, TrendingUp, Star } from 'lucide-react';
import { allCourses } from '../../data/coursesData';
import { courseDetailedData } from '../../data/courseDetailedData';

interface CourseComparisonProps {
  currentCourseId: string;
}

const CourseComparison: React.FC<CourseComparisonProps> = ({ currentCourseId }) => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([currentCourseId]);
  const [showComparison, setShowComparison] = useState(false);

  const currentCourse = allCourses.find(c => c.courseId === currentCourseId);
  const currentCategory = currentCourse?.category.toLowerCase() || '';

  // Get similar courses for comparison
  const getSimilarCourses = () => {
    return allCourses.filter(course => {
      if (course.courseId === currentCourseId) return false;
      
      const courseCategory = course.category.toLowerCase();
      
      // Check if courses are in similar categories
      if (currentCategory.includes('data science') || currentCategory.includes('ai') || currentCategory.includes('machine learning')) {
        return courseCategory.includes('data science') || courseCategory.includes('ai') || courseCategory.includes('machine learning');
      }
      
      if (currentCategory.includes('web') || currentCategory.includes('frontend') || currentCategory.includes('full stack')) {
        return courseCategory.includes('web') || courseCategory.includes('frontend') || courseCategory.includes('full stack');
      }
      
      if (currentCategory.includes('cloud') || currentCategory.includes('devops')) {
        return courseCategory.includes('cloud') || courseCategory.includes('devops');
      }
      
      return courseCategory === currentCategory;
    }).slice(0, 6);
  };

  const similarCourses = getSimilarCourses();

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else if (prev.length < 3) {
        return [...prev, courseId];
      }
      return prev;
    });
  };

  const getComparisonData = (courseId: string) => {
    const course = allCourses.find(c => c.courseId === courseId);
    const detailedData = courseDetailedData[courseId];
    
    return {
      course,
      detailedData,
      salary: detailedData?.jobMarket.averageSalary || 'Not specified',
      growth: detailedData?.jobMarket.jobGrowth || 'Not specified',
      demand: detailedData?.jobMarket.demandLevel || 'Medium',
      positions: detailedData?.jobMarket.openPositions || 'Not specified',
      skills: detailedData?.jobMarket.skills || [],
      prerequisites: detailedData?.content.prerequisites || [],
      projects: detailedData?.content.projects?.length || 0,
      modules: detailedData?.content.modules?.length || 0
    };
  };

  const comparisonCourses = selectedCourses.map(getComparisonData);

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Extreme': return 'text-red-400';
      case 'Very High': return 'text-orange-400';
      case 'High': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getDemandScore = (demand: string) => {
    switch (demand) {
      case 'Extreme': return 5;
      case 'Very High': return 4;
      case 'High': return 3;
      default: return 2;
    }
  };

  if (!showComparison) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-neon-cyan/30">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-neon-cyan mb-4">Compare Courses 📊</h3>
          <p className="text-gray-300 mb-6">
            See how this course stacks up against similar options to make the best choice for your career.
          </p>
          <button
            onClick={() => setShowComparison(true)}
            className="px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-white font-bold rounded-lg hover:from-neon-blue hover:to-neon-cyan transition-all duration-300"
          >
            Start Comparison
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-neon-cyan/30">
        <h3 className="text-2xl font-bold text-neon-cyan mb-6">Course Comparison Tool 📊</h3>
        
        {/* Course Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-bold text-white mb-4">Select courses to compare (max 3):</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[currentCourse, ...similarCourses].filter(Boolean).map((course) => (
              <div
                key={course!.courseId}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedCourses.includes(course!.courseId)
                    ? 'bg-neon-cyan/10 border-neon-cyan/50'
                    : 'bg-gray-700/30 border-gray-600/50 hover:border-gray-500/50'
                }`}
                onClick={() => handleCourseToggle(course!.courseId)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-white text-sm">{course!.courseDisplayName}</h5>
                  {selectedCourses.includes(course!.courseId) ? (
                    <CheckCircle className="h-5 w-5 text-neon-cyan" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {course!.duration} • {course!.level}
                </div>
                {course!.courseId === currentCourseId && (
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-xs">
                      Current Course
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedCourses.length > 1 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-2 text-gray-400 font-medium">Feature</th>
                  {comparisonCourses.map((data, index) => (
                    <th key={index} className="text-center py-4 px-2 text-white font-medium min-w-[200px]">
                      <div className="text-sm">{data.course?.courseDisplayName}</div>
                      {data.course?.courseId === currentCourseId && (
                        <div className="text-xs text-neon-cyan mt-1">Current</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-4">
                {/* Duration */}
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-2 text-gray-300 font-medium">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Duration</span>
                    </div>
                  </td>
                  {comparisonCourses.map((data, index) => (
                    <td key={index} className="py-4 px-2 text-center text-white">
                      {data.course?.duration}
                    </td>
                  ))}
                </tr>

                {/* Level */}
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-2 text-gray-300 font-medium">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Level</span>
                    </div>
                  </td>
                  {comparisonCourses.map((data, index) => (
                    <td key={index} className="py-4 px-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        data.course?.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                        data.course?.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {data.course?.level}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Price */}
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-2 text-gray-300 font-medium">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Price</span>
                    </div>
                  </td>
                  {comparisonCourses.map((data, index) => (
                    <td key={index} className="py-4 px-2 text-center">
                      <span className={`font-bold ${data.course?.price === 0 ? 'text-green-400' : 'text-white'}`}>
                        {data.course?.price === 0 ? 'FREE' : `₹${data.course?.price}`}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Salary Range */}
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-2 text-gray-300 font-medium">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Avg Salary</span>
                    </div>
                  </td>
                  {comparisonCourses.map((data, index) => (
                    <td key={index} className="py-4 px-2 text-center text-green-400 font-medium">
                      {data.salary}
                    </td>
                  ))}
                </tr>

                {/* Market Demand */}
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-2 text-gray-300 font-medium">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>Market Demand</span>
                    </div>
                  </td>
                  {comparisonCourses.map((data, index) => (
                    <td key={index} className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <span className={`font-medium ${getDemandColor(data.demand)}`}>
                          {data.demand}
                        </span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className={`w-2 h-2 rounded-full ${
                                star <= getDemandScore(data.demand) ? 'bg-yellow-400' : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Projects */}
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-2 text-gray-300 font-medium">Projects</td>
                  {comparisonCourses.map((data, index) => (
                    <td key={index} className="py-4 px-2 text-center text-white">
                      {data.projects} projects
                    </td>
                  ))}
                </tr>

                {/* Modules */}
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-2 text-gray-300 font-medium">Modules</td>
                  {comparisonCourses.map((data, index) => (
                    <td key={index} className="py-4 px-2 text-center text-white">
                      {data.modules} modules
                    </td>
                  ))}
                </tr>

                {/* Prerequisites */}
                <tr>
                  <td className="py-4 px-2 text-gray-300 font-medium">Prerequisites</td>
                  {comparisonCourses.map((data, index) => (
                    <td key={index} className="py-4 px-2 text-center">
                      <span className={`text-sm ${data.prerequisites.length === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {data.prerequisites.length === 0 ? 'None' : `${data.prerequisites.length} required`}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Recommendation */}
        {selectedCourses.length > 1 && (
          <div className="mt-8 bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 rounded-lg p-6 border border-neon-cyan/30">
            <h4 className="text-lg font-bold text-neon-cyan mb-4">Our Recommendation 🎯</h4>
            <p className="text-gray-300">
              Based on the comparison, <span className="text-neon-cyan font-bold">{currentCourse?.courseDisplayName}</span> offers 
              excellent value with its comprehensive curriculum and strong job market prospects. 
              {currentCourse?.price === 0 && " Plus, it's completely FREE!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseComparison;
