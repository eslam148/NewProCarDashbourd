import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TranslationState } from './translation.reducer';

export const selectTranslationState = createFeatureSelector<TranslationState>('translation');

export const selectCurrentLanguage = createSelector(
  selectTranslationState,
  (state: TranslationState) => state.currentLanguage
);

export const selectTranslations = createSelector(
  selectTranslationState,
  (state: TranslationState) => state.translations
);

export const selectTranslationError = createSelector(
  selectTranslationState,
  (state: TranslationState) => state.error
);

export const selectIsChangingLanguage = createSelector(
  selectTranslationState,
  (state: TranslationState) => state.isChangingLanguage
);
