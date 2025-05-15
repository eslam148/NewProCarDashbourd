import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
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

@Injectable()
export class AdminEffects {
  constructor(
    private actions$: Actions,
    private adminService: AdminService
  ) {
    // Log all actions
    this.actions$.subscribe(action => {
      console.log('Action Dispatched:', action);
    });
  }

  loadAdmins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAdmins),
      tap(action => console.log('loadAdmins Effect - Action:', action)),
      mergeMap(({ searchDto }) => {
        console.log('loadAdmins Effect - Calling Service with:', searchDto);
        return this.adminService.getAdmins(searchDto).pipe(
          tap(response => console.log('loadAdmins Effect - Service Response:', response)),
          map(response => {
            console.log('loadAdmins Effect - Dispatching Success:', response.data);
            return loadAdminsSuccess({ admins: response.data });
          }),
          catchError(error => {
            console.error('loadAdmins Effect - Error:', error);
            return of(loadAdminsFailure({ error }));
          })
        );
      })
    )
  );

  updateAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAdmin),
      tap(action => console.log('updateAdmin Effect - Action:', action)),
      mergeMap(({ updateAdminDto }) => {
        console.log('updateAdmin Effect - Calling Service with:', updateAdminDto);
        return this.adminService.EditAdmin(updateAdminDto).pipe(
          tap(response => console.log('updateAdmin Effect - Service Response:', response)),
          map(response => {
            console.log('updateAdmin Effect - Dispatching Success:', response);
            return updateAdminSuccess({ admin: response.data });
          }),
          catchError(error => {
            console.error('updateAdmin Effect - Error:', error);
            return of(updateAdminFailure({ error }));
          })
        );
      })
    )
  );

  deleteAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteAdmin),
      tap(action => console.log('deleteAdmin Effect - Action:', action)),
      mergeMap(({ id }) => {
        console.log('deleteAdmin Effect - Calling Service with ID:', id);
        return this.adminService.DeleteAdmin(id).pipe(
          tap(response => console.log('deleteAdmin Effect - Service Response:', response)),
          map(() => {
            console.log('deleteAdmin Effect - Dispatching Success for ID:', id);
            return deleteAdminSuccess({ id });
          }),
          catchError(error => {
            console.error('deleteAdmin Effect - Error:', error);
            return of(deleteAdminFailure({ error }));
          })
        );
      })
    )
  );

  registerAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerAdmin),
      tap(action => console.log('registerAdmin Effect - Action:', action)),
      mergeMap(({ registerDto }) => {
        console.log('registerAdmin Effect - Calling Service with:', registerDto);
        return this.adminService.RegisterAdmin(registerDto).pipe(
          tap(response => console.log('registerAdmin Effect - Service Response:', response)),
          map(response => {
            console.log('registerAdmin Effect - Dispatching Success:', response);
            return registerAdminSuccess({ admin: response.data });
          }),
          catchError(error => {
            console.error('registerAdmin Effect - Error:', error);
            return of(registerAdminFailure({ error }));
          })
        );
      })
    )
  );
}
