import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { MOCK_USERS } from '../lib/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isSupabaseConnected: boolean;
  availableProfiles: UserProfile[];
  switchUser: (userId: string) => void;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('findora_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_USERS[0];
      }
    }
    return MOCK_USERS[0]; // Default demo user: Sarah Chen
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('findora_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('findora_user');
    }
  }, [currentUser]);

  // Check Supabase session if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // If logged in via Supabase Auth
          const userEmail = session.user.email || '';
          const existing = MOCK_USERS.find(u => u.email === userEmail);
          if (existing) {
            setCurrentUser(existing);
          } else {
            setCurrentUser({
              id: session.user.id,
              email: userEmail,
              fullName: session.user.user_metadata?.full_name || userEmail.split('@')[0],
              role: 'user',
              trustScore: 90,
              recoveredCount: 0,
              reportedCount: 0,
              community: 'General Public',
              isVerified: true,
              createdAt: new Date().toISOString()
            });
          }
        }
      });
    }
  }, []);

  const switchUser = (userId: string) => {
    const found = MOCK_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    const match = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (match) {
      setCurrentUser(match);
      return true;
    }
    // Create new profile
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace('.', ' '),
      role: 'user',
      trustScore: 90,
      recoveredCount: 0,
      reportedCount: 0,
      community: 'General Public',
      isVerified: true,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isSupabaseConnected: isSupabaseConfigured,
        availableProfiles: MOCK_USERS,
        switchUser,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
