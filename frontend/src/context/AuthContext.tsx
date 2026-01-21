import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';

interface User {
  id: string;
  email: string;
}

interface TestGroup {
  testId: string;
  testName: string;
  groupId: string;
  groupName: string;
  assignedAt: string;
}

interface AuthContextType {
  user: User | null;
  testGroup: TestGroup | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [testGroup, setTestGroup] = useState<TestGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const accessToken = await storage.getAccessToken();
      if (accessToken) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const storedTestGroup = await storage.getTestGroup();
          if (storedTestGroup) {
            setTestGroup(storedTestGroup);
          }
        } else {
          await storage.clearTokens();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await storage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
    if (response.testGroup) {
      setTestGroup(response.testGroup);
      await storage.setTestGroup(response.testGroup);
    }
  };

  const register = async (email: string, password: string) => {
    const response = await authService.register({ email, password });
    setUser(response.user);
    if (response.testGroup) {
      setTestGroup(response.testGroup);
      await storage.setTestGroup(response.testGroup);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setTestGroup(null);
  };

  return (
    <AuthContext.Provider value={{ user, testGroup, isLoading, login, register, logout }}>
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
