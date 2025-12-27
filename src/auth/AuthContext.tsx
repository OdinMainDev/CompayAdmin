import { type ReactNode, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { COOKIE_AUTH_NAME, COOKIE_AUTH_TOTP_NAME } from '../constants';
import { AuthContext, defaultAuthState, getRoleFromToken, type AuthState, type UserRole } from './authState';
import { type EntityUser } from '../app/entities/user';
import { getMe } from '../app/api/user/get_me';
import { useCallback } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    const token = Cookies.get(COOKIE_AUTH_NAME);
    if (token) {
      return { isAuthenticated: true, role: getRoleFromToken(token) };
    }
    return defaultAuthState;
  });
  const [user, setUser] = useState<EntityUser | undefined>();

  const refreshUser = useCallback(async () => {
    const response = await getMe();
    if ('success' in response && response.success) {
      setUser(response.data);
      return response.data;
    }
    setUser(undefined);
    return null;
  }, []);

  const login = (token: string) => setState({ isAuthenticated: true, role: getRoleFromToken(token) });
  const logout = () => {
    Cookies.remove(COOKIE_AUTH_NAME);
    Cookies.remove(COOKIE_AUTH_TOTP_NAME);
    setState({ isAuthenticated: false, role: 'merchant' });
    setUser(undefined);
  };
  const switchRole = (role: UserRole) => setState((prev) => ({ ...prev, role }));

  const value = useMemo(
    () => ({
      ...state,
      user,
      refreshUser,
      setUser,
      login,
      logout,
      switchRole,
    }),
    [state, user, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
