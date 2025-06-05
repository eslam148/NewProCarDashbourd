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
  checkAuthFailure
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
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        this.store.dispatch(checkAuthSuccess({ response: parsedUser }));
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        this.store.dispatch(checkAuthFailure());
      }
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
            console.log('Full API Response:', response);

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

            console.log('Login successful:', response.data);
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
        tap(({ response }) => {
          if (response?.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            this.router.navigate(['/dashboard']);
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return of(logoutSuccess());
      })
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutSuccess),
        tap(() => {
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
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            return of(checkAuthSuccess({
              response: parsedUser
            }));
          } catch (error) {
            console.error('Error parsing user data:', error);
            return of(checkAuthFailure());
          }
        }
        return of(checkAuthFailure());
      })
    )
  );
}
