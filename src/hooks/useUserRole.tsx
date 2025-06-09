import { UserRole } from "@/lib/types";
import { mockUsers } from "@/lib/constants";

// Import useAuth dynamically to avoid context issues
let useAuth: any;
try {
  useAuth = require("./useAuth").useAuth;
} catch {
  useAuth = null;
}

export const useUserRole = () => {
  let currentUser = null;
  let userRole = null;
  let login = () => {};

  // Try to use auth context if available
  if (useAuth) {
    try {
      const auth = useAuth();
      currentUser = auth.user;
      userRole = auth.user?.role || null;
      login = auth.login;
    } catch (error) {
      // Fallback if auth context is not available
      console.warn("useAuth not available, using fallback");
    }
  }

  // For demo purposes, allow switching between users
  const switchUser = (userId: string) => {
    try {
      if (login) {
        login(userId);
      }
    } catch (error) {
      console.warn("switchUser failed:", error);
    }
  };

  const switchRole = (role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      switchUser(user.id);
    }
  };

  return {
    currentUser,
    userRole,
    switchUser,
    switchRole,
    isEmployer: userRole === "employer",
    isWorker: userRole === "worker",
    isSupplier: userRole === "supplier",
  };
};
