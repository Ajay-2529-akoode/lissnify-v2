"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// User interface
export interface User {
  full_name: string;
  email: string;
  user_type: string;
  // Add other user fields as needed
}

// Authentication context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, accessToken?: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status from localStorage
  const checkAuthStatus = () => {
    try {
      const storedUser = localStorage.getItem('elysian_user');
      const storedToken = localStorage.getItem('elysian_token');
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear invalid data
      localStorage.removeItem('elysian_user');
      localStorage.removeItem('elysian_token');
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = (userData: User, accessToken?: string) => {
    setUser(userData);
    // Store user data and token in localStorage
    console.log('Storing user data:', userData);
    localStorage.setItem('elysian_user', JSON.stringify(userData));
    if (accessToken) {
      localStorage.setItem('elysian_token', accessToken);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    // Clear stored data
    localStorage.clear();
    localStorage.removeItem('elysian_user');
    localStorage.removeItem('elysian_token');
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('elysian_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
