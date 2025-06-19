import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-50 bg-[#0F0F1A] text-white" style={{borderTop: '1px solid rgba(0,255,255,0.2)', boxShadow: '0 0 30px rgba(0,255,255,0.2)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <Logo size="lg" variant="glow" animated={true} />
            </div>
            <p className="mb-6 text-sm sm:text-base text-cyan-200 leading-relaxed">
              Empowering the next generation of data scientists and AI specialists through
              accessible, high-quality education.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-cyan-300 hover:text-neon-cyan transition-all duration-300 p-3 rounded-lg hover:bg-white/10 transform hover:scale-110" style={{filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.5))'}}>
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-cyan-300 hover:text-neon-cyan transition-all duration-300 p-3 rounded-lg hover:bg-white/10 transform hover:scale-110" style={{filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.5))'}}>
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-cyan-300 hover:text-neon-cyan transition-all duration-300 p-3 rounded-lg hover:bg-white/10 transform hover:scale-110" style={{filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.5))'}}>
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-magenta-300 hover:text-neon-magenta transition-all duration-300 p-3 rounded-lg hover:bg-white/10 transform hover:scale-110" style={{filter: 'drop-shadow(0 0 4px rgba(255,0,255,0.5))'}}>
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-neon-cyan" style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>Courses</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/courses?category=data-science" className="text-base text-cyan-200 hover:text-neon-cyan transition-all duration-300 block py-1 hover:translate-x-1">
                  Data Science
                </Link>
              </li>
              <li>
                <Link to="/courses?category=ai-ml" className="text-base text-cyan-200 hover:text-neon-cyan transition-all duration-300 block py-1 hover:translate-x-1">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/courses?category=generative-ai" className="text-base text-cyan-200 hover:text-neon-cyan transition-all duration-300 block py-1 hover:translate-x-1">
                  Generative AI
                </Link>
              </li>
              <li>
                <Link to="/courses?category=python-data-science" className="text-base text-cyan-200 hover:text-neon-cyan transition-all duration-300 block py-1 hover:translate-x-1">
                  Python with Data Science
                </Link>
              </li>
              <li>
                <Link to="/courses?category=data-science-gen-ai" className="text-base text-cyan-200 hover:text-neon-cyan transition-all duration-300 block py-1 hover:translate-x-1">
                  Data Science with Gen AI
                </Link>
              </li>
              <li>
                <Link to="/courses?category=ml-gen-ai" className="text-base text-cyan-200 hover:text-neon-cyan transition-all duration-300 block py-1 hover:translate-x-1">
                  Complete ML with Gen AI
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-base text-cyan-200 hover:text-neon-cyan transition-all duration-300 block py-1 hover:translate-x-1">
                  All Courses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-neon-cyan" style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-base text-cyan-200 hover:text-neon-cyan transition-all duration-300 block py-1 hover:translate-x-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-cyan-200 hover:text-neon-cyan transition-all duration-300 block py-1 hover:translate-x-1">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-base text-cyan-200 hover:text-neon-cyan transition-all duration-300 block py-1 hover:translate-x-1">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-base text-cyan-200 hover:text-neon-cyan transition-all duration-300 block py-1 hover:translate-x-1">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold mb-6 text-neon-cyan" style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-neon-cyan mt-1 group-hover:scale-110 transition-transform duration-300" style={{filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.5))'}} />
                <span className="text-base text-cyan-200 group-hover:text-neon-cyan transition-colors duration-300">support@learnnect.com</span>
              </li>
              <li className="flex items-start group">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-neon-cyan mt-1 group-hover:scale-110 transition-transform duration-300" style={{filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.5))'}} />
                <span className="text-base text-cyan-200 group-hover:text-neon-cyan transition-colors duration-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 mr-3 flex-shrink-0 text-neon-magenta mt-1 group-hover:scale-110 transition-transform duration-300" style={{filter: 'drop-shadow(0 0 4px rgba(255,0,255,0.5))'}} />
                <span className="text-base text-cyan-200 group-hover:text-neon-magenta transition-colors duration-300">
                  123 Education Lane, <br />
                  Tech City, TC 98765
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cyan-800/30 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-base text-cyan-300 text-center sm:text-left font-medium">
            &copy; {currentYear} Learnnect. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-6">
            <Link to="/privacy" className="text-base text-cyan-300 hover:text-neon-cyan transition-all duration-300 hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-base text-cyan-300 hover:text-neon-cyan transition-all duration-300 hover:underline">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-base text-magenta-300 hover:text-neon-magenta transition-all duration-300 hover:underline">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;