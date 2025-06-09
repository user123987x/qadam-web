import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/lib/types";
import { mockUsers } from "@/lib/constants";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on app start
    const checkAuth = () => {
      const storedUserId = localStorage.getItem("authUserId");
      const storedToken = localStorage.getItem("authToken"); // In real app, validate this token

      if (storedUserId && storedToken) {
        const foundUser = mockUsers.find((u) => u.id === storedUserId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          // Invalid stored user, clear storage
          localStorage.removeItem("authUserId");
          localStorage.removeItem("authToken");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userId: string) => {
    const foundUser = mockUsers.find((u) => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("authUserId", userId);
      localStorage.setItem("authToken", `demo-token-${userId}`); // In real app, this would be JWT

      // Also update the old role system for backward compatibility
      localStorage.setItem("currentUserId", userId);
      localStorage.setItem("currentUserRole", foundUser.role);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUserId");
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentUserRole");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
