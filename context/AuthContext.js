// context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    email: '',
    password: '',
  });

  const login = (email, password) => {
    setAuthState({ isAuthenticated: true, email, password });
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, email: '', password: '' });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
