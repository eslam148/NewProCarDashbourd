import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.reducer';

export const selectAdminState = createFeatureSelector<AdminState>('admin');

export const selectAdmins = createSelector(
  selectAdminState,
  (state: AdminState) => state.admins
);

export const selectAdminLoading = createSelector(
  selectAdminState,
  (state: AdminState) => state.loading
);

export const selectAdminError = createSelector(
  selectAdminState,
  (state: AdminState) => state.error
);
