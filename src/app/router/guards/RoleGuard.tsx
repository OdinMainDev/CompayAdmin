import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/useAuth';
import { useRole } from '../../../auth/useRole';
import NotFound from '../../../pages/errors/NotFound';
import type { ReactNode } from 'react';

export interface GuardProps {
    children: ReactNode;
    roles?: string[];
    permissions?: string[];
}

export type GuardComponent = React.ComponentType<GuardProps>;

const RoleGuard = ({ children, roles }: GuardProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const role = useRole();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default RoleGuard;