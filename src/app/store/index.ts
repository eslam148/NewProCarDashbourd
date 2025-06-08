import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { adminReducer, AdminState } from './admin/admin.reducer';
import { translationReducer, TranslationState } from './translation/translation.reducer';
import { governorateReducer, GovernorateState } from './governorate/governorate.reducer';
import { cityReducer, CityState } from './city/city.reducer';
import { serviceCategoryReducer, ServiceCategoryState } from './service-category/service-category.reducer';
import { profileReducer, ProfileState } from './profile/profile.reducer';

export interface AppState {
  auth: AuthState;
  admin: AdminState;
  translation: TranslationState;
  governorate: GovernorateState;
  city: CityState;
  serviceCategory: ServiceCategoryState;
  profile: ProfileState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  admin: adminReducer,
  translation: translationReducer,
  governorate: governorateReducer,
  city: cityReducer,
  serviceCategory: serviceCategoryReducer,
  profile: profileReducer
};
