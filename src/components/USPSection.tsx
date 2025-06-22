import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Trophy,
  Users,
  Clock,
  Award,
  Briefcase,
  Target,
  BookOpen,
  Zap,
  Shield,
  MessageCircle
} from 'lucide-react';

const USPSection: React.FC = () => {
  const handleConsultationClick = () => {
    // Trigger the enquiry widget
    const event = new CustomEvent('openEnquiryWidget');
    window.dispatchEvent(event);
  };
  const uspItems = [
    {
      icon: <Target className="h-8 w-8 animate-pulse" />,
      title: "🎯 Career-First Approach",
      description: "3-phase learning system: Foundation → Advanced → Interview Prep, designed for guaranteed employability",
      color: "from-cyan-400 to-blue-500",
      bgColor: "from-cyan-500/10 to-blue-500/10",
      borderColor: "border-cyan-400/30"
    },
    {
      icon: <BookOpen className="h-8 w-8 animate-bounce" />,
      title: "🚀 Project-Driven Learning",
      description: "Build real-world projects and case studies that showcase your skills to potential employers",
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-400/30"
    },
    {
      icon: <Award className="h-8 w-8 animate-pulse" />,
      title: "🏆 Industry Certifications",
      description: "Dual certifications from Learnnect + AICTE, with upcoming NSDC and Six Sigma partnerships",
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
      borderColor: "border-yellow-400/30"
    },
    {
      icon: <Users className="h-8 w-8 animate-pulse" />,
      title: "💼 Complete Career Support",
      description: "Profile optimization, resume building, mock interviews, and lifetime job placement assistance",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-400/30"
    },
    {
      icon: <Clock className="h-8 w-8 animate-spin" style={{animationDuration: '3s'}} />,
      title: "⏰ Lifetime Learning Access",
      description: "Unlimited course access with 12-month LMS, continuous updates, and new content additions",
      color: "from-indigo-400 to-purple-500",
      bgColor: "from-indigo-500/10 to-purple-500/10",
      borderColor: "border-indigo-400/30"
    },
    {
      icon: <Zap className="h-8 w-8 animate-pulse" />,
      title: "💰 Unbeatable Value",
      description: "Early adopter pricing with maximum ROI - comprehensive skill development at fraction of market cost",
      color: "from-pink-400 to-red-500",
      bgColor: "from-pink-500/10 to-red-500/10",
      borderColor: "border-pink-400/30"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan/30 mb-6">
            <Zap className="h-8 w-8 text-neon-cyan animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta animate-pulse-glow">
              Learnnect
            </span>{' '}
            Stands Out?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the future of tech education with our innovative, industry-aligned learning ecosystem designed for career transformation
          </p>
        </motion.div>

        {/* USP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {uspItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className={`bg-gradient-to-br ${item.bgColor} backdrop-blur-sm border ${item.borderColor} rounded-xl p-6 h-full hover:border-opacity-80 transition-all duration-500 group-hover:transform group-hover:scale-105 group-hover:shadow-2xl relative overflow-hidden`}>
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} mb-6 group-hover:shadow-lg transition-all duration-500 relative z-10`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 transition-all duration-500 relative z-10">
                  {item.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-500 relative z-10">
                  {item.description}
                </p>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12 lg:mt-16"
        >
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-neon-cyan/30 rounded-2xl p-8 max-w-4xl mx-auto relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-neon-magenta/5 to-neon-blue/5 animate-pulse"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
                <Trophy className="h-6 w-6 text-white animate-bounce" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
                Ready to Launch Your Tech Career?
              </h3>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Join our growing community of successful learners and transform your career with industry-relevant skills
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/courses"
                  className="group relative px-8 py-4 bg-gradient-to-r from-neon-cyan via-blue-500 to-neon-blue hover:from-cyan-400 hover:via-blue-400 hover:to-blue-300 text-white font-bold rounded-xl transition-all duration-500 shadow-lg hover:shadow-neon-cyan/60 hover:scale-105 transform overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <span>🚀</span>
                    <span>Explore Courses</span>
                  </div>
                </Link>
                <button
                  onClick={handleConsultationClick}
                  className="group relative px-8 py-4 border-2 border-neon-magenta/60 bg-neon-magenta/10 text-neon-magenta hover:bg-neon-magenta/20 hover:border-neon-magenta hover:text-white font-bold rounded-xl transition-all duration-500 hover:scale-105 transform overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta/0 via-neon-magenta/30 to-neon-magenta/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Book Free Consultation</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default USPSection;
