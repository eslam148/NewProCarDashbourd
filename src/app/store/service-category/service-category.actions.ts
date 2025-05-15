import { createAction, props } from '@ngrx/store';
import { ServiceCategoryDto } from '../../Models/DTOs/ServiceCategoryDto';

export const loadCategories = createAction('[ServiceCategory] Load Categories');
export const loadCategoriesSuccess = createAction('[ServiceCategory] Load Categories Success', props<{ categories: ServiceCategoryDto[] }>());
export const loadCategoriesFailure = createAction('[ServiceCategory] Load Categories Failure', props<{ error: any }>());

export const loadAllCategories = createAction('[ServiceCategory] Load All Categories');
export const loadAllCategoriesSuccess = createAction('[ServiceCategory] Load All Categories Success', props<{ categories: ServiceCategoryDto[] }>());
export const loadAllCategoriesFailure = createAction('[ServiceCategory] Load All Categories Failure', props<{ error: any }>());

export const getAllCategories = createAction('[ServiceCategory] Get All');
export const getAllCategoriesSuccess = createAction('[ServiceCategory] Get All Success', props<{ categories: ServiceCategoryDto[] }>());
export const getAllCategoriesFailure = createAction('[ServiceCategory] Get All Failure', props<{ error: any }>());

export const addCategory = createAction('[ServiceCategory] Add Category', props<{ category: ServiceCategoryDto }>());
export const addCategorySuccess = createAction('[ServiceCategory] Add Category Success', props<{ category: ServiceCategoryDto }>());
export const addCategoryFailure = createAction('[ServiceCategory] Add Category Failure', props<{ error: any }>());

export const updateCategory = createAction('[ServiceCategory] Update Category', props<{ category: ServiceCategoryDto }>());
export const updateCategorySuccess = createAction('[ServiceCategory] Update Category Success', props<{ category: ServiceCategoryDto }>());
export const updateCategoryFailure = createAction('[ServiceCategory] Update Category Failure', props<{ error: any }>());

export const deleteCategory = createAction('[ServiceCategory] Delete Category', props<{ id: number }>());
export const deleteCategorySuccess = createAction('[ServiceCategory] Delete Category Success', props<{ id: number }>());
export const deleteCategoryFailure = createAction('[ServiceCategory] Delete Category Failure', props<{ error: any }>());

export const getCategoryById = createAction('[ServiceCategory] Get Category By Id', props<{ id: number }>());
export const getCategoryByIdSuccess = createAction('[ServiceCategory] Get Category By Id Success', props<{ category: ServiceCategoryDto }>());
export const getCategoryByIdFailure = createAction('[ServiceCategory] Get Category By Id Failure', props<{ error: any }>());
