import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';
import {
  loadAdmins,
  loadAdminsSuccess,
  loadAdminsFailure,
  updateAdmin,
  updateAdminSuccess,
  updateAdminFailure,
  deleteAdmin,
  deleteAdminSuccess,
  deleteAdminFailure,
  registerAdmin,
  registerAdminSuccess,
  registerAdminFailure
} from './admin.actions';
import { AdminsDto } from '../../Models/DTOs/AdminsDto';
import { GenericResponse } from '../../Models/Responses/GenericResponse';

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  count: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

@Injectable()
export class AdminEffects {
  constructor(
    private actions$: Actions,
    private adminService: AdminService
  ) {}

  loadAdmins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAdmins),
      mergeMap(({ searchDto }) => {
        return this.adminService.getAdmins(searchDto).pipe(
          map(response => {
            if (response.status === 1) {
              throw new Error(response.message);
            }
            return loadAdminsSuccess({ admins: response.data });
          }),
          catchError(error => {
            console.error('loadAdmins Effect - Error:', error);
            return of(loadAdminsFailure({ error: error.message || 'An error occurred while loading admins' }));
          })
        );
      })
    )
  );

  updateAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAdmin),
      mergeMap(({ updateAdminDto }) => {
        return this.adminService.EditAdmin(updateAdminDto).pipe(
          map(response => {
            if (response.status === 1) {
              throw new Error(response.message);
            }
            return updateAdminSuccess({ admin: response.data });
          }),
          catchError(error => {
            console.error('updateAdmin Effect - Error:', error);
            return of(updateAdminFailure({ error: error.message || 'An error occurred while updating admin' }));
          })
        );
      })
    )
  );

  deleteAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteAdmin),
      mergeMap(({ id }) => {
        return this.adminService.DeleteAdmin(id).pipe(
          map(response => {
            if (response.status === 1) {
              throw new Error(response.message);
            }
            return deleteAdminSuccess({ id });
          }),
          catchError(error => {
            console.error('deleteAdmin Effect - Error:', error);
            return of(deleteAdminFailure({ error: error.message || 'An error occurred while deleting admin' }));
          })
        );
      })
    )
  );

  registerAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerAdmin),
      mergeMap(({ registerDto }) => {
        return this.adminService.RegisterAdmin(registerDto).pipe(
          switchMap((response: GenericResponse<string>) => {
            if (response.status === 1) {
              throw new Error(response.message);
            }
            // After successful registration, dispatch success and reload admins
            return [
              registerAdminSuccess({ adminId: response.data }),
              loadAdmins({ searchDto: { SearchKey: '', PageNumber: 1, PageSize: 10 } })
            ];
          }),
          catchError(error => {
            console.error('registerAdmin Effect - Error:', error);
            const errorMessage = error.message || error.response?.message || 'An error occurred while registering admin';
            return of(registerAdminFailure({ error: errorMessage }));
          })
        );
      })
    )
  );
}
