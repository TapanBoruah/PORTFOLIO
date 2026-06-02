import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync token to Axios headers on change
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Verify token on application mount
  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/auth/verify');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Session validation failed:', err.response?.data?.msg || err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  // Login handler
  const login = async (username, password) => {
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        msg: err.response?.data?.msg || 'Authentication failed. Please check your credentials.'
      };
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
