import { createAction, props } from '@ngrx/store';
import { GovernorateDto } from '../../Models/DTOs/GovernorateDto';

export const loadGovernorates = createAction('[Governorate] Load Governorates');
export const loadGovernoratesSuccess = createAction('[Governorate] Load Governorates Success', props<{ governorates: GovernorateDto[] }>());
export const loadGovernoratesFailure = createAction('[Governorate] Load Governorates Failure', props<{ error: any }>());

export const loadGovernorateById = createAction('[Governorate] Load Governorate By Id', props<{ id: number }>());
export const loadGovernorateByIdSuccess = createAction('[Governorate] Load Governorate By Id Success', props<{ governorate: GovernorateDto }>());
export const loadGovernorateByIdFailure = createAction('[Governorate] Load Governorate By Id Failure', props<{ error: any }>());

export const addGovernorate = createAction('[Governorate] Add Governorate', props<{ governorate: GovernorateDto }>());
export const addGovernorateSuccess = createAction('[Governorate] Add Governorate Success', props<{ governorate: GovernorateDto }>());
export const addGovernorateFailure = createAction('[Governorate] Add Governorate Failure', props<{ error: any }>());

export const updateGovernorate = createAction('[Governorate] Update Governorate', props<{ governorate: GovernorateDto }>());
export const updateGovernorateSuccess = createAction('[Governorate] Update Governorate Success', props<{ governorate: GovernorateDto }>());
export const updateGovernorateFailure = createAction('[Governorate] Update Governorate Failure', props<{ error: any }>());

export const deleteGovernorate = createAction('[Governorate] Delete Governorate', props<{ id: number }>());
export const deleteGovernorateSuccess = createAction('[Governorate] Delete Governorate Success', props<{ id: number }>());
export const deleteGovernorateFailure = createAction('[Governorate] Delete Governorate Failure', props<{ error: any }>());
