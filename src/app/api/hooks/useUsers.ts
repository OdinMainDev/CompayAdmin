import { useState, useCallback } from 'react';
import { UserService } from '../services/user';
import type { Merchant, User } from '../types/entities';
import type { ApiError } from '../types/core';
import type { MerchantsSearchResponse, UserCreateRequest, UserListRequest, UserUpdateRequest } from '../types/user';


interface UseUsersState {
  readonly users: User[];
  readonly selectedUser: User | null;
  readonly merchants: Merchant[];
  readonly isLoading: boolean;
  readonly error: ApiError | null;
  readonly total: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly filters: any[];
}

interface UseUsersReturn extends UseUsersState {
  readonly fetchUsers: (params?: UserListRequest) => Promise<void>;
  readonly fetchUser: (id: number) => Promise<void>;
  readonly createUser: (data: UserCreateRequest) => Promise<boolean>;
  readonly updateUser: (data: UserUpdateRequest) => Promise<boolean>;
  readonly deleteUser: (id: number) => Promise<boolean>;
  readonly searchMerchants: (query: string) => Promise<void>;
  readonly fetchFilters: () => Promise<void>;
  readonly clearError: () => void;
  readonly clearSelectedUser: () => void;
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
  });

  const fetchUsers = useCallback(async (params: UserListRequest = {}) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const response = await UserService.getList(params);
    
    if ('success' in response && response.success) {
      setState(prev => ({
        ...prev,
        users: response.data.data,
        total: response.data.recordsTotal || response.data.total || 0,
        perPage: response.data.per_page || 15,
        currentPage: response.data.current_page || 1,
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
    console.log(response);
    
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
  };
};