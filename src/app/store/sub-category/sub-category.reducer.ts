import { createReducer, on } from '@ngrx/store';
import * as SubCategoryActions from './sub-category.actions';
import { SubCategoryDto } from '../../Models/DTOs/SubCategoryDto';

export interface SubCategoryState {
  subCategories: SubCategoryDto[];
  selectedSubCategory: SubCategoryDto | null;
  loading: boolean;
  error: any;
}

export const initialState: SubCategoryState = {
  subCategories: [],
  selectedSubCategory: null,
  loading: false,
  error: null
};

export const subCategoryReducer = createReducer(
  initialState,
  on(
    SubCategoryActions.addSubCategory,
    SubCategoryActions.updateSubCategory,
    SubCategoryActions.loadAllSubCategories,
    SubCategoryActions.deleteSubCategory,
    SubCategoryActions.getSubCategoryById,
    SubCategoryActions.loadMobileSubCategories,
    state => ({ ...state, loading: true })
  ),
  on(SubCategoryActions.addSubCategorySuccess, (state, { subCategory }) => ({
    ...state,
    loading: false,
    subCategories: [...state.subCategories, subCategory]
  })),
  on(SubCategoryActions.updateSubCategorySuccess, (state, { subCategory }) => ({
    ...state,
    loading: false,
    subCategories: state.subCategories.map(s => s.id === subCategory.id ? subCategory : s)
  })),
  on(SubCategoryActions.loadAllSubCategoriesSuccess, (state, { subCategories }) => ({
    ...state,
    loading: false,
    subCategories
  })),
  on(SubCategoryActions.deleteSubCategorySuccess, (state, { id }) => ({
    ...state,
    loading: false,
    subCategories: state.subCategories.filter(s => s.id !== id)
  })),
  on(SubCategoryActions.getSubCategoryByIdSuccess, (state, { subCategory }) => ({
    ...state,
    loading: false,
    selectedSubCategory: subCategory
  })),
  on(SubCategoryActions.loadMobileSubCategoriesSuccess, (state, { subCategories }) => ({
    ...state,
    loading: false,
    subCategories
  })),
  on(
    SubCategoryActions.addSubCategoryFailure,
    SubCategoryActions.updateSubCategoryFailure,
    SubCategoryActions.loadAllSubCategoriesFailure,
    SubCategoryActions.deleteSubCategoryFailure,
    SubCategoryActions.getSubCategoryByIdFailure,
    SubCategoryActions.loadMobileSubCategoriesFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
