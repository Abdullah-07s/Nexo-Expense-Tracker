import { createContext, useContext, useState } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

function getStoredUser() {
  const token = localStorage.getItem('nexo_token');
  const email = localStorage.getItem('nexo_email');
  const fullName = localStorage.getItem('nexo_fullName');
  if (token && email) {
    return { email, fullName };
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const loading = false;

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, email: userEmail, fullName } = response.data;
    localStorage.setItem('nexo_token', token);
    localStorage.setItem('nexo_email', userEmail);
    localStorage.setItem('nexo_fullName', fullName);
    setUser({ email: userEmail, fullName });
    return response.data;
  };

  const register = async (fullName, email, password) => {
    const response = await apiClient.post('/auth/register', { fullName, email, password });
    const { token, email: userEmail, fullName: userFullName } = response.data;
    localStorage.setItem('nexo_token', token);
    localStorage.setItem('nexo_email', userEmail);
    localStorage.setItem('nexo_fullName', userFullName);
    setUser({ email: userEmail, fullName: userFullName });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('nexo_token');
    localStorage.removeItem('nexo_email');
    localStorage.removeItem('nexo_fullName');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}