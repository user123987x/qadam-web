import { useContext } from 'react';
import { useAuth } from './useAuth';
import { UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/constants';

export const useUserRole = () => {
  let currentUser = null;
  let userRole = null;
  let login = () => {};

  try {
    const auth = useAuth();
    currentUser = auth.user;
    userRole = auth.user?.role || null;
    login = auth.login;
  } catch (error) {
    // If useAuth fails (not within AuthProvider), use fallback
    console.warn('useUserRole: useAuth hook not available, using fallback');
  }

  // For demo purposes, allow switching between users
  const switchUser = (userId: string) => {
    try {
      login(userId);
    } catch (error) {
      console.warn('switchUser failed:', error);
    }
  };

  const switchRole = (role: UserRole) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      switchUser(user.id);
    }
  };

  return {
    currentUser,
    userRole,
    switchUser,
    switchRole,
    isEmployer: userRole === 'employer',
    isWorker: userRole === 'worker',
    isSupplier: userRole === 'supplier'
  };
};
};