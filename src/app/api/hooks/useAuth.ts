import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthService } from '../services/auth';
import type {
  LoginRequest,
  AuthUser,
  UserRole,
} from '../types/auth';
import type { ApiError } from '../request';

interface UseAuthState {
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: ApiError | null;
  readonly user: AuthUser | null;
  readonly role: UserRole | null;
}

export interface UseAuthReturn extends UseAuthState {
  readonly login: (credentials: LoginRequest) => Promise<boolean>;
  readonly logout: () => Promise<void>;
  readonly checkAuth: () => Promise<boolean>;
  readonly refreshUser: () => Promise<void>;
  readonly clearError: () => void;
  readonly getRole: () => UserRole | null;
  readonly getFieldErrors: () => Record<string, string[]>;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<UseAuthState>(() => ({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    user: AuthService.getUserFromToken(),
    role: AuthService.getRoleFromToken(),
  }));

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const authOk = await AuthService.isAuthenticated()
        ? await checkAuth()
        : false;

      if (mounted) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: authOk,
          user: AuthService.getUserFromToken(),
          role: AuthService.getRoleFromToken(),
        }));
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);


  const scheduleRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      refreshUser();
    }, 300_000);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!AuthService.isAuthenticated()) return;

    //verify if needed

    setState(prev => ({
      ...prev,
      user: AuthService.getUserFromToken(),
      role: AuthService.getRoleFromToken(),
    }));

    scheduleRefresh();
  }, [scheduleRefresh]);

  useEffect(() => {
    if (state.isAuthenticated) {
      checkAuth();
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

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

    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      isLoading: false,
      user: AuthService.getUserFromToken(),
      role: AuthService.getRoleFromToken(),
    }));

    scheduleRefresh();
    return true;
  }, [scheduleRefresh]);

  const logout = useCallback(async () => {
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
      user: AuthService.getUserFromToken(),
      role: AuthService.getRoleFromToken(),
    }));

    scheduleRefresh();
    return true;
  }, [scheduleRefresh]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const getRole = useCallback((): UserRole | null => {
    return AuthService.getRoleFromToken();
  }, []);

  const getFieldErrors = useCallback((): Record<string, string[]> => {
    if (!state.error || !state.error.errors) return {};
    return state.error.errors as Record<string, string[]>;
  }, [state.error]);

  return {
    ...state,
    login,
    logout,
    checkAuth,
    refreshUser,
    clearError,
    getRole,
    getFieldErrors,
  };
};
