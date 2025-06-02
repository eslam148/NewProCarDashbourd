import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PharmacyService } from '../../services/pharmacy.service';
import { GovernorateService } from '../../services/governorate.service';
import { CityService } from '../../services/city.service';
import { PharmacyModel, GetAllPharmaciesRequest, PharmacyResponseModel } from '../../Models/DTOs/Pharmacy';
import { GovernorateDto } from '../../Models/DTOs/GovernorateDto';
import { CityDto } from '../../Models/DTOs/CityDto';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  ModalBodyComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  AlertComponent,
  TableDirective,
  CardBodyComponent,
  CardHeaderComponent,
  FormLabelDirective,
} from '@coreui/angular';
import { ActionButtonComponent } from '../../shared/components';

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
    TranslateModule,
    FormControlDirective,
    FormSelectDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    AlertComponent,
    TableDirective,
    CardBodyComponent,
    CardHeaderComponent,
    FormLabelDirective,
    ButtonGroupModule,
    ActionButtonComponent
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
  showModal = false;
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
      phone: ['', Validators.required],
      governorateId: ['', Validators.required],
      cityId: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]]
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
          this.pharmacies = response.data;
          this.totalItems = this.pharmacies.length;
        }
      },
      error: () => {
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
          this.governorates = response.data;
        }
      },
      error: () => {
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
          this.cities = response.data;
        }
      },
      error: () => {
        this.showAlertMessage('Error loading cities', 'danger');
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
            this.cities = response.data;
          }
        },
        error: () => {
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
    return governorate ? governorate.nameEn : '';
  }

  getCityName(cityId: number): string {
    const city = this.cities.find(c => c.id === cityId);
    return city ? city.nameEn : '';
  }

  openModal(pharmacy?: PharmacyResponseModel): void {
    this.isEditing = !!pharmacy;
    if (pharmacy) {
      this.pharmacyForm.patchValue({
        id: pharmacy.id,
        name: pharmacy.name,
        phone: pharmacy.phoneNumber,
        address: pharmacy.lineNumber,
        email: pharmacy.email,
        latitude: pharmacy.latitude,
        longitude: pharmacy.longitude,
        governorateId: pharmacy.governorateId,
        cityId: pharmacy.cityId,
        notes: pharmacy.notes,
        addressNotes: pharmacy.addressNotes
      });
      this.loadCitiesByGovernorate(pharmacy.governorateId);
    } else {
      this.pharmacyForm.reset();
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.pharmacyForm.reset();
  }

  onSubmit(): void {
    if (this.pharmacyForm.valid) {
      const pharmacyData = this.pharmacyForm.value;

      if (this.isEditing) {
        this.pharmacyService.update(pharmacyData).subscribe({
          next: () => {
            this.translate.get('PHARMACY.MESSAGES.UPDATE_SUCCESS').subscribe((msg: string) => {
              this.showAlertMessage(msg, 'success');
            });
            this.loadPharmacies();
            this.closeModal();
          },
          error: () => {
            this.translate.get('PHARMACY.MESSAGES.ERROR.UPDATE').subscribe((msg: string) => {
              this.showAlertMessage(msg, 'danger');
            });
          }
        });
      } else {
        this.pharmacyService.add(pharmacyData).subscribe({
          next: () => {
            this.translate.get('PHARMACY.MESSAGES.ADD_SUCCESS').subscribe((msg: string) => {
              this.showAlertMessage(msg, 'success');
            });
            this.loadPharmacies();
            this.closeModal();
          },
          error: () => {
            this.translate.get('PHARMACY.MESSAGES.ERROR.ADD').subscribe((msg: string) => {
              this.showAlertMessage(msg, 'danger');
            });
          }
        });
      }
    }
  }

  deletePharmacy(id: string): void {
    this.translate.get('PHARMACY.MESSAGES.DELETE_CONFIRM').subscribe((msg: string) => {
      if (confirm(msg)) {
        this.pharmacyService.delete(id).subscribe({
          next: () => {
            this.translate.get('PHARMACY.MESSAGES.DELETE_SUCCESS').subscribe((msg: string) => {
              this.showAlertMessage(msg, 'success');
            });
            this.loadPharmacies();
          },
          error: () => {
            this.translate.get('PHARMACY.MESSAGES.ERROR.DELETE').subscribe((msg: string) => {
              this.showAlertMessage(msg, 'danger');
            });
          }
        });
      }
    });
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
}
