import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentLanguage } from '../store/translation/translation.selectors';
import { take, switchMap } from 'rxjs/operators';

/**
 * Language Interceptor - Adds Accept-Language header to all HTTP requests
 * This interceptor dynamically sets the Accept-Language header based on the current application language
 */
export function languageInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const store = inject(Store);

  // Get current language from store and add Accept-Language header
  return store.select(selectCurrentLanguage).pipe(
    take(1),
    switchMap(currentLanguage => {
      const acceptLanguage = mapLanguageToLocale(currentLanguage || 'en');
      
      // Clone the request and add the Accept-Language header
      const modifiedRequest = request.clone({
        setHeaders: {
          'Accept-Language': acceptLanguage
        }
      });

      return next(modifiedRequest);
    })
  );
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

/**
 * Get supported locales list
 * @returns Array of supported locale strings
 */
export function getSupportedLocales(): string[] {
  return ['ar-EG', 'en-EG'];
}

/**
 * Check if a locale is supported
 * @param locale - The locale to check
 * @returns True if the locale is supported
 */
export function isSupportedLocale(locale: string): boolean {
  return getSupportedLocales().includes(locale);
}

/**
 * Extract language code from locale
 * @param locale - The locale string (e.g., 'ar-EG')
 * @returns The language code (e.g., 'ar')
 */
export function extractLanguageFromLocale(locale: string): string {
  return locale.split('-')[0];
}
