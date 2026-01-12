import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  isVerified: boolean;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinDate: string;
  hasCompletedOnboarding: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifyEmail: (code: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: () => Promise<{ success: boolean }>;
  completeOnboarding: () => void;
  updateProfile: (data: Partial<User>) => void;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user storage (would be replaced with real backend)
const STORAGE_KEY = 'harvesta_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const saveUser = (userData: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate login validation
    if (!email || !password) {
      setIsLoading(false);
      return { success: false, error: 'Please enter email and password' };
    }
    
    if (password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Invalid credentials' };
    }

    // Check for demo credentials or any valid email format
    const mockUser: User = {
      id: `HRV-AGT-${Date.now().toString(36).toUpperCase()}`,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      phone: '+237 6XX XXX XXX',
      country: 'Cameroon',
      isVerified: true,
      tier: 'Gold',
      joinDate: new Date().toISOString().split('T')[0],
      hasCompletedOnboarding: true,
    };

    saveUser(mockUser);
    setIsLoading(false);
    toast.success('Welcome back! 👋');
    return { success: true };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validation
    if (!data.email || !data.password || !data.name) {
      setIsLoading(false);
      return { success: false, error: 'Please fill in all required fields' };
    }

    if (data.password.length < 8) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid email address' };
    }

    const newUser: User = {
      id: `HRV-AGT-${Date.now().toString(36).toUpperCase()}`,
      email: data.email,
      name: data.name,
      phone: data.phone,
      country: data.country,
      isVerified: false, // Needs email verification
      tier: 'Bronze',
      joinDate: new Date().toISOString().split('T')[0],
      hasCompletedOnboarding: false,
    };

    saveUser(newUser);
    setIsLoading(false);
    toast.success('Account created! Please verify your email.');
    return { success: true };
  };

  const verifyEmail = async (code: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate verification (accept any 6-digit code)
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      return { success: false, error: 'Please enter a valid 6-digit code' };
    }

    if (user) {
      const updatedUser = { ...user, isVerified: true };
      saveUser(updatedUser);
      toast.success('Email verified successfully! 🎉');
    }
    
    return { success: true };
  };

  const resendVerification = async (): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Verification code sent to your email');
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      saveUser(updatedUser);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      saveUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      verifyEmail,
      resendVerification,
      completeOnboarding,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
