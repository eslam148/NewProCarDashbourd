import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectAuthResponse } from '../store/auth/auth.selectors';
import { Roles } from '../Enums/Roles.enum';

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
        }
        else{
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('fcmTokenData');
          localStorage.removeItem('token');
          localStorage.removeItem('fcmToken');
          localStorage.removeItem('fcmTokenData');
        }
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
