import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { loadTranslations, loadTranslationsSuccess, loadTranslationsFailure } from './translation.actions';

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

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}
