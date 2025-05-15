import { createAction, props } from '@ngrx/store';

export const setLanguage = createAction(
  '[Translation] Set Language',
  props<{ language: string }>()
);

export const loadTranslations = createAction(
  '[Translation] Load Translations',
  props<{ language: string }>()
);

export const loadTranslationsSuccess = createAction(
  '[Translation] Load Translations Success',
  props<{ translations: any }>()
);

export const loadTranslationsFailure = createAction(
  '[Translation] Load Translations Failure',
  props<{ error: any }>()
);
