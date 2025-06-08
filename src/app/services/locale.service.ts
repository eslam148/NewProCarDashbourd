import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectCurrentLanguage } from '../store/translation/translation.selectors';

/**
 * Service for managing locale-related operations
 * Handles mapping between language codes and locale formats for HTTP headers
 */
@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  
  constructor(private store: Store) {}

  /**
   * Language to locale mapping configuration
   */
  private readonly languageLocaleMap: { [key: string]: string } = {
    'ar': 'ar-EG',
    'en': 'en-EG'
  };

  /**
   * Default locale when language is not supported
   */
  private readonly defaultLocale = 'en-EG';

  /**
   * Get current locale based on application language
   * @returns Observable of current locale string
   */
  getCurrentLocale(): Observable<string> {
    return this.store.select(selectCurrentLanguage).pipe(
      map(language => this.mapLanguageToLocale(language || 'en'))
    );
  }

  /**
   * Get current locale synchronously from localStorage
   * @returns Current locale string
   */
  getCurrentLocalSync(): string {
    try {
      const savedLanguage = localStorage.getItem('app_language') || 'en';
      return this.mapLanguageToLocale(savedLanguage);
    } catch (error) {
      console.warn('Error getting language from localStorage:', error);
      return this.defaultLocale;
    }
  }

  /**
   * Map language code to Accept-Language locale format
   * @param language - The current language code ('ar' or 'en')
   * @returns The formatted locale string
   */
  mapLanguageToLocale(language: string): string {
    return this.languageLocaleMap[language] || this.defaultLocale;
  }

  /**
   * Get all supported locales
   * @returns Array of supported locale strings
   */
  getSupportedLocales(): string[] {
    return Object.values(this.languageLocaleMap);
  }

  /**
   * Get all supported language codes
   * @returns Array of supported language codes
   */
  getSupportedLanguages(): string[] {
    return Object.keys(this.languageLocaleMap);
  }

  /**
   * Check if a locale is supported
   * @param locale - The locale to check
   * @returns True if the locale is supported
   */
  isSupportedLocale(locale: string): boolean {
    return this.getSupportedLocales().includes(locale);
  }

  /**
   * Check if a language is supported
   * @param language - The language code to check
   * @returns True if the language is supported
   */
  isSupportedLanguage(language: string): boolean {
    return this.getSupportedLanguages().includes(language);
  }

  /**
   * Extract language code from locale
   * @param locale - The locale string (e.g., 'ar-EG')
   * @returns The language code (e.g., 'ar')
   */
  extractLanguageFromLocale(locale: string): string {
    return locale.split('-')[0];
  }

  /**
   * Get Accept-Language header value for HTTP requests
   * @param language - Optional language code, uses current if not provided
   * @returns Accept-Language header value
   */
  getAcceptLanguageHeader(language?: string): string {
    if (language) {
      return this.mapLanguageToLocale(language);
    }
    return this.getCurrentLocalSync();
  }

  /**
   * Get locale information for debugging
   * @returns Object with current locale information
   */
  getLocaleInfo(): {
    currentLanguage: string;
    currentLocale: string;
    supportedLanguages: string[];
    supportedLocales: string[];
    defaultLocale: string;
  } {
    const currentLanguage = localStorage.getItem('app_language') || 'en';
    return {
      currentLanguage,
      currentLocale: this.mapLanguageToLocale(currentLanguage),
      supportedLanguages: this.getSupportedLanguages(),
      supportedLocales: this.getSupportedLocales(),
      defaultLocale: this.defaultLocale
    };
  }

  /**
   * Validate and normalize locale string
   * @param locale - The locale to validate
   * @returns Normalized locale or default if invalid
   */
  validateAndNormalizeLocale(locale: string): string {
    if (!locale) {
      return this.defaultLocale;
    }

    // Check if exact match
    if (this.isSupportedLocale(locale)) {
      return locale;
    }

    // Try to extract language and map it
    const language = this.extractLanguageFromLocale(locale);
    if (this.isSupportedLanguage(language)) {
      return this.mapLanguageToLocale(language);
    }

    // Return default if nothing matches
    return this.defaultLocale;
  }

  /**
   * Get HTTP headers object with Accept-Language
   * @param additionalHeaders - Optional additional headers
   * @returns Headers object with Accept-Language
   */
  getHttpHeaders(additionalHeaders?: { [key: string]: string }): { [key: string]: string } {
    const headers = {
      'Accept-Language': this.getCurrentLocalSync(),
      ...additionalHeaders
    };
    return headers;
  }

  /**
   * Log current locale information for debugging
   */
  logLocaleInfo(): void {
    const info = this.getLocaleInfo();
    console.group('🌐 Locale Service Information');
    console.log('Current Language:', info.currentLanguage);
    console.log('Current Locale:', info.currentLocale);
    console.log('Supported Languages:', info.supportedLanguages);
    console.log('Supported Locales:', info.supportedLocales);
    console.log('Default Locale:', info.defaultLocale);
    console.groupEnd();
  }
}
