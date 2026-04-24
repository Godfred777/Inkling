'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthSession, AuthContextType, RegisterRequest, UserPreferences } from '@/types';
import { 
  signInWithEmailAndPassword, 
  signUpWithEmailAndPassword, 
  signOut,
  resetPasswordForEmail,
  updateUserMetadata,
  updateUserPassword,
  //supabase
} from '@/api/auth';
import { supabase } from '@/lib/supabase/client';
//import { users } from '@/lib/dummyData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'inkling_auth_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from Supabase on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing Supabase session
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        
        if (supabaseSession) {
          const user: User = {
            id: supabaseSession.user.id,
            name: supabaseSession.user.user_metadata?.name || supabaseSession.user.email?.split('@')[0] || '',
            email: supabaseSession.user.email || '',
            role: supabaseSession.user.user_metadata?.role || 'Owner',
          };

          const authSession: AuthSession = {
            user,
            token: supabaseSession.access_token || '',
            expiresAt: supabaseSession.expires_at 
              ? new Date(supabaseSession.expires_at * 1000).toISOString()
              : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          };

          setSession(authSession);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
        } else {
          // Fallback to localStorage
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
      const { data, error } = await signInWithEmailAndPassword(email, password);
      
      if (error) {
        throw error;
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || email.split('@')[0],
          email: data.user.email || email,
          role: data.user.user_metadata?.role || 'Owner',
        };

        const authSession: AuthSession = {
          user,
          token: data.session?.access_token || '',
          expiresAt: data.session?.expires_at 
            ? new Date(data.session.expires_at * 1000).toISOString()
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };

        setSession(authSession);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { data: authData, error } = await signUpWithEmailAndPassword(data.email, data.password);
      
      if (error) {
        throw error;
      }

      if (authData.user) {
        // Update user metadata with name
        if (data.name) {
          await updateUserMetadata({ name: data.name });
        }

        const user: User = {
          id: authData.user.id,
          name: data.name || authData.user.user_metadata?.name || data.email.split('@')[0],
          email: authData.user.email || data.email,
          role: authData.user.user_metadata?.role || 'Owner',
        };

        const authSession: AuthSession = {
          user,
          token: authData.session?.access_token || '',
          expiresAt: authData.session?.expires_at 
            ? new Date(authData.session.expires_at * 1000).toISOString()
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };

        setSession(authSession);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setSession(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!session) throw new Error('No session found');
    
    setIsLoading(true);
    try {
      const { data: userData, error } = await updateUserMetadata({
        name: data.name,
        role: data.role,
      });

      if (error) {
        throw error;
      }

      if (userData.user) {
        const updatedUser: User = {
          ...session.user,
          name: userData.user.user_metadata?.name || session.user.name,
          role: userData.user.user_metadata?.role || session.user.role,
        };
        const updatedSession = { ...session, user: updatedUser };
        
        setSession(updatedSession);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedSession));
      }
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
      const { data: userData, error } = await updateUserMetadata({
        preferences: {
          ...session.user.preferences,
          ...data,
        }
      });

      if (error) {
        throw error;
      }

      const updatedUser: User = {
        ...session.user,
      };
      const updatedSession: AuthSession = { 
        ...session, 
        user: updatedUser,
      };
      
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
    if (!session) throw new Error('No session found');
    
    setIsLoading(true);
    try {
      // Note: Supabase doesn't provide a direct way to verify current password
      // This would typically be handled server-side with a custom function
      // For now, we'll just update the password
      const { error } = await updateUserPassword(newPassword);

      if (error) {
        throw error;
      }

      console.log('Password changed for user:', session.user.email);
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await resetPasswordForEmail(email);
      
      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user: session?.user || null,
    session,
    isLoading,
    isAuthenticated: !!session,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    changePassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
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
