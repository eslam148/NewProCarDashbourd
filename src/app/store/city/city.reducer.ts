import { createReducer, on } from '@ngrx/store';
import * as CityActions from './city.actions';
import { CityDto } from '../../Models/DTOs/CityDto';

export interface CityState {
  cities: CityDto[];
  selectedCity: CityDto | null;
  loading: boolean;
  error: any;
}

export const initialState: CityState = {
  cities: [],
  selectedCity: null,
  loading: false,
  error: null
};

export const cityReducer = createReducer(
  initialState,
  on(CityActions.loadCities, state => ({ ...state, loading: true, error: null })),
  on(CityActions.loadCitiesSuccess, (state, { cities }) => ({ ...state, cities, loading: false })),
  on(CityActions.loadCitiesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(CityActions.loadCityById, state => ({ ...state, loading: true, error: null })),
  on(CityActions.loadCityByIdSuccess, (state, { city }) => ({ ...state, selectedCity: city, loading: false })),
  on(CityActions.loadCityByIdFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(CityActions.addCity, state => ({ ...state, loading: true, error: null })),
  on(CityActions.addCitySuccess, (state, { city }) => ({ ...state, cities: [...state.cities, city], loading: false })),
  on(CityActions.addCityFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(CityActions.updateCity, state => ({ ...state, loading: true, error: null })),
  on(CityActions.updateCitySuccess, (state, { city }) => ({
    ...state,
    cities: state.cities.map(c => c.id === city.id ? city : c),
    loading: false
  })),
  on(CityActions.updateCityFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(CityActions.deleteCity, state => ({ ...state, loading: true, error: null })),
  on(CityActions.deleteCitySuccess, (state, { id }) => ({
    ...state,
    cities: state.cities.filter(c => c.id !== id),
    loading: false
  })),
  on(CityActions.deleteCityFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(CityActions.loadCitiesByGovernorateId, state => ({ ...state, loading: true, error: null })),
  on(CityActions.loadCitiesByGovernorateIdSuccess, (state, { cities }) => ({ ...state, cities, loading: false })),
  on(CityActions.loadCitiesByGovernorateIdFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
