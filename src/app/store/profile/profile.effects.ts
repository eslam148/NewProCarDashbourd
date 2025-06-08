import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';
import {
  loadProfile,
  loadProfileSuccess,
  loadProfileFailure,
  ProfileData
} from './profile.actions';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private adminService: AdminService
  ) {}

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProfile),
      mergeMap(({ userId }) => {
        return this.adminService.getAdminById(userId).pipe(
          map(response => {
            if (response.status === 0 && response.data) {
              const profileData: ProfileData = {
                id: response.data.id,
                firstName: response.data.firstName || '',
                lastName: response.data.lastName || '',
                phoneNumber: response.data.phoneNumber || '',
                imageUrl: response.data.imageUrl || undefined
              };
              return loadProfileSuccess({ profile: profileData });
            } else {
              throw new Error(response.message || 'Failed to load profile');
            }
          }),
          catchError(error => {
            console.error('Profile load error:', error);
            return of(loadProfileFailure({ error }));
          })
        );
      })
    )
  );
}
