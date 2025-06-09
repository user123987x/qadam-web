import { useState, useEffect } from "react";
import { UserRole, User } from "@/lib/types";
import { mockUsers } from "@/lib/constants";

export const useUserRole = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Check for authentication from localStorage
    const storedUserId =
      localStorage.getItem("authUserId") ||
      localStorage.getItem("currentUserId");

    if (storedUserId) {
      const user = mockUsers.find((u) => u.id === storedUserId);
      if (user) {
        setCurrentUser(user);
        setUserRole(user.role);
      }
    } else {
      // Default to first employer for demo if no user is logged in
      const defaultUser =
        mockUsers.find((u) => u.role === "employer") || mockUsers[0];
      setCurrentUser(defaultUser);
      setUserRole(defaultUser.role);
    }
  }, []);

  const switchUser = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setUserRole(user.role);
      localStorage.setItem("authUserId", user.id);
      localStorage.setItem("authToken", `demo-token-${userId}`);
      localStorage.setItem("currentUserId", user.id);
      localStorage.setItem("currentUserRole", user.role);
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
