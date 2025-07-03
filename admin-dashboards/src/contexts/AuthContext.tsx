import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types'; // Import the User type

interface AuthContextType {
  token: string | null;
  user: User | null; // Use the specific User type
  isLoading: boolean;
  login: (token: string, userData: User) => void; // Use the specific User type
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // Use the specific User type
  const [isLoading, setIsLoading] = useState<boolean>(true); // To check initial auth status

  useEffect(() => {
    // Check for token in localStorage on initial load
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user data", e);
          localStorage.removeItem('authUser'); // Clear corrupted data
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => { // Use the specific User type
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    // Optionally, redirect to login page or make an API call to invalidate token on backend
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
