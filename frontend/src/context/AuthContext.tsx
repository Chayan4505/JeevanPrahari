import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  loginWithGoogle: (idToken: string, preferredLanguage?: string) => Promise<void>;
  demoLogin: (role: UserRole, name?: string, email?: string, districtId?: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pahaarsaathi_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('pahaarsaathi_token');
      if (storedToken) {
        try {
          const profile = await api.auth.getMe();
          setUser(profile);
        } catch (e) {
          console.warn('[PahaarSaathi Auth] Session expired or invalid, clearing storage');
          localStorage.removeItem('pahaarsaathi_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const loginWithGoogle = async (idToken: string, preferredLanguage = 'en') => {
    setIsLoading(true);
    try {
      const res = await api.auth.googleLogin(idToken, preferredLanguage);
      localStorage.setItem('pahaarsaathi_token', res.accessToken);
      setToken(res.accessToken);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: UserRole, name?: string, email?: string, districtId?: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.demoLogin(role, name, email, districtId);
      localStorage.setItem('pahaarsaathi_token', res.accessToken);
      setToken(res.accessToken);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('pahaarsaathi_token');
    setToken(null);
    setUser(null);
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        token,
        loginWithGoogle,
        demoLogin,
        logout,
        hasRole,
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
