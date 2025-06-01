import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { adminAuthService } from '../services/adminAuthService';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔐 Starting admin login process...');
    console.log('📧 Email:', email);

    try {
      console.log('🔄 Calling adminAuthService.loginAdmin...');
      const adminUser = await adminAuthService.loginAdmin(email, password);
      console.log('✅ Login successful, admin user:', adminUser);

      console.log('🔄 Calling onLoginSuccess...');
      onLoginSuccess();
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 rounded-full">
                <Lock className="h-8 w-8 text-neon-cyan" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta">
              Admin Login
            </h1>
            <p className="text-cyan-200/80 mt-2">
              Access the blog administration panel
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cyan-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                  placeholder="admin@learnnect.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-neon-cyan"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 text-neon-cyan border border-neon-cyan/50 rounded-xl hover:bg-neon-cyan/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-cyan-300/60 text-sm">
              Only authorized administrators can access this panel.
            </p>
            <p className="text-cyan-300/60 text-xs mt-2">
              Contact system administrator if you need access.
            </p>
          </div>

          {/* Admin Emails Info */}
          <div className="mt-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
            <p className="text-cyan-300 text-xs font-medium mb-2">Authorized Admin Emails:</p>
            <ul className="text-cyan-400/80 text-xs space-y-1">
              <li>• admin@learnnect.com</li>
              <li>• superadmin@learnnect.com</li>
              <li>• your-email@domain.com</li>
            </ul>
            <button
              type="button"
              onClick={() => {
                console.log('🧪 Testing email check for:', email);
                console.log('✅ Is admin email?', adminAuthService.isAdminEmail(email));
              }}
              className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 underline"
            >
              Test Email (Check Console)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
