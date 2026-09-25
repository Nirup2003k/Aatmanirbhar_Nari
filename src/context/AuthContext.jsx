import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../services/api';
import { AuthContext } from './authContextObject';
import { useAuth } from './useAuth';

export { AuthContext, useAuth };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuthUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Error restoring auth state:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthUser();
  }, [fetchAuthUser]);

  const login = useCallback(async (credentials) => {
    const res = await loginUser(credentials);
    setUser(res.data);
    return res.data;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await registerUser(userData);
    setUser(res.data);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refetchUser: fetchAuthUser,
    }),
    [user, isLoading, login, register, logout, fetchAuthUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
