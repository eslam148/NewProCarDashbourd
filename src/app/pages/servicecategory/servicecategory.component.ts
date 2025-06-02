import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  CardModule,
  TableModule,
  ModalModule,
  FormModule,
  GridModule,
  SpinnerModule,
  TooltipModule,
  BadgeModule,
  PaginationModule
} from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { map, mergeMap } from 'rxjs/operators';
import { cilPlus, cilPencil, cilTrash, cilList, cilSearch, cilFolder, cilLayers, cilPhone, cilX, cilWarning, cilCloudUpload } from '@coreui/icons';

import { ServiceCategoryDto } from '../../Models/DTOs/ServiceCategoryDto';
import { ServiceCatalogDto } from '../../Models/DTOs/ServiceCatalogDto';
import { SubCategoryDto } from '../../Models/DTOs/SubCategoryDto';
import { selectAllCategories, selectServiceCategoryLoading, selectServiceCategoryError } from '../../store/service-category/service-category.selectors';
import * as ServiceCategoryActions from '../../store/service-category/service-category.actions';
import { selectAllServices, selectServiceCatalogLoading, selectServiceCatalogError, selectServiceCatalogTotalCount } from '../../store/service-catalog/service-catalog.selectors';
import * as ServiceCatalogActions from '../../store/service-catalog/service-catalog.actions';
import { selectAllSubCategories, selectSubCategoryLoading, selectSubCategoryError } from '../../store/sub-category/sub-category.selectors';
import * as SubCategoryActions from '../../store/sub-category/sub-category.actions';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { GenericResponse } from '../../Models/Responses/GenericResponse';
import { ServiceCategoryService } from '../../services/service-category.service';
import { SubCategoryService } from '../../services/sub-category.service';

