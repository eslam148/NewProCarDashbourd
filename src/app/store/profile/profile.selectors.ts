import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from './profile.reducer';

export const selectProfileState = createFeatureSelector<ProfileState>('profile');

export const selectProfile = createSelector(
  selectProfileState,
  (state: ProfileState) => state?.profile || null
);

export const selectProfileImage = createSelector(
  selectProfileState,
  (state: ProfileState) => state?.profile?.imageUrl || null
);

export const selectProfileFullName = createSelector(
  selectProfileState,
  (state: ProfileState) => {
    if (!state?.profile) return '';
    return `${state.profile.firstName} ${state.profile.lastName}`.trim();
  }
);

export const selectProfileInitials = createSelector(
  selectProfileState,
  (state: ProfileState) => {
    if (!state?.profile) return 'U';
    const firstName = state.profile.firstName || '';
    const lastName = state.profile.lastName || '';
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    if (firstInitial && lastInitial) {
      return firstInitial + lastInitial;
    } else if (firstInitial) {
      return firstInitial;
    } else if (lastInitial) {
      return lastInitial;
    } else {
      return 'U';
    }
  }
);

export const selectProfileLoading = createSelector(
  selectProfileState,
  (state: ProfileState) => state?.loading || false
);

export const selectProfileError = createSelector(
  selectProfileState,
  (state: ProfileState) => state?.error || null
);
