import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
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
        console.log("response from auth guard", response);
        if (response?.token && response?.role === Roles.Admin) {
          return true;
        } else {
          // Only clear auth store if we actually have stale data
          // This prevents unnecessary clearing when the interceptor has already handled it
          const hasLocalToken = localStorage.getItem('token') || localStorage.getItem('authToken');
          const hasLocalUserData = localStorage.getItem('user');

          if (hasLocalToken || hasLocalUserData) {
            console.log('Auth guard: Clearing stale auth data');
            this.store.dispatch(clearAuthStore());
          }

          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }


}
