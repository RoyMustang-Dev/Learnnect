import React from 'react';
import { Users, BookOpen, Award, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for team members
const teamMembers = [
  {
    name: 'Dr. Emily Chen',
    role: 'Founder & CEO',
    bio: 'Former AI research scientist with a passion for making technical education accessible to everyone.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Chief Learning Officer',
    bio: 'Ed-tech veteran with 15+ years experience designing effective online learning experiences.',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Data Science',
    bio: 'Data scientist and educator committed to helping students build practical, industry-relevant skills.',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'David Kim',
    role: 'Chief Technology Officer',
    bio: 'Former tech lead at major AI companies, focusing on building scalable educational platforms.',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const AboutPage = () => {
  return (
    <div className="pt-16 bg-gray-50">
      {/* Hero section */}
      <div className="bg-indigo-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-indigo-100">
              Making high-quality education in Data Science, AI, and ML accessible to learners worldwide.
            </p>
          </div>
        </div>
      </div>
      
      {/* Our story section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4">
                Learnnect was founded in 2023 with a simple yet powerful vision: to bridge the gap between theoretical knowledge and practical skills in the fields of Data Science, AI, and Machine Learning.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Our founder, Dr. Emily Chen, experienced firsthand the challenges of transitioning from academic research to industry applications. She recognized that while many educational platforms offered theoretical courses, few provided the hands-on, project-based learning needed to succeed in real-world scenarios.
              </p>
              <p className="text-lg text-gray-700">
                Today, Learnnect serves thousands of students worldwide, offering a blend of free and premium courses designed to transform beginners into industry-ready professionals through practical, engaging, and accessible education.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Team working together" 
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-indigo-100 rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're proud of the difference we're making in the lives of our students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">10,000+</div>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">100+</div>
              <p className="text-gray-600">Expert-Led Courses</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <p className="text-gray-600">Countries Reached</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">85%</div>
              <p className="text-gray-600">Career Advancement Rate</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Values section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-indigo-50 rounded-xl p-8 border border-indigo-100">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600">
                Making quality education available to everyone, regardless of background or resources.
              </p>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-8 border border-indigo-100">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Practical Learning</h3>
              <p className="text-gray-600">
                Focusing on real-world applications and projects that build tangible skills.
              </p>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-8 border border-indigo-100">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                Maintaining the highest standards in our content, teaching, and platform.
              </p>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-8 border border-indigo-100">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Building a supportive global network of learners and instructors.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate experts behind Learnnect
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="h-64">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-indigo-600 mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-coral-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-6">
            Join Our Learning Community Today
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Discover courses that will transform your career and connect you with a global community of data science and AI enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/courses" className="px-8 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center">
              Explore Our Courses <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/contact" className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-md font-medium hover:bg-indigo-50 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;