import React from 'react';
import { Cookie, Settings, BarChart, Shield, Target, Mail, Phone } from 'lucide-react';

const CookiePolicyPage: React.FC = () => {
  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      icon: Shield,
      description: 'Required for basic website functionality',
      examples: [
        'Authentication and login status',
        'Shopping cart contents',
        'Security and fraud prevention',
        'Website preferences and settings'
      ],
      canDisable: false
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      icon: BarChart,
      description: 'Help us understand how visitors use our website',
      examples: [
        'Page views and user interactions',
        'Popular content and features',
        'User journey and navigation patterns',
        'Performance and error tracking'
      ],
      canDisable: true
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      icon: Settings,
      description: 'Enable enhanced functionality and personalization',
      examples: [
        'Language and region preferences',
        'Customized user interface',
        'Video player settings',
        'Social media integration'
      ],
      canDisable: true
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      icon: Target,
      description: 'Used to deliver relevant advertisements',
      examples: [
        'Targeted advertising',
        'Social media tracking',
        'Cross-site behavioral tracking',
        'Marketing campaign effectiveness'
      ],
      canDisable: true
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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-neon-magenta/20 to-neon-pink/20 border border-neon-magenta/30">
                <Cookie className="h-12 w-12 text-neon-magenta" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta via-neon-pink to-neon-cyan mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-cyan-100/80 max-w-3xl mx-auto mb-8">
              Learn about how we use cookies and similar technologies to enhance your learning experience.
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
              <h2 className="text-2xl font-bold text-neon-magenta mb-4">What Are Cookies?</h2>
              <p className="text-cyan-200/80 leading-relaxed mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us
                provide you with a better experience by remembering your preferences, keeping you logged in, and
                understanding how you use our platform.
              </p>
              <p className="text-cyan-200/80 leading-relaxed">
                We use both session cookies (which expire when you close your browser) and persistent cookies
                (which remain on your device for a set period or until you delete them).
              </p>
            </div>

            {/* Cookie Types */}
            <div className="space-y-8">
              {cookieTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <div
                    key={type.id}
                    className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-neon-magenta/20">
                          <IconComponent className="h-6 w-6 text-neon-magenta" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{type.title}</h3>
                          <p className="text-cyan-400 text-sm">{type.description}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        type.canDisable
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {type.canDisable ? 'Optional' : 'Required'}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-cyan-200 mb-3">Examples:</h4>
                      <ul className="space-y-2">
                        {type.examples.map((example, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full bg-neon-magenta mt-2 flex-shrink-0"></div>
                            <span className="text-cyan-200/80">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Third-Party Cookies */}
            <div
              className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm mt-12"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <h3 className="text-xl font-bold text-neon-magenta mb-6">Third-Party Cookies</h3>
              <p className="text-cyan-200/80 mb-4">
                We may also use third-party services that set their own cookies. These include:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Analytics Services</h4>
                  <ul className="space-y-2 text-cyan-200/80">
                    <li>• Google Analytics</li>
                    <li>• Hotjar (user behavior)</li>
                    <li>• Mixpanel (event tracking)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">External Services</h4>
                  <ul className="space-y-2 text-cyan-200/80">
                    <li>• YouTube (video embedding)</li>
                    <li>• Social media platforms</li>
                    <li>• Payment processors</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Managing Cookies */}
            <div
              className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm mt-8"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <h3 className="text-xl font-bold text-neon-magenta mb-6">Managing Your Cookie Preferences</h3>
              <div className="space-y-4 text-cyan-200/80">
                <p>
                  You can control and manage cookies in several ways:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Use our cookie preference center (available in the footer)</li>
                  <li>• Adjust your browser settings to block or delete cookies</li>
                  <li>• Use browser extensions for enhanced privacy control</li>
                  <li>• Opt out of third-party tracking through industry tools</li>
                </ul>
                <p className="mt-4">
                  <strong>Note:</strong> Disabling essential cookies may affect website functionality and your user experience.
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
              <h3 className="text-xl font-bold text-neon-magenta mb-6">Questions About Cookies?</h3>
              <p className="text-cyan-200/80 mb-6">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-neon-magenta" />
                  <span className="text-cyan-200">privacy@learnnect.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-neon-magenta" />
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

export default CookiePolicyPage;
