// Reservation Models
export interface ReservationModel {
  id: number;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  note: string;
  status: string;
  addresNotes: string;
  cityName: string;
  addressId: number;
  governorateName: string;
}

export interface GetAllReservationsRequest {
  pageNumber: number;
  pageSize: number;
  searchText?: string;
  status?: number;
  fromDate?: string;
  toDate?: string;
}

export interface ReservationResponseModel {
  items: ReservationModel[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  count: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  internalMessage: string | null;
  data: T;
  subStatus: number;
}

export enum ReservationStatus {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}

export interface ReservationFilterModel {
  searchText: string;
  status: ReservationStatus | null;
  fromDate: string;
  toDate: string;
}
