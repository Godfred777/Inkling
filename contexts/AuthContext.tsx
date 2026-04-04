'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthSession, AuthContextType, RegisterRequest, UserPreferences } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'inkling_auth_session';
const MOCK_DELAY = 800;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsedSession = JSON.parse(stored);
          const now = new Date();
          const expiresAt = new Date(parsedSession.expiresAt);
          
          if (expiresAt > now) {
            setSession(parsedSession);
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      
      // Mock authentication - in production, this would be an API call
      const mockUser: User = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0],
        email: email,
        role: 'Owner',
      };

      const mockSession: AuthSession = {
        user: mockUser,
        token: 'mock_jwt_token_' + Date.now(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      };

      setSession(mockSession);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockSession));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const mockUser: User = {
        id: 'user_' + Date.now(),
        name: data.name,
        email: data.email,
        role: 'Owner',
      };

      const mockSession: AuthSession = {
        user: mockUser,
        token: 'mock_jwt_token_' + Date.now(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      setSession(mockSession);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockSession));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!session) throw new Error('No session found');
    
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      
      const updatedUser = { ...session.user, ...data };
      const updatedSession = { ...session, user: updatedUser };
      
      setSession(updatedSession);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedSession));
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const updatePreferences = useCallback(async (data: Partial<UserPreferences>) => {
    if (!session) throw new Error('No session found');
    
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      
      const updatedUser = {
        ...session.user,
        ...data
      };
      const updatedSession: AuthSession = { ...session, user: updatedUser };
      
      setSession(updatedSession);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedSession));
    } catch (error) {
      console.error('Preferences update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      
      // In production, validate currentPassword with backend
      if (currentPassword === 'wrong') {
        throw new Error('Current password is incorrect');
      }
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user: session?.user ?? null,
    session,
    isLoading,
    isAuthenticated: !!session,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
