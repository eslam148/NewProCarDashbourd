import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NurseService } from '../../services/nurse.service';
import { NurseDto } from '../../Models/DTOs/NurseDto';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { PaginationModule } from '@coreui/angular';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-nurse',
  standalone: true,
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.scss'],
  imports: [TranslatePipe, CommonModule, ReactiveFormsModule, PaginationModule, PaginationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NurseComponent implements OnInit {
  nurses: NurseDto[] = [];
  form: FormGroup;
  showForm = false;
  isEditMode = false;
  successMessage = '';
  errorMessage = '';
  isDeleteModalOpen = false;
  nurseIdToDelete: string | null = null;
  selectedImageFile: File | null = null;
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private nurseService: NurseService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      specialization: ['', Validators.required],
      governorate: ['', Validators.required],
      city: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      rate: [null],
      imageUrl: [''],
      cityId: [''],
      governorateId: [''],
      specialtyId: [''],
      latitude: [''],
      longitude: [''],
      medicalLicense: ['']
    });
  }

  ngOnInit() {
    this.loadNurses();
  }

  loadNurses() {
    this.nurseService.getAllNurses({ pageNumber: this.pageNumber, pageSize: this.pageSize, searchKey: '', cityId: 0 }).subscribe({
      next: (res) => {
        this.nurses = res.data.items;
        this.totalCount = res.data.totalCount;
      },
      error: (error) => {
        this.errorMessage = 'nurse.loadError';
        console.error('Error loading nurses:', error);
      }
    });
  }

  onPageChange(page: number) {
    if (page < 1 || (page - 1) * this.pageSize >= this.totalCount) return;
    this.pageNumber = page;
    this.loadNurses();
  }

  getPagesCount(): number {
    if (!this.totalCount || this.totalCount <= 0) return 1;
    return Math.ceil(this.totalCount / this.pageSize);
  }

  showAddForm() {
    this.isEditMode = false;
    this.form.reset();
    this.showForm = true;
  }

  editNurse(nurse: NurseDto) {
    this.isEditMode = true;
    this.form.patchValue({
      ...nurse,
      id: nurse.id
    });
    this.showForm = true;
  }

  onImageSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedImageFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target && 'result' in e.target ? e.target.result : null;
      };
      if (this.selectedImageFile) {
        reader.readAsDataURL(this.selectedImageFile);
      }
    }
  }

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const formData = new FormData();

      if (formValue.id) formData.append('Id', formValue.id);
      if (formValue.firstName) formData.append('FirstName', formValue.firstName);
      if (formValue.lastName) formData.append('LastName', formValue.lastName);
      if (this.selectedImageFile) {
        formData.append('Image', this.selectedImageFile);
      }
      if (formValue.cityId) formData.append('CityId', formValue.cityId.toString());
      if (formValue.governorateId) formData.append('GovernorateId', formValue.governorateId.toString());
      if (formValue.latitude) formData.append('Latitude', formValue.latitude);
      if (formValue.longitude) formData.append('Longitude', formValue.longitude);
      if (formValue.medicalLicense || formValue.licenseNumber) formData.append('MedicalLicense', formValue.medicalLicense || formValue.licenseNumber);
      if (formValue.specialtyId) formData.append('SpecialtyId', formValue.specialtyId.toString());

      if (this.isEditMode) {
        this.nurseService.updateNurse(formData).subscribe({
          next: () => {
            this.successMessage = 'nurse.updateSuccess';
            this.loadNurses();
            this.cancel();
          },
          error: (error) => {
            this.errorMessage = 'nurse.updateError';
            console.error('Error updating nurse:', error);
          }
        });
      } else {
        // Add nurse logic (similar, using FormData)
      }
    }
  }

  cancel() {
    this.showForm = false;
    this.form.reset();
    this.isEditMode = false;
  }

  openDeleteModal(id: string) {
    this.nurseIdToDelete = id;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.nurseIdToDelete = null;
  }

  confirmDelete() {
    if (this.nurseIdToDelete) {
      this.nurseService.deleteNurse(this.nurseIdToDelete).subscribe({
        next: () => {
          this.successMessage = 'nurse.deleteSuccess';
          this.loadNurses();
          this.closeDeleteModal();
        },
        error: (error) => {
          this.errorMessage = 'nurse.deleteError';
          console.error('Error deleting nurse:', error);
          this.closeDeleteModal();
        }
      });
    }
  }
}
