'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  Tenant,
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  RegisterData,
  getAccessToken,
} from '../api/auth';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tenant: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setState({
        user: null,
        tenant: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return;
    }

    try {
      const data = await getCurrentUser();
      if (data) {
        setState({
          user: data.user,
          tenant: data.tenant,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState({
          user: null,
          tenant: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch {
      setState({
        user: null,
        tenant: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const result = await apiLogin(email, password);
      setState({
        user: result.data.user,
        tenant: result.data.tenant,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const result = await apiRegister(data);
      setState({
        user: result.data.user,
        tenant: result.data.tenant,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    await apiLogout();
    setState({
      user: null,
      tenant: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
