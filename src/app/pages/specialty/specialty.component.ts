import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpecialtyService } from '../../services/specialty.service';
import { SpecialtyDto } from '../../Models/DTOs/SpecialtyDto';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import {
  ButtonModule,
  ModalModule,
  CardModule,
  FormModule,
  GridModule,
  TableModule
} from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import {
  cilPlus,
  cilPencil,
  cilTrash,
  cilX,
  cilCheckAlt,
  cilBan,
  cilWarning,
  cilMedicalCross
} from '@coreui/icons';

@Component({
  selector: 'app-specialty',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslatePipe,
    ModalModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    TableModule,
    IconModule
  ],
  templateUrl: './specialty.component.html',
  styleUrls: ['./specialty.component.scss'],
  providers: [IconSetService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SpecialtyComponent implements OnInit {
  specialties: SpecialtyDto[] = [];
  form: FormGroup;
  isEditMode = false;
  selectedSpecialtyId: number | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showForm = false;
  isDeleteModalOpen = false;
  deleteId: number | null = null;

  constructor(
    private specialtyService: SpecialtyService,
    private fb: FormBuilder,
    private translationService: TranslationService,
    private iconSetService: IconSetService
  ) {
    // Register icons
    this.iconSetService.icons = {
      cilPlus,
      cilPencil,
      cilTrash,
      cilX,
      cilCheckAlt,
      cilBan,
      cilWarning,
      cilMedicalCross
    };

    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      descriptionAr: [''],
      descriptionEn: ['']
    });
  }

  ngOnInit() {
    this.loadSpecialties();
  }

  loadSpecialties() {
    this.isLoading = true;
    this.specialtyService.getAllSpecialties().subscribe({
      next: res => {
        this.specialties = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'specialty.loadError';
        this.isLoading = false;
      }
    });
  }

  showAddForm() {
    this.showForm = true;
    this.isEditMode = false;
    this.form.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    const specialty: SpecialtyDto = this.form.value;
    if (this.isEditMode && this.selectedSpecialtyId) {
      specialty.id = this.selectedSpecialtyId;
      this.specialtyService.updateSpecialty(specialty).subscribe({
        next: () => {
          this.successMessage = 'specialty.editSuccess';
          this.loadSpecialties();
          this.cancel();
        },
        error: () => {
          this.errorMessage = 'specialty.editError';
          this.isLoading = false;
        }
      });
    } else {
      this.specialtyService.addSpecialty(specialty).subscribe({
        next: () => {
          this.successMessage = 'specialty.addSuccess';
          this.loadSpecialties();
          this.cancel();
        },
        error: () => {
          this.errorMessage = 'specialty.addError';
          this.isLoading = false;
        }
      });
    }
  }

  edit(specialty: SpecialtyDto) {
    this.isEditMode = true;
    this.selectedSpecialtyId = specialty.id!;
    this.form.patchValue(specialty);
    this.successMessage = '';
    this.errorMessage = '';
    this.showForm = true;
  }

  openDeleteModal(id: number) {
    this.deleteId = id;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.deleteId = null;
  }

  confirmDelete() {
    if (this.deleteId != null) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';
      this.specialtyService.deleteSpecialty(this.deleteId).subscribe({
        next: () => {
          this.successMessage = 'specialty.deleteSuccess';
          this.loadSpecialties();
          this.closeDeleteModal();
        },
        error: () => {
          this.errorMessage = 'specialty.deleteError';
          this.isLoading = false;
          this.closeDeleteModal();
        }
      });
    }
  }

  delete(id: number) {
    this.openDeleteModal(id);
  }

  cancel() {
    this.isEditMode = false;
    this.selectedSpecialtyId = null;
    this.form.reset();
    this.successMessage = '';
    this.errorMessage = '';
    this.isLoading = false;
    this.showForm = false;
  }

  getTranslation(key: string): string {
    let value = '';
    this.translationService.translate(key).subscribe(trans => value = trans);
    return value || key;
  }
}
