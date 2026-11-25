import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kadaya_token');
    if (token) {
      api.getSaya()
        .then((res) => {
          setUser(res.pengguna);
        })
        .catch(() => {
          localStorage.removeItem('kadaya_token');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.masuk(email, password);
    localStorage.setItem('kadaya_token', res.token);
    setUser(res.pengguna);
    return res;
  };

  const logout = async () => {
    try {
      await api.keluar();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('kadaya_token');
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    isAdmin: user?.peran === 'admin',
    isPokja: user?.peran === 'pengurus_pokja',
    pokjaId: user?.pokja_id
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}
