import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/features/auth/auth-context';
import { GuardProps } from './types';

const MerchantGuard = ({ children }: GuardProps) => {
  const { getRole, isAuthenticated } = useAuthContext();
  const location = useLocation();

  const role = getRole();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (role && role != 'merchant') {
    return <Navigate to="/404/merchant" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default MerchantGuard;
