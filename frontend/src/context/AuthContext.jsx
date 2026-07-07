import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('llmguard_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('Failed to verify session:', error);
          localStorage.removeItem('llmguard_token');
          localStorage.removeItem('llmguard_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      const { access_token, role, username: resUser } = res.data;
      
      localStorage.setItem('llmguard_token', access_token);
      
      const userData = { username: resUser, role };
      localStorage.setItem('llmguard_user', JSON.stringify(userData));
      
      // Fetch details profile
      const profileRes = await api.get('/auth/me');
      setUser(profileRes.data);
      return profileRes.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Authentication failed';
    }
  };

  const register = async (username, email, password, role) => {
    try {
      await api.post('/auth/signup', { username, email, password, role });
    } catch (error) {
      throw error.response?.data?.detail || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('llmguard_token');
    localStorage.removeItem('llmguard_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
