import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ServiceCategoryState } from './service-category.reducer';

export const selectServiceCategoryState = createFeatureSelector<ServiceCategoryState>('serviceCategory');

export const selectAllCategories = createSelector(
  selectServiceCategoryState,
  (state: ServiceCategoryState) => state.categories
);

export const selectServiceCategoryLoading = createSelector(
  selectServiceCategoryState,
  (state: ServiceCategoryState) => state.loading
);

export const selectServiceCategoryError = createSelector(
  selectServiceCategoryState,
  (state: ServiceCategoryState) => state.error
);

export const selectSelectedCategory = createSelector(
  selectServiceCategoryState,
  (state: ServiceCategoryState) => state.selectedCategory
);
