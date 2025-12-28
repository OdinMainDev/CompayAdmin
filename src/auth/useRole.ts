import { useMemo } from 'react';
import Cookies from 'js-cookie';
import { getRoleFromToken } from './authState';
import { COOKIE_AUTH_NAME } from '../constants';

export const useRole = () => {
  return useMemo(() => {
    const token = Cookies.get(COOKIE_AUTH_NAME);
    return getRoleFromToken(token);
  }, []);
};