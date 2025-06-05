import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
 import { TranslatePipe } from '../../pipes/translate.pipe';

// CoreUI Imports
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  TableDirective,
  ButtonDirective,
  FormControlDirective,
  AlertComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalTitleDirective,
  ButtonGroupModule,
  SpinnerComponent
} from '@coreui/angular';

// Models and Services
import { ReportModel, ReportFilterModel, AddOrUpdateReportModel } from '../../models/report.model';
import { ReportService } from '../../services/report.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { IconDirective } from '@coreui/icons-angular';
import { ActionButtonComponent } from '../../shared/components';

@Component({
  selector: 'app-reports',
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
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  // Data properties
  reports: ReportModel[] = [];
  selectedReport: ReportModel | null = null;
  diseases: any[] = [];
  services: any[] = [];

  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPreviousPage = false;

  // Loading and error states
  isLoading = false;
  error: string | null = null;

  // Filter properties
  filterForm!: FormGroup;

  // Modal properties
  showDetailsModal = false;
  showAddEditModal = false;
  showPatientReportsModal = false;
  reportForm!: FormGroup;
  patientReports: ReportModel[] = [];
  selectedPatientName = '';
  isEditMode = false;

  constructor(
    private reportService: ReportService,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadReports();
    this.loadDiseases();
    this.loadServices();
  }

  /**
   * Initialize forms
   */
  private initializeForms(): void {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: ['']
    });

    this.reportForm = this.fb.group({
      requestId: [''],
      drugs: [''],
      notes: [''],
      diseasesIds: [[]],
      serviceIds: [[]]
    });
  }

  /**
   * Load reports with current filters and pagination
   */
  loadReports(): void {
    this.isLoading = true;
    this.error = null;

    const filters: ReportFilterModel = {
      pageNumber: this.currentPage - 1, // API uses 0-based indexing
      pageSize: this.pageSize,
      fromDate: this.filterForm.get('fromDate')?.value || undefined,
      toDate: this.filterForm.get('toDate')?.value || undefined
    };

    this.reportService.getAllReports(filters).subscribe({
      next: (response) => {
        if (response.status === 0) {
          this.reports = response.data.items;
          this.totalCount = response.data.totalCount;
          this.totalPages = response.data.totalPages;
          this.hasNextPage = response.data.hasNextPage;
          this.hasPreviousPage = response.data.hasPreviousPage;
        } else {
          this.error = response.message || 'Failed to load reports';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load reports. Please try again.';
        this.isLoading = false;
        console.error('Error loading reports:', error);
      }
    });
  }

  /**
   * Load diseases for dropdown
   */
  loadDiseases(): void {
    this.reportService.getDiseases().subscribe({
      next: (diseases) => {
        this.diseases = diseases;
      },
      error: (error) => {
        console.error('Error loading diseases:', error);
      }
    });
  }

  /**
   * Load services for dropdown
   */
  loadServices(): void {
    this.reportService.getServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  /**
   * Apply filters
   */
  applyFilters(): void {
    this.currentPage = 1;
    this.loadReports();
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadReports();
  }

  /**
   * Handle page change
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadReports();
  }

  /**
   * View report details
   */
  viewDetails(report: ReportModel): void {
    this.selectedReport = report;
    this.showDetailsModal = true;
  }

  /**
   * Close details modal
   */
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedReport = null;
  }

  /**
   * Open add report modal
   */
  openAddModal(): void {
    this.isEditMode = false;
    this.reportForm.reset();
    this.showAddEditModal = true;
  }

  /**
   * Close add/edit modal
   */
  closeAddEditModal(): void {
    this.showAddEditModal = false;
    this.reportForm.reset();
  }

  /**
   * Save report
   */
  saveReport(): void {
    if (this.reportForm.valid) {
      this.isLoading = true;

      const reportData: AddOrUpdateReportModel = this.reportForm.value;

      this.reportService.addOrUpdateReport(reportData).subscribe({
        next: (response) => {
          this.closeAddEditModal();
          this.loadReports();
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to save report. Please try again.';
          this.isLoading = false;
          console.error('Error saving report:', error);
        }
      });
    }
  }

  /**
   * View patient reports
   */
  viewPatientReports(patientId: string, patientName?: string): void {
    this.isLoading = true;
    this.selectedPatientName = patientName || 'Unknown Patient';

    this.reportService.getReportByPatientId(patientId).subscribe({
      next: (response) => {
        if (response.status === 0) {
          this.patientReports = response.data || [];
          this.showPatientReportsModal = true;
        } else if (response.status === 1 && response.message === 'No Data Founds!') {
          // Handle case when no reports found for patient
          this.patientReports = [];
          this.showPatientReportsModal = true;
        } else {
          this.error = response.message || 'Failed to load patient reports';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load patient reports. Please try again.';
        this.isLoading = false;
        console.error('Error loading patient reports:', error);
      }
    });
  }

  /**
   * Close patient reports modal
   */
  closePatientReportsModal(): void {
    this.showPatientReportsModal = false;
    this.patientReports = [];
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  /**
   * Format time for display
   */
  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  }

  /**
   * Track by function for reports list
   */
  trackByReportId(_index: number, report: ReportModel): string {
    return report.id;
  }
}
