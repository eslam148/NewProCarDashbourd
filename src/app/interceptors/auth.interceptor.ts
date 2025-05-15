import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
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

      // Handle specific error cases
      if (error.status === 401) {
        // Handle unauthorized error
        console.log('Unauthorized access');
        // You can redirect to login page or refresh token here
      }

      if (error.status === 403) {
        // Handle forbidden error
        console.log('Forbidden access');
      }

      // Return the error
      return throwError(() => error);
    })
  );
}
