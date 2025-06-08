import { createReducer, on } from '@ngrx/store';
import {
  loadProfile,
  loadProfileSuccess,
  loadProfileFailure,
  updateProfileImage,
  clearProfile
} from './profile.actions';
import { ProfileData } from './profile.actions';

export interface ProfileState {
  profile: ProfileData | null;
  loading: boolean;
  error: any;
}

export const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null
};

export const profileReducer = createReducer(
  initialState,
  on(loadProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
    error: null
  })),
  on(loadProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(updateProfileImage, (state, { imageUrl }) => ({
    ...state,
    profile: state.profile ? {
      ...state.profile,
      imageUrl
    } : null
  })),
  on(clearProfile, () => ({
    ...initialState
  }))
);
