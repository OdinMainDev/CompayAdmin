import { useState, useCallback } from 'react';
import { UserService } from '../services/user';
import type { ApiError } from '../types/core';
import type { FilterReponse, Merchant, MerchantsSearchResponse, User, UserCreateRequest, UserListRequest, UsersListResponse, UserUpdateRequest } from '../types/user';
import type { IResponseList } from '../../../features/datatable-core/domain/entities/DatatableResponse';

interface UseUsersState {
  readonly users: User[];
  readonly selectedUser: User | null;
  readonly merchants: Merchant[];
  readonly isLoading: boolean;
  readonly error: ApiError | null;
  readonly total: number;
  readonly filtered: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly filters: FilterReponse[];
}

interface UseUsersReturn extends UseUsersState {
  readonly fetchUsers: (params?: UserListRequest) => Promise<IResponseList<User>>;
  readonly fetchUser: (id: number) => Promise<void>;
  readonly createUser: (data: UserCreateRequest) => Promise<boolean>;
  readonly updateUser: (data: UserUpdateRequest) => Promise<boolean>;
  readonly deleteUser: (id: number) => Promise<boolean>;
  readonly searchMerchants: (query: string) => Promise<void>;
  readonly fetchFilters: () => Promise<void>;
  readonly clearError: () => void;
  readonly clearSelectedUser: () => void;
  readonly getFieldErrors: () => Record<string, string[]>; 
}

export const useUsers = (): UseUsersReturn => {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    selectedUser: null,
    merchants: [],
    filters: [],
    isLoading: false,
    error: null,
    total: 0,
    currentPage: 1,
    perPage: 15,
    filtered: 0
  });
    
  const fetchUsers = useCallback(
    async (params?: UserListRequest): Promise<IResponseList<User>> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await UserService.getList(params);

        if (response.success) {
          const users = response.data.data;
          const total = response.data.recordsTotal ?? response.data.total ?? 0;
          const filtered = response.data.recordsFiltered ?? total;

          setState(prev => ({
            ...prev,
            users,
            total,
            perPage: response.data.per_page ?? 10,
            currentPage: response.data.current_page ?? 1,
            isLoading: false,
          }));

          return {
            success: true,
            data: {
              data: users,
              recordsTotal: total,
              recordsFiltered: filtered,
              recordsCount: users.length,
            },
          };
        } else {
          const error = response as ApiError;
          setState(prev => ({ ...prev, error, isLoading: false }));

          return {
            success: false,
            data: {
              data: [],
              recordsTotal: 0,
              recordsFiltered: 0,
              recordsCount: 0,
            },
          };
        }
      } catch (err) {
        setState(prev => ({ ...prev, error: err as ApiError, isLoading: false }));
        return {
          success: false,
          data: {
            data: [],
            recordsTotal: 0,
            recordsFiltered: 0,
            recordsCount: 0,
          },
        };
      }
    },
    []
  );

  
  const fetchUser = useCallback(async (id: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const response = await UserService.getById(id);
    
    if ('success' in response && response.success) {
      setState(prev => ({
        ...prev,
        selectedUser: response.data,
        isLoading: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        error: response as ApiError,
        isLoading: false,
      }));
    }
  }, []);

  const createUser = useCallback(async (data: UserCreateRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const response = await UserService.create(data);
    
    if ('success' in response && response.success) {
      setState(prev => ({ ...prev, isLoading: false }));
      await fetchUsers(); 
      return true;
    } else {
      setState(prev => ({
        ...prev,
        error: response as ApiError,
        isLoading: false,
      }));
      return false;
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (data: UserUpdateRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const response = await UserService.update(data);
    
    if ('success' in response && response.success) {
      setState(prev => ({
        ...prev,
        selectedUser: response.data,
        isLoading: false,
      }));
      await fetchUsers(); 
      return true;
    } else {
      setState(prev => ({
        ...prev,
        error: response as ApiError,
        isLoading: false,
      }));
      return false;
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const response = await UserService.delete(id);
    
    if ('success' in response && response.success) {
      setState(prev => ({ ...prev, isLoading: false }));
      await fetchUsers();
      return true;
    } else {
      setState(prev => ({
        ...prev,
        error: response as ApiError,
        isLoading: false,
      }));
      return false;
    }
  }, [fetchUsers]);

  const searchMerchants = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const response = await UserService.searchMerchants(query);
    
    if ('success' in response && response.success) {
      setState(prev => ({
        ...prev,
        merchants: (response as MerchantsSearchResponse).data,
        isLoading: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        error: response as ApiError,
        isLoading: false,
      }));
    }
  }, []);

  const fetchFilters = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const response = await UserService.getFilters();
    
    if ('success' in response && response.success) {
      setState(prev => ({
        ...prev,
        filters: response.data,
        isLoading: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        error: response as ApiError,
        isLoading: false,
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearSelectedUser = useCallback(() => {
    setState(prev => ({ ...prev, selectedUser: null }));
  }, []);
  const getFieldErrors = useCallback((): Record<string, string[]> => {
    if (!state.error || !state.error.errors) return {};
    return state.error.errors as Record<string, string[]>; 
  }, [state.error]);

  return {
    ...state,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    searchMerchants,
    fetchFilters,
    clearError,
    clearSelectedUser,
    getFieldErrors 
  };
};