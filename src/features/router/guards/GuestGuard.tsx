import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthContext } from '@/features/auth/auth-context';

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated, getRole } = useAuthContext();
  const location = useLocation();

  if (isAuthenticated) {
    const role = getRole();

    const redirectTo =
      (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname || '/dashboard';

    const regirestUrl = role === 'admin' ? redirectTo : '/dashboard';

    return <Navigate to={regirestUrl} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default GuestGuard;