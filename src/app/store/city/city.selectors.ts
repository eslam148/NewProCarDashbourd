import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CityState } from './city.reducer';

export const selectCityState = createFeatureSelector<CityState>('city');

export const selectAllCities = createSelector(
  selectCityState,
  (state) => state.cities
);

export const selectSelectedCity = createSelector(
  selectCityState,
  (state) => state.selectedCity
);

export const selectCityLoading = createSelector(
  selectCityState,
  (state) => state.loading
);

export const selectCityError = createSelector(
  selectCityState,
  (state) => state.error
);
