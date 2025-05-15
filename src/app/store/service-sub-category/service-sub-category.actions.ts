import { createAction, props } from '@ngrx/store';
import { ServiceSubCategoryDto } from '../../Models/DTOs/ServiceSubCategoryDto';

// Load All SubCategories
export const loadAllSubCategories = createAction('[ServiceSubCategory] Load All SubCategories');
export const loadAllSubCategoriesSuccess = createAction(
  '[ServiceSubCategory] Load All SubCategories Success',
  props<{ subCategories: ServiceSubCategoryDto[] }>()
);
export const loadAllSubCategoriesFailure = createAction(
  '[ServiceSubCategory] Load All SubCategories Failure',
  props<{ error: string }>()
);

// Add SubCategory
export const addSubCategory = createAction(
  '[ServiceSubCategory] Add SubCategory',
  props<{ subCategory: ServiceSubCategoryDto }>()
);
export const addSubCategorySuccess = createAction(
  '[ServiceSubCategory] Add SubCategory Success',
  props<{ subCategory: ServiceSubCategoryDto }>()
);
export const addSubCategoryFailure = createAction(
  '[ServiceSubCategory] Add SubCategory Failure',
  props<{ error: string }>()
);

// Update SubCategory
export const updateSubCategory = createAction(
  '[ServiceSubCategory] Update SubCategory',
  props<{ id: number; subCategory: ServiceSubCategoryDto }>()
);
export const updateSubCategorySuccess = createAction(
  '[ServiceSubCategory] Update SubCategory Success',
  props<{ subCategory: ServiceSubCategoryDto }>()
);
export const updateSubCategoryFailure = createAction(
  '[ServiceSubCategory] Update SubCategory Failure',
  props<{ error: string }>()
);

// Delete SubCategory
export const deleteSubCategory = createAction(
  '[ServiceSubCategory] Delete SubCategory',
  props<{ id: number }>()
);
export const deleteSubCategorySuccess = createAction(
  '[ServiceSubCategory] Delete SubCategory Success',
  props<{ id: number }>()
);
export const deleteSubCategoryFailure = createAction(
  '[ServiceSubCategory] Delete SubCategory Failure',
  props<{ error: string }>()
);

// Get SubCategory By Id
export const getSubCategoryById = createAction(
  '[ServiceSubCategory] Get SubCategory By Id',
  props<{ id: number }>()
);
export const getSubCategoryByIdSuccess = createAction(
  '[ServiceSubCategory] Get SubCategory By Id Success',
  props<{ subCategory: ServiceSubCategoryDto }>()
);
export const getSubCategoryByIdFailure = createAction(
  '[ServiceSubCategory] Get SubCategory By Id Failure',
  props<{ error: string }>()
);
