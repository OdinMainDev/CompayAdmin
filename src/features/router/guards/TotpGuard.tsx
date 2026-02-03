import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthContext } from '@/features/auth/auth-context';

interface TotpGuardProps {
  children: ReactNode;
}

const TotpGuard = ({ children }: TotpGuardProps) => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={'/'} state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default TotpGuard;
