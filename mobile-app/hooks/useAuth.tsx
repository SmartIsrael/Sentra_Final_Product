import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Platform } from 'react-native';

interface User {
  id: string;
  phoneNumber: string;
  name: string;
  farmLocation: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (phoneNumber: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage utility that works across platforms
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    // For native platforms, you would use AsyncStorage here
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // return await AsyncStorage.getItem(key);
    return null;
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    // For native platforms, you would use AsyncStorage here
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // await AsyncStorage.setItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    // For native platforms, you would use AsyncStorage here
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // await AsyncStorage.removeItem(key);
  }
};

const AUTH_TOKEN_KEY = 'savebot_auth_token';
const USER_DATA_KEY = 'savebot_user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [token, userData] = await Promise.all([
        storage.getItem(AUTH_TOKEN_KEY),
        storage.getItem(USER_DATA_KEY)
      ]);

      console.log('Auth debug:', { token, userData });
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('Auth debug: user set', parsedUser);
      } else {
        setUser(null);
        console.log('Auth debug: user set to null');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear potentially corrupted data
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (phoneNumber: string, password: string) => {
    setIsLoading(true);
    try {
      // Validate demo credentials
      if (phoneNumber.replace(/\s/g, '') !== '078123456' || password !== 'demo123') {
        throw new Error('Invalid credentials');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock user data
      const userData: User = {
        id: '1',
        phoneNumber: phoneNumber,
        name: 'Jean Claude Uwimana',
        farmLocation: 'Nyagatare District, Rwanda',
      };

      // Generate mock token
      const token = `savebot_token_${Date.now()}`;

      // Store auth data
      await Promise.all([
        storage.setItem(AUTH_TOKEN_KEY, token),
        storage.setItem(USER_DATA_KEY, JSON.stringify(userData))
      ]);

      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Clear stored auth data
      await Promise.all([
        storage.removeItem(AUTH_TOKEN_KEY),
        storage.removeItem(USER_DATA_KEY)
      ]);

      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      // Force clear user state even if storage operations fail
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
