import { createReducer, on } from '@ngrx/store';
import {
  setLanguage,
  loadTranslationsSuccess,
  loadTranslationsFailure,
  changeLanguageApi,
  changeLanguageApiSuccess,
  changeLanguageApiFailure
} from './translation.actions';
import { environment } from '../../../environments/environment';

export interface TranslationState {
  currentLanguage: string;
  translations: any;
  error: any;
  isChangingLanguage: boolean;
}

export const initialState: TranslationState = {
  currentLanguage: environment.defaultLanguage,
  translations: {},
  error: null,
  isChangingLanguage: false
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
  })),
  on(changeLanguageApi, (state) => ({
    ...state,
    isChangingLanguage: true,
    error: null
  })),
  on(changeLanguageApiSuccess, (state, { language }) => ({
    ...state,
    currentLanguage: language,
    isChangingLanguage: false,
    error: null
  })),
  on(changeLanguageApiFailure, (state, { error }) => ({
    ...state,
    isChangingLanguage: false,
    error
  }))
);
