import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, take, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentLanguage } from '../store/translation/translation.selectors';
import { clearAuthStore } from '../store/auth/auth.actions';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const store = inject(Store);

  // Get token from localStorage
  const token = localStorage.getItem('token');
  if(!token){
              router.navigate(['/login'], { replaceUrl: true });

  }
  // Get current language and map to locale
  const currentLanguage = getCurrentLanguageSync();
  const acceptLanguage = mapLanguageToLocale(currentLanguage);

  // Prepare headers object
  const headers: { [key: string]: string } = {
    'Accept-Language': acceptLanguage
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Clone the request and add headers
  request = request.clone({
    setHeaders: headers
  });

  // Handle the response
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error:', error);

      // Handle unauthorized error (401)
      if (error.status === 401) {
        console.log('401 error: Clearing auth store and redirecting to login');

        // Dispatch clear auth store action - this will clear both store state and localStorage
        store.dispatch(clearAuthStore());

        // Use setTimeout to allow store state to update before redirecting
        // This prevents the race condition that causes infinite redirect loops
        setTimeout(() => {
          // Only redirect if we're not already on the login page
          if (router.url !== '/login') {
            console.log('401 error: Redirecting to login page');
            router.navigate(['/login'], { replaceUrl: true });
          }
        }, 0);
      }

      // Handle forbidden error (403)
      if (error.status === 403) {
        // You might want to redirect to an access denied page
        router.navigate(['/access-denied']);
      }

      // Return the error
      return throwError(() => error);
    })
  );
}



/**
 * Get current language synchronously from localStorage
 * Falls back to 'en' if no language is found
 */
function getCurrentLanguageSync(): string {
  try {
    const savedLanguage = localStorage.getItem('app_language');
    return savedLanguage || 'en';
  } catch (error) {
    console.warn('Error getting language from localStorage:', error);
    return 'en';
  }
}

/**
 * Map language code to Accept-Language locale format
 * @param language - The current language code ('ar' or 'en')
 * @returns The formatted locale string
 */
function mapLanguageToLocale(language: string): string {
  const languageLocaleMap: { [key: string]: string } = {
    'ar': 'ar-EG',
    'en': 'en-US'
  };

  // Return mapped locale or default to 'en-US' for unsupported languages
  return languageLocaleMap[language] || 'en-US';
}
