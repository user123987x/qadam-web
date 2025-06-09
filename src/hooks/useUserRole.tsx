import { useAuth } from './useAuth';
import { UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/constants';

export const useUserRole = () => {
  const { user: currentUser } = useAuth();
  const userRole = currentUser?.role || null;

  // For demo purposes, allow switching between users
  const switchUser = (userId: string) => {
    const { login } = useAuth();
    login(userId);
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