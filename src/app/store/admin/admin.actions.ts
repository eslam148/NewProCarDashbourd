import { createAction, props } from '@ngrx/store';
import { AdminsDto } from '../../Models/DTOs/AdminsDto';
import { AdminsSearchDto } from '../../Models/DTOs/AdminsSearchDto';
import { UpdateAdminDto } from '../../Models/DTOs/UpdateAdminDto';
import { RegisterDto } from '../../Models/DTOs/RegisterDto';

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

// Load Admins
export const loadAdmins = createAction(
  '[Admin] Load Admins',
  props<{ searchDto: AdminsSearchDto }>()
);

export const loadAdminsSuccess = createAction(
  '[Admin] Load Admins Success',
  props<{ admins: PaginatedResponse<AdminsDto> }>()
);

export const loadAdminsFailure = createAction(
  '[Admin] Load Admins Failure',
  props<{ error: string }>()
);

// Update Admin
export const updateAdmin = createAction(
  '[Admin] Update Admin',
  props<{ updateAdminDto: UpdateAdminDto }>()
);

export const updateAdminSuccess = createAction(
  '[Admin] Update Admin Success',
  props<{ admin: AdminsDto }>()
);

export const updateAdminFailure = createAction(
  '[Admin] Update Admin Failure',
  props<{ error: string }>()
);

// Delete Admin
export const deleteAdmin = createAction(
  '[Admin] Delete Admin',
  props<{ id: string }>()
);

export const deleteAdminSuccess = createAction(
  '[Admin] Delete Admin Success',
  props<{ id: string }>()
);

export const deleteAdminFailure = createAction(
  '[Admin] Delete Admin Failure',
  props<{ error: string }>()
);

// Register Admin
export const registerAdmin = createAction(
  '[Admin] Register Admin',
  props<{ registerDto: RegisterDto }>()
);

export const registerAdminSuccess = createAction(
  '[Admin] Register Admin Success',
  props<{ admin: string }>()
);

export const registerAdminFailure = createAction(
  '[Admin] Register Admin Failure',
  props<{ error: string }>()
);

export const clearAdminError = createAction(
  '[Admin] Clear Error'
);
