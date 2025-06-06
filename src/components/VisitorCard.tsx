import React, { useState } from 'react';
import { Phone, Mail, Globe, Users, Zap, BookOpen, ArrowRight } from 'lucide-react';

interface ContactPerson {
  name: string;
  phone: string;
}

const VisitorCard: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const contacts: ContactPerson[] = [
    { name: 'Aditya Mishra', phone: '+91 7007788926' },
    { name: 'Abdussamad', phone: '+91 9319369737' },
    { name: 'Tabish Jamal', phone: '+91 7763027544' }
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black p-8">
      <div className="relative w-96 h-64 perspective-1000">
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div 
              className="w-full h-full bg-gradient-to-br from-gray-900/95 to-neon-black/95 rounded-2xl border border-neon-cyan/50 backdrop-blur-sm relative overflow-hidden"
              style={{
                boxShadow: '0 0 30px rgba(0,255,255,0.3), inset 0 0 30px rgba(255,0,255,0.1)'
              }}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-magenta/20 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-neon-cyan/30 to-transparent rounded-full blur-xl"></div>
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-neon-blue/40 to-transparent rounded-full blur-lg"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                {/* Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Zap className="h-8 w-8 text-neon-cyan mr-2" style={{filter: 'drop-shadow(0 0 10px rgba(0,255,255,0.8))'}} />
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta">
                      Learnnect
                    </h1>
                  </div>
                  <p className="text-sm text-cyan-200/80 font-medium tracking-wide">
                    Learn, Connect, Succeed!!
                  </p>
                </div>

                {/* Main Content */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-neon-cyan">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-lg font-semibold">Visitor Pass</span>
                  </div>
                  <div className="text-cyan-100/90 text-sm">
                    AI-Powered Learning Platform
                  </div>
                  <div className="flex items-center justify-center text-xs text-cyan-300/70">
                    <Globe className="h-4 w-4 mr-1" />
                    <span>www.learnnect.com</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                  <div className="flex items-center justify-center text-xs text-cyan-400/60 mb-2">
                    <ArrowRight className="h-3 w-3 mr-1 animate-pulse" />
                    <span>Flip for contacts</span>
                  </div>
                  <div className="text-xs text-cyan-300/50">
                    Level Up Your Future 🚀
                  </div>
                </div>
              </div>

              {/* Glowing Border Animation */}
              <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-blue opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div 
              className="w-full h-full bg-gradient-to-br from-gray-900/95 to-neon-black/95 rounded-2xl border border-neon-magenta/50 backdrop-blur-sm relative overflow-hidden"
              style={{
                boxShadow: '0 0 30px rgba(255,0,255,0.3), inset 0 0 30px rgba(0,255,255,0.1)'
              }}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-neon-cyan/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-neon-magenta/30 to-transparent rounded-full blur-xl"></div>
                <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-neon-blue/40 to-transparent rounded-full blur-lg"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-neon-magenta mr-2" style={{filter: 'drop-shadow(0 0 10px rgba(255,0,255,0.8))'}} />
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan">
                      Contact Team
                    </h2>
                  </div>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-neon-magenta to-neon-cyan mx-auto"></div>
                </div>

                {/* Contacts */}
                <div className="flex-1 space-y-4">
                  {contacts.map((contact, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-3 border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300"
                      style={{boxShadow: '0 0 10px rgba(0,255,255,0.1)'}}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-neon-cyan" style={{textShadow: '0 0 5px rgba(0,255,255,0.5)'}}>
                            {contact.name}
                          </h3>
                          <div className="flex items-center mt-1">
                            <Phone className="h-3 w-3 text-cyan-400 mr-1" />
                            <span className="text-xs text-cyan-200/80">{contact.phone}</span>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-neon-magenta/20 to-neon-cyan/20 rounded-full flex items-center justify-center">
                          <Phone className="h-4 w-4 text-neon-cyan" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="text-center mt-4">
                  <div className="flex items-center justify-center text-xs text-cyan-400/60 mb-2">
                    <Mail className="h-3 w-3 mr-1" />
                    <span>info@learnnect.com</span>
                  </div>
                  <div className="text-xs text-cyan-300/50">
                    Building Tomorrow's Tech Leaders
                  </div>
                </div>
              </div>

              {/* Glowing Border Animation */}
              <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-neon-magenta via-neon-cyan to-neon-blue opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorCard;
