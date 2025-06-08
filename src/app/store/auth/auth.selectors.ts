import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { LoginStatus } from '../../Enums/LoginStatus';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthResponse = createSelector(
  selectAuthState,
  (state: AuthState) => state?.response || null
);

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state?.response || null
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state?.response?.token || null
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state?.loading || false
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state?.error || null
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state?.response?.loginStatus === LoginStatus.Success
);

export const selectFcmToken = createSelector(
  selectAuthState,
  (state: AuthState) => state?.fcmToken || null
);
