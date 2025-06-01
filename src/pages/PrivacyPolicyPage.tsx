import React from 'react';
import { Shield, Eye, Lock, Database, Mail, Phone } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: [
        'Personal information you provide when creating an account (name, email, phone number)',
        'Learning progress and course completion data',
        'Payment information for premium courses (processed securely through third-party providers)',
        'Usage data and analytics to improve our platform',
        'Device information and IP addresses for security purposes'
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        'Provide and maintain our learning platform services',
        'Personalize your learning experience and recommendations',
        'Process payments and manage subscriptions',
        'Send important updates about courses and platform changes',
        'Improve our services through analytics and user feedback',
        'Ensure platform security and prevent fraud'
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: Shield,
      content: [
        'We do not sell your personal information to third parties',
        'Course instructors may see your progress in their courses',
        'Payment processors handle transaction data securely',
        'We may share anonymized data for research and improvement',
        'Legal compliance may require disclosure in certain circumstances'
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: [
        'Industry-standard encryption for data transmission and storage',
        'Regular security audits and vulnerability assessments',
        'Secure authentication and access controls',
        'Data backup and recovery procedures',
        'Employee training on data protection best practices'
      ]
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-neon-black via-gray-900 to-neon-black">
      {/* Enhanced Background effects matching HomePage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30">
                <Shield className="h-12 w-12 text-neon-cyan" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-magenta mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-cyan-100/80 max-w-3xl mx-auto mb-8">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="text-sm text-cyan-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div
              className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm mb-12"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <h2 className="text-2xl font-bold text-neon-cyan mb-4">Introduction</h2>
              <p className="text-cyan-200/80 leading-relaxed">
                At Learnnect, we are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our
                learning management system and related services.
              </p>
            </div>

            {/* Main Sections */}
            <div className="space-y-8">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <div
                    key={section.id}
                    className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 rounded-lg bg-neon-cyan/20">
                        <IconComponent className="h-6 w-6 text-neon-cyan" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {section.content.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-neon-cyan mt-2 flex-shrink-0"></div>
                          <span className="text-cyan-200/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Your Rights */}
            <div
              className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm mt-12"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <h3 className="text-xl font-bold text-neon-cyan mb-6">Your Rights</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Access & Control</h4>
                  <ul className="space-y-2 text-cyan-200/80">
                    <li>• Access your personal data</li>
                    <li>• Update or correct information</li>
                    <li>• Delete your account</li>
                    <li>• Export your data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Privacy Controls</h4>
                  <ul className="space-y-2 text-cyan-200/80">
                    <li>• Opt-out of marketing emails</li>
                    <li>• Control data sharing preferences</li>
                    <li>• Manage cookie settings</li>
                    <li>• Request data portability</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div
              className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm mt-12"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <h3 className="text-xl font-bold text-neon-cyan mb-6">Contact Us</h3>
              <p className="text-cyan-200/80 mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-neon-cyan" />
                  <span className="text-cyan-200">privacy@learnnect.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-neon-cyan" />
                  <span className="text-cyan-200">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
