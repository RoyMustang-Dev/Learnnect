import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AdminBlogPage from './pages/AdminBlogPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import LMSLayout from './components/LMS/LMSLayout';
import GoogleAuthSuccess from './components/GoogleAuthSuccess';
import GoogleCallback from './components/GoogleCallback';
import ScrollToTop from './components/ScrollToTop';
import UserProfilePage from './pages/UserProfilePage';
import LinkedInProfilePage from './pages/LinkedInProfilePage';
import SettingsPage from './pages/SettingsPage';
import LMSPlaceholder from './pages/LMSPlaceholder';
import { EmailNotificationManager } from './components/EmailNotification';
import EnquiryWidget from './components/EnquiryWidget';
import './services/userActivityService'; // Initialize activity tracking


function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black">
          <Navbar />
          <main className="flex-grow pt-[0]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/admin/blog" element={<AdminBlogPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />

              {/* Protected Routes - Dashboard System */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* LMS Route - Future third-party integration */}
              <Route path="/lms" element={
                <ProtectedRoute>
                  <LMSPlaceholder />
                </ProtectedRoute>
              } />

              {/* User Profile & Settings */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <LinkedInProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/profile/basic" element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />

          {/* Email notification system */}
          <EmailNotificationManager />

          {/* Enquiry Widget - Available throughout the website */}
          <EnquiryWidget autoShowDelay={10000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;