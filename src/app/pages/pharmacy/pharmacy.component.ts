import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy.service';
import { GovernorateService } from '../../services/governorate.service';
import { CityService } from '../../services/city.service';
import { GetAllPharmaciesRequest, PharmacyResponseModel } from '../../Models/DTOs/Pharmacy';
import { GovernorateDto } from '../../Models/DTOs/GovernorateDto';
import { CityDto } from '../../Models/DTOs/CityDto';

import { TranslatePipe } from '../../pipes/translate.pipe';

import {
  CardModule,
  FormModule,
  GridModule,
  ButtonModule,
  TableModule,
  ModalModule,
  AlertModule,
  ButtonGroupModule,
  FormControlDirective,
  FormSelectDirective,
  AlertComponent,
  TableDirective,
  CardBodyComponent,
  CardHeaderComponent,
  FormLabelDirective,
} from '@coreui/angular';
import { ActionButtonComponent } from '../../shared/components';
import { MapSelectorComponent } from '../../shared/components/map-selector/map-selector.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pharmacy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    FormModule,
    GridModule,
    ButtonModule,
    TableModule,
    ModalModule,
    AlertModule,
  TranslatePipe,
    FormControlDirective,
    FormSelectDirective,



    AlertComponent,
    TableDirective,
    CardBodyComponent,
    CardHeaderComponent,
    FormLabelDirective,
    ButtonGroupModule,
    ActionButtonComponent,
    MapSelectorComponent,
    PaginationComponent
  ],
  templateUrl: './pharmacy.component.html',
  styleUrl: './pharmacy.component.scss'
})
export class PharmacyComponent implements OnInit {
  pharmacies: PharmacyResponseModel[] = [];
  governorates: GovernorateDto[] = [];
  cities: CityDto[] = [];
  pharmacyForm: FormGroup;
  isEditing = false;
  showForm = false;

  // Delete modal state
  isDeleteModalOpen = false;
  pharmacyIdToDelete: string | null = null;

  // Map state
  showMap = false;
  selectedLatitude: number = 30.0444; // Default to Egypt's latitude
  selectedLongitude: number = 31.2357; // Default to Egypt's longitude

  alertMessage = '';
  showAlert = false;
  alertType = 'info';
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  protected Math = Math;

