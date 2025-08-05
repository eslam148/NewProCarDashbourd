import { LandingPageService } from './../../services/landing-page.service';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NurseService, NurseSearchParams } from '../../services/nurse.service';
import { NurseDto, ReviewDto } from '../../Models/DTOs/NurseDto';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  nurses: NurseDto[] = [];
  form!: FormGroup; // Using definite assignment assertion
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

  // Search filters
  searchKey = '';
  selectedGovernorateId = 0;
  selectedCityId = 0;
  searchLatitude = 0;
  searchLongitude = 0;

  // Separate arrays for search filters
  searchCities: CityDto[] = [];

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
    this.initializeForm();
  }

  private initializeForm() {
    // Create base form group with validators
    const baseControls = {
      firstName: ['', [
        Validators.required
      ]],
      lastName: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/)
      ]],
      specialtyId: [null, [
        Validators.required
      ]],
      governorateId: [null, [
        Validators.required
      ]],
      cityId: [null, [
        Validators.required
      ]],
      medicalLicense: ['', [
        Validators.required
      ]],
      latitude: ['', [
        Validators.required
      ]],
      longitude: ['', [
        Validators.required
      ]],
      imageUrl: ['']
    };

    if (this.isEditMode) {
      this.form = this.fb.group({
        id: [''], // Changed from Id to id to match API
        ...baseControls
      });
    } else {
      // Create mode - add password fields
      this.form = this.fb.group({
        ...baseControls,
        password: ['', [
          Validators.required,
          Validators.minLength(8)
        ]],
        confirmPassword: ['', [
          Validators.required
        ]]
      }, {
        validators: this.passwordMatchValidator.bind(this)
      });
    }

    // Listen to governorate changes
    this.form.get('governorateId')?.valueChanges.subscribe(governorateId => {
      const cityControl = this.form.get('cityId');
      if (cityControl) {
        cityControl.setValue(null);
        cityControl.markAsUntouched();
      }
      this.cities = [];

      if (governorateId) {
        this.loadCities(governorateId);
      }
    });
  }

  // Helper method to check if a field has errors
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  // Helper method to get field error message
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return `${fieldName} is required`;
    if (errors['email']) return 'Invalid email format';
    if (errors['pattern']) {
      if (fieldName === 'phoneNumber') return 'Invalid phone number format';
      if (fieldName === 'password') return 'Password must contain at least 8 characters';
    }
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
    if (errors['passwordMismatch']) return 'Passwords do not match';

    return 'Invalid value';
  }

  ngOnInit() {
    this.loadNurses();
    this.loadSpecialties();
    this.loadGovernorates();
  }

  ngAfterViewInit() {
    if (this.showMap && this.mapSelector) {
      this.mapSelector.refreshMap();
    }
  }

  loadNurses() {
    const searchParams: NurseSearchParams = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchKey: this.searchKey,
      cityId: this.selectedCityId,
      latitude: this.searchLatitude,
      longitude: this.searchLongitude
    };

    this.nurseService.getAllNurses(searchParams).subscribe({
      next: (res) => {
        this.nurses = res.data.items;
        console.log('Nurses loaded:', this.nurses);
        console.log('Search params used:', searchParams);

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

  searchNurses() {
    this.pageNumber = 1; // Reset to first page when searching
    console.log('Searching nurses with filters:', {
      searchKey: this.searchKey,
      cityId: this.selectedCityId,
      latitude: this.searchLatitude,
      longitude: this.searchLongitude
    });
    this.loadNurses();
  }

  resetSearch() {
    this.searchKey = '';
    this.selectedGovernorateId = 0;
    this.selectedCityId = 0;
    this.searchLatitude = 0;
    this.searchLongitude = 0;
    this.searchCities = [];
    this.pageNumber = 1;
    this.loadNurses();
  }

  // Handle governorate change for search filters
  onSearchGovernorateChange() {
    this.selectedCityId = 0; // Reset city selection
    this.searchCities = []; // Clear cities array

    if (this.selectedGovernorateId && this.selectedGovernorateId > 0) {
      this.loadSearchCities(this.selectedGovernorateId);
    }
  }

  // Load cities for search filter based on selected governorate
  loadSearchCities(governorateId: number) {
    this.cityService.getCityByGovernorateId(governorateId).subscribe({
      next: (response) => {
        this.searchCities = response.data;
      },
      error: (error) => {
        console.error('Error loading search cities:', error);
      }
    });
  }

  // Test method to verify API call with exact curl parameters
  testApiCall() {
    const testParams: NurseSearchParams = {
      pageNumber: 0,
      pageSize: 0,
      searchKey: "string",
      cityId: 0,
      latitude: 0,
      longitude: 0
    };

    console.log('Testing API call with exact curl parameters:', testParams);
    this.nurseService.getAllNurses(testParams).subscribe({
      next: (response) => {
        console.log('API Response:', response);
      },
      error: (error) => {
        console.error('API Error:', error);
      }
    });
  }

  getPagesCount(): number {
    if (!this.totalCount || this.totalCount <= 0) return 1;
    return Math.ceil(this.totalCount / this.pageSize);
  }

  showAddForm() {
    this.isEditMode = false;
    this.initializeForm();  // Initialize form after setting isEditMode
    this.showForm = true;
    this.showMap = true;
    this.imagePreview = null;
    this.selectedImageFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  editNurse(nurse: NurseDto) {
    this.isEditMode = true;
    this.initializeForm();  // Initialize form after setting isEditMode

    // Patch values after form is initialized
    this.form.patchValue({
      id: nurse.id, // Changed from Id to id
      firstName: nurse.firstName,
      lastName: nurse.lastName,
      phoneNumber: nurse.phoneNumber,
      email: nurse.email,
      specialtyId: nurse.specialization,
      governorateId: nurse.governorateId,
      cityId: nurse.cityId,
      medicalLicense: nurse.licenseNumber,
      latitude: nurse.latitude,
      longitude: nurse.longitude,
      imageUrl: nurse.imageUrl
    });

    this.showForm = true;
    this.showMap = true;
    this.imagePreview = nurse.imageUrl || null;
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'nurse.invalidImageType';
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.errorMessage = 'nurse.imageTooLarge';
        return;
      }

      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.imagePreview = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.imagePreview = null;
    this.selectedImageFile = null;
    this.form.patchValue({ imageUrl: '' });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
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
    if (this.form.invalid) {
      this.markFormAsTouched();
      return;
    }

    const formData = new FormData();
    const formValue = this.form.value;

    if (this.isEditMode) {
      // Edit mode - match exact API structure
      formData.append('Id', formValue.id?.toString() || '');
      formData.append('FirstName', formValue.firstName?.trim() || '');
      formData.append('LastName', formValue.lastName?.trim() || '');
      formData.append('PhoneNumber', formValue.phoneNumber || '');
      formData.append('SpecialtyId', formValue.specialtyId?.toString() || '0');
      formData.append('GovernorateId', formValue.governorateId?.toString() || '0');
      formData.append('CityId', formValue.cityId?.toString() || '0');
      formData.append('MedicalLicense', formValue.medicalLicense?.trim() || '');

      // Handle image - API expects 'Image' field
      if (this.selectedImageFile) {
        formData.append('Image', this.selectedImageFile);
      } else if (formValue.imageUrl) {
        // If there's an existing image URL but no new file selected
        const existingImageBlob = new Blob([formValue.imageUrl], { type: 'text/plain' });
        formData.append('Image', existingImageBlob, 'existing-image-url.txt');
      } else {
        // If no image at all, send empty string
        formData.append('Image', '');
      }

      // Log the form data for debugging
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      this.nurseService.updateNurse(formData).subscribe({
        next: () => {
          this.successMessage = 'nurse.success.edit';
          this.loadNurses();
          this.showForm = false;
          this.form.reset();
          this.selectedImageFile = null;
          this.imagePreview = null;
        },
        error: (error) => {
          console.error('Update error:', error);
          this.handleError(error);
        }
      });
    } else {
      // Add mode - nested UserData structure
      formData.append('UserData.FirstName', formValue.firstName?.trim() || '');
      formData.append('UserData.LastName', formValue.lastName?.trim() || '');
      formData.append('UserData.Email', formValue.email?.trim() || '');
      formData.append('UserData.PhoneNumber', formValue.phoneNumber || '');
      formData.append('UserData.Password', formValue.password || '');
      formData.append('UserData.ConfirmPassword', formValue.confirmPassword || '');

      formData.append('SpecialtyId', formValue.specialtyId?.toString() || '0');
      formData.append('GovernorateId', formValue.governorateId?.toString() || '0');
      formData.append('CityId', formValue.cityId?.toString() || '0');
      formData.append('MedicalLicense', formValue.medicalLicense?.trim() || '');
      formData.append('Latitude', formValue.latitude?.toString() || '0');
      formData.append('Longitude', formValue.longitude?.toString() || '0');

      // Handle profile picture
      if (this.selectedImageFile) {
        formData.append('ProfilePicture', this.selectedImageFile);
      }

      // Log the form data for debugging
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      this.nurseService.addNurse(formData).subscribe({
        next: () => {
          this.successMessage = 'nurse.success.add';
          this.loadNurses();
          this.showForm = false;
          this.form.reset();
          this.selectedImageFile = null;
          this.imagePreview = null;
        },
        error: (error) => {
          console.error('Add error:', error);
          this.handleError(error);
        }
      });
    }
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    if (error.error?.errors) {
      // Handle validation errors from API
      const errorMessages = [];
      for (const key in error.error.errors) {
        errorMessages.push(error.error.errors[key].join(', '));
      }
      this.errorMessage = errorMessages.join('\n');
    } else {
      this.errorMessage = error.error?.message || 'nurse.generalError';
    }
  }

  private markFormAsTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control) {
        control.markAsTouched();
        if (control.invalid) {
          console.log(`${key} validation errors:`, control.errors);
        }
      }
    });
  }

  cancel() {
    this.showForm = false;
    this.showMap = false;
    this.form.reset();
    this.isEditMode = false;
    this.imagePreview = null;
    this.selectedImageFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
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
  addToLandingPage(review: ReviewDto) {

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

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const errors: ValidationErrors = {};

      if (!hasUpperCase) errors['noUpperCase'] = true;
      if (!hasLowerCase) errors['noLowerCase'] = true;
      if (!hasSpecialChar) errors['noSpecialChar'] = true;

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

  loadAllCities() {
    this.cityService.getAllCities().subscribe({
      next: (response) => {
        this.cities = response.data;
      },
      error: (error) => {
        console.error('Error loading all cities:', error);
      }
    });
  }
}
