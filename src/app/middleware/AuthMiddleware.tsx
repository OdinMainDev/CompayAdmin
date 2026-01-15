import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../api/auth/auth-context';

const AuthMiddleware = () => {
  const { refreshUser } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    void refreshUser();
  }, [location.pathname, refreshUser]);

  return <Outlet />;
};

export default AuthMiddleware;
