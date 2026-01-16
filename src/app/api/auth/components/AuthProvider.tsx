import { useEffect, useMemo, type ReactNode } from 'react';
import { AuthContext } from '../auth-context';
import { useAuth } from '../hooks/useAuth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();

  useEffect(() => {
    auth.checkAuth();
  }, []);

  const value = useMemo(() => ({ ...auth }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
