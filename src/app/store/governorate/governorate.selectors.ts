import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GovernorateState } from './governorate.reducer';

export const selectGovernorateState = createFeatureSelector<GovernorateState>('governorate');

export const selectAllGovernorates = createSelector(
  selectGovernorateState,
  (state) => state.governorates
);

export const selectSelectedGovernorate = createSelector(
  selectGovernorateState,
  (state) => state.selectedGovernorate
);

export const selectGovernorateLoading = createSelector(
  selectGovernorateState,
  (state) => state.loading
);

export const selectGovernorateError = createSelector(
  selectGovernorateState,
  (state) => state.error
);
