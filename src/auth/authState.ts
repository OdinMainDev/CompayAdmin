import { createContext } from 'react';

export type UserRole = 'admin' | 'merchant';

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
}

export interface AuthContextValue extends AuthState {
  user?: import('../entities/user').EntityUser;
  refreshUser: () => Promise<import('../entities/user').EntityUser | null>;
  setUser: (user?: import('../entities/user').EntityUser) => void;
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
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const decoded = JSON.parse(atob(padded));
    return decoded?.isa === true ? 'admin' : 'merchant';
  } catch {
    return 'merchant';
  }
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
