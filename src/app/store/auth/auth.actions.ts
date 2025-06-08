import { LoginResponse } from './../../Models/Responses/LoginResponse';
import { createAction, props } from '@ngrx/store';
import { Roles } from '../../Enums/Roles.enum';

export interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthOfDate: Date;
  role: Roles;
}

export const login = createAction(
  '[Auth] Login',
  props<{ phonenumber: string; password: string,deviceToken:string }>()
);

export const saveFcmToken = createAction(
  '[Auth] Save FCM Token',
  props<{ fcmToken: string }>()
);

export const clearFcmToken = createAction(
  '[Auth] Clear FCM Token'
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: LoginResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const checkAuth = createAction('[Auth] Check Auth');

export const checkAuthSuccess = createAction(
  '[Auth] Check Auth Success',
  props<{ response: LoginResponse }>()
);

export const checkAuthFailure = createAction('[Auth] Check Auth Failure');
