import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/features/auth/auth-context';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // TODO: need an additional variable to indicate if 2FA check is required at this moment
  if (user && user.is_twofa_enabled) {
    return <Navigate to="/auth/2fa" />;
  }
  return <>{children}</>;
};

export default AuthGuard;
