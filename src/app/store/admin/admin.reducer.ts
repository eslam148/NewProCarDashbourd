import { Update } from './../../../../node_modules/@ngrx/entity/src/models.d';
import { createReducer, on } from '@ngrx/store';
import { AdminsDto } from '../../Models/DTOs/AdminsDto';
import { UpdateAdminDto } from '../../Models/DTOs/UpdateAdminDto';
import { RegisterDto } from '../../Models/DTOs/RegisterDto';
import * as AdminActions from './admin.actions';

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

export interface AdminState {
  admins: PaginatedResponse<AdminsDto> | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateAdminState {
  admins: string;
  loading: boolean;
  error: string | null;
}

export const initialUpdateAdminState: UpdateAdminState = {
  admins: "",
  loading: false,
  error: null
};

export const initialState: AdminState = {
  admins: null,
  loading: false,
  error: null
};

export const adminReducer = createReducer(
  initialState,
  on(AdminActions.loadAdmins, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AdminActions.loadAdminsSuccess, (state, { admins }) => ({
    ...state,
    admins,
    loading: false,
    error: null
  })),
  on(AdminActions.loadAdminsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AdminActions.updateAdmin, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AdminActions.updateAdminSuccess, (state, { admin }) => ({
    ...state,
    admins: state.admins ? {
      ...state.admins,
      items: state.admins.items.map(a => a.id === admin.id ? admin : a)
    } : null,
    loading: false,
    error: null
  })),
  on(AdminActions.updateAdminFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AdminActions.deleteAdmin, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AdminActions.deleteAdminSuccess, (state, { id }) => ({
    ...state,
    admins: state.admins ? {
      ...state.admins,
      items: state.admins.items.filter(a => a.id !== id)
    } : null,
    loading: false,
    error: null
  })),
  on(AdminActions.deleteAdminFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AdminActions.registerAdmin, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AdminActions.clearAdminError, (state) => ({
    ...state,
    error: null
  }))
);
