import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SubCategoryState } from './sub-category.reducer';

export const selectSubCategoryState = createFeatureSelector<SubCategoryState>('subCategory');

export const selectAllSubCategories = createSelector(
  selectSubCategoryState,
  (state: SubCategoryState) => state.subCategories
);

export const selectSubCategoryLoading = createSelector(
  selectSubCategoryState,
  (state: SubCategoryState) => state.loading
);

export const selectSubCategoryError = createSelector(
  selectSubCategoryState,
  (state: SubCategoryState) => state.error
);

export const selectSelectedSubCategory = createSelector(
  selectSubCategoryState,
  (state: SubCategoryState) => state.selectedSubCategory
);
