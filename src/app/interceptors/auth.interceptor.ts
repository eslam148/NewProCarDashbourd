import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Clone the request and add the authorization header if token exists
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Log the request
  console.log('Request:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    body: request.body
  });

  // Handle the response
  return next(request).pipe(
    tap(response => {
      console.log('Response:', response);
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error:', error);

      // Handle unauthorized error (401)
      if (error.status === 401) {
        // Clear all items from localStorage
        localStorage.clear();

        // Redirect to login page
        router.navigate(['/login']);

        // You can also show a notification here if you have a notification service
        console.log('Session expired. Please login again.');
      }

      // Handle forbidden error (403)
      if (error.status === 403) {
        console.log('Forbidden access');
        // You might want to redirect to an access denied page
        router.navigate(['/access-denied']);
      }

      // Return the error
      return throwError(() => error);
    })
  );
}
