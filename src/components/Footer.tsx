import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-50 bg-[#0F0F1A] text-white" style={{borderTop: '1px solid rgba(0,255,255,0.2)', boxShadow: '0 0 30px rgba(0,255,255,0.2)'}}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo size="lg" variant="glow" animated={true} />
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-cyan-200 leading-relaxed">
              Empowering the next generation of data scientists and AI specialists through
              accessible, high-quality education.
            </p>
            <div className="mt-4 sm:mt-6 flex space-x-3 sm:space-x-4">
              <a href="#" className="text-cyan-300 hover:text-neon-cyan transition-colors p-2 rounded-lg hover:bg-white/10" style={{filter: 'drop-shadow(0 0 2px rgba(0,255,255,0.5))'}}>
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-cyan-300 hover:text-neon-cyan transition-colors p-2 rounded-lg hover:bg-white/10" style={{filter: 'drop-shadow(0 0 2px rgba(0,255,255,0.5))'}}>
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-cyan-300 hover:text-neon-cyan transition-colors p-2 rounded-lg hover:bg-white/10" style={{filter: 'drop-shadow(0 0 2px rgba(0,255,255,0.5))'}}>
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-magenta-300 hover:text-neon-magenta transition-colors p-2 rounded-lg hover:bg-white/10" style={{filter: 'drop-shadow(0 0 2px rgba(255,0,255,0.5))'}}>
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neon-cyan">Courses</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link to="/courses?category=data-science" className="text-sm sm:text-base text-cyan-200 hover:text-[#00FFFF] transition-colors block py-1">
                  Data Science
                </Link>
              </li>
              <li>
                <Link to="/courses?category=ai-ml" className="text-sm sm:text-base text-cyan-200 hover:text-[#00FFFF] transition-colors block py-1">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/courses?category=generative-ai" className="text-sm sm:text-base text-cyan-200 hover:text-[#00FFFF] transition-colors block py-1">
                  Generative AI
                </Link>
              </li>
              <li>
                <Link to="/courses?category=python-data-science" className="text-sm sm:text-base text-cyan-200 hover:text-[#00FFFF] transition-colors block py-1">
                  Python with Data Science
                </Link>
              </li>
              <li>
                <Link to="/courses?category=data-science-gen-ai" className="text-sm sm:text-base text-cyan-200 hover:text-[#00FFFF] transition-colors block py-1">
                  Data Science with Gen AI
                </Link>
              </li>
              <li>
                <Link to="/courses?category=ml-gen-ai" className="text-sm sm:text-base text-cyan-200 hover:text-[#00FFFF] transition-colors block py-1">
                  Complete ML with Gen AI
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-sm sm:text-base text-cyan-200 hover:text-[#00FFFF] transition-colors block py-1">
                  All Courses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neon-cyan">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link to="/about" className="text-sm sm:text-base text-cyan-200 hover:text-[#00FFFF] transition-colors block py-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm sm:text-base text-cyan-200 hover:text-[#00FFFF] transition-colors block py-1">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm sm:text-base text-cyan-200 hover:text-[#00FFFF] transition-colors block py-1">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm sm:text-base text-cyan-200 hover:text-[#00FFFF] transition-colors block py-1">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neon-cyan">Contact Us</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0 text-[#00FFFF] mt-0.5" style={{filter: 'drop-shadow(0 0 2px rgba(0,255,255,0.5))'}} />
                <span className="text-sm sm:text-base text-cyan-200">support@learnnect.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0 text-[#00FFFF] mt-0.5" style={{filter: 'drop-shadow(0 0 2px rgba(0,255,255,0.5))'}} />
                <span className="text-sm sm:text-base text-cyan-200">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0 text-[#FF00FF] mt-0.5" style={{filter: 'drop-shadow(0 0 2px rgba(255,0,255,0.5))'}} />
                <span className="text-sm sm:text-base text-cyan-200">
                  123 Education Lane, <br />
                  Tech City, TC 98765
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-cyan-800/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm sm:text-base text-cyan-300 text-center sm:text-left">
            &copy; {currentYear} Learnnect. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
            <Link to="/privacy" className="text-sm sm:text-base text-cyan-300 hover:text-neon-cyan transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm sm:text-base text-cyan-300 hover:text-neon-cyan transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-sm sm:text-base text-magenta-300 hover:text-neon-magenta transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;