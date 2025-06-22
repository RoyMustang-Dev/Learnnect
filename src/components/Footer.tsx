import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Gem, Target, Rocket, BookOpen, ExternalLink, ArrowUpRight, Send, CheckCircle, AlertCircle, TrendingUp, MessageCircle, AtSign, Newspaper } from 'lucide-react';
import { paidCourses, freeCourses } from '../data/coursesData';
import { useState, useEffect } from 'react';
import { validateEmail, getEmailValidationError } from '../utils/validation';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailTouched, setIsEmailTouched] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (isEmailTouched) {
      const error = getEmailValidationError(value);
      setEmailError(error);
    }
  };

  const handleEmailBlur = () => {
    setIsEmailTouched(true);
    const error = getEmailValidationError(email);
    setEmailError(error);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email before submission
    const error = getEmailValidationError(email);
    if (error) {
      setEmailError(error);
      setIsEmailTouched(true);
      return;
    }

    setStatus('loading');
    setEmailError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setMessage('Successfully subscribed to our newsletter!');
      setEmail('');
      setIsEmailTouched(false);

      // Auto-dismiss success message
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 10000);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');

      // Auto-dismiss error message
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  const isEmailValid = email && !emailError && validateEmail(email);
  const showEmailError = isEmailTouched && emailError;

  return (
    <footer className="relative z-50 bg-[#0F0F1A] text-white" style={{borderTop: '1px solid rgba(0,255,255,0.2)', boxShadow: '0 0 30px rgba(0,255,255,0.2)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-12 sm:py-16 md:py-20">
        {/* Row 1: Main Content - 5 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-8 mb-16">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <Logo size="lg" variant="glow" animated={true} />
            </div>
            <p className="mb-6 text-sm sm:text-base text-cyan-200 leading-relaxed">
              Empowering the next generation of data scientists and AI specialists through
              accessible, high-quality education.
            </p>
            <div className="flex space-x-2">
              <a href="#" className="group relative p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-110 hover:rotate-3">
                <Facebook className="h-5 w-5 text-cyan-300 group-hover:text-neon-cyan transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="group relative p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-110 hover:-rotate-3">
                <Twitter className="h-5 w-5 text-blue-300 group-hover:text-blue-400 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="group relative p-3 rounded-xl bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border border-blue-600/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-110 hover:rotate-3">
                <Linkedin className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="group relative p-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-110 hover:-rotate-3">
                <Instagram className="h-5 w-5 text-pink-300 group-hover:text-neon-magenta transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Premium Courses */}
          <div>
            <div className="flex items-center mb-6">
              <Gem className="h-5 w-5 text-purple-400 mr-2" />
              <h3 className="text-lg font-bold text-purple-400" style={{textShadow: '0 0 10px rgba(147,51,234,0.5)'}}>Premium Courses</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="/courses?type=premium" className="group flex items-center text-sm text-purple-200 hover:text-purple-300 transition-all duration-300 py-1 rounded-lg hover:bg-purple-500/10 hover:pl-2">
                  <BookOpen className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">All Premium Courses</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </li>
              <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400/30 scrollbar-track-transparent">
                {paidCourses.map((course) => (
                <li key={course.courseId}>
                  <Link to={`/courses/${course.courseId}`} className="group flex items-start text-sm text-purple-200/80 hover:text-purple-300 transition-all duration-300 py-1 rounded-lg hover:bg-purple-500/5 hover:pl-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mt-2 mr-2 opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 leading-relaxed">{course.courseDisplayName}</span>
                    <ExternalLink className="h-3 w-3 ml-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </li>
                ))}
              </div>
            </ul>
          </div>

          {/* Foundation Courses */}
          <div>
            <div className="flex items-center mb-6">
              <Target className="h-5 w-5 text-yellow-400 mr-2" />
              <h3 className="text-lg font-bold text-yellow-400" style={{textShadow: '0 0 10px rgba(234,179,8,0.5)'}}>Foundation Courses</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="/courses?type=foundation" className="group flex items-center text-sm text-yellow-200 hover:text-yellow-300 transition-all duration-300 py-1 rounded-lg hover:bg-yellow-500/10 hover:pl-2">
                  <BookOpen className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">All Foundation Courses</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </li>
              <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400/30 scrollbar-track-transparent">
                {freeCourses.filter(course => course.type === 'Freemium').map((course) => (
                <li key={course.courseId}>
                  <Link to={`/courses/${course.courseId}`} className="group flex items-start text-sm text-yellow-200/80 hover:text-yellow-300 transition-all duration-300 py-1 rounded-lg hover:bg-yellow-500/5 hover:pl-2">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2 mr-2 opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 leading-relaxed">{course.courseDisplayName}</span>
                    <ExternalLink className="h-3 w-3 ml-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </li>
                ))}
              </div>
            </ul>
          </div>

          {/* Free Courses */}
          <div>
            <div className="flex items-center mb-6">
              <Rocket className="h-5 w-5 text-green-400 mr-2" />
              <h3 className="text-lg font-bold text-green-400" style={{textShadow: '0 0 10px rgba(34,197,94,0.5)'}}>Free Courses</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="/courses?type=free" className="group flex items-center text-sm text-green-200 hover:text-green-300 transition-all duration-300 py-1 rounded-lg hover:bg-green-500/10 hover:pl-2">
                  <BookOpen className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">All Free Courses</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </li>
              <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-green-400/30 scrollbar-track-transparent">
                {freeCourses.filter(course => course.type === 'Free').map((course) => (
                <li key={course.courseId}>
                  <Link to={`/courses/${course.courseId}`} className="group flex items-start text-sm text-green-200/80 hover:text-green-300 transition-all duration-300 py-1 rounded-lg hover:bg-green-500/5 hover:pl-2">
                    <div className="w-1 h-1 bg-green-400 rounded-full mt-2 mr-2 opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 leading-relaxed">{course.courseDisplayName}</span>
                    <ExternalLink className="h-3 w-3 ml-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </li>
                ))}
              </div>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <div className="flex items-center mb-6">
              <BookOpen className="h-5 w-5 text-neon-cyan mr-2" />
              <h3 className="text-lg font-bold text-neon-cyan" style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>Company</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="group flex items-center text-sm text-cyan-200 hover:text-neon-cyan transition-all duration-300 py-2 rounded-lg hover:bg-cyan-500/10 hover:pl-2">
                  <div className="w-1 h-1 bg-neon-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">About Us</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="group flex items-center text-sm text-cyan-200 hover:text-neon-cyan transition-all duration-300 py-2 rounded-lg hover:bg-cyan-500/10 hover:pl-2">
                  <div className="w-1 h-1 bg-neon-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Contact</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </li>
              <li>
                <Link to="/careers" className="group flex items-center text-sm text-cyan-200 hover:text-neon-cyan transition-all duration-300 py-2 rounded-lg hover:bg-cyan-500/10 hover:pl-2">
                  <div className="w-1 h-1 bg-neon-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Careers</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </li>
              <li>
                <Link to="/blog" className="group flex items-center text-sm text-cyan-200 hover:text-neon-cyan transition-all duration-300 py-2 rounded-lg hover:bg-cyan-500/10 hover:pl-2">
                  <div className="w-1 h-1 bg-neon-cyan rounded-full mr-2 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Blog</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Row 2: Contact & Newsletter - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Contact Information - Enhanced Design */}
          <div className="relative">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-2xl blur-xl"></div>

            <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 shadow-2xl">
              {/* Header with animated icon */}
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-md animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-3 rounded-full border border-cyan-400/30">
                    <MessageCircle className="h-6 w-6 text-neon-cyan" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-neon-cyan" style={{textShadow: '0 0 15px rgba(0,255,255,0.6)'}}>
                    Get In Touch
                  </h3>
                  <p className="text-sm text-cyan-300/70 mt-1">We're here to help you succeed</p>
                </div>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Email Card */}
                <div className="group relative overflow-hidden cursor-pointer">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse"></div>

                  {/* Sliding border effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-[1px] bg-slate-900/90 rounded-xl"></div>
                  </div>

                  <div className="relative flex items-center p-4 rounded-xl border border-cyan-500/20 group-hover:border-transparent transition-all duration-500 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                    <div className="relative">
                      {/* Icon glow effect */}
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
                      <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-3 rounded-lg group-hover:bg-gradient-to-br group-hover:from-cyan-400/30 group-hover:to-blue-400/30 transition-all duration-500">
                        <AtSign className="h-5 w-5 text-neon-cyan group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-cyan-200 group-hover:text-neon-cyan transition-all duration-300 group-hover:tracking-wide">
                          support@learnnect.com
                        </span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:scale-150 group-hover:bg-green-300 transition-all duration-300"></div>
                      </div>
                      <p className="text-sm text-cyan-300/60 group-hover:text-cyan-200/80 mt-1 transition-all duration-300">Available 24/7 • Response within 2 hours</p>
                    </div>
                  </div>
                </div>

                {/* Phone Cards */}
                <div className="group relative overflow-hidden cursor-pointer">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/10 to-green-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse"></div>

                  {/* Sliding border effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-green-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-[1px] bg-slate-900/90 rounded-xl"></div>
                  </div>

                  <div className="relative flex items-center p-4 rounded-xl border border-green-500/20 group-hover:border-transparent transition-all duration-500 group-hover:shadow-lg group-hover:shadow-green-500/20">
                    <div className="relative">
                      {/* Icon glow effect */}
                      <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
                      <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-3 rounded-lg group-hover:bg-gradient-to-br group-hover:from-green-400/30 group-hover:to-emerald-400/30 transition-all duration-500">
                        <Phone className="h-5 w-5 text-green-400 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-green-200 group-hover:text-green-300 transition-all duration-300 group-hover:tracking-wide">
                            +91 7007788926
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-green-200 group-hover:text-green-300 transition-all duration-300 group-hover:tracking-wide">
                            +91 9319369737
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-green-200 group-hover:text-green-300 transition-all duration-300 group-hover:tracking-wide">
                            +91 8709229353
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-green-300/60 group-hover:text-green-200/80 mt-2 transition-all duration-300">Available 7 days a week, 9AM-6PM IST</p>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="group relative overflow-hidden cursor-pointer">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/10 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse"></div>

                  {/* Sliding border effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-[1px] bg-slate-900/90 rounded-xl"></div>
                  </div>

                  <div className="relative flex items-center p-4 rounded-xl border border-purple-500/20 group-hover:border-transparent transition-all duration-500 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                    <div className="relative">
                      {/* Icon glow effect */}
                      <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
                      <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-lg group-hover:bg-gradient-to-br group-hover:from-purple-400/30 group-hover:to-pink-400/30 transition-all duration-500">
                        <MapPin className="h-5 w-5 text-purple-400 group-hover:scale-125 group-hover:bounce transition-all duration-500" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <span className="text-base font-semibold text-purple-200 group-hover:text-purple-300 transition-all duration-300 group-hover:tracking-wide">
                        Wave City, Sector 2<br />
                        Ghaziabad, Pin - 201002
                      </span>
                      <p className="text-sm text-purple-300/60 group-hover:text-purple-200/80 mt-1 transition-all duration-300">Visit our innovation hub • Open campus tours</p>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>

          {/* Newsletter & Trending Section */}
          <div className="space-y-8">
            {/* Row 1: Newsletter Subscription */}
            <div className="relative">
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-2xl blur-xl"></div>

              <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-md animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-3 rounded-full border border-cyan-400/30">
                      <Newspaper className="h-5 w-5 text-neon-cyan" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-neon-cyan" style={{textShadow: '0 0 15px rgba(0,255,255,0.6)'}}>
                      Newsletter Signup
                    </h3>
                    <p className="text-sm text-cyan-300/70 mt-1">Stay updated with latest courses & insights</p>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  {/* Form */}
                  <div className="w-full space-y-3">
                    <form onSubmit={handleNewsletterSubmit} className="flex items-start gap-3 w-full">
                      <div className="flex-1">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          onBlur={handleEmailBlur}
                          placeholder="Enter your email..."
                          className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-cyan-300/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            showEmailError
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                              : isEmailValid
                              ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                              : 'border-cyan-500/30 focus:border-neon-cyan focus:ring-neon-cyan/20'
                          }`}
                          required
                          disabled={status === 'loading'}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={status === 'loading' || !isEmailValid}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
                      >
                        {status === 'loading' ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            Subscribe
                            <Send className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Email Validation Messages */}
                    {showEmailError && (
                      <div className="flex items-center gap-2 text-sm text-red-400">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {emailError}
                      </div>
                    )}
                    {isEmailValid && (
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        Valid email address
                      </div>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="w-full">
                    <div className="text-sm text-cyan-300/70 space-y-1">
                      <p>• Weekly updates • Exclusive discounts • Industry insights • Free resources</p>
                      <p className="text-cyan-400/60 text-xs">No spam, unsubscribe anytime.</p>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {message && (
                    <div className="w-full">
                      <div className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                        status === 'success'
                          ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                          : 'bg-red-500/20 border border-red-500/30 text-red-300'
                      }`}>
                        {status === 'success' ? (
                          <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        )}
                        <span className="text-sm">{message}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: What's Trending Now */}
            <div className="relative">
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-orange-500/10 rounded-2xl blur-xl"></div>

              <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-md animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-full border border-purple-400/30">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-purple-400" style={{textShadow: '0 0 15px rgba(147,51,234,0.6)'}}>
                      What's Trending Now
                    </h3>
                    <p className="text-sm text-purple-300/70 mt-1">Live data from our platform</p>
                  </div>
                </div>

                {/* Trending Content - Placeholder for dynamic data */}
                <div className="text-center text-purple-300/70">
                  <p className="text-sm">Dynamic trending data will be loaded here...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gradient-to-r from-cyan-800/30 via-purple-800/30 to-cyan-800/30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-center sm:text-left">
              <p className="text-base text-cyan-300 font-medium mb-2">
                &copy; {currentYear} Learnnect. All rights reserved.
              </p>
              <p className="text-sm text-cyan-400/60">
                Transforming careers through innovative education
              </p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4">
              <Link to="/privacy" className="group relative px-4 py-2 text-sm text-cyan-300 hover:text-neon-cyan transition-all duration-300 rounded-lg hover:bg-cyan-500/10">
                <span className="relative z-10">Privacy Policy</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link to="/terms" className="group relative px-4 py-2 text-sm text-cyan-300 hover:text-neon-cyan transition-all duration-300 rounded-lg hover:bg-cyan-500/10">
                <span className="relative z-10">Terms of Service</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link to="/cookies" className="group relative px-4 py-2 text-sm text-purple-300 hover:text-neon-magenta transition-all duration-300 rounded-lg hover:bg-purple-500/10">
                <span className="relative z-10">Cookie Policy</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;