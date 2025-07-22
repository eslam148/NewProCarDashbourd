import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFcmToken } from '../store/auth/auth.selectors';
import { saveFcmToken, clearFcmToken } from '../store/auth/auth.actions';
import { Observable } from 'rxjs';
import { clearAuthData } from '../utils/auth-utils';

@Injectable({
  providedIn: 'root'
})
export class FcmStorageService {

  constructor(private store: Store) {}

  /**
   * Save FCM token to both store and localStorage
   */
  saveFcmToken(token: string): void {
    // Save to store
    this.store.dispatch(saveFcmToken({ fcmToken: token }));

    // Save to localStorage with metadata
    const tokenData = {
      token: token,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId()
    };

    localStorage.setItem('fcmToken', token);
    localStorage.setItem('fcmTokenData', JSON.stringify(tokenData));

    console.log('FCM token saved to store and localStorage:', token);
  }

  /**
   * Get FCM token from store (reactive)
   */
  getFcmToken$(): Observable<string | null> {
    return this.store.select(selectFcmToken);
  }

  /**
   * Get FCM token from localStorage (synchronous)
   */
  getFcmTokenFromStorage(): string | null {
    return localStorage.getItem('fcmToken');
  }

  /**
   * Get FCM token data with metadata
   */
  getFcmTokenData(): any {
    const tokenData = localStorage.getItem('fcmTokenData');
    if (tokenData) {
      try {
        return JSON.parse(tokenData);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Clear FCM token from both store and localStorage
   */
  clearFcmToken(): void {
    // Clear from store
    this.store.dispatch(clearFcmToken());

    // Clear only FCM-related items from localStorage
    localStorage.removeItem('fcmToken');
    localStorage.removeItem('fcmTokenData');

    console.log('FCM token cleared from store and localStorage');
  }

  /**
   * Clear all auth data including FCM tokens
   */
  clearAllAuthData(): void {
    // Clear from store
    this.store.dispatch(clearFcmToken());

    // Clear all auth data
    clearAuthData();

    console.log('All auth data cleared');
  }

  /**
   * Check if FCM token exists and is valid
   */
  hasValidFcmToken(): boolean {
    const token = this.getFcmTokenFromStorage();
    const tokenData = this.getFcmTokenData();

    if (!token || !tokenData) {
      return false;
    }

    try {
      const tokenAge = Date.now() - new Date(tokenData.timestamp).getTime();
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

      return tokenAge < maxAge;
    } catch {
      return false;
    }
  }

  /**
   * Update FCM token if it has changed
   */
  updateFcmTokenIfChanged(newToken: string): boolean {
    const currentToken = this.getFcmTokenFromStorage();

    if (currentToken !== newToken) {
      this.saveFcmToken(newToken);
      return true;
    }

    return false;
  }

  /**
   * Get current user ID from localStorage
   */
  private getCurrentUserId(): string | null {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user?.id || user?.UserId || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Sync FCM token between store and localStorage
   */
  syncFcmToken(): void {
    const storageToken = this.getFcmTokenFromStorage();

    if (storageToken) {
      // If token exists in localStorage but not in store, save to store
      this.store.dispatch(saveFcmToken({ fcmToken: storageToken }));
    }
  }

  /**
   * Get FCM token info for debugging
   */
  getFcmTokenInfo(): any {
    const token = this.getFcmTokenFromStorage();
    const tokenData = this.getFcmTokenData();

    return {
      hasToken: !!token,
      token: token ? token.substring(0, 20) + '...' : null,
      isValid: this.hasValidFcmToken(),
      timestamp: tokenData?.timestamp,
      userId: tokenData?.userId,
      age: tokenData?.timestamp ?
        Math.floor((Date.now() - new Date(tokenData.timestamp).getTime()) / (1000 * 60 * 60 * 24)) + ' days' :
        null
    };
  }

  /**
   * Export FCM token data for backup/sync
   */
  exportFcmTokenData(): any {
    return {
      token: this.getFcmTokenFromStorage(),
      data: this.getFcmTokenData(),
      isValid: this.hasValidFcmToken()
    };
  }

  /**
   * Import FCM token data from backup/sync
   */
  importFcmTokenData(tokenData: any): boolean {
    try {
      if (tokenData?.token) {
        this.saveFcmToken(tokenData.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
