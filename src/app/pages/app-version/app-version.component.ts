import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
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
  showForceUpdateConfirmModal = false;

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
   ];

  // Available versions for force update dropdown
  availableVersionsForForceUpdate: {value: string, label: string}[] = [];

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
    // Apply default filters after initialization
    setTimeout(() => {
      this.applyFilters();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.addForm = this.fb.group({
      version: ['', [Validators.required, Validators.pattern(/^\d+\.\d+(\.\d+)?$/)]],
      platform: [PlatformType.IOS, Validators.required] // Default to iOS
    });

    this.editForm = this.fb.group({
      id: [0],
      version: ['', [Validators.required, Validators.pattern(/^\d+\.\d+(\.\d+)?$/)]],
      platform: [null, Validators.required]
    });

    this.searchForm = this.fb.group({
      version: [''],
      platform: [PlatformType.IOS] // Default to iOS for filtering
    });

    this.forceUpdateForm = this.fb.group({
      version: ['', Validators.required],
      platform: [PlatformType.IOS, Validators.required] // Default to iOS
    });
  }

  loadVersions(): void {
    this.loading = true;
    this.appVersionService.getAllVersions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === 0 && response.data) {
            this.versions = response.data;
            this.filteredVersions = [...this.versions];
            this.applyFilters();
          } else {
            this.showError(response.message || 'appVersion.errors.loadFailed');
            // If no data available, create sample data for demonstration
            this.createSampleData();
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading versions:', error);
          this.showError('appVersion.errors.loadFailed');
          // If error loading, create sample data for demonstration
          this.createSampleData();
          this.loading = false;
        }
      });
  }

  private createSampleData(): void {
    this.versions = [
      {
        id: 1,
        version: '2.1.0',
        platformName: 'iOS',
        platformType: PlatformType.IOS,
        createdAt: '2024-01-15T10:30:00Z',
        modifiedAt: '2024-01-15T10:30:00Z',
        createdBy: 'Admin',
        modifiedBy: 'Admin'
      },
      {
        id: 2,
        version: '2.0.5',
        platformName: 'iOS',
        platformType: PlatformType.IOS,
        createdAt: '2024-01-10T09:20:00Z',
        modifiedAt: '2024-01-10T09:20:00Z',
        createdBy: 'Admin',
        modifiedBy: 'Admin'
      },
      {
        id: 3,
        version: '2.0.0',
        platformName: 'iOS',
        platformType: PlatformType.IOS,
        createdAt: '2024-01-05T14:15:00Z',
        modifiedAt: '2024-01-05T14:15:00Z',
        createdBy: 'Admin',
        modifiedBy: 'Admin'
      },
      {
        id: 4,
        version: '2.1.2',
        platformName: 'Android',
        platformType: PlatformType.Android,
        createdAt: '2024-01-18T11:45:00Z',
        modifiedAt: '2024-01-18T11:45:00Z',
        createdBy: 'Admin',
        modifiedBy: 'Admin'
      },
      {
        id: 5,
        version: '2.1.0',
        platformName: 'Android',
        platformType: PlatformType.Android,
        createdAt: '2024-01-15T10:30:00Z',
        modifiedAt: '2024-01-15T10:30:00Z',
        createdBy: 'Admin',
        modifiedBy: 'Admin'
      },
      {
        id: 6,
        version: '2.0.8',
        platformName: 'Android',
        platformType: PlatformType.Android,
        createdAt: '2024-01-12T16:00:00Z',
        modifiedAt: '2024-01-12T16:00:00Z',
        createdBy: 'Admin',
        modifiedBy: 'Admin'
      }
    ];
    this.filteredVersions = [...this.versions];
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
    // Set default platform after reset
    this.searchForm.patchValue({
      platform: PlatformType.IOS
    });
    this.applyFilters();
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
    // Set default platform after reset
    this.addForm.patchValue({
      platform: PlatformType.IOS
    });
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.addForm.reset();
    // Restore default platform
    this.addForm.patchValue({
      platform: PlatformType.IOS
    });
  }

  onAddVersion(): void {
    if (this.addForm.valid) {
      this.saving = true;
      const createDto: CreateAppVersionDto = {
        version: this.addForm.value.version,
        platform: Number(this.addForm.value.platform)
      };

      this.appVersionService.addNewVersion(createDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status === 0) {
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
            if (response.status === 0) {
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
    this.availableVersionsForForceUpdate = [];

    // Set default platform after reset
    this.forceUpdateForm.patchValue({
      platform: PlatformType.IOS
    });

    // Auto-populate versions for default platform and select latest
    this.updateAvailableVersions(PlatformType.IOS);
    if (this.availableVersionsForForceUpdate.length > 0) {
      this.forceUpdateForm.patchValue({
        version: this.availableVersionsForForceUpdate[0].value // Select latest version (first in sorted list)
      });
    }

    this.showForceUpdateModal = true;
  }

  closeForceUpdateModal(): void {
    this.showForceUpdateModal = false;
    this.forceUpdateForm.reset();
    this.availableVersionsForForceUpdate = [];

    // Restore default platform
    this.forceUpdateForm.patchValue({
      platform: PlatformType.IOS
    });

    // Re-populate versions for default platform
    this.updateAvailableVersions(PlatformType.IOS);
    if (this.availableVersionsForForceUpdate.length > 0) {
      this.forceUpdateForm.patchValue({
        version: this.availableVersionsForForceUpdate[0].value
      });
    }
  }

    onForceUpdatePlatformChange(): void {
    const selectedPlatform = this.forceUpdateForm.get('platform')?.value;

    if (selectedPlatform) {
      this.updateAvailableVersions(Number(selectedPlatform));
      // Auto-select latest version when platform changes
      if (this.availableVersionsForForceUpdate.length > 0) {
        this.forceUpdateForm.patchValue({
          version: this.availableVersionsForForceUpdate[0].value // Select latest version
        });
      } else {
        this.forceUpdateForm.patchValue({ version: '' });
      }
    } else {
      this.availableVersionsForForceUpdate = [];
      this.forceUpdateForm.patchValue({ version: '' });
    }
  }

      private updateAvailableVersions(platformType: number): void {
    // Get unique versions for the selected platform
    const platformVersions = this.versions
      .filter(version => version.platformType === platformType)
      .map(version => version.version);

    // Remove duplicates and sort
    const uniqueVersions = [...new Set(platformVersions)].sort((a, b) => {
      // Sort versions in descending order (newest first)
      return this.compareVersions(b, a);
    });

    this.availableVersionsForForceUpdate = uniqueVersions.map(version => ({
      value: version,
      label: `${version}`
    }));
  }

  private compareVersions(a: string, b: string): number {
    const aParts = a.split('.').map(n => parseInt(n, 10));
    const bParts = b.split('.').map(n => parseInt(n, 10));

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;

      if (aPart !== bPart) {
        return aPart - bPart;
      }
    }

    return 0;
  }

  onForceUpdate(): void {
    if (this.forceUpdateForm.valid) {
      // Show confirmation modal first
      this.showForceUpdateConfirmModal = true;
    }
  }

  closeForceUpdateConfirmModal(): void {
    this.showForceUpdateConfirmModal = false;
  }

  onConfirmForceUpdate(): void {
    if (this.forceUpdateForm.valid) {
      this.saving = true;
      this.showForceUpdateConfirmModal = false;

      const forceUpdateDto: ForceUpdateDto = {
        version: this.forceUpdateForm.value.version,
        platform: Number( this.forceUpdateForm.value.platform)
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
