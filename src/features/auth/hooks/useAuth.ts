import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthService } from '@/app/api/private/auth/service';
import { ProfileService } from '@/app/api/private/profile/service';
import { User } from '@/app/entities/user';
import { ApiError } from '@/features/api-client/types/core';
import { UserRole } from '@/features/auth/types';
import { LoginRequest } from '@/app/api/private/auth/types';
import { COOKIE_AUTH_NAME, COOKIE_AUTH_TOTP_NAME } from '@/constants';

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
  readonly getProfile: () => Promise<boolean>;
  readonly clearError: () => void;
  readonly getRole: () => UserRole | null;
  readonly getFieldErrors: () => Record<string, string[]>;
  readonly saveToken: (s: string) => void;
  readonly getUsername: () => string;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<UseAuthState>(() => ({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    user: null,
    role: null,
  }));

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshUserRef = useRef<() => void>(() => {});

  const getToken = useCallback((): string | null => Cookies.get(COOKIE_AUTH_NAME) || null, []);

  const isAuthenticated = useCallback((): boolean => !!getToken(), [getToken]);

  const saveToken = useCallback((token: string): void => {
    Cookies.set(COOKIE_AUTH_NAME, token);
  }, []);

  const getRoleFromToken = useCallback((): UserRole | null => {
    try {
      const payload = getToken()?.split('.')?.[1];
      if (!payload) return 'merchant';
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(
        normalized.length + ((4 - (normalized.length % 4)) % 4),
        '=',
      );
      const decoded = JSON.parse(atob(padded)) as unknown;
      const isAdmin =
        typeof decoded === 'object' &&
        decoded !== null &&
        'isa' in decoded &&
        (decoded as { isa?: unknown }).isa === true;
      return isAdmin ? 'admin' : 'merchant';
    } catch {
      return 'merchant';
    }
  }, [getToken]);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      refreshUserRef.current();
    }, 300_000);
  }, []);

  const logout = useCallback((): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    Cookies.remove(COOKIE_AUTH_NAME);
    Cookies.remove(COOKIE_AUTH_TOTP_NAME);

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
    return Promise.resolve();
  }, []);

  const getProfile = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated()) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        role: null,
      }));
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    const response = await ProfileService.get();

    if (!('success' in response) || !response.success) {
      await logout();
      return false;
    }

    const role = getRoleFromToken();
    if (!role) {
      await logout();
      return false;
    }

    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      user: response.data,
      role: role,
    }));

    scheduleRefresh();
    return true;
  }, [getRoleFromToken, isAuthenticated, logout, scheduleRefresh]);

  const checkAuth = useCallback((): Promise<boolean> => {
    if (!isAuthenticated()) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        role: null,
      }));

      return Promise.resolve(false);
    }

    void getProfile();
    return Promise.resolve(true);
  }, [getProfile, isAuthenticated]);

  const refreshUser = useCallback(async (): Promise<void> => {
    await getProfile();
  }, [getProfile]);

  useEffect(() => {
    refreshUserRef.current = () => {
      void refreshUser();
    };
  }, [refreshUser]);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await AuthService.login(credentials, { hasToast: true });
      if (!('success' in response) || !response.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response as ApiError,
        }));
        return false;
      }

      return await getProfile();
    },
    [getProfile],
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const getRole = useCallback((): UserRole | null => {
    return state.role;
  }, [state.role]);

  const getFieldErrors = useCallback((): Record<string, string[]> => {
    if (!state.error || !state.error.errors) return {};
    return state.error.errors;
  }, [state.error]);

  useEffect(() => {
    let mounted = true;

    const init = () => {
      if (!mounted) return;

      if (!isAuthenticated()) {
        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
        }));
        return;
      }
    };

    void init();

    return () => {
      mounted = false;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isAuthenticated]);

  const getUsername = useCallback((): string => {
    return state.user ? state.user.username : 'undefined';
  }, [state.user]);

  return {
    ...state,
    getProfile,
    login,
    logout,
    checkAuth,
    refreshUser,
    clearError,
    getRole,
    getFieldErrors,
    saveToken,
    getUsername,
  };
};
