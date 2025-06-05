import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, BarChart, User, Award, PlayCircle, CheckCircle, ShoppingCart } from 'lucide-react';
import { googleAppsScriptService } from '../services/googleAppsScriptService';
import { userActivityService } from '../services/userActivityService';
import { useAuth } from '../contexts/AuthContext';

// Mock data for course details
const courseData = {
  id: '3',
  title: 'Generative AI with Python',
  instructor: 'Dr. Michael Lee',
  instructorTitle: 'AI Research Scientist',
  instructorBio: 'Dr. Michael Lee is a leading AI researcher with over 10 years of experience in generative models. He previously led AI research teams at major tech companies and has published numerous papers in top AI conferences.',
  instructorImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  description: 'Explore the exciting world of generative AI, including GANs, VAEs, and diffusion models to create innovative AI-generated content.',
  longDescription: 'This comprehensive course on Generative AI will take you from the basic concepts to advanced techniques used in state-of-the-art generative models. You will learn the mathematics and programming skills needed to build your own generative models from scratch. By the end of this course, you will be able to create models that can generate realistic images, text, music, and more.',
  image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  price: 99.99,
  category: 'Generative AI',
  level: 'Advanced',
  duration: '10 weeks',
  enrolled: 1253,
  rating: 4.8,
  reviews: 284,
  lastUpdated: 'August 2023',
  language: 'English',
  prerequisites: [
    'Intermediate Python programming skills',
    'Basic understanding of neural networks',
    'Familiarity with linear algebra and probability'
  ],
  whatYouWillLearn: [
    'Understand the mathematical foundations of generative models',
    'Build and train Generative Adversarial Networks (GANs)',
    'Implement Variational Autoencoders (VAEs) for image generation',
    'Master diffusion models like Stable Diffusion',
    'Create text-to-image models',
    'Deploy generative models to production environments',
    'Optimize models for performance and quality'
  ],
  curriculum: [
    {
      title: 'Introduction to Generative AI',
      lessons: [
        { title: 'Course Overview', duration: '10 min', preview: true },
        { title: 'What is Generative AI?', duration: '15 min', preview: true },
        { title: 'Applications of Generative Models', duration: '20 min', preview: false },
        { title: 'Mathematical Foundations', duration: '30 min', preview: false }
      ]
    },
    {
      title: 'Generative Adversarial Networks (GANs)',
      lessons: [
        { title: 'GAN Architecture Overview', duration: '25 min', preview: false },
        { title: 'Building Your First GAN', duration: '45 min', preview: false },
        { title: 'Training Challenges and Solutions', duration: '35 min', preview: false },
        { title: 'Advanced GAN Architectures', duration: '40 min', preview: false },
        { title: 'Hands-on Project: Image Generation', duration: '60 min', preview: false }
      ]
    },
    {
      title: 'Variational Autoencoders (VAEs)',
      lessons: [
        { title: 'VAE Theory and Architecture', duration: '30 min', preview: false },
        { title: 'Implementing VAEs in PyTorch', duration: '40 min', preview: false },
        { title: 'Latent Space Manipulation', duration: '35 min', preview: false },
        { title: 'Hands-on Project: Image Generation with VAEs', duration: '55 min', preview: false }
      ]
    },
    {
      title: 'Diffusion Models',
      lessons: [
        { title: 'Introduction to Diffusion Models', duration: '25 min', preview: false },
        { title: 'DDPM Implementation', duration: '45 min', preview: false },
        { title: 'Stable Diffusion Architecture', duration: '40 min', preview: false },
        { title: 'Text-to-Image Generation', duration: '35 min', preview: false },
        { title: 'Fine-tuning Diffusion Models', duration: '50 min', preview: false },
        { title: 'Hands-on Project: Creating a Custom Diffusion Model', duration: '90 min', preview: false }
      ]
    },
    {
      title: 'Deployment and Optimization',
      lessons: [
        { title: 'Model Optimization Techniques', duration: '30 min', preview: false },
        { title: 'Deploying Models to Production', duration: '35 min', preview: false },
        { title: 'Scaling Inference', duration: '25 min', preview: false },
        { title: 'Final Project', duration: '120 min', preview: false }
      ]
    }
  ]
};

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [isEnrolling, setIsEnrolling] = useState(false);

  // In a real app, we would fetch the course data based on the courseId
  const course = courseData;

  // Track course view when component mounts
  React.useEffect(() => {
    if (user?.email) {
      userActivityService.trackCourseView(course.id, course.title, user.email);
    }
  }, [course.id, course.title, user?.email]);

  // Handle course enrollment
  const handleEnrollment = async () => {
    console.log('🎯 Enrollment button clicked!');
    console.log('👤 Current user:', user);
    console.log('📚 Course data:', { id: course.id, title: course.title, price: course.price });

    if (!user) {
      console.log('❌ No user logged in');
      alert('Please log in to enroll in courses');
      return;
    }

    console.log('✅ User is logged in, proceeding with enrollment...');
    setIsEnrolling(true);

    try {
      console.log('📊 Sending enrollment data to Google Sheets...');

      // Record enrollment in Google Sheets
      const enrollmentData = {
        userEmail: user.email,
        courseID: course.id,
        courseName: course.title,
        price: course.price.toString(),
        paymentStatus: course.price === 0 ? 'Free' : 'Completed',
        enrollmentStatus: 'Active'
      };

      console.log('📋 Enrollment data:', enrollmentData);

      const result = await googleAppsScriptService.recordCourseEnrollment(enrollmentData);

      console.log('📊 Google Sheets response:', result);

      if (result.result === 'success') {
        console.log('✅ Course enrollment recorded in Google Sheets successfully');

        // Track enrollment activity
        console.log('📈 Tracking enrollment activity...');
        await userActivityService.trackCourseEnroll(course.id, course.title, user.email);

        console.log('🎉 All enrollment tracking completed successfully');
        alert(`Successfully enrolled in "${course.title}"! Welcome to the course. Check your Google Sheets to see the enrollment record.`);
      } else {
        console.error('❌ Google Sheets returned error:', result);
        throw new Error(result.error || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('❌ Error enrolling in course:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        user: user?.email,
        course: course.id
      });
      alert('There was an error enrolling in the course. Please check the console for details and try again.');
    } finally {
      setIsEnrolling(false);
    }
  };
  
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };
  
  return (
    <div className="pt-16 bg-gray-50">
      {/* Course header */}
      <div className="bg-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 text-sm mb-2">
                <Link to="/courses" className="text-indigo-200 hover:text-white">Courses</Link>
                <span>&gt;</span>
                <Link to={`/courses?category=${course.category.toLowerCase().replace(/\s+/g, '-')}`} className="text-indigo-200 hover:text-white">{course.category}</Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-indigo-100 mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-1 text-indigo-300" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="w-5 h-5 mr-1 text-indigo-300" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-1 text-indigo-300" />
                  <span>{course.duration}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 mb-6">
                <span className="text-yellow-400 font-bold">{course.rating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-5 h-5 ${star <= Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-indigo-200">({course.reviews} reviews)</span>
                <span className="text-indigo-200 ml-4">{course.enrolled} students</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-indigo-200">Last updated: {course.lastUpdated}</span>
                <span className="text-indigo-200">•</span>
                <span className="text-indigo-200">{course.language}</span>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="relative mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button className="p-3 bg-white rounded-full text-indigo-600 hover:text-indigo-700 transition-colors">
                      <PlayCircle className="h-12 w-12" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-indigo-900">${course.price.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleEnrollment}
                    disabled={isEnrolling}
                    className="w-full py-3 bg-coral-500 text-white rounded-md font-medium hover:bg-coral-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                  <button className="w-full py-3 border border-indigo-600 text-indigo-600 rounded-md font-medium hover:bg-indigo-50 transition-colors">
                    Try Free Preview
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2">This course includes:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Access on mobile and desktop</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Hands-on projects</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Downloadable resources</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'curriculum'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('instructor')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'instructor'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Instructor
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>
      </div>
      
      {/* Course content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Description</h2>
                  <p className="text-gray-700 mb-6">{course.longDescription}</p>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Prerequisites</h3>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    {course.prerequisites.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                {/* This column intentionally left empty for layout purposes */}
              </div>
            </div>
          )}
          
          {/* Curriculum tab */}
          {activeTab === 'curriculum' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
              <div className="space-y-4">
                {course.curriculum.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 rounded-md overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-500">
                          {section.lessons.length} lessons &bull; 
                          {' '}
                          {section.lessons.reduce((total, lesson) => {
                            const minutes = parseInt(lesson.duration.split(' ')[0]);
                            return total + minutes;
                          }, 0)} min
                        </p>
                      </div>
                      <svg
                        className={`h-5 w-5 text-gray-500 transform ${
                          expandedSections[section.title] ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    
                    {expandedSections[section.title] && (
                      <div className="border-t border-gray-200">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className={`p-4 flex justify-between items-center ${
                              lessonIndex < section.lessons.length - 1 ? 'border-b border-gray-200' : ''
                            }`}
                          >
                            <div className="flex items-start">
                              <PlayCircle className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                <p className="text-sm text-gray-500">{lesson.duration}</p>
                              </div>
                            </div>
                            {lesson.preview && (
                              <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                                Preview
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Instructor tab */}
          {activeTab === 'instructor' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Instructor</h2>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <img
                  src={course.instructorImage}
                  alt={course.instructor}
                  className="w-32 h-32 rounded-full object-cover"
                />
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{course.instructor}</h3>
                  <p className="text-indigo-600 mb-4">{course.instructorTitle}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-gray-500 mr-1" />
                      <span className="text-gray-700">10+ Years Experience</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-500 mr-1" />
                      <span className="text-gray-700">5,000+ Students</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700">{course.instructorBio}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Reviews tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
              
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-indigo-600 mb-2">{course.rating}</div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-5 h-5 ${star <= Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600">Course Rating</p>
                  <p className="text-sm text-gray-500">{course.reviews} reviews</p>
                </div>
                
                <div className="flex-grow">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      // Generate realistic percentages based on overall rating
                      let percentage = 0;
                      if (rating === 5) percentage = 72;
                      else if (rating === 4) percentage = 20;
                      else if (rating === 3) percentage = 5;
                      else if (rating === 2) percentage = 2;
                      else percentage = 1;
                      
                      return (
                        <div key={rating} className="flex items-center">
                          <div className="flex items-center w-24">
                            <span className="text-sm text-gray-600 mr-1">{rating}</span>
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600 w-12">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-center text-gray-600">This page shows student reviews for illustration purposes. In a full implementation, actual student reviews would be displayed here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;