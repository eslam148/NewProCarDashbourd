import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import {
  CardModule,
  BreadcrumbModule,
  AlertModule,
  ButtonModule,
  FormModule,
  ModalModule,
  SpinnerModule,
  TableModule,
  BadgeModule
} from '@coreui/angular';
import { AppVersionService } from '../../services/app-version.service';
import {
  AppVersionDto,
  CreateAppVersionDto,
  UpdateAppVersionDto,
  ForceUpdateDto,
  PlatformType,
  PlatformNames
} from '../../Models/DTOs/AppVersionDto';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-app-version',
  templateUrl: './app-version.component.html',
  styleUrls: ['./app-version.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    CardModule,
    BreadcrumbModule,
    AlertModule,
    ButtonModule,
    FormModule,
    ModalModule,
    SpinnerModule,
    TableModule,
    BadgeModule,
    TranslatePipe
  ]
})
export class AppVersionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  versions: AppVersionDto[] = [];
  filteredVersions: AppVersionDto[] = [];
  loading = false;
  saving = false;

  // Modal states
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showForceUpdateModal = false;

  // Forms
  addForm!: FormGroup;
  editForm!: FormGroup;
  searchForm!: FormGroup;
  forceUpdateForm!: FormGroup;

  // Selected items
  selectedVersion: AppVersionDto | null = null;

  // Platform options
  platformOptions = [
    { value: PlatformType.IOS, label: 'iOS' },
    { value: PlatformType.Android, label: 'Android' },
    { value: PlatformType.Web, label: 'Web' }
  ];

  // Table configuration
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;

  // Messages
  successMessage = '';
  errorMessage = '';

  // Breadcrumb
  breadcrumbItems = [
    { label: 'common.dashboard', url: '/dashboard', active: false },
    { label: 'appVersion.title', url: '', active: true }
  ];

  constructor(
    private fb: FormBuilder,
    private appVersionService: AppVersionService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadVersions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.addForm = this.fb.group({
      version: ['', [Validators.required, Validators.pattern(/^\d+\.\d+(\.\d+)?$/)]],
      platform: [null, Validators.required]
    });

    this.editForm = this.fb.group({
      id: [0],
      version: ['', [Validators.required, Validators.pattern(/^\d+\.\d+(\.\d+)?$/)]],
      platform: [null, Validators.required]
    });

    this.searchForm = this.fb.group({
      version: [''],
      platform: [null]
    });

    this.forceUpdateForm = this.fb.group({
      version: ['', [Validators.required, Validators.pattern(/^\d+\.\d+(\.\d+)?$/)]],
      platform: [null, Validators.required]
    });
  }

  loadVersions(): void {
    this.loading = true;
    this.appVersionService.getAllVersions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === 1 && response.data) {
            this.versions = response.data;
            this.filteredVersions = [...this.versions];
            this.applyFilters();
          } else {
            this.showError(response.message || 'appVersion.errors.loadFailed');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading versions:', error);
          this.showError('appVersion.errors.loadFailed');
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    const searchValues = this.searchForm.value;
    this.filteredVersions = this.versions.filter(version => {
      const versionMatch = !searchValues.version ||
        version.version.toLowerCase().includes(searchValues.version.toLowerCase());
      const platformMatch = !searchValues.platform ||
        version.platformType === searchValues.platform;

      return versionMatch && platformMatch;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.filteredVersions = [...this.versions];
  }

  clearField(fieldName: string): void {
    this.searchForm.patchValue({ [fieldName]: '' });
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    const formValue = this.searchForm.value;
    return !!(formValue.version || formValue.platform);
  }

  // Add Version Modal
  openAddModal(): void {
    this.addForm.reset();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.addForm.reset();
  }

  onAddVersion(): void {
    if (this.addForm.valid) {
      this.saving = true;
      const createDto: CreateAppVersionDto = {
        version: this.addForm.value.version,
        platform: this.addForm.value.platform
      };

      this.appVersionService.addNewVersion(createDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status === 1) {
              this.showSuccess('appVersion.messages.addSuccess');
              this.closeAddModal();
              this.loadVersions();
            } else {
              this.showError(response.message || 'appVersion.errors.addFailed');
            }
            this.saving = false;
          },
          error: (error) => {
            console.error('Error adding version:', error);
            this.showError('appVersion.errors.addFailed');
            this.saving = false;
          }
        });
    }
  }

  // Edit Version Modal
  openEditModal(version: AppVersionDto): void {
    this.selectedVersion = version;
    this.editForm.patchValue({
      id: version.id,
      version: version.version,
      platform: version.platformType
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editForm.reset();
    this.selectedVersion = null;
  }

  onEditVersion(): void {
    if (this.editForm.valid && this.selectedVersion) {
      this.saving = true;
      const updateDto: UpdateAppVersionDto = {
        id: this.editForm.value.id,
        version: this.editForm.value.version,
        platform: this.editForm.value.platform
      };

      this.appVersionService.updateVersion(updateDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status === 1) {
              this.showSuccess('appVersion.messages.updateSuccess');
              this.closeEditModal();
              this.loadVersions();
            } else {
              this.showError(response.message || 'appVersion.errors.updateFailed');
            }
            this.saving = false;
          },
          error: (error) => {
            console.error('Error updating version:', error);
            this.showError('appVersion.errors.updateFailed');
            this.saving = false;
          }
        });
    }
  }

  // Delete Version Modal
  openDeleteModal(version: AppVersionDto): void {
    this.selectedVersion = version;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedVersion = null;
  }

  onDeleteVersion(): void {
    if (this.selectedVersion) {
      this.saving = true;
      this.appVersionService.deleteVersion(this.selectedVersion.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status === 1) {
              this.showSuccess('appVersion.messages.deleteSuccess');
              this.closeDeleteModal();
              this.loadVersions();
            } else {
              this.showError(response.message || 'appVersion.errors.deleteFailed');
            }
            this.saving = false;
          },
          error: (error) => {
            console.error('Error deleting version:', error);
            this.showError('appVersion.errors.deleteFailed');
            this.saving = false;
          }
        });
    }
  }

  // Force Update Modal
  openForceUpdateModal(): void {
    this.forceUpdateForm.reset();
    this.showForceUpdateModal = true;
  }

  closeForceUpdateModal(): void {
    this.showForceUpdateModal = false;
    this.forceUpdateForm.reset();
  }

  onForceUpdate(): void {
    if (this.forceUpdateForm.valid) {
      this.saving = true;
      const forceUpdateDto: ForceUpdateDto = {
        version: this.forceUpdateForm.value.version,
        platform: this.forceUpdateForm.value.platform
      };

      this.appVersionService.forceUpdate(forceUpdateDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status === 1) {
              this.showSuccess('appVersion.messages.forceUpdateSuccess');
              this.closeForceUpdateModal();
            } else {
              this.showError(response.message || 'appVersion.errors.forceUpdateFailed');
            }
            this.saving = false;
          },
          error: (error) => {
            console.error('Error forcing update:', error);
            this.showError('appVersion.errors.forceUpdateFailed');
            this.saving = false;
          }
        });
    }
  }

  // Utility methods
  getPlatformName(platformType: number): string {
    return PlatformNames[platformType as PlatformType] || 'Unknown';
  }

  getPlatformBadgeColor(platformType: number): string {
    switch (platformType) {
      case PlatformType.IOS:
        return 'info';
      case PlatformType.Android:
        return 'success';
      case PlatformType.Web:
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getFieldError(form: FormGroup, fieldName: string): string | null {
    const field = form.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return 'common.validation.required';
      }
      if (field.errors?.['pattern']) {
        return 'appVersion.validation.versionPattern';
      }
    }
    return null;
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  dismissSuccess(): void {
    this.successMessage = '';
  }

  dismissError(): void {
    this.errorMessage = '';
  }
}
