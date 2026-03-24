import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/auth.api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { email: string; name: string; phone?: string; city?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string; city?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    const savedUser = sessionStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        sessionStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await authApi.login({ email, password });
    sessionStorage.setItem('access_token', res.data.access);
    sessionStorage.setItem('refresh_token', res.data.refresh);
    sessionStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (data: { email: string; name: string; phone?: string; city?: string; password: string }) => {
    const res = await authApi.register(data);
    sessionStorage.setItem('access_token', res.data.access);
    sessionStorage.setItem('refresh_token', res.data.refresh);
    sessionStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const updateProfile = async (data: { name?: string; phone?: string; city?: string }) => {
    const res = await authApi.updateProfile(data);
    const updated = { ...user, ...res.data } as User;
    sessionStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  const logout = async () => {
    const refresh = sessionStorage.getItem('refresh_token');
    if (refresh) {
      try { await authApi.logout(refresh); } catch { /* ignore */ }
    }
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'staff',
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
