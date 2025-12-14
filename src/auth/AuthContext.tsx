import { type ReactNode, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { COOKIE_AUTH_NAME } from '../constants';
import { AuthContext, defaultAuthState, getRoleFromToken, type AuthState, type UserRole } from './authState';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    const token = Cookies.get(COOKIE_AUTH_NAME);
    if (token) {
      return { isAuthenticated: true, role: getRoleFromToken(token) };
    }
    return defaultAuthState;
  });

  const login = (token: string) => setState({ isAuthenticated: true, role: getRoleFromToken(token) });
  const logout = () => {
    Cookies.remove(COOKIE_AUTH_NAME);
    setState({ isAuthenticated: false, role: 'merchant' });
  };
  const switchRole = (role: UserRole) => setState((prev) => ({ ...prev, role }));

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      switchRole,
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
