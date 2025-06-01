import React from 'react';
import { FileText, Users, CreditCard, AlertTriangle, Scale, Mail, Phone } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: FileText,
      content: [
        'By accessing and using Learnnect, you accept and agree to be bound by these Terms of Service',
        'If you do not agree to these terms, please do not use our platform',
        'We may update these terms from time to time, and continued use constitutes acceptance',
        'You must be at least 13 years old to use our services'
      ]
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: Users,
      content: [
        'You are responsible for maintaining the confidentiality of your account credentials',
        'You must provide accurate and complete information when creating an account',
        'You are responsible for all activities that occur under your account',
        'Notify us immediately of any unauthorized use of your account',
        'We reserve the right to suspend or terminate accounts that violate our terms'
      ]
    },
    {
      id: 'payment-terms',
      title: 'Payment and Billing',
      icon: CreditCard,
      content: [
        'Premium courses and subscriptions require payment as specified',
        'All payments are processed securely through third-party payment providers',
        'Subscription fees are billed in advance on a recurring basis',
        'Refunds are available within 30 days of purchase for most courses',
        'We reserve the right to change pricing with advance notice'
      ]
    },
    {
      id: 'prohibited-conduct',
      title: 'Prohibited Conduct',
      icon: AlertTriangle,
      content: [
        'Do not share copyrighted content without proper authorization',
        'Harassment, abuse, or discrimination of any kind is not tolerated',
        'Do not attempt to hack, disrupt, or compromise platform security',
        'Spam, phishing, or other malicious activities are prohibited',
        'Do not create multiple accounts to circumvent restrictions'
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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-neon-blue/20 to-neon-magenta/20 border border-neon-blue/30">
                <Scale className="h-12 w-12 text-neon-blue" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-magenta to-neon-pink mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-cyan-100/80 max-w-3xl mx-auto mb-8">
              Please read these terms carefully before using our learning platform and services.
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
              <h2 className="text-2xl font-bold text-neon-blue mb-4">Welcome to Learnnect</h2>
              <p className="text-cyan-200/80 leading-relaxed">
                These Terms of Service ("Terms") govern your use of the Learnnect learning management system and related services.
                By using our platform, you agree to comply with these terms and our Privacy Policy. Please read them carefully.
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
                      <div className="p-2 rounded-lg bg-neon-blue/20">
                        <IconComponent className="h-6 w-6 text-neon-blue" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {section.content.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-neon-blue mt-2 flex-shrink-0"></div>
                          <span className="text-cyan-200/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Intellectual Property */}
            <div
              className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm mt-12"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <h3 className="text-xl font-bold text-neon-blue mb-6">Intellectual Property</h3>
              <div className="space-y-4 text-cyan-200/80">
                <p>
                  All content on Learnnect, including courses, videos, text, graphics, logos, and software,
                  is owned by Learnnect or our content partners and is protected by copyright and other intellectual property laws.
                </p>
                <p>
                  You may access and use the content for personal, non-commercial educational purposes only.
                  You may not reproduce, distribute, modify, or create derivative works without explicit permission.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div
              className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm mt-8"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <h3 className="text-xl font-bold text-neon-blue mb-6">Limitation of Liability</h3>
              <div className="space-y-4 text-cyan-200/80">
                <p>
                  Learnnect provides the platform "as is" without warranties of any kind. We do not guarantee
                  that the service will be uninterrupted, error-free, or completely secure.
                </p>
                <p>
                  To the maximum extent permitted by law, Learnnect shall not be liable for any indirect,
                  incidental, special, or consequential damages arising from your use of the platform.
                </p>
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
              <h3 className="text-xl font-bold text-neon-blue mb-6">Contact Us</h3>
              <p className="text-cyan-200/80 mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-neon-blue" />
                  <span className="text-cyan-200">legal@learnnect.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-neon-blue" />
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

export default TermsOfServicePage;
