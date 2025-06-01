import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // This would typically make an API call
    // For now, using the same mock logic as in AuthPage
    if (email === 'demo@learnnect.com' && password === 'Demo123!') {
      const userData = {
        id: '1',
        email,
        name: 'Demo User',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'mock-jwt-token');
      return userData;
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (userData: any) => {
    // This would typically make an API call
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', 'mock-jwt-token');
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected route component
export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-cyan-200">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neon-black via-gray-900 to-neon-black flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-cyan/10 via-transparent to-neon-magenta/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          <div className="mb-6 w-20 h-20 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
            Premium Content
          </h2>
          <p className="text-cyan-200 mb-8 leading-relaxed">
            This content is exclusive to registered learners. Join our community to access premium courses, track your progress, and earn certificates.
          </p>

          <div className="space-y-4">
            <a
              href="/auth?signup=true"
              className="block w-full px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-neon-magenta to-neon-pink hover:from-magenta-500 hover:to-pink-500 transition-all duration-200 transform hover:scale-105"
              style={{ boxShadow: '0 0 20px rgba(255,0,255,0.3)' }}
            >
              Sign Up Now
            </a>

            <a
              href="/auth"
              className="block w-full px-6 py-3 border border-neon-cyan/50 rounded-xl text-sm font-medium text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-200"
            >
              Already have an account? Login
            </a>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-cyan-300/60 text-xs">
              ✨ Join thousands of learners advancing their careers with our premium content
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthContext;
