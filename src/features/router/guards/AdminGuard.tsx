import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/features/auth/auth-context';
import { GuardProps } from './types';

const AdminGuard = ({ children }: GuardProps) => {
  const { getRole, isAuthenticated } = useAuthContext();
  const location = useLocation();

  const role = getRole();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (role && role != 'admin') {
    return <Navigate to="/404" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
