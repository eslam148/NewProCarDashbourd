import { createAction, props } from '@ngrx/store';
import { CityDto } from '../../Models/DTOs/CityDto';

export const loadCities = createAction('[City] Load Cities');
export const loadCitiesSuccess = createAction('[City] Load Cities Success', props<{ cities: CityDto[] }>());
export const loadCitiesFailure = createAction('[City] Load Cities Failure', props<{ error: any }>());

export const loadCityById = createAction('[City] Load City By Id', props<{ id: number }>());
export const loadCityByIdSuccess = createAction('[City] Load City By Id Success', props<{ city: CityDto }>());
export const loadCityByIdFailure = createAction('[City] Load City By Id Failure', props<{ error: any }>());

export const addCity = createAction('[City] Add City', props<{ city: CityDto }>());
export const addCitySuccess = createAction('[City] Add City Success', props<{ city: CityDto }>());
export const addCityFailure = createAction('[City] Add City Failure', props<{ error: any }>());

export const updateCity = createAction('[City] Update City', props<{ city: CityDto }>());
export const updateCitySuccess = createAction('[City] Update City Success', props<{ city: CityDto }>());
export const updateCityFailure = createAction('[City] Update City Failure', props<{ error: any }>());

export const deleteCity = createAction('[City] Delete City', props<{ id: number }>());
export const deleteCitySuccess = createAction('[City] Delete City Success', props<{ id: number }>());
export const deleteCityFailure = createAction('[City] Delete City Failure', props<{ error: any }>());

export const loadCitiesByGovernorateId = createAction('[City] Load Cities By GovernorateId', props<{ governorateId: number }>());
export const loadCitiesByGovernorateIdSuccess = createAction('[City] Load Cities By GovernorateId Success', props<{ cities: CityDto[] }>());
export const loadCitiesByGovernorateIdFailure = createAction('[City] Load Cities By GovernorateId Failure', props<{ error: any }>());
