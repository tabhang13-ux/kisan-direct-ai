import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('kisandirect_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch (err) {
          console.warn('Token expired or invalid');
          localStorage.removeItem('kisandirect_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('kisandirect_token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please check credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (formData) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', formData);
      const { token, user: userData } = res.data;
      localStorage.setItem('kisandirect_token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('kisandirect_token');
    setUser(null);
  };

  const demoLogin = async (roleEmail) => {
    return login(roleEmail, 'password123');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
