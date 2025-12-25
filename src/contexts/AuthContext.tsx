
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { User, Address } from '@/types/user';

// Define types
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateUserProfile: (data: Partial<User> & { addresses?: Address[] }) => Promise<void>;
};

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user' as const,
    createdAt: new Date() // Added missing createdAt property
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const,
    createdAt: new Date() // Added missing createdAt property
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('skinAuraUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure createdAt is a Date object if it exists as a string
        if (parsedUser.createdAt && typeof parsedUser.createdAt === 'string') {
          parsedUser.createdAt = new Date(parsedUser.createdAt);
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('skinAuraUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Extract user data without password
      const { password: _, ...userData } = foundUser;
      
      // Save to state and localStorage
      setUser(userData as User);
      localStorage.setItem('skinAuraUser', JSON.stringify(userData));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      });
      
      return Promise.resolve();
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: 'user',
        createdAt: new Date() // Added missing createdAt property
      };
      
      // In a real app, we would save to database here
      
      // Save to state and localStorage
      setUser(newUser);
      localStorage.setItem('skinAuraUser', JSON.stringify(newUser));
      
      toast({
        title: "Account Created",
        description: "Your account has been successfully created.",
      });
      
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User> & { addresses?: Address[] }) => {
    if (!user) return Promise.reject(new Error('No user logged in'));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('skinAuraUser', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      return Promise.resolve();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('skinAuraUser');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email exists
      const userExists = MOCK_USERS.some(u => u.email === email);
      
      if (!userExists) {
        throw new Error('No account found with this email');
      }
      
      toast({
        title: "Password Reset Email Sent",
        description: "If your email is registered with us, you'll receive a password reset link shortly.",
      });
      
    } catch (error) {
      toast({
        title: "Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would validate the token and update the password in the database
      
      toast({
        title: "Password Reset Successful",
        description: "Your password has been successfully reset. Please log in with your new password.",
      });
      
    } catch (error) {
      toast({
        title: "Password Reset Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
