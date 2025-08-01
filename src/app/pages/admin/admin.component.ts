import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalModule, ButtonModule, TooltipModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';

import { AdminsDto } from '../../Models/DTOs/AdminsDto';
import { RegisterDto } from '../../Models/DTOs/RegisterDto';
import { UpdateAdminDto } from '../../Models/DTOs/UpdateAdminDto';
import { AdminState } from '../../store/admin/admin.reducer';
import { loadAdmins, deleteAdmin, registerAdmin, updateAdmin, clearAdminError } from '../../store/admin/admin.actions';
import { selectAdmins, selectAdminLoading, selectAdminError } from '../../store/admin/admin.selectors';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { Actions, ofType } from '@ngrx/effects';
import { registerAdminSuccess, updateAdminSuccess } from '../../store/admin/admin.actions';

// Import shared components
import {
  DataTableComponent,
  ActionButtonComponent
} from '../../shared/components';

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

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule,
    ButtonModule,
    IconModule,
    TooltipModule,
    AlertModule,
    AdminFormComponent,
    TranslatePipe,
    DataTableComponent,
    ActionButtonComponent
  ]
})
export class AdminComponent implements OnInit, OnDestroy {
  admins$: Observable<AdminsDto[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  searchForm: FormGroup;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalItems = 0;
  showForm = false;
  selectedAdmin: AdminsDto | null = null;
  showDeleteModal = false;
  adminToDelete: string | null = null;
  protected readonly Math = Math; // Make Math available in template
  private destroy$ = new Subject<void>();
  private operationInProgress = false;

  // Default avatar path - update to use an existing avatar image
  defaultAvatarPath = 'assets/images/avatars/8.jpg';

  // Table columns definition
  tableColumns = [
    { key: 'firstName', label: 'admin.firstName' },
    { key: 'lastName', label: 'admin.lastName' },
    { key: 'phoneNumber', label: 'admin.phone' },

    { key: 'email', label: 'admin.email' }
  ];

  constructor(
    private store: Store<{ admin: AdminState }>,
    private fb: FormBuilder,
    private actions$: Actions
  ) {
    this.admins$ = this.store.select(selectAdmins).pipe(
      map((response: PaginatedResponse<AdminsDto> | null) => {
        if (response) {
          this.totalPages = response.totalPages;
          this.totalItems = response.totalCount;
          this.currentPage = response.pageNumber;
          return response.items;
        }
        return [];
      })
    );
    this.loading$ = this.store.select(selectAdminLoading);
    this.error$ = this.store.select(selectAdminError);
    this.searchForm = this.fb.group({
      SearchKey: new FormControl('')
    });

    // Subscribe to success actions to close form
    this.actions$.pipe(
      ofType(registerAdminSuccess, updateAdminSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.showForm = false;
      this.selectedAdmin = null;
      this.operationInProgress = false;
    });

    // Subscribe to error changes to handle operation completion
    this.error$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(error => {
      if (error) {
        // Operation failed
        this.operationInProgress = false;
      }
    });

    // Subscribe to loading changes
    this.loading$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      if (!loading && this.operationInProgress) {
        // Additional check to ensure operation is complete
        this.operationInProgress = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadAdmins();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAdmins(): void {
    this.store.dispatch(loadAdmins({
      searchDto: {
        SearchKey: this.searchForm.get('SearchKey')?.value || '',
        PageNumber: this.currentPage,
        PageSize: this.pageSize
      }
    }));
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadAdmins();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAdmins();
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadAdmins();
  }

  onDeleteAdmin(adminId: string): void {
    this.adminToDelete = adminId;
    this.showDeleteModal = true;
  }

  onDeleteModalChange(visible: boolean): void {
    this.showDeleteModal = visible;
    if (!visible) {
      this.adminToDelete = null;
    }
  }

  confirmDelete(): void {
    if (this.adminToDelete) {
      this.store.dispatch(deleteAdmin({ id: this.adminToDelete }));
      this.showDeleteModal = false;
      this.adminToDelete = null;
    }
  }

  onEditAdmin(admin: AdminsDto): void {
    this.selectedAdmin = admin;
    this.showForm = true;
  }

  onCreateAdmin(): void {
    this.selectedAdmin = null;
    this.showForm = true;
  }

  onFormSubmit(data: RegisterDto | UpdateAdminDto): void {
    if (this.operationInProgress) {
      return; // Prevent multiple submissions
    }

    this.operationInProgress = true;

    if ('id' in data) {
      this.store.dispatch(updateAdmin({ updateAdminDto: data }));
    } else {
      this.store.dispatch(registerAdmin({ registerDto: data }));
    }
  }

  onFormCancel(): void {
    this.showForm = false;
    this.selectedAdmin = null;
  }

  dismissError(): void {
    this.store.dispatch(clearAdminError());
  }

  /**
   * Handles image loading errors by setting a default avatar image
   */
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = this.defaultAvatarPath;
    }
  }
}

