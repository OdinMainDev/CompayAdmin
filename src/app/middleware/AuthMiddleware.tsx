import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

const AuthMiddleware = () => {
  const { refreshUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    void refreshUser();
  }, [location.pathname, refreshUser]);

  return <Outlet />;
};

export default AuthMiddleware;
