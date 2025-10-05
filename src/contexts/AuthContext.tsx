import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/authService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, AuthUser, LoginRequest, UserRole, CreateUserRequest, UpdatePasswordRequest } from '../types/user.types';

export type LoginResponse = {
  token: string;
  user: any; // or your User type/interface
  role: string;
  redirectTo: string;
};
interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  register: (userData: CreateUserRequest) => Promise<void>;
  updatePassword: (passwordData: UpdatePasswordRequest) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStoreOwner: boolean;
  isNormalUser: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage<AuthUser | null>('user', null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && user) {
        try {
          const userData = await authService.getCurrentUser();
          setUser({ ...userData, token });
        } catch (error) {
          console.error('Auth initialization failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    setLoading(true);
    const response = await authService.login(credentials);
    setUser({
      ...response.user,
      token: response.token,
      refreshToken: '',  // add response.refreshToken if available
      expiresAt: '',     // add response.expiresAt if available
    });
    localStorage.setItem('token', response.token);
    return response;
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);
  }
};



  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  const register = async (userData: CreateUserRequest): Promise<void> => {
    try {
      setLoading(true);
      await authService.register(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (passwordData: UpdatePasswordRequest): Promise<void> => {
    try {
      await authService.updatePassword(passwordData);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    updatePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.SYSTEM_ADMIN,
    isStoreOwner: user?.role === UserRole.STORE_OWNER,
    isNormalUser: user?.role === UserRole.NORMAL_USER,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
