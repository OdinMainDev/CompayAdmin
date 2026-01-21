import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthContext } from '@/features/auth/auth-context';

export interface GuardProps {
    children: ReactNode;
    roles?: string[];
    permissions?: string[];
}

export type GuardComponent = React.ComponentType<GuardProps>;

const RoleGuard = ({ children, roles }: GuardProps) => {
  const { getRole, isAuthenticated } = useAuthContext();
  const location = useLocation();

  const role = getRole();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (role && roles && roles.length > 0 && !roles.includes(role)) {
    return  <Navigate to="/404" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;