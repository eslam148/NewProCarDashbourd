import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ReservationModel,
  GetAllReservationsRequest,
  ReservationResponseModel,
  ApiResponse
} from '../Models/DTOs/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = 'http://procare.runasp.net/api/Reservation/Admin';

  constructor(private http: HttpClient) {}

  /**
   * Get all reservations with pagination and filters
   */
  getAllReservations(request: GetAllReservationsRequest): Observable<ApiResponse<ReservationResponseModel>> {
    const url = `${this.baseUrl}/GetAll`;
    return this.http.post<ApiResponse<ReservationResponseModel>>(url, request);
  }

  /**
   * Get reservation by ID
   */
  getReservationById(id: number): Observable<ApiResponse<ReservationModel>> {
    const url = `${this.baseUrl}/GetById/${id}`;
    return this.http.get<ApiResponse<ReservationModel>>(url);
  }

  /**
   * Complete a reservation
   */
  completeReservation(id: number): Observable<ApiResponse<boolean>> {
    const url = `${this.baseUrl}/Complete/${id}`;
    return this.http.put<ApiResponse<boolean>>(url, {});
  }

  /**
   * Cancel a reservation
   */
  cancelReservation(id: number): Observable<ApiResponse<boolean>> {
    const url = `${this.baseUrl}/Cancel/${id}`;
    return this.http.put<ApiResponse<boolean>>(url, {});
  }

  /**
   * Update reservation status
   */
  updateReservationStatus(id: number, status: number): Observable<ApiResponse<boolean>> {
    const url = `${this.baseUrl}/UpdateStatus/${id}`;
    return this.http.put<ApiResponse<boolean>>(url, { status });
  }

  /**
   * Delete a reservation
   */
  deleteReservation(id: number): Observable<ApiResponse<boolean>> {
    const url = `${this.baseUrl}/Delete/${id}`;
    return this.http.delete<ApiResponse<boolean>>(url);
  }

  /**
   * Get reservations statistics
   */
  getReservationsStats(): Observable<ApiResponse<any>> {
    const url = `${this.baseUrl}/Stats`;
    return this.http.get<ApiResponse<any>>(url);
  }

  /**
   * Export reservations to Excel
   */
  exportReservations(request: GetAllReservationsRequest): Observable<Blob> {
    const url = `${this.baseUrl}/Export`;
    return this.http.post(url, request, {
      responseType: 'blob'
    });
  }

  /**
   * Get reservation status options
   */
  getStatusOptions() {
    return [
      { value: 0, label: 'RESERVATION.STATUS.NEW', color: 'primary' },
      { value: 1, label: 'RESERVATION.STATUS.IN_PROGRESS', color: 'warning' },
      { value: 2, label: 'RESERVATION.STATUS.COMPLETED', color: 'success' },
      { value: 3, label: 'RESERVATION.STATUS.CANCELLED', color: 'danger' }
    ];
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'badge bg-primary';
      case 'inprogress':
      case 'in progress':
        return 'badge bg-warning';
      case 'completed':
        return 'badge bg-success';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Format time for display
   */
  formatTime(timeString: string): string {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}
