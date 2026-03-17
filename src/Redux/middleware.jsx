import { isRejectedWithValue } from '@reduxjs/toolkit';
import { logout } from './auth';

/**
 * Intercepts all RTK Query responses.
 * If a 401 (Unauthorized) is detected, it forces a logout.
 */
export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    // action.payload contains the server response
    if (action.payload?.status === 401) {
      console.error("Session Expired: Redirecting to login...");
      
      // 1. Clear the Redux auth state
      api.dispatch(logout());
      
      // 2. Force browser redirect to login
      window.location.href = "/"; 
    }
  }

  return next(action);
};