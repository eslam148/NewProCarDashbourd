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

// API Language Change Actions
export const changeLanguageApi = createAction(
  '[Translation] Change Language API',
  props<{ language: string }>()
);

export const changeLanguageApiSuccess = createAction(
  '[Translation] Change Language API Success',
  props<{ language: string }>()
);

export const changeLanguageApiFailure = createAction(
  '[Translation] Change Language API Failure',
  props<{ error: any }>()
);
