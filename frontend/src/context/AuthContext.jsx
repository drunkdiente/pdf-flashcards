import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Attempt to get user info if token exists
          const response = await api.get('/api/auth/me');
          setUser({ ...response.data, token });
        } catch (error) {
          console.error("Auth check failed:", error);
          // If the interceptor handles token refresh properly,
          // the api call should eventually succeed or fail entirely.
          if (error.response && error.response.status === 401) {
             // Let the interceptor handle the redirection or refresh attempt
             // But if we end up here with a 401, we consider the user logged out.
             setUser(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token, role, email) => {
    localStorage.setItem('token', token);
    setUser({ token, role, email });
  };

  const logout = async () => {
    try {
        await api.post('/api/auth/logout');
    } catch(err) {
        console.error("Logout error", err);
    } finally {
        localStorage.removeItem('token');
        setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
