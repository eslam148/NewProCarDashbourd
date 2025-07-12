import { LandingPageService } from './../../services/landing-page.service';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { NurseService } from '../../services/nurse.service';
import { NurseDto, ReviewDto } from '../../Models/DTOs/NurseDto';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { PaginationModule } from '@coreui/angular';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { MapSelectorComponent } from '../../shared/components/map-selector/map-selector.component';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { BootstrapIconComponent } from '../../components/bootstrap-icon/bootstrap-icon.component';
import { SpecialtyService } from '../../services/specialty.service';
import { SpecialtyDto } from '../../Models/DTOs/SpecialtyDto';
import { GovernorateService } from '../../services/governorate.service';
import { GovernorateDto } from '../../Models/DTOs/GovernorateDto';
import { CityService } from '../../services/city.service';
import { CityDto } from '../../Models/DTOs/CityDto';

@Component({
  selector: 'app-nurse',
  standalone: true,
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.scss'],
  imports: [
    TranslatePipe,
    CommonModule,
    ReactiveFormsModule,
    PaginationModule,
    PaginationComponent,
    MapSelectorComponent,
    ActionButtonComponent,
    BootstrapIconComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NurseComponent implements OnInit, AfterViewInit {
  @ViewChild('mapSelector') mapSelector?: MapSelectorComponent;

  nurses: NurseDto[] = [];
  form: FormGroup;
  showForm = false;
  isEditMode = false;
  successMessage = '';
  errorMessage = '';
  isDeleteModalOpen = false;
  nurseIdToDelete: string | null = null;
  isReviewsModalOpen = false;
  selectedNurseReviews: ReviewDto[] = []; // Replace 'any' with a proper Review DTO if available
  selectedNurseName: string = '';
  selectedImageFile: File | null = null;
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;
  imagePreview: string | ArrayBuffer | null = null;
  showPassword = false;
  showConfirmPassword = false;

  // Map-related properties
  showMap = false;
  defaultAvatarPath = 'assets/images/avatars/8.jpg';

  specialties: SpecialtyDto[] = [];
  governorates: GovernorateDto[] = [];
  cities: CityDto[] = [];

  constructor(
    private fb: FormBuilder,
    private nurseService: NurseService,
    private landingPageService: LandingPageService,
    private specialtyService: SpecialtyService,
    private governorateService: GovernorateService,
    private cityService: CityService
  ) {
    this.form = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator()
      ]],
      confirmPassword: ['', this.isEditMode ? [] : [Validators.required]],
      specialization: ['', Validators.required],
      governorateId: ['', Validators.required],
      city: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      rate: [null],
      imageUrl: [''],
      cityId: [''],
      specialtyId: [''],
      latitude: [''],
      longitude: [''],
      medicalLicense: ['']
    }, {
      validators: this.passwordMatchValidator
    });

    // Listen to governorate changes
    this.form.get('governorateId')?.valueChanges.subscribe(governorateId => {
      // Reset city when governorate changes
      this.form.patchValue({ cityId: '' });
      this.cities = [];

      if (governorateId) {
        this.loadCities(governorateId);
      }
    });
  }

  ngOnInit() {
    this.loadNurses();
    this.loadSpecialties();
    this.loadGovernorates();
  }

  ngAfterViewInit() {
    // Component view has been initialized
  }

  loadNurses() {
    this.nurseService.getAllNurses({ pageNumber: this.pageNumber, pageSize: this.pageSize, searchKey: '', cityId: 0 }).subscribe({
      next: (res) => {
        this.nurses = res.data.items;
        console.log('Nurses loaded:',  this.nurses);

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
    this.showMap = true;
  }

  editNurse(nurse: NurseDto) {
    this.isEditMode = true;
    this.form.patchValue({
      ...nurse,
      id: nurse.id
    });
    this.showForm = true;
    this.showMap = true;

    // Set timeout to ensure the map is initialized before updating the marker
    setTimeout(() => {
      if (nurse.latitude && nurse.longitude && this.mapSelector) {
        this.mapSelector.refreshMap();
        this.mapSelector.updateMarkerPosition(
          parseFloat(nurse.latitude),
          parseFloat(nurse.longitude)
        );
      }
    }, 500);
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

  // Handle map location selection
  onLocationSelected(location: {lat: number, lng: number}) {
    this.form.patchValue({
      latitude: location.lat.toString(),
      longitude: location.lng.toString()
    });
    console.log('Location selected:', location);
  }

  toggleMap() {
    this.showMap = !this.showMap;

    // When map is shown, refresh it to ensure it renders properly
    if (this.showMap) {
      setTimeout(() => {
        if (this.mapSelector) {
          this.mapSelector.refreshMap();
        }
      }, 100);
    }
  }

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const formData = new FormData();

      if (formValue.id) formData.append('Id', formValue.id);
      if (formValue.firstName) formData.append('FirstName', formValue.firstName);
      if (formValue.lastName) formData.append('LastName', formValue.lastName);
      if (formValue.phoneNumber) formData.append('PhoneNumber', formValue.phoneNumber);
      if (formValue.email) formData.append('Email', formValue.email);
      if (formValue.specialization) formData.append('Specialization', formValue.specialization);
      if (formValue.governorateId) formData.append('GovernorateId', formValue.governorateId.toString());
      if (formValue.city) formData.append('City', formValue.city);

      // Add latitude and longitude from the map
      if (formValue.latitude) formData.append('Latitude', formValue.latitude);
      if (formValue.longitude) formData.append('Longitude', formValue.longitude);

      if (this.selectedImageFile) {
        formData.append('Image', this.selectedImageFile);
      }
      if (formValue.cityId) formData.append('CityId', formValue.cityId.toString());
      if (formValue.governorateId) formData.append('GovernorateId', formValue.governorateId.toString());
      if (formValue.medicalLicense || formValue.licenseNumber) formData.append('MedicalLicense', formValue.medicalLicense || formValue.licenseNumber);
      if (formValue.specialtyId) formData.append('SpecialtyId', formValue.specialtyId.toString());
      if (formValue.rate) formData.append('Rate', formValue.rate.toString());

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
        this.nurseService.addNurse(formData).subscribe({
          next: () => {
            this.successMessage = 'nurse.addSuccess';
            this.loadNurses();
            this.cancel();
          },
          error: (error) => {
            this.errorMessage = 'nurse.addError';
            console.error('Error adding nurse:', error);
          }
        });
      }
    }
  }

  cancel() {
    this.showForm = false;
    this.showMap = false;
    this.form.reset();
    this.isEditMode = false;
    this.imagePreview = null;
  }

  openDeleteModal(id: string) {
    this.nurseIdToDelete = id;
    this.isDeleteModalOpen = true;
  }

  openReviewsModal(nurseId: string) {
    // TODO: Fetch reviews for the nurse with nurseId
    // For now, using placeholder data
    const nurse = this.nurses.find(n => n.id === nurseId);
    if (nurse) {
      this.selectedNurseName = `${nurse.firstName} ${nurse.lastName}`;
      // Simulate fetching reviews
      this.selectedNurseReviews =  nurse.reviews;
      this.isReviewsModalOpen = true;
    }
  }

  closeReviewsModal() {
    this.isReviewsModalOpen = false;
    this.selectedNurseReviews = [];
    this.selectedNurseName = '';
  }
  addToLandingPage(review: any) {

      this.landingPageService.addReviewToLandingPage(review.id).subscribe({
        next: (data: any) => {
          console.log('Data:', data.data.isUsedInPublic);
          this.successMessage = 'nurse.addToLandingPageSuccess';
          this.selectedNurseReviews.find(r => r.id === review.id)!.isUsedInPublic = !review.isUsedInPublic;

          this.loadNurses();
        },
        error: (error) => {
          this.errorMessage = 'nurse.addToLandingPageError';
          console.error('Error adding nurse to landing page:', error);
        }
      });
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

  // Handle image loading errors by setting a default avatar image
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = this.defaultAvatarPath;
    }
  }

  passwordStrengthValidator(): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const errors: ValidationErrors = {};

      if (!hasUpperCase) {
        errors['noUpperCase'] = true;
      }
      if (!hasLowerCase) {
        errors['noLowerCase'] = true;
      }
      if (!hasSpecialChar) {
        errors['noSpecialChar'] = true;
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  loadSpecialties() {
    this.specialtyService.getAllSpecialties().subscribe({
      next: (response) => {
        this.specialties = response.data;
      },
      error: (error) => {
        console.error('Error loading specialties:', error);
      }
    });
  }

  loadGovernorates() {
    this.governorateService.getAllGovernorates().subscribe({
      next: (response) => {
        this.governorates = response.data;
      },
      error: (error) => {
        console.error('Error loading governorates:', error);
      }
    });
  }

  loadCities(governorateId: number) {
    this.cityService.getCityByGovernorateId(governorateId).subscribe({
      next: (response) => {
        this.cities = response.data;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }
}
