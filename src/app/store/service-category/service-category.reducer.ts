import { createReducer, on } from '@ngrx/store';
import * as ServiceCategoryActions from './service-category.actions';
import { ServiceCategoryDto } from '../../Models/DTOs/ServiceCategoryDto';

export interface ServiceCategoryState {
  categories: ServiceCategoryDto[];
  selectedCategory: ServiceCategoryDto | null;
  loading: boolean;
  error: any;
}

export const initialState: ServiceCategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null
};

export const serviceCategoryReducer = createReducer(
  initialState,
  on(
    ServiceCategoryActions.addCategory,
    ServiceCategoryActions.updateCategory,
    ServiceCategoryActions.loadAllCategories,
    ServiceCategoryActions.deleteCategory,
    ServiceCategoryActions.getCategoryById,
    state => ({ ...state, loading: true })
  ),
  on(ServiceCategoryActions.addCategorySuccess, (state, { category }) => ({
    ...state,
    loading: false,
    categories: [...state.categories, category]
  })),
  on(ServiceCategoryActions.updateCategorySuccess, (state, { category }) => ({
    ...state,
    loading: false,
    categories: state.categories.map(c => c.id === category.id ? category : c)
  })),
  on(ServiceCategoryActions.loadAllCategoriesSuccess, (state, { categories }) => ({
    ...state,
    loading: false,
    categories
  })),
  on(ServiceCategoryActions.deleteCategorySuccess, (state, { id }) => ({
    ...state,
    loading: false,
    categories: state.categories.filter(c => c.id !== id)
  })),
  on(ServiceCategoryActions.getCategoryByIdSuccess, (state, { category }) => ({
    ...state,
    loading: false,
    selectedCategory: category
  })),
  on(
    ServiceCategoryActions.addCategoryFailure,
    ServiceCategoryActions.updateCategoryFailure,
    ServiceCategoryActions.loadAllCategoriesFailure,
    ServiceCategoryActions.deleteCategoryFailure,
    ServiceCategoryActions.getCategoryByIdFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
