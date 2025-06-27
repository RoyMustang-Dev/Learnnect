import React from 'react';
import { Users, BookOpen, Award, Globe, ChevronRight, Zap, Target, Rocket, Star, Brain, Code, Database, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEO/SEOHead';

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
    <>
      <SEOHead
        title="About Learnnect | Leading EdTech Platform for AI, ML & Data Science"
        description="Learn about Learnnect's mission to transform careers through industry-ready AI, ML, and Data Science education. Meet our expert team and discover our proven track record of success."
        keywords="about learnnect, edtech platform, AI education, ML courses, data science training, online learning platform, career transformation, tech education"
        url="https://learnnect.com/about"
        type="website"
        image="https://learnnect.com/assets/about-learnnect.png"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-magenta/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 rounded-full border border-neon-cyan/30 mb-8">
              <Zap className="h-5 w-5 text-neon-cyan mr-2" />
              <span className="text-neon-cyan font-medium">Launching the Future of Learning</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-magenta bg-clip-text text-transparent">
              Learn, Connect, Succeed!!
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-300 leading-relaxed">
              The next-generation EdTech platform designed to transform beginners into
              <span className="text-neon-cyan font-semibold"> industry-ready professionals</span> through
              cutting-edge courses in Data Science, AI, and Machine Learning.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/courses"
                className="group px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-bold rounded-xl hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
                <ChevronRight className="inline ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-neon-magenta text-neon-magenta font-bold rounded-xl hover:bg-neon-magenta/10 transition-all duration-300"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Vision section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon-magenta/20 to-neon-purple/20 rounded-full border border-neon-magenta/30 mb-6">
                <Target className="h-5 w-5 text-neon-magenta mr-2" />
                <span className="text-neon-magenta font-medium">Our Vision</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-8 leading-tight">
                Revolutionizing Tech Education for the
                <span className="text-neon-cyan"> AI-Driven Future</span>
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Learnnect is born from a vision to democratize cutting-edge technology education. We're building the platform that doesn't just teach—it transforms careers and lives.
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                In a world where AI and Data Science skills are becoming essential, we're creating the bridge between curiosity and expertise, between learning and earning.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full mr-4"></div>
                  <span className="text-gray-300">Industry-aligned curriculum designed by experts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-neon-magenta rounded-full mr-4"></div>
                  <span className="text-gray-300">Hands-on projects with real-world applications</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-neon-blue rounded-full mr-4"></div>
                  <span className="text-gray-300">Personalized learning paths for every skill level</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20"></div>
                <img
                  src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Future of learning"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-2xl opacity-20 blur-xl"></div>
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Why Choose Us section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 rounded-full border border-neon-blue/30 mb-6">
              <Rocket className="h-5 w-5 text-neon-blue mr-2" />
              <span className="text-neon-blue font-medium">Why Choose Learnnect</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Your Gateway to the
              <span className="text-neon-magenta"> Future of Tech</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join the next generation of tech professionals with our cutting-edge platform designed for success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-neon-cyan/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-blue rounded-xl flex items-center justify-center mb-6">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI-Powered Learning</h3>
                <p className="text-gray-300 leading-relaxed">
                  Personalized learning paths that adapt to your pace and style, powered by cutting-edge AI technology.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-neon-magenta/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-magenta/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-magenta to-neon-purple rounded-xl flex items-center justify-center mb-6">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Hands-On Projects</h3>
                <p className="text-gray-300 leading-relaxed">
                  Build real-world projects that showcase your skills to employers and add value to your portfolio.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-neon-blue/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-xl flex items-center justify-center mb-6">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Industry-Ready Skills</h3>
                <p className="text-gray-300 leading-relaxed">
                  Learn the exact tools and technologies used by top companies in Data Science and AI.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-neon-purple/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-magenta rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Career Growth</h3>
                <p className="text-gray-300 leading-relaxed">
                  From beginner to expert with clear progression paths and career guidance from industry professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Values section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon-purple/20 to-neon-magenta/20 rounded-full border border-neon-purple/30 mb-6">
              <Star className="h-5 w-5 text-neon-purple mr-2" />
              <span className="text-neon-purple font-medium">Our Core Values</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Built on
              <span className="text-neon-cyan"> Innovation</span> and
              <span className="text-neon-magenta"> Excellence</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that drive us to create the best learning experience for our students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30 flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-neon-cyan" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Accessibility</h3>
                <p className="text-gray-300 leading-relaxed">
                  Breaking down barriers to quality tech education, making it available to learners worldwide regardless of background.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-neon-magenta/20 hover:border-neon-magenta/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-magenta/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-neon-magenta/20 to-neon-purple/20 border border-neon-magenta/30 flex items-center justify-center mb-6">
                  <BookOpen className="h-8 w-8 text-neon-magenta" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Practical Learning</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every course is designed with real-world applications in mind, ensuring you gain skills that matter in today's job market.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-neon-blue/20 hover:border-neon-blue/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 border border-neon-blue/30 flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-neon-blue" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Excellence</h3>
                <p className="text-gray-300 leading-relaxed">
                  We maintain the highest standards in content quality, platform performance, and student support to ensure your success.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-neon-purple/20 hover:border-neon-purple/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-magenta/20 border border-neon-purple/30 flex items-center justify-center mb-6">
                  <Globe className="h-8 w-8 text-neon-purple" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Community</h3>
                <p className="text-gray-300 leading-relaxed">
                  Building a vibrant global community where learners connect, collaborate, and grow together in their tech journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 rounded-full border border-neon-cyan/30 mb-6">
              <Users className="h-5 w-5 text-neon-cyan mr-2" />
              <span className="text-neon-cyan font-medium">Our Expert Team</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Meet the
              <span className="text-neon-magenta"> Visionaries</span> Behind Learnnect
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Industry experts and passionate educators dedicated to transforming tech education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-neon-cyan/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                  </div>
                  <div className="relative p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-neon-cyan mb-3 font-medium">{member.role}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-magenta/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-magenta/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 rounded-full border border-neon-magenta/30 mb-8">
            <Rocket className="h-5 w-5 text-neon-magenta mr-2" />
            <span className="text-neon-magenta font-medium">Ready to Transform Your Career?</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Start Your
            <span className="text-neon-cyan"> Tech Journey</span> Today
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners who are already building their future in Data Science, AI, and Machine Learning.
            Your transformation starts with a single click.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/courses"
              className="group px-10 py-4 bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-bold rounded-xl hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              Explore Our Courses
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 border-2 border-neon-magenta text-neon-magenta font-bold rounded-xl hover:bg-neon-magenta/10 transition-all duration-300 flex items-center justify-center"
            >
              Get in Touch
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-3xl font-bold text-neon-cyan mb-2 group-hover:scale-110 transition-transform">Free</div>
              <p className="text-gray-400">Trial Courses Available</p>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-neon-magenta mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <p className="text-gray-400">Learning Support</p>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-neon-blue mb-2 group-hover:scale-110 transition-transform">∞</div>
              <p className="text-gray-400">Lifetime Access</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default AboutPage;