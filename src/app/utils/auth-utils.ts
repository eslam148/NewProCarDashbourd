/**
 * Utility functions for authentication data management
 * Provides consistent auth data clearing across the application
 */

/**
 * Authentication-related localStorage keys
 */
export const AUTH_STORAGE_KEYS = [
  'token',
  'authToken',
  'user',
  'fcmToken',
  'fcmTokenData'
] as const;

/**
 * Clear only authentication-related data from localStorage
 * Preserves non-auth data like theme and language preferences
 */
export function clearAuthData(): void {
  AUTH_STORAGE_KEYS.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('Auth data cleared from localStorage');
}

/**
 * Check if any auth data exists in localStorage
 */
export function hasAuthData(): boolean {
  return AUTH_STORAGE_KEYS.some(key => localStorage.getItem(key) !== null);
}

/**
 * Get all current auth data from localStorage
 */
export function getAuthData(): Record<string, string | null> {
  const authData: Record<string, string | null> = {};
  
  AUTH_STORAGE_KEYS.forEach(key => {
    authData[key] = localStorage.getItem(key);
  });

  return authData;
}