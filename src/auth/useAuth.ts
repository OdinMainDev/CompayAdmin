import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './authState';

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

export const useAuthOptional = () => useContext(AuthContext);
