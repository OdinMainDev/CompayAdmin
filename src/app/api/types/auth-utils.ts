import type { 
    LegacyLoginResponseData,
    AuthUser 
  } from './auth';
  
 
  export const decodeJwtToken = (token: string): { user_id?: number; username?: string; is_admin?: boolean; merchant_id?: number } | null => {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      
      const decoded = JSON.parse(atob(payload));
      return {
        user_id: decoded.user_id,
        username: decoded.username,
        is_admin: decoded.is_admin,
        merchant_id: decoded.merchant_id,
      };
    } catch {
      return null;
    }
  };