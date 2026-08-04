import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AppUser } from "@/lib/api";

interface UserContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginUser: (userData: AppUser) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const STORAGE_KEY = "user";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loginUser = async (userData: AppUser) => {
    setUser(userData);
    setIsAuthenticated(true);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logoutUser = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, loading, loginUser, logoutUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
