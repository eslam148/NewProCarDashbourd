import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  checkAuth,
  checkAuthSuccess,
  checkAuthFailure,
  saveFcmToken,
  clearFcmToken,
  clearAuthStore
} from './auth.actions';
import { LoginResponse } from '../../Models/Responses/LoginResponse';

export interface AuthState {
  response: LoginResponse | null;
  loading: boolean;
  error: any;
  fcmToken: string | null;
}

export const initialState: AuthState = {
  response: null,
  loading: false,
  error: null,
  fcmToken: null
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loginSuccess, (state, { response }) => ({
    ...state,
    response,
    loading: false,
    error: null
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(logout, (state) => ({
    ...state,
    loading: true
  })),
  on(logoutSuccess, () => ({
    ...initialState
  })),
  on(checkAuth, (state) => ({
    ...state,
    loading: true
  })),
  on(checkAuthSuccess, (state, { response }) => ({
    ...state,
    response,
    loading: false,
    error: null
  })),
  on(checkAuthFailure, (state) => ({
    ...state,
    response: null,
    loading: false
  })),
  on(saveFcmToken, (state, { fcmToken }) => ({
    ...state,
    fcmToken
  })),
  on(clearFcmToken, (state) => ({
    ...state,
    fcmToken: null
  })),
  on(clearAuthStore, () => ({
    ...initialState
  }))
);
