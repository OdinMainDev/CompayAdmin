import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../api/auth/auth-context';
import type { ReactNode } from 'react';

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated, getRole } = useAuthContext();
  const location = useLocation();

  if (isAuthenticated) {
    const role = getRole();

    const redirectTo =
      (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname || '/panel/dashboard';

    const regirestUrl = role === 'admin' ? redirectTo : '/panel/dashboard';

    return <Navigate to={regirestUrl} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default GuestGuard;