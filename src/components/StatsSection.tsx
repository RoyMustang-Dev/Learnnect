import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      number: "23+",
      label: "Specialized Courses",
      description: "From beginner to expert level across tech domains",
      color: "neon-cyan"
    },
    {
      icon: <Award className="h-8 w-8" />,
      number: "3",
      label: "Learning Phases",
      description: "Foundation → Advanced → Interview Prep",
      color: "neon-magenta"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      number: "100%",
      label: "Industry-Relevant",
      description: "Curriculum designed for real-world employability",
      color: "neon-blue"
    },
    {
      icon: <Users className="h-8 w-8" />,
      number: "12+",
      label: "Months LMS Access",
      description: "Plus lifetime course access and updates",
      color: "neon-green"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-pink-900/10"></div>
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-neon-cyan/5 rounded-full blur-3xl transform -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-neon-magenta/5 rounded-full blur-3xl transform -translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Learning{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta">
              Excellence
            </span>{' '}
            by Numbers
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive tech education designed for career transformation with measurable outcomes
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-neon-cyan/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-${stat.color}/20 to-${stat.color}/10 border border-${stat.color}/30 mb-4 group-hover:shadow-lg group-hover:shadow-${stat.color}/25 transition-all duration-300`}>
                  <div className={`text-${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>

                {/* Number */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className={`text-4xl sm:text-5xl font-bold text-${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                  style={{ textShadow: `0 0 20px rgba(0,255,255,0.3)` }}
                >
                  {stat.number}
                </motion.div>

                {/* Label */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {stat.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-cyan/5 to-neon-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 lg:mt-16"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-neon-cyan/30 rounded-xl p-8 max-w-4xl mx-auto relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-neon-magenta/5 to-neon-blue/5 animate-pulse"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
                🚀 Pioneering the Future of Tech Education
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                We're building India's most comprehensive platform for{' '}
                <span className="text-neon-cyan font-semibold">Data Science</span>,{' '}
                <span className="text-neon-magenta font-semibold">AI & Machine Learning</span>, and{' '}
                <span className="text-neon-blue font-semibold">Generative AI</span> education.
              </p>
              <p className="text-gray-400 text-base">
                Join our mission to democratize quality tech education and create the next generation of industry-ready professionals.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
