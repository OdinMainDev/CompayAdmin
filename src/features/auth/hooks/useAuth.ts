import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthService } from '@/app/api/auth/service';
import { ProfileService } from '@/app/api/profile/service';
import { User } from '@/app/entities/user';
import { ApiError } from '@/features/api-client/types/core';
import { UserRole } from '@/features/auth/types';
import { LoginRequest } from '@/app/api/auth/types';
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
  readonly getMe: () => Promise<boolean>;
  readonly clearError: () => void;
  readonly getRole: () => UserRole | null;
  readonly getFieldErrors: () => Record<string, string[]>;
  saveToken: (s: string) => void;
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

  const getToken = (): string | null => {
    return Cookies.get(COOKIE_AUTH_NAME) || null;
  };

  const isAuthenticated = (): boolean => {
    return !!getToken();
  };

  const saveToken = (token: string): void => {
    Cookies.set(COOKIE_AUTH_NAME, token);
  };

  const getRoleFromToken = (): UserRole | null => {
    try {
      const payload = getToken()?.split(".")?.[1];
      if (!payload) return "merchant";
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(
        normalized.length + ((4 - (normalized.length % 4)) % 4),
        "="
      );
      const decoded = JSON.parse(atob(padded));
      return decoded?.isa === true ? "admin" : "merchant";
    } catch {
      return "merchant";
    }
  }

  const scheduleRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      refreshUser();
    }, 300_000);
  }, []);

  const getMe = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated()) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        role: null,
      }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    const response = await ProfileService.getMe();

    if (!('success' in response) || !response.success) {
      logout();
      return false;
    }

    const role = getRoleFromToken();
    if(!role){
      logout();
      return false;
    }

    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      user: response.data,
      role: role,
    }));

    scheduleRefresh();
    return true;
  }, [scheduleRefresh]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated()) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        role: null,
      }));
  
      return false;
    }
  
    getMe();
    return true;
  }, []);
  

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

      if (!isAuthenticated()) {
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
    saveToken,
  };
};
