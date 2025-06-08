import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  setLanguage,
  loadTranslations,
  changeLanguageApi
} from '../store/translation/translation.actions';
import {
  selectCurrentLanguage,
  selectTranslations,
  selectIsChangingLanguage
} from '../store/translation/translation.selectors';
import { AuthService } from './auth.service';

const LANGUAGE_KEY = 'app_language';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(
    private store: Store,
    private authService: AuthService
  ) {
    // Try to load language from localStorage, fallback to default
    const savedLang = localStorage.getItem(LANGUAGE_KEY) || environment.defaultLanguage;
    this.setLanguage(savedLang);
  }

  public getCurrentLang(): Observable<string> {
    return this.store.select(selectCurrentLanguage);
  }

  public setLanguage(lang: string): void {
    if (environment.supportedLanguages.includes(lang)) {
      localStorage.setItem(LANGUAGE_KEY, lang);
      this.store.dispatch(setLanguage({ language: lang }));
      this.loadTranslation(lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    } else {
      console.warn(`Language ${lang} is not supported. Using default language: ${environment.defaultLanguage}`);
      this.setLanguage(environment.defaultLanguage);
    }
  }

  /**
   * Set language with API synchronization
   * This method will update both local state and backend preference
   */
  public setLanguageWithApi(lang: string): void {
    if (environment.supportedLanguages.includes(lang)) {
      // Check if user is authenticated before making API call
      if (this.authService.isAuthenticated()) {
        localStorage.setItem(LANGUAGE_KEY, lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        this.store.dispatch(changeLanguageApi({ language: lang }));
      } else {
        // If not authenticated, just set locally
        this.setLanguage(lang);
      }
    } else {
      console.warn(`Language ${lang} is not supported. Using default language: ${environment.defaultLanguage}`);
      this.setLanguageWithApi(environment.defaultLanguage);
    }
  }

  /**
   * Get loading state for language change
   */
  public getIsChangingLanguage(): Observable<boolean> {
    return this.store.select(selectIsChangingLanguage);
  }

  private loadTranslation(lang: string): void {
    this.store.dispatch(loadTranslations({ language: lang }));
  }

  public translate(key: string, params?: any[]): Observable<string> {
    return this.store.select(selectTranslations).pipe(
      map(translations => {
        const keys = key.split('.');
        let translation = translations;

        for (const k of keys) {
          if (translation && translation[k]) {
            translation = translation[k];
          } else {
            return key;
          }
        }

        if (params && params.length > 0) {
          params.forEach((param, index) => {
            translation = translation.replace(`{${index}}`, param);
          });
        }

        return translation;
      })
    );
  }
}
