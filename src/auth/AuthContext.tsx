import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type UserRole = 'dev' | 'admin';

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
}

interface AuthContextValue extends AuthState {
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const defaultState: AuthState = {
  isAuthenticated: false,
  role: 'admin',
};

const STORAGE_KEY = 'compay-admin-auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    if (typeof window === 'undefined') {
      return defaultState;
    }
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) } as AuthState;
      }
    } catch (error) {
      console.warn('Failed to read auth cache', error);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to persist auth cache', error);
    }
  }, [state]);

  const login = (role: UserRole) => setState({ isAuthenticated: true, role });
  const logout = () => setState({ isAuthenticated: false, role: 'admin' });
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
