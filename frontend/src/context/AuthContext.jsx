import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { setAuthToken, setOnUnauthorized } from '../api/client';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return typeof window !== 'undefined'
      ? (localStorage.getItem('quiz_app_token') || sessionStorage.getItem('quiz_app_token') || null)
      : null;
  });

  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('quiz_app_user') || sessionStorage.getItem('quiz_app_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          localStorage.removeItem('quiz_app_user');
          sessionStorage.removeItem('quiz_app_user');
        }
      }
    }
    return null;
  });

  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  const clearAuth = useCallback(() => {
    setAuthToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quiz_app_token');
      sessionStorage.removeItem('quiz_app_token');
      localStorage.removeItem('quiz_app_user');
      sessionStorage.removeItem('quiz_app_user');
    }
    setToken(null);
    setUser(null);
  }, []);

  // Setup API client 401 callback
  useEffect(() => {
    setOnUnauthorized(() => {
      clearAuth();
    });
  }, [clearAuth]);

  // Rehydrate & verify token with backend on mount/refresh
  useEffect(() => {
    const verifyStoredAuth = async () => {
      const savedToken = typeof window !== 'undefined'
        ? (localStorage.getItem('quiz_app_token') || sessionStorage.getItem('quiz_app_token'))
        : null;

      if (savedToken) {
        setAuthToken(savedToken);
        const res = await authService.getMe();
        if (res.success && res.data && res.data.user) {
          setUser(res.data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('quiz_app_user', JSON.stringify(res.data.user));
          }
        } else {
          clearAuth();
        }
      } else {
        clearAuth();
      }
      setInitializing(false);
    };

    verifyStoredAuth();
  }, [clearAuth]);

  const login = async (email, password) => {
    setLoading(true);
    const res = await authService.login(email, password);

    if (res.success && res.data && res.data.token) {
      setAuthToken(res.data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('quiz_app_token', res.data.token);
        localStorage.setItem('quiz_app_user', JSON.stringify(res.data.user));
        sessionStorage.setItem('quiz_app_token', res.data.token);
        sessionStorage.setItem('quiz_app_user', JSON.stringify(res.data.user));
      }
      setToken(res.data.token);
      setUser(res.data.user);
    }
    setLoading(false);
    return res;
  };

  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    const res = await authService.register(name, email, password, confirmPassword);
    setLoading(false);
    return res;
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user?.role || null,
        initializing,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
