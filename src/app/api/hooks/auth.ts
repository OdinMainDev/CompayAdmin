import { useCallback, useState, useEffect, useRef } from 'react';
import { AuthService } from '../services/auth';
import { isApiError } from '../types/utils';
import { mapToAuthError } from '../types/auth-utils';
import type { 
  LoginRequest, 
  LoginResponse, 
  TotpRequest, 
  TotpResponse,
  AuthError,
  AuthUser,
  UserRole 
} from '../types/auth';

interface UseAuthState {
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: AuthError | null;
  readonly user: AuthUser | null;
  readonly role: UserRole | null;
}

interface UseAuthReturn extends UseAuthState {
  readonly login: (credentials: LoginRequest) => Promise<LoginResponse | AuthError>;
  readonly verifyTotp: (code: string) => Promise<TotpResponse | AuthError>;
  readonly logout: () => Promise<void>;
  readonly checkAuth: () => Promise<boolean>;
  readonly clearError: () => void;
  readonly refreshUser: () => Promise<void>;
  readonly getRole: () => UserRole | null;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<UseAuthState>(() => {
    const user = AuthService.getUserFromToken();
    const role = AuthService.getRoleFromToken();
    
    return {
      isAuthenticated: AuthService.isAuthenticated(),
      isLoading: false,
      error: null,
      user,
      role,
    };
  });

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      refreshUser();
    }, 300000);
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    if (!AuthService.isAuthenticated()) return;

    const result = await AuthService.verifyToken({ hasToast: false });

    if (isApiError(result)) {
      setState(prev => ({
        ...prev,
        user: null,
        role: null,
      }));
      return;
    }

    const user = result.data.user || AuthService.getUserFromToken();
    const role = AuthService.getRoleFromToken();

    setState(prev => ({
      ...prev,
      user,
      role,
    }));

    if (state.isAuthenticated) {
      scheduleRefresh();
    }
  }, [state.isAuthenticated, scheduleRefresh]);

  useEffect(() => {
    const verifyAuth = async () => {
      if (state.isAuthenticated) {
        await checkAuth();
      }
    };

    verifyAuth();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const login = useCallback(async (
    credentials: LoginRequest
  ): Promise<LoginResponse | AuthError> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const result = await AuthService.login(credentials, { hasToast: true });

    if (isApiError(result)) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: result,
        isAuthenticated: false,
        user: null,
        role: null,
      }));
      return result;
    }

    const user = result.data.user;
    const role = AuthService.getRoleFromToken();

    setState({
      isAuthenticated: true,
      isLoading: false,
      error: null,
      user: user || null,
      role,
    });

    scheduleRefresh();

    return result;
  }, [scheduleRefresh]);

  const verifyTotp = useCallback(async (
    code: string
  ): Promise<TotpResponse | AuthError> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const result = await AuthService.verifyTotp(code, { hasToast: true });

    if (isApiError(result)) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: result,
        isAuthenticated: false,
        user: null,
        role: null,
      }));
      return result;
    }

    const role = AuthService.getRoleFromToken();

    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      role,
    }));

    scheduleRefresh();

    return result;
  }, [scheduleRefresh]);

  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await AuthService.logout({ hasToast: true });
    } catch {
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
      setState(prev => ({ ...prev, isAuthenticated: false, user: null, role: null }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    const result = await AuthService.verifyToken({ hasToast: false });

    if (isApiError(result)) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: result,
        user: null,
        role: null,
      });
      return false;
    }

    const user = result.data.user || AuthService.getUserFromToken();
    const role = AuthService.getRoleFromToken();

    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      user,
      role,
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

  return {
    ...state,
    login,
    verifyTotp,
    logout,
    checkAuth,
    clearError,
    refreshUser,
    getRole,
  };
};

export const useRequireAuth = (redirectTo = '/login'): void => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated && !isLoading) {
        const authenticated = await checkAuth();
        if (!authenticated && typeof window !== 'undefined') {
          window.location.href = redirectTo;
        }
      }
    };

    verifyAuth();
  }, [isAuthenticated, isLoading, checkAuth, redirectTo]);
};

export const usePermissions = () => {
  const { user, role } = useAuth();

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    return user.is_admin;
  }, [user]);

  const isMerchantUser = useCallback((): boolean => {
    return !!user && !user.is_admin && user.merchant_id !== null;
  }, [user]);

  const getMerchantId = useCallback((): number | null => {
    return user?.merchant_id ?? null;
  }, [user]);

  return {
    hasPermission,
    isMerchantUser,
    getMerchantId,
    isAdmin: user?.is_admin ?? false,
    userId: user?.id ?? null,
    role,
  };
};