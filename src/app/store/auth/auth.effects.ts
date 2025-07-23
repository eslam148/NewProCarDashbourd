import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDto } from '../../Models/DTOs/LoginDto';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  checkAuth,
  checkAuthSuccess,
  checkAuthFailure,
  saveFcmToken,
  clearFcmToken,
  clearAuthStore
} from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {
    // Check auth state on app initialization
    this.checkStoredAuth();
  }

  private checkStoredAuth() {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    console.log('Checking stored auth:', { hasToken: !!token, hasUserData: !!userData });

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        this.store.dispatch(checkAuthSuccess({ response: parsedUser }));
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.store.dispatch(checkAuthFailure());
      }
    } else {
      this.store.dispatch(checkAuthFailure());
    }
  }



  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(({ Email, password ,deviceToken }) => {
        const loginDto: LoginDto = {
          Email: Email,
          Password: password,
          deviceToken: deviceToken
        };
        return this.authService.Login(loginDto).pipe(
          map(response => {
            // Check if response indicates an error (status = 1 usually means error)
            if (response?.status === 1) {
              // This is an error response, throw it to be caught by catchError
              throw response;
            }

            // Check for successful response with valid data
            if (!response?.data) {
              throw new Error('Invalid response format');
            }

            // Check if token is null in successful response (invalid credentials)
            if (response.data.token === null) {
              throw {
                status: 1,
                message: response.message || 'Phone number or password is wrong.',
                data: response.data
              };
            }

            return loginSuccess({
              response: response.data
            });
          }),
          catchError(error => {
            console.error('Login error:', error);

            // Handle API error responses
            if (error?.status === 1) {
              return of(loginFailure({
                error: error
              }));
            }

            // Handle HTTP errors
            return of(loginFailure({
              error: error?.error || error?.message || 'An error occurred during login'
            }));
          })
        );
      })
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(async ({ response }) => {
          if (response?.token) {
            // Store auth data
            localStorage.setItem('token', response.token);
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response));

            // Initialize FCM token after successful login
            try {
              await this.authService.initializeFcmAfterLogin();
            } catch (error) {
              console.error('Error initializing FCM after login:', error);
            }

            // Navigate to dashboard
            this.router.navigate(['/profile']);
          } else {
            console.error('No token in response:', response);
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => console.log('Logout action triggered')),
      mergeMap(() => {
        console.log('Clearing auth data');

        // Clear local storage immediately




        // Call logout API
        return this.authService.Logout().pipe(
          map((response: any) => {
            console.log('Logout API response:', response);
            return logoutSuccess();
          }),
          catchError((error: any) => {
            console.error('Logout API error:', error);
            // Even if API fails, we still consider logout successful locally
            return of(logoutSuccess());
          })
        );
      })
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutSuccess),
        tap(() => {
          console.log('Logout success, clearing auth store - redirect will be handled by clearAuthStore effect');

          // Dispatch clear auth store to ensure complete cleanup
          // The clearAuthStore effect will handle the redirect to login
          this.store.dispatch(clearAuthStore());
        })
      ),
    { dispatch: false }
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkAuth),
      mergeMap(() => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            return of(checkAuthSuccess({
              response: parsedUser
            }));
          } catch (error) {
            console.error('Error parsing user data:', error);
            // Clear corrupted auth data
            this.clearAuthData();
            return of(checkAuthFailure());
          }
        }

        console.log('Auth check failed - no valid data');
        return of(checkAuthFailure());
      })
    )
  );

  // Save FCM Token Effect
  saveFcmToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(saveFcmToken),
        tap(({ fcmToken }) => {
          // Save FCM token to localStorage
          localStorage.setItem('fcmToken', fcmToken);

          // Also save it with a timestamp for tracking
          const tokenData = {
            token: fcmToken,
            timestamp: new Date().toISOString(),
            userId: this.getCurrentUserId()
          };
          localStorage.setItem('fcmTokenData', JSON.stringify(tokenData));
        })
      ),
    { dispatch: false }
  );

  // Clear FCM Token Effect
  clearFcmToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(clearFcmToken),
        tap(() => {
          // Remove FCM token from localStorage
          localStorage.removeItem('fcmToken');
          localStorage.removeItem('fcmTokenData');
        })
      ),
    { dispatch: false }
  );

  private getCurrentUserId(): string | null {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user?.id || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  clearAuthStore$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(clearAuthStore),
        tap(() => {
          console.log('Clearing auth store and localStorage');
          // Clear only auth-related data from localStorage
          this.clearAuthData();

          // Clear FCM token
          this.authService.clearFcmToken();

          console.log('Auth data cleared - no redirect from effect, let auth guard handle it');
        })
      ),
    { dispatch: false }
  );

  /**
   * Clear only authentication-related data from localStorage
   * Preserves non-auth data like theme and language preferences
   */
  private clearAuthData(): void {
    const authKeys = [
      'token',
      'authToken',
      'user',
      'fcmToken',
      'fcmTokenData'
    ];

    authKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('Auth data cleared from effects');
  }
}
