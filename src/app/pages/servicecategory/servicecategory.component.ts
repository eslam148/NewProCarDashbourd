import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { cilPlus, cilPencil, cilTrash, cilList, cilSearch, cilFolder, cilLayers, cilPhone, cilX, cilWarning, cilCloudUpload } from '@coreui/icons';

import { ServiceCategoryDto } from '../../Models/DTOs/ServiceCategoryDto';
import { ServiceCatalogDto } from '../../Models/DTOs/ServiceCatalogDto';
import { SubCategoryDto } from '../../Models/DTOs/SubCategoryDto';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { GenericResponse } from '../../Models/Responses/GenericResponse';
import { ServiceCategoryService } from '../../services/service-category.service';
import { SubCategoryService } from '../../services/sub-category.service';
import { ServiceCatalogService } from '../../services/service-catalog.service';

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
  categories: ServiceCategoryDto[] = [];
  isLoading = false;
  error: string | null = null;

  // Service Catalog
  serviceCatalogs: ServiceCatalogDto[] = [];
  isServiceCatalogLoading = false;
  serviceCatalogError: any = null;
  totalItems = 0;

  // Sub Category
  subCategories: SubCategoryDto[] = [];
  isSubCategoryLoading = false;
  subCategoryError: any = null;

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

  searchKey = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: ServiceCategoryService,
    private subCategoryService: SubCategoryService,
    private serviceCatalogService: ServiceCatalogService,
    private iconSetService: IconSetService
  ) {
    // Register Icons
    iconSetService.icons = {
      cilPlus, cilPencil, cilTrash, cilList, cilSearch, cilFolder,
      cilLayers, cilPhone, cilX, cilWarning, cilCloudUpload
    };

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
  }

  loadData(): void {
    this.loadServices();
    this.loadCategories();
    this.loadSubCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        console.log('Categories:', response.data);
        this.categories = response.data;
        this.isLoading = false;
        this.error = null;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
        this.error = 'Failed to load categories';
      }
    });
  }

  loadSubCategories() {
    this.isSubCategoryLoading = true;
    this.subCategoryService.getAllSubCategories().subscribe({
      next: (subCategories) => {
        this.subCategories = subCategories;
        this.isSubCategoryLoading = false;
        this.subCategoryError = null;
      },
      error: (error) => {
        console.error('Error loading sub-categories:', error);
        this.isSubCategoryLoading = false;
        this.subCategoryError = 'Failed to load sub-categories';
      }
    });
  }

  loadServices() {
    this.isServiceCatalogLoading = true;
    this.serviceCatalogService.getAllServices({
      SearchKey: this.searchKey,
      PageNumber: this.currentPage,
      PageSize: this.pageSize
    }).subscribe({
      next: (response) => {
        this.serviceCatalogs = response.data;
        this.totalItems = response.totalCount;
        this.isServiceCatalogLoading = false;
        this.serviceCatalogError = null;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isServiceCatalogLoading = false;
        this.serviceCatalogError = 'Failed to load services';
      }
    });
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

  showSuccess(message: string): void {
    // Implement your toast notification system here
    console.log('Success:', message);
  }

  showError(message: string): void {
    // Implement your toast notification system here
    console.error('Error:', message);
  }

  submit() {
    if (this.form.valid) {
      const categoryData: ServiceCategoryDto = {
        nameAr: this.form.value.nameAr,
        nameEn: this.form.value.nameEn,
        descriptionAr: this.form.value.descriptionAr,
        descriptionEn: this.form.value.descriptionEn,
        icon: this.selectedFile
      };

      if (this.isEditMode && this.selectedCategoryId !== null) {
        categoryData.id = this.selectedCategoryId;
        this.categoryService.updateCategory(categoryData).subscribe({
          next: (response) => {
            this.loadCategories();
            this.showCategoryForm = false;
            this.form.reset();
            this.showSuccess('Category updated successfully');
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating category:', error);
            this.showError('Failed to update category');
          }
        });
      } else {
        this.categoryService.addCategory(categoryData).subscribe({
          next: (response) => {
            this.loadCategories();
            this.showCategoryForm = false;
            this.form.reset();
            this.showSuccess('Category created successfully');
            this.closeModal();
          },
          error: (error) => {
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
        next: (response) => {
          this.loadCategories();
          this.closeDeleteModal();
          this.showSuccess('Category deleted successfully');

          if (this.selectedCategoryId === this.selectedCategoryId) {
            this.selectedCategoryId = null;
          }
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.closeDeleteModal();
          this.showError('Failed to delete category');
        }
      });
    }
  }

  getSubCategories(categoryId: number): Observable<SubCategoryDto[]> {
    return of(this.subCategories).pipe(
      map(subCategories => subCategories.filter(sub => sub.serviceCategoryId === categoryId))
    );
  }

  getServiceCatalogs(categoryId: number): Observable<ServiceCatalogDto[]> {
    return of(this.serviceCatalogs).pipe(
      map(catalogs => {
        if (!Array.isArray(catalogs)) {
          console.error('Expected catalogs to be an array, but got:', catalogs);
          return [];
        }
        return catalogs;
      }),
      mergeMap(catalogs =>
        of(this.subCategories).pipe(
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
            next: (response) => {
              this.loadSubCategories();
              this.cancelSubCategoryForm();
              this.showSuccess('Subcategory updated successfully');
            },
            error: (error) => {
              console.error('Error updating subcategory:', error);
              this.showError('Failed to update subcategory');
            }
          });
        } else {
          subCategoryData.id = this.editingSubCategoryId;
          this.subCategoryService.updateSubCategory(subCategoryData).subscribe({
            next: (response) => {
              this.loadSubCategories();
              this.cancelSubCategoryForm();
              this.showSuccess('Subcategory updated successfully');
            },
            error: (error) => {
              console.error('Error updating subcategory:', error);
              this.showError('Failed to update subcategory');
            }
          });
        }
      } else {
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
            next: (response) => {
              this.loadSubCategories();
              this.cancelSubCategoryForm();
              this.showSuccess('Subcategory created successfully');
            },
            error: (error) => {
              console.error('Error creating subcategory:', error);
              this.showError('Failed to create subcategory');
            }
          });
        } else {
          this.subCategoryService.addSubCategory(subCategoryData).subscribe({
            next: (response) => {
              this.loadSubCategories();
              this.cancelSubCategoryForm();
              this.showSuccess('Subcategory created successfully');
            },
            error: (error) => {
              console.error('Error creating subcategory:', error);
              this.showError('Failed to create subcategory');
            }
          });
        }
      }
    } else {
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
      descriptionEn: category.descriptionEn,
      icon: category.icon
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
        next: (response) => {
          this.loadSubCategories();
          this.closeDeleteSubCategoryModal();
          this.showSuccess('Subcategory deleted successfully');
        },
        error: (error) => {
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

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.iconPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
