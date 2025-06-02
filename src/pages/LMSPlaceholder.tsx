import React from 'react';

const LMSPlaceholder: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-20">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              LMS Integration Coming Soon
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              We're working on integrating a powerful Learning Management System to enhance your learning experience. 
              Stay tuned for advanced course management, progress tracking, and interactive learning tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 mx-auto mb-4 bg-neon-cyan/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Course Management</h3>
              <p className="text-gray-400 text-sm">Advanced course creation, organization, and delivery tools</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 mx-auto mb-4 bg-neon-purple/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Progress Analytics</h3>
              <p className="text-gray-400 text-sm">Detailed insights into learning progress and performance</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 mx-auto mb-4 bg-neon-green/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Collaborative Learning</h3>
              <p className="text-gray-400 text-sm">Interactive discussions, group projects, and peer learning</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">Meanwhile, explore our current features</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/dashboard" 
                className="bg-gradient-to-r from-neon-cyan to-neon-blue text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
              >
                Go to Dashboard
              </a>
              <a 
                href="/courses" 
                className="bg-gradient-to-r from-neon-purple to-neon-pink text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300"
              >
                Browse Courses
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMSPlaceholder;
