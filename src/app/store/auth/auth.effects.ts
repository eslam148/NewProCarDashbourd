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
  clearFcmToken
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
      mergeMap(({ phonenumber, password ,deviceToken }) => {
        const loginDto: LoginDto = {
          PhoneNumber: phonenumber,
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
            this.router.navigate(['/dashboard']);
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
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');

          // Clear FCM token on logout
          this.authService.clearFcmToken();

          console.log('Logout success, navigating to login');
          this.router.navigate(['/login']);
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
            // Clear corrupted data
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
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
}
