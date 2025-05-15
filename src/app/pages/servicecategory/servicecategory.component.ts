import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  BadgeModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { map, mergeMap } from 'rxjs/operators';

import { ServiceCategoryDto } from '../../Models/DTOs/ServiceCategoryDto';
import { ServiceCatalogDto } from '../../Models/DTOs/ServiceCatalogDto';
import { SubCategoryDto } from '../../Models/DTOs/SubCategoryDto';
import { selectAllCategories, selectServiceCategoryLoading, selectServiceCategoryError } from '../../store/service-category/service-category.selectors';
import * as ServiceCategoryActions from '../../store/service-category/service-category.actions';
import { selectAllServices, selectServiceCatalogLoading, selectServiceCatalogError } from '../../store/service-catalog/service-catalog.selectors';
import * as ServiceCatalogActions from '../../store/service-catalog/service-catalog.actions';
import { selectAllSubCategories, selectSubCategoryLoading, selectSubCategoryError } from '../../store/sub-category/sub-category.selectors';
import * as SubCategoryActions from '../../store/sub-category/sub-category.actions';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { GenericResponse } from '../../Models/Responses/GenericResponse';
import { ServiceCategoryService } from '../../services/service-category.service';
import { SubCategoryService } from '../../services/sub-category.service';

@Component({
  selector: 'app-servicecategory',
  standalone: true,
  templateUrl: './servicecategory.component.html',
  styleUrls: ['./servicecategory.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    TranslatePipe
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

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private categoryService: ServiceCategoryService,
    private subCategoryService: SubCategoryService
  ) {
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
  }

  loadData(): void {
    this.store.dispatch(ServiceCategoryActions.loadAllCategories());
    this.store.dispatch(ServiceCatalogActions.loadAllServices());
    this.store.dispatch(SubCategoryActions.loadAllSubCategories());
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

  submit() {
    if (this.form.valid) {
      console.log(this.selectedCategoryId);
      const categoryData: ServiceCategoryDto = {
        id: this.selectedCategoryId ?? undefined,
        nameAr: this.form.get('nameAr')?.value,
        nameEn: this.form.get('nameEn')?.value,
        descriptionAr: this.form.get('descriptionAr')?.value,
        descriptionEn: this.form.get('descriptionEn')?.value,
        icon: this.selectedFile
      };

      if (this.isEditMode && this.selectedCategoryId) {
        this.store.dispatch(ServiceCategoryActions.updateCategory({
          category: { ...categoryData, id: this.selectedCategoryId }
        }));
      } else {
        this.store.dispatch(ServiceCategoryActions.addCategory({ category: categoryData }));
      }

      this.closeModal();
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
    if (this.selectedCategoryId) {
      this.store.dispatch(ServiceCategoryActions.deleteCategory({ id: this.selectedCategoryId }));
      this.closeDeleteModal();
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
    if (this.subCategoryForm.valid) {
      this.subCategoryForm.patchValue({ serviceCategoryId: this.selectedCategoryId });
      if (this.isEditSubMode && this.editingSubCategoryId != null) {
        if (this.subCategoryIconFile) {
          // Edit mode with new icon
          const formData = new FormData();
          formData.append('id', this.editingSubCategoryId?.toString() || '');
          formData.append('serviceCategoryId', this.selectedCategoryId?.toString() || '');
          formData.append('fromCallCenter', this.subCategoryForm.get('fromCallCenter')?.value ?? 'false');
          formData.append('nameAr', this.subCategoryForm.get('nameAr')?.value);
          formData.append('nameEn', this.subCategoryForm.get('nameEn')?.value);
          formData.append('descriptionAr', this.subCategoryForm.get('descriptionAr')?.value);
          formData.append('descriptionEn', this.subCategoryForm.get('descriptionEn')?.value);
          if (this.subCategoryIconFile) {
            formData.append('icon', this.subCategoryIconFile);
          }
          this.subCategoryService.updateSubCategoryWithIcon(this.editingSubCategoryId, formData).subscribe({
            next: () => {
              this.showSubCategoryForm = false;
              this.isEditSubMode = false;
              this.editingSubCategoryId = null;
              this.subCategoryForm.reset();
              this.subCategoryIconFile = null;
              this.subCategoryIconPreview = null;
              this.store.dispatch(SubCategoryActions.loadAllSubCategories());
            },
            error: (error) => {
              console.error('Error updating subcategory:', error);
            }
          });
        } else {
          // Edit mode without new icon
          const updatedSubCategory = {
            ...this.subCategoryForm.value,
            id: this.editingSubCategoryId
          };
          this.store.dispatch(SubCategoryActions.updateSubCategory({ subCategory: updatedSubCategory }));
          this.showSubCategoryForm = false;
          this.isEditSubMode = false;
          this.editingSubCategoryId = null;
          this.subCategoryForm.reset();
          this.subCategoryIconFile = null;
          this.subCategoryIconPreview = null;
        }
      } else if (this.subCategoryIconFile) {
        // Add mode with icon
        const formData = new FormData();
        formData.append('nameAr', this.subCategoryForm.get('nameAr')?.value);
        formData.append('nameEn', this.subCategoryForm.get('nameEn')?.value);
        formData.append('descriptionAr', this.subCategoryForm.get('descriptionAr')?.value);
        formData.append('descriptionEn', this.subCategoryForm.get('descriptionEn')?.value);
        formData.append('serviceCategoryId', this.selectedCategoryId?.toString() || '');
        formData.append('icon', this.subCategoryIconFile);
        this.subCategoryService.addSubCategoryWithIcon(formData).subscribe({
          next: () => {
            this.showSubCategoryForm = false;
            this.isEditSubMode = false;
            this.editingSubCategoryId = null;
            this.subCategoryForm.reset();
            this.subCategoryIconFile = null;
            this.subCategoryIconPreview = null;
            this.store.dispatch(SubCategoryActions.loadAllSubCategories());
          },
          error: (error) => {
            console.error('Error creating subcategory:', error);
          }
        });
      } else {
        // Add mode without icon
        this.store.dispatch(SubCategoryActions.addSubCategory({ subCategory: this.subCategoryForm.value }));
        this.showSubCategoryForm = false;
        this.isEditSubMode = false;
        this.editingSubCategoryId = null;
        this.subCategoryForm.reset();
        this.subCategoryIconFile = null;
        this.subCategoryIconPreview = null;
      }
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
    if (this.selectedSubCategoryId != null) {
      this.store.dispatch(SubCategoryActions.deleteSubCategory({ id: this.selectedSubCategoryId }));
      this.closeDeleteSubCategoryModal();
    }
  }
}
