import { createContext, useContext } from 'react';
import type { UseAuthReturn } from './hooks/useAuth';

export const AuthContext = createContext<UseAuthReturn | null>(null);

export const useAuthContext = (): UseAuthReturn => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return ctx;
};

export const useAuthOptional = () => useContext(AuthContext);