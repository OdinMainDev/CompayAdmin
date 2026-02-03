import { useEffect } from 'react';
import { useAuthContext } from '@/features/auth/auth-context';

export default function Logout() {
  const { logout } = useAuthContext();

  useEffect(() => {
    void logout();
  }, [logout]);

  return <>LOGOUT</>;
}
