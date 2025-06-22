import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, Clock, Users, Star, Award, CheckCircle, TrendingUp, 
  DollarSign, Briefcase, Target, BookOpen, Code, Database,
  Brain, Zap, ArrowRight, Calendar, Globe, Shield
} from 'lucide-react';
import { allCourses } from '../../data/coursesData';
import { courseDetailedData } from '../../data/courseDetailedData';
import { useAuth } from '../../contexts/AuthContext';
import { googleAppsScriptService } from '../../services/googleAppsScriptService';
import { userActivityService } from '../../services/userActivityService';
import { userDataService } from '../../services/userDataService';
import { emailService } from '../../services/emailService';
import JobMarketCharts from './JobMarketCharts';
import PrerequisiteChecker from './PrerequisiteChecker';
import LearningPathRecommendations from './LearningPathRecommendations';
import CourseComparison from './CourseComparison';
import AuthPromptModal from '../Auth/AuthPromptModal';
import ReviewSubmissionModal from '../Reviews/ReviewSubmissionModal';
import ReviewsDisplay from '../Reviews/ReviewsDisplay';

const CourseLandingPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewsKey, setReviewsKey] = useState(0); // Key to force reviews refresh
  const [course, setCourse] = useState<any>(null);

  // Find course data
  useEffect(() => {
    const foundCourse = allCourses.find(c => c.courseId === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      // Track course view
      if (user?.email) {
        userActivityService.trackCourseView(foundCourse.courseId, foundCourse.courseDisplayName, user.email);
      }
    }
  }, [courseId, user]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neon-cyan mb-4">Course Not Found</h1>
          <Link to="/courses" className="text-neon-magenta hover:text-neon-pink">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Get course-specific data based on courseId
  const getCourseSpecificData = (courseId: string) => {
    const courseData = courseDetailedData[courseId];

    if (courseData) {
      return {
        jobMarket: courseData.jobMarket,
        content: courseData.content
      };
    }

    // Fallback data for courses not yet in detailed data
    return {
      jobMarket: {
        averageSalary: '₹8-20 LPA',
        jobGrowth: '+25% (2024-2029)',
        openPositions: '25,000+',
        topCompanies: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'IBM'],
        skills: ['Programming', 'Problem Solving', 'Analytics', 'Communication'],
        careerPaths: ['Software Engineer', 'Data Analyst', 'Technical Consultant'],
        demandLevel: 'High' as const,
        futureOutlook: 'Growing demand in digital transformation'
      },
      content: {
        modules: [
          {
            title: 'Foundation Concepts',
            lessons: 10,
            duration: '2 weeks',
            topics: ['Basics', 'Core Concepts', 'Practical Applications']
          }
        ],
        projects: [
          {
            title: 'Capstone Project',
            description: 'Apply learned concepts in a real-world scenario',
            technologies: ['Industry Tools', 'Best Practices'],
            difficulty: 'Intermediate' as const
          }
        ],
        certifications: ['Course Completion Certificate'],
        prerequisites: ['Basic computer skills'],
        learningOutcomes: ['Master core concepts', 'Build practical projects', 'Gain industry skills']
      }
    };
  };

  const { jobMarket, content } = getCourseSpecificData(course.courseId);
  const courseDetailedInfo = courseDetailedData[course.courseId];

  // Handle enrollment
  const handleEnrollment = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    await processEnrollment();
  };

  // Process enrollment after authentication
  const processEnrollment = async (userOverride?: any) => {
    setIsEnrolling(true);

    try {
      // Use the provided user or the current user from context
      const currentUser = userOverride || user;

      console.log('🔍 Processing enrollment with user:', currentUser?.email || 'No user');

      if (!currentUser || !currentUser.email) {
        console.error('❌ No valid user data available for enrollment');
        throw new Error('User not authenticated');
      }

      const enrollmentData = {
        userEmail: currentUser.email,
        courseID: course.courseId,
        courseName: course.courseDisplayName,
        price: course.price.toString(),
        paymentStatus: course.price === 0 ? 'Free' : 'Completed',
        enrollmentStatus: 'Active',
        enrollmentDate: new Date().toISOString(),
        category: course.category,
        level: course.level,
        duration: course.duration
      };

      const result = await googleAppsScriptService.recordCourseEnrollment(enrollmentData);

      if (result.result === 'success') {
        // Also update user profile in Firestore
        await userDataService.enrollInCourse(currentUser.id, {
          courseID: course.courseId,
          courseName: course.courseDisplayName,
          category: course.category,
          level: course.level,
          duration: course.duration,
          price: course.price,
          enrollmentDate: new Date().toISOString(),
          enrollmentStatus: 'Active',
          paymentStatus: course.price === 0 ? 'Free' : 'Completed'
        });

        await userActivityService.trackCourseEnroll(course.courseId, course.courseDisplayName, currentUser.email);

        // Send enrollment confirmation email
        await emailService.sendEnrollmentConfirmation({
          to: currentUser.email,
          name: currentUser.name || currentUser.email.split('@')[0],
          courseName: course.courseDisplayName,
          courseId: course.courseId,
          price: course.price,
          enrollmentDate: new Date().toISOString()
        });

        const successMessage = course.price === 0
          ? `🎉 Successfully enrolled in "${course.courseDisplayName}"! Welcome to your free course. Check your email and dashboard to start learning.`
          : `🎉 Successfully enrolled in "${course.courseDisplayName}"! Payment confirmed. Check your email and dashboard to access the content.`;

        alert(successMessage);
      } else {
        console.error('❌ Google Sheets enrollment failed:', result);
        throw new Error(result.error || 'Failed to enroll in course');
      }
    } catch (error: any) {
      console.error('❌ Enrollment error:', error);

      // Provide more specific error messages
      if (error.message.includes('not authenticated')) {
        alert('Authentication error. Please try logging in again.');
      } else if (error.message.includes('Google Sheets integration not configured')) {
        alert('Enrollment system is currently under maintenance. Please try again later.');
      } else {
        alert(`Failed to enroll in course: ${error.message}. Please try again.`);
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center space-x-2 text-sm mb-4">
                <Link to="/courses" className="text-neon-cyan hover:text-cyan-300">Courses</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-300">{course.category}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-6">
                {course.courseDisplayName}
              </h1>

              {/* Marketing Hook */}
              {courseDetailedInfo?.marketingHook && (
                <div className="bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 rounded-xl p-4 mb-6 border border-neon-magenta/30">
                  <p className="text-xl font-bold text-neon-magenta text-center">
                    {courseDetailedInfo.marketingHook}
                  </p>
                </div>
              )}

              {/* Gen Z Appeal */}
              {courseDetailedInfo?.genZAppeal && (
                <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 rounded-lg p-3 mb-6 border border-neon-cyan/30">
                  <p className="text-lg text-neon-cyan text-center font-medium">
                    {courseDetailedInfo.genZAppeal}
                  </p>
                </div>
              )}

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-neon-cyan/30">
                  <Clock className="h-6 w-6 text-neon-cyan mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Duration</div>
                  <div className="font-semibold text-white">{course.duration}</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-neon-magenta/30">
                  <Target className="h-6 w-6 text-neon-magenta mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Level</div>
                  <div className="font-semibold text-white">{course.level}</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-neon-blue/30">
                  <BookOpen className="h-6 w-6 text-neon-blue mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Format</div>
                  <div className="font-semibold text-white">Online</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-yellow-400/30">
                  <Award className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Certificate</div>
                  <div className="font-semibold text-white">Included</div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-neon-cyan/30">
                <div>
                  <div className="text-3xl font-bold text-neon-cyan">
                    {course.price === 0 ? 'FREE' : `₹${course.price}`}
                  </div>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <div className="text-sm text-gray-400 line-through">₹{course.originalPrice}</div>
                  )}
                </div>
                <button
                  onClick={handleEnrollment}
                  disabled={isEnrolling}
                  className="px-8 py-3 bg-gradient-to-r from-neon-magenta to-neon-pink text-white font-bold rounded-lg hover:from-neon-pink hover:to-neon-magenta transition-all duration-300 disabled:opacity-50"
                >
                  {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            </div>

            {/* Right Content - Course Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-neon-cyan/30">
                <div className="aspect-video bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
                  <Play className="h-16 w-16 text-neon-cyan" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Course Preview</h3>
                <ul className="space-y-3">
                  {content.modules.slice(0, 3).map((module, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      {module.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-16 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'curriculum', label: 'Curriculum', icon: Code },
              { id: 'projects', label: 'Projects', icon: Target },
              { id: 'career', label: 'Career Impact', icon: TrendingUp },
              { id: 'reviews', label: 'Reviews', icon: Star },
              { id: 'path', label: 'Learning Path', icon: ArrowRight }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? 'border-neon-cyan text-neon-cyan'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* What You'll Learn */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-neon-cyan/30">
                  <h2 className="text-2xl font-bold text-neon-cyan mb-6">What You'll Master 🎯</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobMarket.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-gray-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Job Market Insights */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-neon-magenta/30">
                  <h2 className="text-2xl font-bold text-neon-magenta mb-6">Job Market Reality Check 📊</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                      <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-400">{jobMarket.averageSalary}</div>
                      <div className="text-sm text-gray-400">Average Salary</div>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-400">{jobMarket.jobGrowth}</div>
                      <div className="text-sm text-gray-400">Job Growth</div>
                    </div>
                    <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <Briefcase className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-400">{jobMarket.openPositions}</div>
                      <div className="text-sm text-gray-400">Open Positions</div>
                    </div>
                  </div>
                </div>

                {/* Industry Relevance */}
                {courseDetailedInfo?.industryRelevance && (
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-neon-blue/30">
                    <h2 className="text-2xl font-bold text-neon-blue mb-6">Industry Impact 🏭</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {courseDetailedInfo.industryRelevance}
                    </p>
                  </div>
                )}

                {/* Prerequisites Checker */}
                <PrerequisiteChecker
                  prerequisites={content.prerequisites}
                  courseTitle={course.courseDisplayName}
                />

                {/* Top Hiring Companies */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-neon-blue/30">
                  <h2 className="text-2xl font-bold text-neon-blue mb-6">Where Our Grads Work 🏢</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {jobMarket.topCompanies.map((company, index) => (
                      <div key={index} className="p-4 bg-gray-700/50 rounded-lg text-center border border-gray-600">
                        <div className="font-semibold text-white">{company}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Comparison */}
                <CourseComparison currentCourseId={course.courseId} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Unique Selling Points */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-yellow-400/30">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Why Choose This Course? ⭐</h3>
                  <ul className="space-y-3">
                    {courseDetailedInfo?.uniqueSellingPoints?.map((point: string, index: number) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Award className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">{point}</span>
                      </li>
                    )) || course.features?.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Award className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Career Paths */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-green-400/30">
                  <h3 className="text-xl font-bold text-green-400 mb-4">Career Paths</h3>
                  <ul className="space-y-3">
                    {jobMarket.careerPaths.map((path, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <ArrowRight className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300 text-sm">{path}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructor */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-neon-cyan/30">
                  <h3 className="text-xl font-bold text-neon-cyan mb-4">Your Instructor</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Industry Expert</div>
                      <div className="text-sm text-gray-400">10+ Years Experience</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Learn from industry professionals with real-world experience in top tech companies.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-neon-cyan">Course Curriculum</h2>
              <div className="space-y-6">
                {content.modules.map((module, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-neon-cyan/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Module {index + 1}: {module.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{module.lessons} lessons</span>
                        <span>{module.duration}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {module.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-neon-magenta">Real-World Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.projects.map((project, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-neon-magenta/30">
                    <h3 className="text-xl font-bold text-neon-magenta mb-4">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="px-3 py-1 bg-neon-magenta/20 text-neon-magenta rounded-full text-sm border border-neon-magenta/30">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'career' && (
            <div className="space-y-8">
              <JobMarketCharts jobMarket={jobMarket} courseTitle={course.courseDisplayName} />
            </div>
          )}

          {activeTab === 'path' && (
            <div className="space-y-8">
              <LearningPathRecommendations
                currentCourseId={course.courseId}
                currentCourseCategory={course.category}
              />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-yellow-400">Course Reviews & Feedback 💬</h2>

              {/* Real Reviews Display */}
              <ReviewsDisplay
                key={reviewsKey}
                courseId={course.courseId}
                onWriteReview={() => setShowReviewModal(true)}
              />

              {/* Platform Commitment Section */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-yellow-400/30">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">Our Commitment to Quality</h3>
                  <p className="text-gray-300 text-lg">
                    We value authentic feedback and continuously improve based on student experiences.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/30">
                    <h4 className="text-blue-400 font-bold mb-3">Our Promise</h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Industry-relevant curriculum updated regularly</li>
                      <li>• Real-world projects and practical learning</li>
                      <li>• Responsive support and community</li>
                      <li>• Transparent pricing with no hidden costs</li>
                    </ul>
                  </div>

                  <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/30">
                    <h4 className="text-green-400 font-bold mb-3">What You Get</h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Comprehensive course materials</li>
                      <li>• Hands-on project experience</li>
                      <li>• Certificate upon completion</li>
                      <li>• Access to course community</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Learning Experience Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-blue-400/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="h-8 w-8 text-blue-400" />
                    <h4 className="text-xl font-bold text-blue-400">Comprehensive Learning</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Our courses are designed with industry professionals to ensure you learn the most relevant and up-to-date skills. Each module builds upon the previous one for a structured learning experience.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-green-400/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className="h-8 w-8 text-green-400" />
                    <h4 className="text-xl font-bold text-green-400">Practical Projects</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Every course includes hands-on projects that simulate real-world scenarios. You'll build a portfolio of work that demonstrates your skills to potential employers.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-purple-400/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="h-8 w-8 text-purple-400" />
                    <h4 className="text-xl font-bold text-purple-400">Community Support</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Join a community of learners and professionals. Get help when you're stuck, share your progress, and network with peers in your field.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-orange-400/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <Award className="h-8 w-8 text-orange-400" />
                    <h4 className="text-xl font-bold text-orange-400">Recognized Certification</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Earn a certificate upon successful completion that you can add to your LinkedIn profile and resume. Our certificates are recognized by industry professionals.
                  </p>
                </div>
              </div>

              {/* What You Can Achieve */}
              <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 rounded-xl p-8 border border-neon-cyan/30">
                <h3 className="text-2xl font-bold text-neon-cyan mb-6 text-center">What You Can Achieve 🎯</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-xl font-bold text-white mb-2">Skill Development</div>
                    <div className="text-sm text-gray-300">Master in-demand technical skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🛠️</div>
                    <div className="text-xl font-bold text-white mb-2">Portfolio Building</div>
                    <div className="text-sm text-gray-300">Create projects for your portfolio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎓</div>
                    <div className="text-xl font-bold text-white mb-2">Career Readiness</div>
                    <div className="text-sm text-gray-300">Prepare for job opportunities</div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Results depend on your dedication, practice, and market conditions. We provide the tools and knowledge - your success depends on how you use them.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-6">
            Ready to Level Up Your Career? 🚀
          </h2>

          {/* Gen Z-friendly motivational content */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 mb-8 border border-neon-cyan/30">
            <p className="text-lg text-gray-300 mb-4">
              Don't let FOMO hit you when your friends are landing dream jobs! 💼✨
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-400">✅</span>
                <span className="text-gray-300">No boring theory</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-blue-400">🔥</span>
                <span className="text-gray-300">Real projects only</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-purple-400">💰</span>
                <span className="text-gray-300">ROI guaranteed</span>
              </div>
            </div>
          </div>

          <p className="text-xl text-gray-300 mb-8">
            Start your learning journey today and take the first step towards mastering new skills.
          </p>

          {/* Course Value */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-4 mb-8 border border-blue-500/30">
            <p className="text-blue-400 font-bold mb-2">💡 Why Choose This Course?</p>
            <p className="text-gray-300">
              {course.price === 0 ?
                "This course is completely free as part of our commitment to accessible education." :
                `Comprehensive curriculum designed by industry professionals at an affordable price of ₹${course.price}.`
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleEnrollment}
              disabled={isEnrolling}
              className="px-8 py-4 bg-gradient-to-r from-neon-magenta to-neon-pink text-white font-bold rounded-lg hover:from-neon-pink hover:to-neon-magenta transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
            >
              {isEnrolling ? 'Enrolling...' :
                course.price === 0 ?
                  '🎉 Enroll FREE Now!' :
                  `💎 Enroll Now - ₹${course.price}`
              }
            </button>
            <Link
              to="/courses"
              className="px-8 py-4 border-2 border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition-all duration-300"
            >
              🔍 Browse More Courses
            </Link>
          </div>

          {/* Value Propositions */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-neon-cyan">✓</div>
              <div className="text-sm text-gray-400">Industry-Relevant</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">✓</div>
              <div className="text-sm text-gray-400">Hands-On Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">✓</div>
              <div className="text-sm text-gray-400">Certificate Included</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">✓</div>
              <div className="text-sm text-gray-400">Community Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(authenticatedUser) => {
          setShowAuthModal(false);
          // Ensure we have valid user data before proceeding
          if (authenticatedUser && authenticatedUser.email) {
            console.log('✅ Authentication successful, proceeding with enrollment:', authenticatedUser.email);
            // Small delay to ensure user context is updated
            setTimeout(() => {
              processEnrollment(authenticatedUser);
            }, 1000); // Increased delay for better reliability
          } else {
            console.error('❌ Authentication succeeded but user data is invalid:', authenticatedUser);
            alert('Authentication completed but user data is missing. Please try again.');
          }
        }}
        courseName={course.courseDisplayName}
        coursePrice={course.price}
      />

      {/* Review Submission Modal */}
      <ReviewSubmissionModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        courseId={course.courseId}
        courseName={course.courseDisplayName}
        onReviewSubmitted={() => {
          // Close modal and refresh reviews component
          setShowReviewModal(false);
          // Increment key to force ReviewsDisplay to reload
          setReviewsKey(prev => prev + 1);
        }}
      />
    </div>
  );
};

export default CourseLandingPage;