  constructor(
    private pharmacyService: PharmacyService,
    private governorateService: GovernorateService,
    private cityService: CityService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.pharmacyForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.email]],
      governorateId: ['', Validators.required],
      cityId: ['', Validators.required],
      latitude: ['', [Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.min(-180), Validators.max(180)]],
      notes: [''],
      addressNotes: ['']
    });
  }

  ngOnInit(): void {
    this.loadPharmacies();
    this.loadGovernorates();
  }

  loadPharmacies(): void {
    const request: GetAllPharmaciesRequest = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchText: '',
      cityId: 0
    };

    this.pharmacyService.getAll(request).subscribe({
      next: (response) => {
        if (response && response.data) {
          // Handle both array and paginated response structures
          if (Array.isArray(response.data)) {
            // Direct array response
            this.pharmacies = response.data;
            this.totalItems = response.data.length;
          } else {
            // Try to access as paginated response
            const paginatedData = response.data as any;
            if (paginatedData.items && Array.isArray(paginatedData.items)) {
              // Paginated response with items array
              this.pharmacies = paginatedData.items;
              this.totalItems = paginatedData.totalCount || paginatedData.items.length;
            } else {
              // Fallback: ensure pharmacies is always an array
              this.pharmacies = [];
              this.totalItems = 0;
            }
          }
        } else {
          this.pharmacies = [];
          this.totalItems = 0;
        }
      },
      error: () => {
        this.pharmacies = [];
        this.totalItems = 0;
        this.translate.get('PHARMACY.MESSAGES.ERROR.LOAD_PHARMACIES').subscribe((msg: string) => {
          this.showAlertMessage(msg, 'danger');
        });
      }
    });
  }

  loadGovernorates(): void {
    this.governorateService.getAllGovernorates().subscribe({
      next: (response) => {
        if (response && response.data) {
          // Ensure governorates is always an array
          if (Array.isArray(response.data)) {
            this.governorates = response.data;
          } else {
            // Try to access as paginated response
            const paginatedData = response.data as any;
            if (paginatedData.items && Array.isArray(paginatedData.items)) {
              this.governorates = paginatedData.items;
            } else {
              this.governorates = [];
            }
          }
        } else {
          this.governorates = [];
        }
      },
      error: () => {
        this.governorates = [];
        this.translate.get('PHARMACY.MESSAGES.ERROR.LOAD_GOVERNORATES').subscribe((msg: string) => {
          this.showAlertMessage(msg, 'danger');
        });
      }
    });
  }

  loadCitiesByGovernorate(governorateId: number): void {
    this.cityService.getCityByGovernorateId(governorateId).subscribe({
      next: (response) => {
        if (response && response.data) {
          // Ensure cities is always an array
          if (Array.isArray(response.data)) {
            this.cities = response.data;
          } else {
            const paginatedData = response.data as any;
            if (paginatedData.items && Array.isArray(paginatedData.items)) {
              this.cities = paginatedData.items;
            } else {
              this.cities = [];
            }
          }
        } else {
          this.cities = [];
        }
      },
      error: () => {
        this.cities = [];
        this.translate.get('PHARMACY.MESSAGES.ERROR.LOAD_CITIES').subscribe((msg: string) => {
          this.showAlertMessage(msg, 'danger');
        });
      }
    });
  }

  onGovernorateChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const governorateId = +target.value;

    if (governorateId) {
      this.cityService.getCityByGovernorateId(governorateId).subscribe({
        next: (response) => {
          if (response && response.data) {
            // Ensure cities is always an array
            if (Array.isArray(response.data)) {
              this.cities = response.data;
            } else {
              const paginatedData = response.data as any;
              if (paginatedData.items && Array.isArray(paginatedData.items)) {
                this.cities = paginatedData.items;
              } else {
                this.cities = [];
              }
            }
          } else {
            this.cities = [];
          }
        },
        error: () => {
          this.cities = [];
          this.translate.get('PHARMACY.MESSAGES.ERROR.LOAD_CITIES').subscribe((msg: string) => {
            this.showAlertMessage(msg, 'danger');
          });
        }
      });
    } else {
      this.cities = [];
    }
  }

  getGovernorateName(governorateId: number): string {
    const governorate = this.governorates.find(g => g.id === governorateId);
    if (!governorate) return '';
    return this.getCurrentLanguage() === 'ar' ? governorate.nameAr : governorate.nameEn;
  }

  getCityName(cityId: number): string {
    const city = this.cities.find(c => c.id === cityId);
    if (!city) return '';
    return this.getCurrentLanguage() === 'ar' ? city.nameAr : city.nameEn;
  }

  openForm(pharmacy?: PharmacyResponseModel): void {
    this.isEditing = !!pharmacy;
    if (pharmacy) {
      this.pharmacyForm.patchValue({
        id: pharmacy.id,
        name: pharmacy.name,
        phone: pharmacy.phoneNumber,
        address: pharmacy.addressNotes || pharmacy.lineNumber, // Use addressNotes as primary address
        email: pharmacy.email,
        latitude: pharmacy.latitude,
        longitude: pharmacy.longitude,
        governorateId: pharmacy.governorateId,
        cityId: pharmacy.cityId,
        notes: pharmacy.notes,
        addressNotes: pharmacy.addressNotes
      });
      this.loadCitiesByGovernorate(pharmacy.governorateId);

      // Set map coordinates if available
      if (pharmacy.latitude && pharmacy.longitude) {
        this.selectedLatitude = parseFloat(pharmacy.latitude);
        this.selectedLongitude = parseFloat(pharmacy.longitude);
      }
    } else {
      this.pharmacyForm.reset();
      this.cities = []; // Clear cities when adding new pharmacy
      // Reset map to default coordinates
      this.selectedLatitude = 30.0444;
      this.selectedLongitude = 31.2357;
    }
    this.showForm = true;
    this.showMap = false; // Hide map initially

    // Scroll to form
    setTimeout(() => {
      const formElement = document.querySelector('[data-form-section]');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  closeForm(): void {
    this.showForm = false;
    this.showMap = false;
    this.pharmacyForm.reset();
    this.cities = [];
  }

  onSubmit(): void {
    if (this.pharmacyForm.valid) {
      const formValue = this.pharmacyForm.value;

      // Map form data to the correct API structure
      const pharmacyData = {
        id: formValue.id,
        name: formValue.name,
        phoneNumber: formValue.phone,
        email: formValue.email,
        lineNumber: formValue.address, // Map address to lineNumber
        addressNotes: formValue.addressNotes,
        latitude: formValue.latitude ? formValue.latitude.toString() : '0',
        longitude: formValue.longitude ? formValue.longitude.toString() : '0',
        governorateId: parseInt(formValue.governorateId),
        cityId: parseInt(formValue.cityId),
        notes: formValue.notes
      };

      if (this.isEditing) {
        this.pharmacyService.update(pharmacyData).subscribe({
          next: (response) => {
            if (response.status === 0) {
              this.translate.get('PHARMACY.MESSAGES.UPDATE_SUCCESS').subscribe((msg: string) => {
                this.showAlertMessage(msg, 'success');
              });

              // Update the pharmacy in the list directly
              const updatedPharmacy: PharmacyResponseModel = {
                id: pharmacyData.id,
                name: pharmacyData.name,
                phoneNumber: pharmacyData.phoneNumber,
                email: pharmacyData.email,
                lineNumber: pharmacyData.lineNumber,
                addressNotes: pharmacyData.addressNotes,
                latitude: pharmacyData.latitude,
                longitude: pharmacyData.longitude,
                governorateId: pharmacyData.governorateId,
                cityId: pharmacyData.cityId,
                notes: pharmacyData.notes
              };

              // Find and update the pharmacy in the list
              const index = this.pharmacies.findIndex(p => p.id === pharmacyData.id);
              if (index !== -1) {
                this.pharmacies[index] = updatedPharmacy;
                // Trigger change detection
                this.pharmacies = [...this.pharmacies];
              } else {
                // Fallback: reload if not found
                this.loadPharmacies();
              }

              this.closeForm();
            } else {
              this.translate.get('PHARMACY.MESSAGES.ERROR.UPDATE').subscribe((msg: string) => {
                this.showAlertMessage(response.message || msg, 'danger');
              });
            }
          },
          error: (error) => {
            console.error('Update error:', error);
            this.translate.get('PHARMACY.MESSAGES.ERROR.UPDATE').subscribe((msg: string) => {
              this.showAlertMessage(msg, 'danger');
            });
          }
        });
      } else {
        this.pharmacyService.add(pharmacyData).subscribe({
          next: (response) => {
            if (response.status === 0) {
              this.translate.get('PHARMACY.MESSAGES.ADD_SUCCESS').subscribe((msg: string) => {
                this.showAlertMessage(msg, 'success');
              });

              // Add the new pharmacy to the list immediately
              if (response.data) {
                // Create a new pharmacy object with the response data
                const newPharmacy: PharmacyResponseModel = {
                  id: response.data.id || Date.now(), // Use response ID or fallback
                  name: pharmacyData.name,
                  phoneNumber: pharmacyData.phoneNumber,
                  email: pharmacyData.email,
                  lineNumber: pharmacyData.lineNumber,
                  addressNotes: pharmacyData.addressNotes,
                  latitude: pharmacyData.latitude,
                  longitude: pharmacyData.longitude,
                  governorateId: pharmacyData.governorateId,
                  cityId: pharmacyData.cityId,
                  notes: pharmacyData.notes
                };

                // Add to the beginning of the list
                this.pharmacies = [newPharmacy, ...this.pharmacies];
                this.totalItems = this.totalItems + 1;
              } else {
                // Fallback: reload the list if no data in response
                this.loadPharmacies();
              }

              this.closeForm();
            } else {
              this.translate.get('PHARMACY.MESSAGES.ERROR.ADD').subscribe((msg: string) => {
                this.showAlertMessage(response.message || msg, 'danger');
              });
            }
          },
          error: (error) => {
            console.error('Add error:', error);
            this.translate.get('PHARMACY.MESSAGES.ERROR.ADD').subscribe((msg: string) => {
              this.showAlertMessage(msg, 'danger');
            });
          }
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.pharmacyForm.controls).forEach(key => {
        this.pharmacyForm.get(key)?.markAsTouched();
      });
      this.translate.get('PHARMACY.FORM.VALIDATION_ERROR').subscribe((msg: string) => {
        this.showAlertMessage(msg || 'Please fill in all required fields correctly', 'warning');
      });
    }
  }

  openDeleteModal(pharmacyId: string): void {
    this.pharmacyIdToDelete = pharmacyId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.pharmacyIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.pharmacyIdToDelete) {
      const pharmacyToDeleteId = parseInt(this.pharmacyIdToDelete);
      this.pharmacyService.delete(this.pharmacyIdToDelete).subscribe({
        next: () => {
          this.translate.get('PHARMACY.MESSAGES.DELETE_SUCCESS').subscribe((msg: string) => {
            this.showAlertMessage(msg, 'success');
          });

          // Remove the pharmacy from the list directly
          this.pharmacies = this.pharmacies.filter(p => p.id !== pharmacyToDeleteId);
          this.totalItems = this.totalItems - 1;

          // If we're on a page that no longer has items, go to previous page
          if (this.pharmacies.length === 0 && this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            this.loadPharmacies();
          }

          this.closeDeleteModal();
        },
        error: () => {
          this.translate.get('PHARMACY.MESSAGES.ERROR.DELETE').subscribe((msg: string) => {
            this.showAlertMessage(msg, 'danger');
          });
          this.closeDeleteModal();
        }
      });
    }
  }

  showAlertMessage(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 3000);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPharmacies();
  }

  // Map-related methods
  toggleMap(): void {
    this.showMap = !this.showMap;

    // If opening map, set current coordinates if available
    if (this.showMap) {
      const lat = this.pharmacyForm.get('latitude')?.value;
      const lng = this.pharmacyForm.get('longitude')?.value;

      if (lat && lng) {
        this.selectedLatitude = parseFloat(lat);
        this.selectedLongitude = parseFloat(lng);
      }
    }
  }

  onLocationSelected(location: { lat: number; lng: number }): void {
    this.selectedLatitude = location.lat;
    this.selectedLongitude = location.lng;

    // Update form with selected coordinates
    this.pharmacyForm.patchValue({
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6)
    });
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          this.selectedLatitude = lat;
          this.selectedLongitude = lng;

          // Update form with current location
          this.pharmacyForm.patchValue({
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6)
          });

          // Show map with current location
          this.showMap = true;
        },
        (error) => {
          console.error('Error getting current location:', error);
          this.translate.get('PHARMACY.MAP.LOCATION_ERROR').subscribe((msg: string) => {
            this.showAlertMessage(msg || 'Unable to get current location. Please select manually on the map.', 'warning');
          });
        }
      );
    } else {
      this.translate.get('PHARMACY.MAP.GEOLOCATION_NOT_SUPPORTED').subscribe((msg: string) => {
        this.showAlertMessage(msg || 'Geolocation is not supported by this browser.', 'warning');
      });
    }
  }

  // Get current language for conditional display
  getCurrentLanguage(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }
}
