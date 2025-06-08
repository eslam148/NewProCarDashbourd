import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  loadTranslations,
  loadTranslationsSuccess,
  loadTranslationsFailure,
  changeLanguageApi,
  changeLanguageApiSuccess,
  changeLanguageApiFailure,
  setLanguage,
  loadTranslations as loadTranslationsAction
} from './translation.actions';
import { ProfileService } from '../../services/profile.service';

@Injectable()
export class TranslationEffects {
  loadTranslations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTranslations),
      mergeMap(({ language }) =>
        this.http.get(`/assets/i18n/${language}.json`).pipe(
          map(translations => loadTranslationsSuccess({ translations })),
          catchError(error => of(loadTranslationsFailure({ error })))
        )
      )
    )
  );

  changeLanguageApi$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeLanguageApi),
      mergeMap(({ language }) => {
        const apiLanguageCode = this.profileService.mapLanguageToApiCode(language);
        return this.profileService.changeLanguage(apiLanguageCode).pipe(
          mergeMap(() => [
            changeLanguageApiSuccess({ language }),
            setLanguage({ language }),
            loadTranslationsAction({ language })
          ]),
          catchError(error => {
            console.error('Language change API error:', error);
            return of(changeLanguageApiFailure({ error }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private profileService: ProfileService
  ) {}
}
