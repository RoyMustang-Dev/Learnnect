import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, BookOpen, Code, Database, Brain } from 'lucide-react';

interface PrerequisiteCheckerProps {
  prerequisites: string[];
  courseTitle: string;
}

const PrerequisiteChecker: React.FC<PrerequisiteCheckerProps> = ({ prerequisites, courseTitle }) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleCheck = (prerequisite: string, isChecked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [prerequisite]: isChecked
    }));
  };

  const getIcon = (prerequisite: string) => {
    const lower = prerequisite.toLowerCase();
    if (lower.includes('programming') || lower.includes('python') || lower.includes('java')) {
      return <Code className="h-5 w-5 text-blue-400" />;
    }
    if (lower.includes('database') || lower.includes('sql')) {
      return <Database className="h-5 w-5 text-green-400" />;
    }
    if (lower.includes('math') || lower.includes('statistics') || lower.includes('algebra')) {
      return <Brain className="h-5 w-5 text-purple-400" />;
    }
    return <BookOpen className="h-5 w-5 text-yellow-400" />;
  };

  const getRecommendations = (prerequisite: string) => {
    const lower = prerequisite.toLowerCase();
    if (lower.includes('python')) {
      return {
        course: 'Python Programming Fundamentals',
        link: '/courses/16',
        duration: '4 weeks'
      };
    }
    if (lower.includes('sql') || lower.includes('database')) {
      return {
        course: 'SQL & Database Fundamentals',
        link: '/courses/14',
        duration: '3 weeks'
      };
    }
    if (lower.includes('javascript')) {
      return {
        course: 'Frontend Development with JavaScript',
        link: '/courses/15',
        duration: '6 weeks'
      };
    }
    if (lower.includes('linux')) {
      return {
        course: 'Linux Fundamentals',
        link: '/courses/13',
        duration: '2 weeks'
      };
    }
    return {
      course: 'Foundation Course',
      link: '/courses',
      duration: '2-4 weeks'
    };
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = prerequisites.length;
  const completionPercentage = totalCount > 0 ? (checkedCount / totalCount) * 100 : 100;

  const getReadinessLevel = () => {
    if (completionPercentage >= 80) return { level: 'Ready to Rock! 🚀', color: 'text-green-400', bgColor: 'bg-green-500/10' };
    if (completionPercentage >= 60) return { level: 'Almost There! 💪', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' };
    if (completionPercentage >= 40) return { level: 'Getting Started 📚', color: 'text-orange-400', bgColor: 'bg-orange-500/10' };
    return { level: 'Need Prep Work 🎯', color: 'text-red-400', bgColor: 'bg-red-500/10' };
  };

  const readiness = getReadinessLevel();

  if (prerequisites.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-green-400/30">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-bold text-green-400">No Prerequisites Required! 🎉</h3>
        </div>
        <p className="text-gray-300">
          This course is perfect for beginners! You can start right away without any prior knowledge.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-neon-cyan/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-neon-cyan">Prerequisites Checker 📋</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${readiness.bgColor} ${readiness.color}`}>
          {readiness.level}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Readiness Level</span>
          <span className="text-sm font-medium text-white">{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              completionPercentage >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              completionPercentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              completionPercentage >= 40 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
              'bg-gradient-to-r from-red-500 to-pink-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Prerequisites List */}
      <div className="space-y-3 mb-6">
        {prerequisites.map((prerequisite, index) => {
          const isChecked = checkedItems[prerequisite] || false;
          return (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                isChecked 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-gray-700/30 border-gray-600/50 hover:border-gray-500/50'
              }`}
            >
              <button
                onClick={() => handleCheck(prerequisite, !isChecked)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isChecked
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-400 hover:border-gray-300'
                }`}
              >
                {isChecked && <CheckCircle className="h-4 w-4 text-white" />}
              </button>
              
              {getIcon(prerequisite)}
              
              <div className="flex-1">
                <span className={`font-medium ${isChecked ? 'text-green-400' : 'text-gray-300'}`}>
                  {prerequisite}
                </span>
              </div>

              {!isChecked && (
                <button
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className="text-xs text-neon-cyan hover:text-cyan-300 transition-colors"
                >
                  Need help?
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      {showRecommendations && (
        <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 rounded-lg p-4 border border-neon-cyan/30">
          <h4 className="text-lg font-bold text-neon-cyan mb-3">📚 Recommended Prep Courses</h4>
          <div className="space-y-3">
            {prerequisites.filter(p => !checkedItems[p]).map((prerequisite, index) => {
              const recommendation = getRecommendations(prerequisite);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{recommendation.course}</div>
                    <div className="text-sm text-gray-400">Duration: {recommendation.duration}</div>
                  </div>
                  <a
                    href={recommendation.link}
                    className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-lg text-sm hover:bg-neon-cyan/30 transition-colors"
                  >
                    Start Learning
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Based on Readiness */}
      <div className="mt-6 text-center">
        {completionPercentage >= 80 ? (
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-bold mb-2">You're Ready! 🎉</p>
            <p className="text-gray-300 text-sm">
              You have all the prerequisites to excel in {courseTitle}. Let's get started!
            </p>
          </div>
        ) : completionPercentage >= 60 ? (
          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
            <AlertCircle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-yellow-400 font-bold mb-2">Almost Ready! 💪</p>
            <p className="text-gray-300 text-sm">
              You can start the course, but consider brushing up on the unchecked items for better success.
            </p>
          </div>
        ) : (
          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
            <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 font-bold mb-2">Prep Work Needed 📚</p>
            <p className="text-gray-300 text-sm">
              We recommend completing some foundation courses first to get the most out of {courseTitle}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrerequisiteChecker;
