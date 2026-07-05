import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.user);
    toast.success('Logged in successfully');
    return data;
  };

  const register = async (values) => {
    const { data } = await api.post('/auth/register', values);
    setUser(data.user);
    toast.success('Account created successfully');
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    toast.success('Logged out');
  };

  return <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
