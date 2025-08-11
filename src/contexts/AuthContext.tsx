import React, { createContext, useContext, useState, useEffect } from 'react';
import { MockAPI, User, SignupData } from '../services/MockAPI';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  logout: () => void;
  clearAuth: () => void; // Add this for debugging
  updateProfile: (userId: string, data: Partial<User>) => Promise<boolean>;
  tempSignupData: SignupData | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tempSignupData, setTempSignupData] = useState<SignupData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('quickcourt_user');
    console.log('Checking localStorage for user data:', storedUser ? 'Found' : 'Not found');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Parsed user data:', userData);
        
        // Validate that the stored user data has required fields
        if (userData && userData.id && userData.email && userData.role) {
          console.log('Valid user data found, setting authentication state');
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Invalid user data, clear it
          console.log('Invalid user data found, clearing...');
          localStorage.removeItem('quickcourt_user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('quickcourt_user');
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      console.log('No stored user data found');
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      // Use MockAPI for login
      const userData = await MockAPI.login(email, password);
      
      if (userData) {
        console.log('Login successful for:', userData.email);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('quickcourt_user', JSON.stringify(userData));
        return true;
      }
      
      console.log('Login failed - invalid credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      // Use MockAPI for signup
      const userData = await MockAPI.signup(data);
      
      if (userData) {
        setTempSignupData(data);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp === '123456' && tempSignupData) {
        const userData: User = {
          id: Date.now().toString(),
          email: tempSignupData.email,
          fullName: tempSignupData.fullName,
          role: tempSignupData.role,
          phone: tempSignupData.phone,
          isActive: true
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('quickcourt_user', JSON.stringify(userData));
        setTempSignupData(null);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setTempSignupData(null);
    localStorage.removeItem('quickcourt_user');
    // Force a page reload to clear any cached state
    window.location.href = '/login';
  };

  const clearAuth = () => {
    setUser(null);
    setIsAuthenticated(false);
    setTempSignupData(null);
    localStorage.removeItem('quickcourt_user');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (user) {
      try {
        // Use MockAPI for profile update
        const updatedUser = await MockAPI.updateProfile(user.id, data);
        
        if (updatedUser) {
          setUser(updatedUser);
          localStorage.setItem('quickcourt_user', JSON.stringify(updatedUser));
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Profile update error:', error);
        return false;
      }
    }
    return false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    signup,
    verifyOTP,
    logout,
    clearAuth,
    updateProfile,
    tempSignupData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};