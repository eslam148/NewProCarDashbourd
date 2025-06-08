import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { saveFcmToken, clearFcmToken } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private vapidKey = 'YOUR_VAPID_KEY'; // Replace with your actual VAPID key

  constructor(private store: Store) {}

  /**
   * Initialize FCM and request permission
   */
  async initializeFCM(): Promise<string | null> {
    try {
      // Check if Firebase messaging is available
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push messaging is not supported');
        return null;
      }

      // For now, we'll generate a mock token since Firebase isn't configured
      // In a real app, you would use Firebase SDK here
      const mockToken = this.generateMockFCMToken();
      
      if (mockToken) {
        // Save token to store and localStorage
        this.store.dispatch(saveFcmToken({ fcmToken: mockToken }));
        console.log('FCM token saved:', mockToken);
        return mockToken;
      }

      return null;
    } catch (error) {
      console.error('Error initializing FCM:', error);
      return null;
    }
  }

  /**
   * Get current FCM token from localStorage
   */
  getCurrentToken(): string | null {
    return localStorage.getItem('fcmToken');
  }

  /**
   * Clear FCM token
   */
  clearToken(): void {
    this.store.dispatch(clearFcmToken());
  }

  /**
   * Check if FCM token exists and is valid
   */
  hasValidToken(): boolean {
    const token = this.getCurrentToken();
    const tokenData = localStorage.getItem('fcmTokenData');
    
    if (!token || !tokenData) {
      return false;
    }

    try {
      const data = JSON.parse(tokenData);
      const tokenAge = Date.now() - new Date(data.timestamp).getTime();
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      
      return tokenAge < maxAge;
    } catch {
      return false;
    }
  }

  /**
   * Refresh FCM token if needed
   */
  async refreshTokenIfNeeded(): Promise<string | null> {
    if (!this.hasValidToken()) {
      return await this.initializeFCM();
    }
    return this.getCurrentToken();
  }

  /**
   * Generate a mock FCM token for development
   * In production, replace this with actual Firebase FCM token generation
   */
  private generateMockFCMToken(): string {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 15);
    const deviceInfo = navigator.userAgent.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '');
    
    return `fcm_${timestamp}_${randomPart}_${deviceInfo}`;
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
      }

      if (Notification.permission === 'granted') {
        return true;
      }

      if (Notification.permission === 'denied') {
        console.warn('Notification permission denied');
        return false;
      }

      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Send FCM token to backend (if needed)
   */
  async sendTokenToServer(token: string, userId: string): Promise<boolean> {
    try {
      // Here you would typically send the token to your backend
      // For now, we'll just log it
      console.log('Sending FCM token to server:', { token, userId });
      
      // Mock API call
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('FCM token sent to server successfully');
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('Error sending FCM token to server:', error);
      return false;
    }
  }

  /**
   * Get FCM token data with metadata
   */
  getTokenData(): any {
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
   * Check if FCM is supported in current environment
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }
}