@Component({
  selector: 'app-servicecategory',
  standalone: true,
  templateUrl: './servicecategory.component.html',
  styleUrls: [
    './servicecategory.component.scss'
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    ModalModule,
    FormModule,
    GridModule,
    SpinnerModule,
    TooltipModule,
    IconModule,
    BadgeModule,
    PaginationModule,
    TranslatePipe,
    ActionButtonComponent
  ],
})
export class ServicecategoryComponent implements OnInit {
  // Service Category
  categories$: Observable<ServiceCategoryDto[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  // Service Catalog
  serviceCatalogs$: Observable<ServiceCatalogDto[]>;
  serviceCatalogLoading$: Observable<boolean>;
  serviceCatalogError$: Observable<any>;

  // Sub Category
  subCategories$: Observable<SubCategoryDto[]>;
  subCategoryLoading$: Observable<boolean>;
  subCategoryError$: Observable<any>;

  form: FormGroup;
  subCategoryForm: FormGroup;
  isModalOpen = false;
  isDeleteModalOpen = false;
  isIconPreviewOpen = false;
  isSubCategoryModalOpen = false;
  isEditMode = false;
  selectedCategoryId: number | null = null;
  iconPreview: string | null = null;
  selectedFile: File | null = null;
  previewIconUrl: string | null = null;

  // Add new properties for subcategory icon handling
  subCategoryIconPreview: string | null = null;
  subCategoryIconFile: File | null = null;

  showCategoryForm = false;
  showSubCategoryForm = false;
  isEditSubMode = false;
  editingSubCategoryId: number | null = null;

  isDeleteSubCategoryModalOpen = false;
  selectedSubCategoryId: number | null = null;

  // Pagination for services
  currentPage = 1;
  pageSize = 2;
  totalItems = 0;

  searchKey = '';

  // Declare the property without initializing it
  totalItems$: Observable<number>;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private categoryService: ServiceCategoryService,
    private subCategoryService: SubCategoryService,
    private iconSetService: IconSetService
  ) {
    // Initialize the property here
    this.totalItems$ = this.store.select(selectServiceCatalogTotalCount);

    // Register Icons
    iconSetService.icons = {
      cilPlus, cilPencil, cilTrash, cilList, cilSearch, cilFolder,
      cilLayers, cilPhone, cilX, cilWarning, cilCloudUpload
    };

    // Service Category
    this.categories$ = this.store.select(selectAllCategories);
    this.loading$ = this.store.select(selectServiceCategoryLoading);
    this.error$ = this.store.select(selectServiceCategoryError);
    // Service Catalog
    this.serviceCatalogs$ = this.store.select(selectAllServices);
    this.serviceCatalogLoading$ = this.store.select(selectServiceCatalogLoading);
    this.serviceCatalogError$ = this.store.select(selectServiceCatalogError);
    // Sub Category
    this.subCategories$ = this.store.select(selectAllSubCategories);
    this.subCategoryLoading$ = this.store.select(selectSubCategoryLoading);
    this.subCategoryError$ = this.store.select(selectSubCategoryError);
    // Form
    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      icon: [null]
    });
    // Sub Category Form
    this.subCategoryForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      icon: [null],
      serviceCategoryId: [null, Validators.required],
      fromCallCenter: [false]
    });
  }

  ngOnInit() {
    this.loadData();
    this.serviceCatalogs$.subscribe(data => {
      console.log('Service Catalogs:', data);
    });
    this.totalItems$.subscribe(count => {
      console.log('Total Items:', count);
    });
  }

  loadData(): void {
    this.loadServices();
    this.store.dispatch(ServiceCategoryActions.loadAllCategories());
    this.store.dispatch(SubCategoryActions.loadAllSubCategories());
  }

  loadServices() {
    this.store.dispatch(ServiceCatalogActions.loadAllServices({
      page: this.currentPage,
      pageSize: this.pageSize,
      searchKey: this.searchKey
    }));
  }

  onPageChange(page: number | Event) {
    if (typeof page === 'number') {
      this.currentPage = page;
    } else if (page && typeof (page as any).target?.value !== 'undefined') {
      this.currentPage = +(page as any).target.value;
    }
    this.loadServices();
  }

  openAddModal() {
    this.isEditMode = false;
    this.form.reset();
    this.iconPreview = null;
    this.selectedFile = null;
    this.isModalOpen = true;
  }

  openEditModal(category: ServiceCategoryDto) {
    if (!category) {
      console.error('Category is null or undefined');
      return;
    }
    this.isEditMode = true;
    this.selectedCategoryId = category.id ?? null;
    this.form.patchValue({
      nameAr: category.nameAr ?? '',
      nameEn: category.nameEn ?? '',
      descriptionAr: category.descriptionAr ?? '',
      descriptionEn: category.descriptionEn ?? ''
    });
    if (category.icon instanceof File) {
      this.selectedFile = category.icon;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.iconPreview = e.target.result;
      };
      reader.readAsDataURL(category.icon);
    } else {
      this.iconPreview = null;
      this.selectedFile = null;
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.form.reset();
    this.iconPreview = null;
    this.selectedFile = null;
    this.selectedCategoryId = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.iconPreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeIcon() {
    this.iconPreview = null;
    this.selectedFile = null;
    this.form.patchValue({ icon: null });
  }

  previewIcon(iconUrl: string) {
    this.previewIconUrl = iconUrl;
    this.isIconPreviewOpen = true;
  }

  closeIconPreview() {
    this.isIconPreviewOpen = false;
    this.previewIconUrl = null;
  }

  // Helper method to show success toast
  showSuccess(message: string): void {
    // You can implement your preferred toast notification system here
    console.log('Success:', message);
    // Example using browser alert (replace with your toast system)
    alert('Success: ' + message);
  }

  // Helper method to show error toast
  showError(message: string): void {
    // You can implement your preferred toast notification system here
    console.error('Error:', message);
    // Example using browser alert (replace with your toast system)
    alert('Error: ' + message);
  }

  submit() {
    if (this.form.valid) {
      console.log(this.selectedCategoryId);

      // Create category data object
      const categoryData: ServiceCategoryDto = {
        nameAr: this.form.value.nameAr,
        nameEn: this.form.value.nameEn,
        descriptionAr: this.form.value.descriptionAr,
        descriptionEn: this.form.value.descriptionEn,
        icon: this.selectedFile
      };

      if (this.isEditMode && this.selectedCategoryId !== null) {
        // Use the existing updateCategory method
        categoryData.id = this.selectedCategoryId;
        this.categoryService.updateCategory(categoryData).subscribe({
          next: (response: GenericResponse<ServiceCategoryDto>) => {
            console.log('Category updated successfully:', response);
            this.store.dispatch(ServiceCategoryActions.loadAllCategories());
            this.showCategoryForm = false;
            this.form.reset();
            this.showSuccess('Category updated successfully');
          },
          error: (error: any) => {
            console.error('Error updating category:', error);
            this.showError('Failed to update category');
          }
        });
      } else {
        // Use the existing addCategory method
        this.categoryService.addCategory(categoryData).subscribe({
          next: (response: GenericResponse<ServiceCategoryDto>) => {
            console.log('Category created successfully:', response);
            this.store.dispatch(ServiceCategoryActions.loadAllCategories());
            this.showCategoryForm = false;
            this.form.reset();
            this.showSuccess('Category created successfully');
          },
          error: (error: any) => {
            console.error('Error creating category:', error);
            this.showError('Failed to create category');
          }
        });
      }
    }
  }

  openDeleteModal(id: number) {
    this.selectedCategoryId = id;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedCategoryId = null;
  }

  confirmDelete() {
    if (this.selectedCategoryId !== null) {
      this.categoryService.deleteCategory(this.selectedCategoryId).subscribe({
        next: (response: GenericResponse<any>) => {
          console.log('Category deleted successfully:', response);
          this.store.dispatch(ServiceCategoryActions.loadAllCategories());
          this.closeDeleteModal();
          this.showSuccess('Category deleted successfully');

          // Clear selected category if the deleted one was selected
          if (this.selectedCategoryId === this.selectedCategoryId) {
            this.selectedCategoryId = null;
          }
        },
        error: (error: any) => {
          console.error('Error deleting category:', error);
          this.closeDeleteModal();
          this.showError('Failed to delete category');
        }
      });
    }
  }

  getSubCategories(categoryId: number): Observable<SubCategoryDto[]> {
    return this.subCategories$.pipe(
      map(subCategories => subCategories.filter(sub => sub.serviceCategoryId === categoryId))
    );
  }

  getServiceCatalogs(categoryId: number): Observable<ServiceCatalogDto[]> {
    return this.serviceCatalogs$.pipe(
      map(catalogs => {
        if (!Array.isArray(catalogs)) {
          console.error('Expected catalogs to be an array, but got:', catalogs);
          return [];
        }
        return catalogs;
      }),
      mergeMap(catalogs =>
        this.subCategories$.pipe(
          map(subCategories => {
            const categorySubCategories = subCategories.filter(sub => sub.serviceCategoryId === categoryId);
            return catalogs.filter(catalog =>
              categorySubCategories.some(sub => sub.id === catalog.subCategoryId)
            );
          })
        )
      )
    );
  }

  openAddSubCategoryModal() {
    this.subCategoryForm.reset();
    this.subCategoryForm.patchValue({
      serviceCategoryId: this.selectedCategoryId
    });
    this.isSubCategoryModalOpen = true;
  }

  closeSubCategoryModal() {
    this.isSubCategoryModalOpen = false;
    this.subCategoryForm.reset();
    this.subCategoryIconPreview = null;
    this.subCategoryIconFile = null;
  }

  editSubCategory(sub: SubCategoryDto) {
    this.isEditSubMode = true;
    this.showSubCategoryForm = true;
    this.editingSubCategoryId = sub.id ?? null;
    this.subCategoryForm.patchValue({
      nameAr: sub.nameAr,
      nameEn: sub.nameEn,
      descriptionAr: sub.descriptionAr,
      descriptionEn: sub.descriptionEn,
      serviceCategoryId: sub.serviceCategoryId,
      fromCallCenter: sub.fromCallCenter ?? false
    });
  }

  submitSubCategory() {
    if (this.subCategoryForm.valid && this.selectedCategoryId !== null) {

      // Create subcategory data object
      const subCategoryData: SubCategoryDto = {
        nameAr: this.subCategoryForm.value.nameAr,
        nameEn: this.subCategoryForm.value.nameEn,
        descriptionAr: this.subCategoryForm.value.descriptionAr,
        descriptionEn: this.subCategoryForm.value.descriptionEn,
        serviceCategoryId: this.selectedCategoryId,
        fromCallCenter: this.subCategoryForm.value.fromCallCenter,
        icon: this.subCategoryIconFile
      };

      if (this.isEditSubMode && this.editingSubCategoryId !== null) {
        // For update with icon, use updateSubCategoryWithIcon method
        if (this.subCategoryIconFile) {
          const formData = new FormData();
          formData.append('nameAr', this.subCategoryForm.value.nameAr);
          formData.append('nameEn', this.subCategoryForm.value.nameEn);
          formData.append('descriptionAr', this.subCategoryForm.value.descriptionAr);
          formData.append('descriptionEn', this.subCategoryForm.value.descriptionEn);
          formData.append('fromCallCenter', String(this.subCategoryForm.value.fromCallCenter));
          formData.append('serviceCategoryId', this.selectedCategoryId.toString());
          formData.append('icon', this.subCategoryIconFile);

          this.subCategoryService.updateSubCategoryWithIcon(this.editingSubCategoryId, formData).subscribe({
            next: (response: any) => {
              console.log('Subcategory updated successfully:', response);
              this.store.dispatch(SubCategoryActions.loadAllSubCategories());
              this.cancelSubCategoryForm();
              this.showSuccess('Subcategory updated successfully');
            },
            error: (error: any) => {
              console.error('Error updating subcategory:', error);
              this.showError('Failed to update subcategory');
            }
          });
        } else {
          // For update without icon, use updateSubCategory method
          subCategoryData.id = this.editingSubCategoryId;
          this.subCategoryService.updateSubCategory(subCategoryData).subscribe({
            next: (response: any) => {
              console.log('Subcategory updated successfully:', response);
              this.store.dispatch(SubCategoryActions.loadAllSubCategories());
              this.cancelSubCategoryForm();
              this.showSuccess('Subcategory updated successfully');
            },
            error: (error: any) => {
              console.error('Error updating subcategory:', error);
              this.showError('Failed to update subcategory');
            }
          });
        }
      } else {
        // For create with icon, use addSubCategoryWithIcon method
        if (this.subCategoryIconFile) {
          const formData = new FormData();
          formData.append('nameAr', this.subCategoryForm.value.nameAr);
          formData.append('nameEn', this.subCategoryForm.value.nameEn);
          formData.append('descriptionAr', this.subCategoryForm.value.descriptionAr);
          formData.append('descriptionEn', this.subCategoryForm.value.descriptionEn);
          formData.append('fromCallCenter', String(this.subCategoryForm.value.fromCallCenter));
          formData.append('serviceCategoryId', this.selectedCategoryId.toString());
          formData.append('icon', this.subCategoryIconFile);

          this.subCategoryService.addSubCategoryWithIcon(formData).subscribe({
            next: (response: any) => {
              console.log('Subcategory created successfully:', response);
              this.store.dispatch(SubCategoryActions.loadAllSubCategories());
              this.cancelSubCategoryForm();
              this.showSuccess('Subcategory created successfully');
            },
            error: (error: any) => {
              console.error('Error creating subcategory:', error);
              this.showError('Failed to create subcategory');
            }
          });
        } else {
          // For create without icon, use addSubCategory method
          this.subCategoryService.addSubCategory(subCategoryData).subscribe({
            next: (response: any) => {
              console.log('Subcategory created successfully:', response);
              this.store.dispatch(SubCategoryActions.loadAllSubCategories());
              this.cancelSubCategoryForm();
              this.showSuccess('Subcategory created successfully');
            },
            error: (error: any) => {
              console.error('Error creating subcategory:', error);
              this.showError('Failed to create subcategory');
            }
          });
        }
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      Object.keys(this.subCategoryForm.controls).forEach(key => {
        const control = this.subCategoryForm.get(key);
        control?.markAsTouched();
      });
      this.showError('Please fill all required fields');
    }
  }

  onSubCategoryFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.subCategoryIconFile = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.subCategoryIconPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSubCategoryIcon(): void {
    this.subCategoryIconPreview = null;
    this.subCategoryIconFile = null;
    this.subCategoryForm.patchValue({ icon: null });
  }

  getIconUrl(icon: any): string {
    if (icon instanceof File) {
      return this.iconPreview || '';
    }
    return icon || '';
  }

  selectCategory(id: number) {
    this.selectedCategoryId = id;
    this.showSubCategoryForm = false;
    this.isEditSubMode = false;
    this.subCategoryForm.reset();
    this.subCategoryForm.patchValue({ serviceCategoryId: id });
  }

  editCategory(category: ServiceCategoryDto) {
    this.isEditMode = true;
    this.showCategoryForm = true;
    this.selectedCategoryId = category.id ?? null;
    this.form.patchValue({
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      descriptionAr: category.descriptionAr,
      descriptionEn: category.descriptionEn
    });
  }

  cancelCategoryForm() {
    this.showCategoryForm = false;
    this.isEditMode = false;
    this.form.reset();
    this.selectedCategoryId = null;
  }

  cancelSubCategoryForm() {
    this.showSubCategoryForm = false;
    this.isEditSubMode = false;
    this.subCategoryForm.reset();
    this.subCategoryForm.patchValue({ serviceCategoryId: this.selectedCategoryId });
  }

  openDeleteSubCategoryModal(id: number) {
    this.selectedSubCategoryId = id;
    this.isDeleteSubCategoryModalOpen = true;
  }

  closeDeleteSubCategoryModal() {
    this.isDeleteSubCategoryModalOpen = false;
    this.selectedSubCategoryId = null;
  }

  confirmDeleteSubCategory() {
    if (this.selectedSubCategoryId !== null) {
      this.subCategoryService.deleteSubCategory(this.selectedSubCategoryId).subscribe({
        next: (response: any) => {
          console.log('Subcategory deleted successfully:', response);
          this.store.dispatch(SubCategoryActions.loadAllSubCategories());
          this.closeDeleteSubCategoryModal();
          this.showSuccess('Subcategory deleted successfully');
        },
        error: (error: any) => {
          console.error('Error deleting subcategory:', error);
          this.closeDeleteSubCategoryModal();
          this.showError('Failed to delete subcategory');
        }
      });
    }
  }

  onSearch() {
    this.currentPage = 1;
    this.loadServices();
  }

  getPagesCount(total: number | null | undefined): number {
    if (!total || total <= 0) return 1;
    return Math.ceil(total / this.pageSize);
  }
}
