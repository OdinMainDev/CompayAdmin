import { createContext } from 'react';

export type UserRole = 'admin' | 'merchant';

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
}

export interface AuthContextValue extends AuthState {
  login: (token: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const defaultAuthState: AuthState = {
  isAuthenticated: false,
  role: 'merchant',
};

export const getRoleFromToken = (token?: string): UserRole => {
  try {
    const payload = token?.split('.')?.[1];
    if (!payload) return 'merchant';
    const decoded = JSON.parse(atob(payload));
    return decoded?.isa === true ? 'admin' : 'merchant';
  } catch {
    return 'merchant';
  }
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
