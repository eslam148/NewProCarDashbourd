import { createAction, props } from '@ngrx/store';
import { SubCategoryDto } from '../../Models/DTOs/SubCategoryDto';

export const addSubCategory = createAction('[SubCategory] Add', props<{ subCategory: SubCategoryDto }>());
export const addSubCategorySuccess = createAction('[SubCategory] Add Success', props<{ subCategory: SubCategoryDto }>());
export const addSubCategoryFailure = createAction('[SubCategory] Add Failure', props<{ error: any }>());

export const updateSubCategory = createAction('[SubCategory] Update', props<{ subCategory: SubCategoryDto }>());
export const updateSubCategorySuccess = createAction('[SubCategory] Update Success', props<{ subCategory: SubCategoryDto }>());
export const updateSubCategoryFailure = createAction('[SubCategory] Update Failure', props<{ error: any }>());

export const loadAllSubCategories = createAction('[SubCategory] Load All');
export const loadAllSubCategoriesSuccess = createAction('[SubCategory] Load All Success', props<{ subCategories: SubCategoryDto[] }>());
export const loadAllSubCategoriesFailure = createAction('[SubCategory] Load All Failure', props<{ error: any }>());

export const deleteSubCategory = createAction('[SubCategory] Delete', props<{ id: number }>());
export const deleteSubCategorySuccess = createAction('[SubCategory] Delete Success', props<{ id: number }>());
export const deleteSubCategoryFailure = createAction('[SubCategory] Delete Failure', props<{ error: any }>());

export const getSubCategoryById = createAction('[SubCategory] Get By Id', props<{ id: number }>());
export const getSubCategoryByIdSuccess = createAction('[SubCategory] Get By Id Success', props<{ subCategory: SubCategoryDto }>());
export const getSubCategoryByIdFailure = createAction('[SubCategory] Get By Id Failure', props<{ error: any }>());

export const loadMobileSubCategories = createAction('[SubCategory] Load Mobile', props<{ categoryId: number }>());
export const loadMobileSubCategoriesSuccess = createAction('[SubCategory] Load Mobile Success', props<{ subCategories: SubCategoryDto[] }>());
export const loadMobileSubCategoriesFailure = createAction('[SubCategory] Load Mobile Failure', props<{ error: any }>());
