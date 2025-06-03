import { TranslatePipe } from './../../pipes/translate.pipe';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  TableDirective,
  ButtonDirective,
  AlertComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalTitleDirective,
  ButtonGroupModule,
  SpinnerComponent,

} from '@coreui/angular';

import { ActionButtonComponent } from '../../shared/components';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ReservationService } from '../../services/reservation.service';
import {
  ReservationModel,
  GetAllReservationsRequest
} from '../../Models/DTOs/Reservation';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    TranslatePipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    TableDirective,
    ButtonDirective,
    AlertComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalTitleDirective,
    ButtonGroupModule,
    SpinnerComponent,
    ActionButtonComponent,
    PaginationComponent
  ],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  // Data properties
  reservations: ReservationModel[] = [];
  selectedReservation: ReservationModel | null = null;

  // Pagination properties
  currentPage = 1;
  pageSize = 3;
  totalItems = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPreviousPage = false;

  // Loading and state properties
  isLoading = false;
  isLoadingAction = false;
  error: string | null = null;
  success: string | null = null;

  // Filter properties
  filterForm!: FormGroup;
  statusOptions: any[] = [];
  showFilters = true; // Show filters by default

  // Modal properties
  showDetailsModal = false;
  showConfirmModal = false;
  confirmAction: 'complete' | 'cancel' | 'delete' | null = null;
  confirmReservationId: number | null = null;

  constructor(
    private reservationService: ReservationService,
    private fb: FormBuilder
  ) {
    this.initializeFilterForm();
  }

  ngOnInit(): void {
    this.statusOptions = this.reservationService.getStatusOptions();

    // Set first status option as default
    if (this.statusOptions.length > 0) {
      this.filterForm.patchValue({
        status: this.statusOptions[0].value
      });
    }

    this.loadReservations();
  }

  private initializeFilterForm(): void {
    this.filterForm = this.fb.group({
      searchText: [''],
      status: [''], // Will be set to first option after statusOptions are loaded
      fromDate: [''],
      toDate: ['']
    });
  }

  /**
   * Load reservations with current filters and pagination
   */
  loadReservations(): void {
    this.isLoading = true;
    this.error = null;

    const request: GetAllReservationsRequest = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchText: this.filterForm.get('searchText')?.value || '',
      status: this.filterForm.get('status')?.value,
      fromDate: this.filterForm.get('fromDate')?.value || undefined,
      toDate: this.filterForm.get('toDate')?.value || undefined
    };

    this.reservationService.getAllReservations(request).subscribe({
      next: (response) => {
        if (response.status === 0 && response.data) {
          this.reservations = response.data.items;
          this.totalItems = response.data.totalCount;
          this.totalPages = response.data.totalPages;
          this.hasNextPage = response.data.hasNextPage;
          this.hasPreviousPage = response.data.hasPreviousPage;
        } else {
          this.error = response.message || 'Failed to load reservations';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load reservations';
        this.isLoading = false;
        console.error('Error loading reservations:', error);
      }
    });
  }

  /**
   * Handle page change
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadReservations();
  }

  /**
   * Apply filters
   */
  applyFilters(): void {
    this.currentPage = 1;
    this.loadReservations();
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadReservations();
  }

  /**
   * View reservation details
   */
  viewDetails(reservation: ReservationModel): void {
    this.selectedReservation = reservation;
    this.showDetailsModal = true;
  }

  /**
   * Show confirmation modal
   */
  showConfirmation(action: 'complete' | 'cancel' | 'delete', reservationId: number): void {
    this.confirmAction = action;
    this.confirmReservationId = reservationId;
    this.showConfirmModal = true;
  }

  /**
   * Confirm action
   */
  confirmActionHandler(): void {
    if (!this.confirmAction || !this.confirmReservationId) return;

    this.isLoadingAction = true;
    this.error = null;
    this.success = null;

    let actionObservable: Observable<any>;
    let successMessage = '';

    switch (this.confirmAction) {
      case 'complete':
        actionObservable = this.reservationService.completeReservation(this.confirmReservationId);
        successMessage = 'RESERVATION.MESSAGES.COMPLETED_SUCCESS';
        break;
      case 'cancel':
        actionObservable = this.reservationService.cancelReservation(this.confirmReservationId);
        successMessage = 'RESERVATION.MESSAGES.CANCELLED_SUCCESS';
        break;
      case 'delete':
        actionObservable = this.reservationService.deleteReservation(this.confirmReservationId);
        successMessage = 'RESERVATION.MESSAGES.DELETED_SUCCESS';
        break;
      default:
        this.isLoadingAction = false;
        return;
    }

    actionObservable.subscribe({
      next: (response: any) => {
        if (response.status === 0) {
          this.success = successMessage;
          this.loadReservations();
        } else {
          this.error = response.message || 'Action failed';
        }
        this.isLoadingAction = false;
        this.closeConfirmModal();
      },
      error: (error: any) => {
        this.error = 'Action failed';
        this.isLoadingAction = false;
        this.closeConfirmModal();
        console.error('Error performing action:', error);
      }
    });
  }

  /**
   * Close modals
   */
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedReservation = null;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.confirmAction = null;
    this.confirmReservationId = null;
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: string): string {
    return this.reservationService.getStatusBadgeClass(status);
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    return this.reservationService.formatDate(dateString);
  }

  /**
   * Format time
   */
  formatTime(timeString: string): string {
    return this.reservationService.formatTime(timeString);
  }

  /**
   * Clear messages
   */
  clearMessages(): void {
    this.error = null;
    this.success = null;
  }

  /**
   * Track by function for reservations list
   */
  trackByReservationId(_index: number, reservation: ReservationModel): number {
    return reservation.id;
  }

  /**
   * Toggle filters visibility
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  /**
   * Check if there are active filters
   */
  hasActiveFilters(): boolean {
    const formValue = this.filterForm.value;
    return !!(
      formValue.searchText ||
      formValue.status ||
      formValue.fromDate ||
      formValue.toDate
    );
  }

  /**
   * Clear specific filter
   */
  clearFilter(filterName: string): void {
    this.filterForm.patchValue({ [filterName]: '' });
    this.applyFilters();
  }

  /**
   * Get status label for display
   */
  getStatusLabel(statusValue: string): string {
    const status = this.statusOptions.find(s => s.value === statusValue);
    return status ? status.label : statusValue;
  }

  /**
   * Print reservation details
   */
  printReservationDetails(): void {
    if (this.selectedReservation) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const printContent = this.generatePrintContent(this.selectedReservation);
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  }

  /**
   * Generate print content for reservation
   */
  private generatePrintContent(reservation: ReservationModel): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reservation Details - #${reservation.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .info-row { display: flex; margin: 10px 0; }
          .info-label { font-weight: bold; width: 150px; }
          .info-value { flex: 1; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reservation Details</h1>
          <h2>#${reservation.id}</h2>
        </div>

        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="info-row">
            <div class="info-label">Name:</div>
            <div class="info-value">${reservation.patientName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Phone:</div>
            <div class="info-value">${reservation.patientPhone}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Appointment Information</div>
          <div class="info-row">
            <div class="info-label">Date:</div>
            <div class="info-value">${this.formatDate(reservation.date)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Time:</div>
            <div class="info-value">${this.formatTime(reservation.time)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Status:</div>
            <div class="info-value">${reservation.status}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Location Information</div>
          <div class="info-row">
            <div class="info-label">Governorate:</div>
            <div class="info-value">${reservation.governorateName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">City:</div>
            <div class="info-value">${reservation.cityName}</div>
          </div>
          ${reservation.addresNotes ? `
          <div class="info-row">
            <div class="info-label">Address Notes:</div>
            <div class="info-value">${reservation.addresNotes}</div>
          </div>
          ` : ''}
        </div>

        ${reservation.note ? `
        <div class="section">
          <div class="section-title">Additional Notes</div>
          <div class="info-row">
            <div class="info-value">${reservation.note}</div>
          </div>
        </div>
        ` : ''}

        <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
          Printed on ${new Date().toLocaleString()}
        </div>
      </body>
      </html>
    `;
  }
}
