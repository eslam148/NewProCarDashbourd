import { createReducer, on } from '@ngrx/store';
import { setLanguage, loadTranslationsSuccess, loadTranslationsFailure } from './translation.actions';
import { environment } from '../../../environments/environment';

export interface TranslationState {
  currentLanguage: string;
  translations: any;
  error: any;
}

export const initialState: TranslationState = {
  currentLanguage: environment.defaultLanguage,
  translations: {},
  error: null
};

export const translationReducer = createReducer(
  initialState,
  on(setLanguage, (state, { language }) => ({
    ...state,
    currentLanguage: language
  })),
  on(loadTranslationsSuccess, (state, { translations }) => ({
    ...state,
    translations,
    error: null
  })),
  on(loadTranslationsFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
