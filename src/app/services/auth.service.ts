import { LoginResponse } from './../Models/Responses/LoginResponse';
import { LoginDto } from './../Models/DTOs/LoginDto';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';
import { GenericResponse } from '../Models/Responses/GenericResponse';
import { FcmService } from './fcm.service';

interface JWTPayload {
  UserId: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);

  constructor(
    private http: HttpClient,
    private fcmService: FcmService
  ) { }

  Login(loginDto: LoginDto): Observable<GenericResponse<LoginResponse>> {
    return this.http.post<GenericResponse<LoginResponse>>(`${this.apiUrl}/api/Auth/Login`, loginDto);
  }

  Logout(): Observable<GenericResponse<any>> {
    const token: string = this.getToken() || '';
    const fcmToken = this.getFcmToken();
    return this.http.post<GenericResponse<any>>(`${this.apiUrl}/api/Auth/Logout`,{
      token: fcmToken
    },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
  }

  /**
   * Get the stored JWT token
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      return payload.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }

  /**
   * Decode JWT token
   */
  private decodeToken(token: string): JWTPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Get current user information from JWT token
   */
  getCurrentUser(): JWTPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = this.decodeToken(token);
      if (payload.exp > Date.now() / 1000) {
        return payload;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.UserId : null;
  }

  /**
   * Get current user role
   */
  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Store authentication data
   */
  storeAuthData(token: string, user?: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  }

  /**
   * Initialize FCM token after successful login
   */
  async initializeFcmAfterLogin(): Promise<void> {
    try {
      const fcmToken = await this.fcmService.initializeFCM();
      if (fcmToken) {
        const userId = this.getCurrentUserId();
        if (userId) {
          await this.fcmService.sendTokenToServer(fcmToken, userId.toString());
        }
      }
    } catch (error) {
      console.error('Error initializing FCM after login:', error);
    }
  }

  /**
   * Get FCM token
   */
  getFcmToken(): string | null {
    return this.fcmService.getCurrentToken();
  }

  /**
   * Clear FCM token on logout
   */
  clearFcmToken(): void {
    this.fcmService.clearToken();
  }

  /**
   * Check if FCM is available and has valid token
   */
  hasFcmToken(): boolean {
    return this.fcmService.hasValidToken();
  }

  /**
   * Refresh FCM token if needed
   */
  async refreshFcmToken(): Promise<string | null> {
    return await this.fcmService.refreshTokenIfNeeded();
  }
}
