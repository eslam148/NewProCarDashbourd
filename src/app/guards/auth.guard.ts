import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take, delay } from 'rxjs';
import { selectAuthResponse } from '../store/auth/auth.selectors';
import { Roles } from '../Enums/Roles.enum';
import { clearAuthStore } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectAuthResponse).pipe(
      take(1),
      map(response => {
        console.log("Auth guard: Checking auth response", response);
        console.log("Auth guard: Current URL", this.router.url);

        if (response?.token && response?.role === Roles.Admin) {
          console.log("Auth guard: User authenticated, allowing access");
          return true;
        } else {
          console.log("Auth guard: User not authenticated");

          // Check if we're already on login page to prevent redirect loops
          if (this.router.url === '/login') {
            console.log("Auth guard: Already on login page, allowing access");
            return true;
          }

          // Only clear auth store if we actually have stale data
          const hasLocalToken = localStorage.getItem('token') || localStorage.getItem('authToken');
          const hasLocalUserData = localStorage.getItem('user');

          if (hasLocalToken || hasLocalUserData) {
            console.log('Auth guard: Found stale auth data, clearing it');
            this.store.dispatch(clearAuthStore());
          }

          console.log("Auth guard: Redirecting to login");
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }


}
