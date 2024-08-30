import React, { createContext, useState, useContext } from 'react';

// Create a context object to manage authentication state and provide access to it throughout the app.
const AuthContext = createContext();

// AuthProvider component to wrap the app or part of the app that needs access to authentication state.
export const AuthProvider = ({ children }) => {
  // Initialize state to manage authentication information: whether the user is authenticated, their email, and password.
  const [authState, setAuthState] = useState({
    isAuthenticated: false,  // Initial authentication status is false
    email: '',               // Initial email is an empty string
    password: '',            // Initial password is an empty string
  });

  // Function to handle user login. It updates the authentication state with provided email and password.
  const login = (email, password) => {
    setAuthState({ isAuthenticated: true, email, password });
  };

  // Function to handle user logout. It resets the authentication state to initial values.
  const logout = () => {
    setAuthState({ isAuthenticated: false, email: '', password: '' });
  };

  // Provide the authentication state and functions (login and logout) to child components that need them.
  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the authentication context in other components.
export const useAuth = () => useContext(AuthContext);
