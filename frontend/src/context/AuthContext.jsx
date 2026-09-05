import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { apiClient, setAuthToken, setOnUnauthorized } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('quiz_app_token') || null : null;
  });

  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUser = sessionStorage.getItem('quiz_app_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          sessionStorage.removeItem('quiz_app_user');
        }
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const clearAuth = useCallback(() => {
    setAuthToken(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('quiz_app_token');
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

  const login = async (email, password) => {
    setLoading(true);
    const res = await apiClient('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (res.success && res.data && res.data.token) {
      setAuthToken(res.data.token);
      if (typeof window !== 'undefined') {
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
    const res = await apiClient('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        confirm_password: confirmPassword
      })
    });
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
