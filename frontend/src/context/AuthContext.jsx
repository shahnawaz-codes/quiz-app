import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { setOnUnauthorized } from '../api/client';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  const clearAuth = useCallback(() => {
    setUser(null);
  }, []);

  // Setup API client 401 callback
  useEffect(() => {
    setOnUnauthorized(() => {
      clearAuth();
    });
  }, [clearAuth]);

  // Rehydrate & verify session with backend on mount/refresh via HttpOnly cookie
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        const res = await authService.getMe();
        if (isMounted) {
          if (res.success && res.data && res.data.user) {
            setUser(res.data.user);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setInitializing(false);
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const res = await authService.login(email, password);

    if (res.success && res.data && res.data.user) {
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

  const logout = async () => {
    setLoading(true);
    await authService.logout();
    clearAuth();
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
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
