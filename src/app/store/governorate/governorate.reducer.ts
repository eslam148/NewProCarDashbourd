import { createReducer, on } from '@ngrx/store';
import * as GovernorateActions from './governorate.actions';
import { GovernorateDto } from '../../Models/DTOs/GovernorateDto';

export interface GovernorateState {
  governorates: GovernorateDto[];
  selectedGovernorate: GovernorateDto | null;
  loading: boolean;
  error: any;
}

export const initialState: GovernorateState = {
  governorates: [],
  selectedGovernorate: null,
  loading: false,
  error: null
};

export const governorateReducer = createReducer(
  initialState,
  on(GovernorateActions.loadGovernorates, state => ({ ...state, loading: true, error: null })),
  on(GovernorateActions.loadGovernoratesSuccess, (state, { governorates }) => ({ ...state, governorates, loading: false })),
  on(GovernorateActions.loadGovernoratesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(GovernorateActions.loadGovernorateById, state => ({ ...state, loading: true, error: null })),
  on(GovernorateActions.loadGovernorateByIdSuccess, (state, { governorate }) => ({ ...state, selectedGovernorate: governorate, loading: false })),
  on(GovernorateActions.loadGovernorateByIdFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(GovernorateActions.addGovernorate, state => ({ ...state, loading: true, error: null })),
  on(GovernorateActions.addGovernorateSuccess, (state, { governorate }) => ({ ...state, governorates: [...state.governorates, governorate], loading: false })),
  on(GovernorateActions.addGovernorateFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(GovernorateActions.updateGovernorate, state => ({ ...state, loading: true, error: null })),
  on(GovernorateActions.updateGovernorateSuccess, (state, { governorate }) => ({
    ...state,
    governorates: state.governorates.map(g => g.id === governorate.id ? governorate : g),
    loading: false
  })),
  on(GovernorateActions.updateGovernorateFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(GovernorateActions.deleteGovernorate, state => ({ ...state, loading: true, error: null })),
  on(GovernorateActions.deleteGovernorateSuccess, (state, { id }) => ({
    ...state,
    governorates: state.governorates.filter(g => g.id !== id),
    loading: false
  })),
  on(GovernorateActions.deleteGovernorateFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
