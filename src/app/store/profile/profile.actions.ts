import { createAction, props } from '@ngrx/store';
import { AdminsDto } from '../../Models/DTOs/AdminsDto';

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  imageUrl?: string;
}

// Load Profile
export const loadProfile = createAction(
  '[Profile] Load Profile',
  props<{ userId: string }>()
);

export const loadProfileSuccess = createAction(
  '[Profile] Load Profile Success',
  props<{ profile: ProfileData }>()
);

export const loadProfileFailure = createAction(
  '[Profile] Load Profile Failure',
  props<{ error: any }>()
);

// Update Profile Image
export const updateProfileImage = createAction(
  '[Profile] Update Profile Image',
  props<{ imageUrl: string }>()
);

// Clear Profile
export const clearProfile = createAction(
  '[Profile] Clear Profile'
);
