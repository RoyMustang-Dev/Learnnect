import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Zap } from 'lucide-react';
import { googleAppsScriptService } from '../services/googleAppsScriptService';
import PhoneInput from '../components/PhoneInput';
import EmailInput from '../components/EmailInput';
import { getEmailValidationError } from '../utils/validation';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (phoneValue: string, isValid: boolean) => {
    setFormData(prev => ({
      ...prev,
      mobile: phoneValue
    }));
    setIsMobileValid(isValid);
  };

  const handleEmailChange = (emailValue: string, isValid: boolean) => {
    setFormData(prev => ({
      ...prev,
      email: emailValue
    }));
    setIsEmailValid(isValid);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate email before submission
      const emailError = getEmailValidationError(formData.email);
      if (emailError) {
        alert(emailError);
        setIsSubmitting(false);
        return;
      }

      console.log('📧 Submitting contact form:', formData);

      // Send to Google Sheets
      const result = await googleAppsScriptService.recordContactForm({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        subject: formData.subject || 'General Inquiry',
        message: formData.message
      });

      if (result.result === 'success') {
        console.log('✅ Contact form submitted successfully');
        setShowSuccess(true);

        // Trigger email notification
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('emailSent', {
            detail: {
              email: formData.email,
              type: 'contact'
            }
          }));
        }, 500);

        // Reset form after delay
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            mobile: '',
            subject: '',
            message: ''
          });
          setShowSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('❌ Error submitting contact form:', error);
      alert('There was an error submitting your message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black">
      {/* Hero section */}
      <div className="relative pt-20 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-magenta/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,0,255,0.1) 0%, transparent 50%)`
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan animate-pulse-glow">
              Contact Us
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-cyan-200/80 leading-relaxed">
              Have questions or feedback? We'd love to hear from you! Get in touch and let's start your learning journey together.
            </p>
          </div>
        </div>
      </div>
      
      {/* Contact info and form section */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact information */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan mb-8">
                Get in Touch
              </h2>

              <div className="space-y-8">
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-all duration-300"
                         style={{boxShadow: '0 0 20px rgba(0,255,255,0.2)'}}>
                      <Mail className="h-7 w-7 text-neon-cyan" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
                    <p className="text-cyan-200/70 mb-3">Our friendly team is here to help.</p>
                    <a href="mailto:support@learnnect.com"
                       className="text-neon-cyan hover:text-neon-magenta transition-colors duration-300 font-medium">
                      support@learnnect.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-full bg-neon-magenta/10 border border-neon-magenta/30 flex items-center justify-center group-hover:bg-neon-magenta/20 transition-all duration-300"
                         style={{boxShadow: '0 0 20px rgba(255,0,255,0.2)'}}>
                      <MapPin className="h-7 w-7 text-neon-magenta" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
                    <p className="text-cyan-200/70 mb-3">Come say hello at our headquarters.</p>
                    <p className="text-gray-300 leading-relaxed">
                      123 Education Lane,<br />
                      Tech City, TC 98765
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-all duration-300"
                         style={{boxShadow: '0 0 20px rgba(0,255,255,0.2)'}}>
                      <Phone className="h-7 w-7 text-neon-cyan" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
                    <p className="text-cyan-200/70 mb-3">Mon-Fri from 9am to 6pm.</p>
                    <a href="tel:+15551234567"
                       className="text-neon-cyan hover:text-neon-magenta transition-colors duration-300 font-medium">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-6">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  <a href="#" className="h-12 w-12 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan transition-all duration-300 group"
                     style={{boxShadow: '0 0 15px rgba(0,255,255,0.2)'}}>
                    <svg className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="h-12 w-12 rounded-full bg-neon-magenta/10 border border-neon-magenta/30 flex items-center justify-center text-neon-magenta hover:bg-neon-magenta/20 hover:border-neon-magenta transition-all duration-300 group"
                     style={{boxShadow: '0 0 15px rgba(255,0,255,0.2)'}}>
                    <svg className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="h-12 w-12 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan transition-all duration-300 group"
                     style={{boxShadow: '0 0 15px rgba(0,255,255,0.2)'}}>
                    <svg className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="h-12 w-12 rounded-full bg-neon-magenta/10 border border-neon-magenta/30 flex items-center justify-center text-neon-magenta hover:bg-neon-magenta/20 hover:border-neon-magenta transition-all duration-300 group"
                     style={{boxShadow: '0 0 15px rgba(255,0,255,0.2)'}}>
                    <svg className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="h-12 w-12 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan transition-all duration-300 group"
                     style={{boxShadow: '0 0 15px rgba(0,255,255,0.2)'}}>
                    <svg className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="relative bg-gradient-to-br from-gray-900/95 to-neon-black/95 rounded-2xl border border-neon-cyan/50 backdrop-blur-sm overflow-hidden"
                   style={{boxShadow: '0 0 50px rgba(0,255,255,0.3), inset 0 0 30px rgba(255,0,255,0.1)'}}>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-magenta/5 rounded-2xl"></div>

                <div className="relative z-10 p-8">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan mb-8">
                    Send Us a Message
                  </h2>

                  {showSuccess ? (
                    <div className="text-center py-12">
                      <div className="mb-6">
                        <div className="mx-auto w-20 h-20 bg-neon-cyan/20 rounded-full flex items-center justify-center border border-neon-cyan/40"
                             style={{boxShadow: '0 0 30px rgba(0,255,255,0.4)'}}>
                          <Zap className="h-10 w-10 text-neon-cyan animate-pulse" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-neon-cyan mb-4">Message Sent Successfully!</h3>
                      <p className="text-cyan-200/80 text-lg">Thank you for reaching out! We'll get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-neon-magenta mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <EmailInput
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleEmailChange}
                          label="Your Email"
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neon-magenta mb-2">
                          Mobile Number
                        </label>
                        <PhoneInput
                          value={formData.mobile}
                          onChange={handlePhoneChange}
                          placeholder="Enter your mobile number"
                          className=""
                        />
                      </div>
                    
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-neon-magenta mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2300FFFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.75rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em'
                          }}
                        >
                          <option value="" className="bg-gray-800 text-gray-400">Select a subject</option>
                          <option value="General Inquiry" className="bg-gray-800 text-white">General Inquiry</option>
                          <option value="Course Information" className="bg-gray-800 text-white">Course Information</option>
                          <option value="Technical Support" className="bg-gray-800 text-white">Technical Support</option>
                          <option value="Feedback" className="bg-gray-800 text-white">Feedback</option>
                          <option value="Partnership" className="bg-gray-800 text-white">Partnership</option>
                          <option value="Career Guidance" className="bg-gray-800 text-white">Career Guidance</option>
                          <option value="Enrollment Support" className="bg-gray-800 text-white">Enrollment Support</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-neon-magenta mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all resize-none"
                          placeholder="Tell us how we can help you..."
                        ></textarea>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 bg-gradient-to-r from-neon-magenta/20 to-neon-pink/20 border-2 border-neon-magenta/50 text-neon-magenta rounded-lg font-bold hover:border-neon-magenta hover:bg-neon-magenta/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg"
                          style={{boxShadow: '0 0 25px rgba(255,0,255,0.3)'}}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neon-magenta"></div>
                              <span>Sending Message...</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-6 w-6" />
                              <span>Send Message</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-neon-black/50 to-transparent"></div>

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-cyan-200/80 leading-relaxed">
              Find answers to common questions about Learnnect
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900/80 to-neon-black/80 rounded-xl border border-neon-cyan/30 p-8 backdrop-blur-sm hover:border-neon-cyan/50 transition-all duration-300"
                 style={{boxShadow: '0 0 20px rgba(0,255,255,0.1)'}}>
              <h3 className="text-xl font-bold text-neon-cyan mb-4">How do I enroll in a course?</h3>
              <p className="text-gray-300 leading-relaxed">
                To enroll in a course, simply browse our course catalog, select the course you're interested in, and click the "Enroll Now" button. For free courses, you'll get immediate access. For paid courses, you'll be directed to a secure payment page.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-neon-black/80 rounded-xl border border-neon-magenta/30 p-8 backdrop-blur-sm hover:border-neon-magenta/50 transition-all duration-300"
                 style={{boxShadow: '0 0 20px rgba(255,0,255,0.1)'}}>
              <h3 className="text-xl font-bold text-neon-magenta mb-4">What's the difference between free and paid courses?</h3>
              <p className="text-gray-300 leading-relaxed">
                Free courses provide access to basic learning materials and lessons. Paid courses include comprehensive content, hands-on projects, personalized feedback, certificates of completion, and lifetime access to course updates.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-neon-black/80 rounded-xl border border-neon-cyan/30 p-8 backdrop-blur-sm hover:border-neon-cyan/50 transition-all duration-300"
                 style={{boxShadow: '0 0 20px rgba(0,255,255,0.1)'}}>
              <h3 className="text-xl font-bold text-neon-cyan mb-4">Do you offer refunds?</h3>
              <p className="text-gray-300 leading-relaxed">
                Yes, we offer a 30-day money-back guarantee for all paid courses. If you're not satisfied with the course content, you can request a full refund within 30 days of enrollment.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-neon-black/80 rounded-xl border border-neon-magenta/30 p-8 backdrop-blur-sm hover:border-neon-magenta/50 transition-all duration-300"
                 style={{boxShadow: '0 0 20px rgba(255,0,255,0.1)'}}>
              <h3 className="text-xl font-bold text-neon-magenta mb-4">How long do I have access to a course?</h3>
              <p className="text-gray-300 leading-relaxed">
                Once enrolled, you have lifetime access to the course materials. You can learn at your own pace and revisit the content whenever you need a refresher.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-neon-black/80 rounded-xl border border-neon-cyan/30 p-8 backdrop-blur-sm hover:border-neon-cyan/50 transition-all duration-300"
                 style={{boxShadow: '0 0 20px rgba(0,255,255,0.1)'}}>
              <h3 className="text-xl font-bold text-neon-cyan mb-4">Do I receive a certificate upon completion?</h3>
              <p className="text-gray-300 leading-relaxed">
                Yes, all paid courses include a certificate of completion that you can add to your LinkedIn profile or resume. Free courses do not include certificates.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neon-black/30"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan mb-4">
              Our Location
            </h2>
            <p className="text-xl text-cyan-200/80 leading-relaxed">
              Visit our headquarters in Tech City
            </p>
          </div>

          <div className="relative h-96 bg-gradient-to-br from-gray-900/90 to-neon-black/90 rounded-2xl border border-neon-cyan/30 overflow-hidden backdrop-blur-sm"
               style={{boxShadow: '0 0 40px rgba(0,255,255,0.2), inset 0 0 40px rgba(255,0,255,0.1)'}}>
            {/* Map would be integrated here in a production environment */}
            <div className="h-full w-full flex items-center justify-center relative">
              {/* Animated background grid */}
              <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full" style={{
                  backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              {/* Content */}
              <div className="relative text-center">
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-neon-magenta/20 rounded-full flex items-center justify-center border border-neon-magenta/40"
                       style={{boxShadow: '0 0 25px rgba(255,0,255,0.3)'}}>
                    <MapPin className="h-8 w-8 text-neon-magenta" />
                  </div>
                </div>
                <p className="text-neon-cyan text-lg font-medium mb-2">Interactive Map Coming Soon</p>
                <p className="text-cyan-200/60">Advanced location features will be available here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;