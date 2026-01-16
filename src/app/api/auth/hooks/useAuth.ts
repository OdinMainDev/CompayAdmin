import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthService } from '../service';
import type {
  LoginRequest,
  UserRole,
} from '../types';
import type { ApiError } from '../../core/request';
import type { User } from '../../users/types';

interface UseAuthState {
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: ApiError | null;
  readonly user: User | null;
  readonly role: UserRole | null;
}

export interface UseAuthReturn extends UseAuthState {
  readonly login: (credentials: LoginRequest) => Promise<boolean>;
  readonly logout: () => Promise<void>;
  readonly checkAuth: () => Promise<boolean>;
  readonly refreshUser: () => Promise<void>;
  readonly getMe: () => Promise<boolean>;
  readonly clearError: () => void;
  readonly getRole: () => UserRole | null;
  readonly getFieldErrors: () => Record<string, string[]>;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<UseAuthState>(() => ({
    isAuthenticated: AuthService.isAuthenticated(),
    isLoading: false,
    error: null,
    user: null,
    role: null,
  }));

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      refreshUser();
    }, 300_000);
  }, []);

  const getMe = useCallback(async (): Promise<boolean> => {
    if (!AuthService.isAuthenticated()) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        role: null,
      }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    const response = await AuthService.getMe();

    if (!('success' in response) || !response.success) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
        error: response as ApiError,
        user: null,
        role: null,
      }));
      return false;
    }

    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      user: response.data,
      role: response.data.is_admin ? 'admin' : 'merchant',
    }));

    scheduleRefresh();
    return true;
  }, [scheduleRefresh]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (!AuthService.isAuthenticated()) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        role: null,
      }));
  
      return false;
    }
  
    // verify token if needed
  
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      role: AuthService.getRoleFromToken(),
    }));
  
    scheduleRefresh();
    return true;
  }, [scheduleRefresh]);
  

  const refreshUser = useCallback(async (): Promise<void> => {
    await getMe();
  }, [getMe]);

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const response = await AuthService.login(credentials, { hasToast: true });

    if (!('success' in response) || !response.success) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: response as ApiError,
      }));
      return false;
    }

    return await getMe();
  }, [getMe]);

  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await AuthService.logout({ hasToast: true });
    } finally {
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: null,
        user: null,
        role: null,
      });

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const getRole = useCallback((): UserRole | null => {
    return state.role;
  }, [state.role]);

  const getFieldErrors = useCallback((): Record<string, string[]> => {
    if (!state.error || !state.error.errors) return {};
    return state.error.errors as Record<string, string[]>;
  }, [state.error]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!mounted) return;

      if (!AuthService.isAuthenticated()) {
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
        }));
        return;
      }
    };

    init();

    return () => {
      mounted = false;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [getMe]);

  return {
    ...state,
    getMe,
    login,
    logout,
    checkAuth,
    refreshUser,
    clearError,
    getRole,
    getFieldErrors,
  };
};
