import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ModalModule,
  ButtonModule,
  TooltipModule,
  CardModule,
  GridModule,
  AlertModule,
  TableDirective,
  TableModule as CoreUITableModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { DiseaseService } from '../../services/disease.service';
import { DiseaseDto } from '../../Models/DTOs/DiseaseDto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Status } from '../../Enums/Status.enum';

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule,
    ButtonModule,
    IconModule,
    TooltipModule,
    PaginationComponent,
    ActionButtonComponent,
    CardModule,
    GridModule,
    CoreUITableModule,
    AlertModule,
    TableDirective,
    TranslatePipe
  ]
})
export class DiseaseComponent implements OnInit, OnDestroy {
  diseases: DiseaseDto[] = [];
  loading = false;
  error: string | null = null;
  searchForm: FormGroup;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalItems = 0;

  // Form management
  diseaseForm: FormGroup;
  showForm = false;
  isEditMode = false;

  // Delete modal management
  showDeleteModal = false;
  diseaseToDelete: string | null = null;

  // Make Math available in template
  protected readonly Math = Math;

  private destroy$ = new Subject<void>();

  constructor(
    private diseaseService: DiseaseService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchKey: new FormControl('')
    });

    this.diseaseForm = this.fb.group({
      id: [''],
      nameEn: [''],
      nameAr: ['']
    });
  }

  ngOnInit(): void {
    this.loadDiseases();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDiseases(): void {
    this.loading = true;
    this.error = null;

    console.log('بدء تحميل البيانات من API');

    this.diseaseService.getAll(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('استجابة API:', response);

          if (response && response.status === Status.Success) {
            console.log('حالة النجاح مع البيانات:', response.data);

            if (response.data && response.data.items && response.data.items.length > 0) {
              this.diseases = response.data.items;
              this.totalItems = response.data.totalCount;
              this.totalPages = response.data.totalPages;

              console.log('تم تعيين بيانات الصفحات:', {
                total: this.totalItems,
                pages: this.totalPages
              });
            } else {
              console.log('لم يتم العثور على بيانات من API');
              this.diseases = [];
              this.totalItems = 0;
              this.totalPages = 1;
            }
          } else {
            console.error('خطأ في الاستجابة أو بيانات غير متوقعة');

            if (response && response.message) {
              this.error = response.message;
            }
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('فشل في الاتصال بالـ API:', err);

          this.totalPages = 1;
          this.error = 'Failed to load diseases. Please try again.';
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadDiseases();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadDiseases();
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select) {
      const size = parseInt(select.value, 10);
      if (!isNaN(size)) {
        this.pageSize = size;
        this.currentPage = 1;
        this.loadDiseases();
      }
    }
  }

  onCreateDisease(): void {
    this.isEditMode = false;
    this.diseaseForm.reset();
    this.showForm = true;
  }

  onEditDisease(disease: DiseaseDto): void {
    this.isEditMode = true;
    this.diseaseForm.patchValue({
      id: disease.id,
      nameEn: disease.nameEn,
      nameAr: disease.nameAr
    });
    this.showForm = true;
  }

  onDeleteDisease(id: string): void {
    this.diseaseToDelete = id;
    this.showDeleteModal = true;
  }

  onDeleteModalChange(visible: boolean): void {
    this.showDeleteModal = visible;
    if (!visible) {
      this.diseaseToDelete = null;
    }
  }

  confirmDelete(): void {
    if (this.diseaseToDelete) {
      this.loading = true;
      this.diseaseService.delete(this.diseaseToDelete)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status === Status.Success) {
              this.loadDiseases();
            } else {
              this.error = response.message;
            }
            this.showDeleteModal = false;
            this.diseaseToDelete = null;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to delete disease. Please try again.';
            this.showDeleteModal = false;
            this.diseaseToDelete = null;
            this.loading = false;
          }
        });
    }
  }

  onFormSubmit(): void {
    if (this.diseaseForm.valid) {
      const diseaseData: DiseaseDto = this.diseaseForm.value;
      this.loading = true;

      if (this.isEditMode && diseaseData.id) {
        this.diseaseService.update(diseaseData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.status === Status.Success) {
                this.loadDiseases();
                this.showForm = false;
              } else {
                this.error = response.message;
              }
              this.loading = false;
            },
            error: (err) => {
              this.error = 'Failed to update disease. Please try again.';
              this.loading = false;
            }
          });
      } else {
        this.diseaseService.add(diseaseData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.status === Status.Success) {
                this.loadDiseases();
                this.showForm = false;
              } else {
                this.error = response.message;
              }
              this.loading = false;
            },
            error: (err) => {
              this.error = 'Failed to add disease. Please try again.';
              this.loading = false;
            }
          });
      }
    }
  }

  onFormCancel(): void {
    this.showForm = false;
    this.diseaseForm.reset();
  }

  dismissError(): void {
    this.error = null;
  }
}
