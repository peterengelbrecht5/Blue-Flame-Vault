import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  username: string;
  email: string;
  memberSince: string;
  membershipTier: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = "@blueflame_users";
const CURRENT_USER_KEY = "@blueflame_current_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const stored = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load user", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function getUsers(): Promise<Record<string, { user: User; password: string }>> {
    const stored = await AsyncStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  async function login(email: string, password: string): Promise<boolean> {
    const users = await getUsers();
    const entry = users[email.toLowerCase()];
    if (entry && entry.password === password) {
      setUser(entry.user);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(entry.user));
      return true;
    }
    return false;
  }

  async function register(username: string, email: string, password: string): Promise<boolean> {
    const users = await getUsers();
    const key = email.toLowerCase();
    if (users[key]) return false;

    const newUser: User = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      username,
      email: key,
      memberSince: new Date().toISOString(),
      membershipTier: "Standard",
    };

    users[key] = { user: newUser, password };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
