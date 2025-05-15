import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GovernorateDto } from '../../Models/DTOs/GovernorateDto';
import { CityDto } from '../../Models/DTOs/CityDto';
import { AppState } from '../../store';
import { selectAllGovernorates } from '../../store/governorate/governorate.selectors';
import { selectAllCities } from '../../store/city/city.selectors';
import * as GovernorateActions from '../../store/governorate/governorate.actions';
import * as CityActions from '../../store/city/city.actions';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { cilPlus, cilPencil } from '@coreui/icons';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ReactiveFormsModule, ButtonModule, IconModule, TranslatePipe],
  providers: [IconSetService]
})
export class LocationComponent implements OnInit {
  governorates$: Observable<GovernorateDto[]>;
  cities$: Observable<CityDto[]>;
  selectedGovernorateId: number | null = null;

  governorateForm: FormGroup;
  cityForm: FormGroup;

  isAddingGovernorate = false;
  isAddingCity = false;
  isEditingGovernorate = false;
  isEditingCity = false;

  loadingGovernorates = false;
  loadingCities = false;
  governorateError: string | null = null;
  cityError: string | null = null;

  icons = { cilPlus, cilPencil };
  currentLang: string = 'en';

  showDeleteModal = false;
  deleteType: 'governorate' | 'city' | null = null;
  deleteId: number | null = null;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private iconSetService: IconSetService,
    private translationService: TranslationService
  ) {
    this.governorates$ = this.store.select(selectAllGovernorates);
    this.cities$ = this.store.select(selectAllCities);

    // Register icons
    this.iconSetService.icons = { cilPlus, cilPencil };

    this.governorateForm = this.fb.group({
      id: [null],
      nameAr: ['', [Validators.required, Validators.minLength(3)]],
      nameEn: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.cityForm = this.fb.group({
      id: [null],
      nameAr: ['', [Validators.required, Validators.minLength(3)]],
      nameEn: ['', [Validators.required, Validators.minLength(3)]],
      governorateId: [null, Validators.required]
    });

    this.translationService.getCurrentLang().subscribe(lang => {
      this.currentLang = lang;
    });

    // Subscribe to governorates to debug
    this.governorates$.subscribe({
      next: (governorates) => {
        console.log('Governorates loaded:', governorates);
        this.loadingGovernorates = false;
      },
      error: (error) => {
        console.error('Error loading governorates:', error);
        this.governorateError = 'Failed to load governorates';
        this.loadingGovernorates = false;
      }
    });

    // Subscribe to cities to debug
    this.cities$.subscribe({
      next: (cities) => {
        console.log('Cities loaded:', cities);
        this.loadingCities = false;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
        this.cityError = 'Failed to load cities';
        this.loadingCities = false;
      }
    });
  }

  ngOnInit() {
    console.log('Dispatching loadGovernorates action');
    this.loadingGovernorates = true;
    this.store.dispatch(GovernorateActions.loadGovernorates());
    this.store.select(selectAllGovernorates).subscribe((governorates) => {
      console.log('Governorates loaded:', governorates);
    });

    // Subscribe to governorateId changes in cityForm to load cities
    this.cityForm.get('governorateId')?.valueChanges.subscribe((govId) => {
      if (govId === 'all') {
        this.selectedGovernorateId = null;
        this.loadingCities = true;
        this.store.dispatch(CityActions.loadCities());
      } else if (govId) {
        this.selectedGovernorateId = govId;
        this.loadingCities = true;
        this.store.dispatch(CityActions.loadCitiesByGovernorateId({ governorateId: govId }));
      } else {
        this.selectedGovernorateId = null;
      }
    });
  }

  onGovernorateChange(governorateIdStr: string) {
    console.log('Governorate changed:', governorateIdStr);
    const governorateId = Number(governorateIdStr);
    if (!governorateIdStr || isNaN(governorateId)) {
      this.selectedGovernorateId = null;
      return;
    }
    this.selectedGovernorateId = governorateId;
    console.log('Dispatching loadCitiesByGovernorateId action with id:', governorateId);
    this.loadingCities = true;
    this.store.dispatch(CityActions.loadCitiesByGovernorateId({ governorateId }));
  }

  addGovernorate() {
    if (this.governorateForm.valid) {
      this.store.dispatch(GovernorateActions.addGovernorate({ governorate: this.governorateForm.value }));
      this.governorateForm.reset();
      this.isAddingGovernorate = false;
    }
  }

  editGovernorate(governorate: GovernorateDto) {
    this.governorateForm.patchValue({
      id: governorate.id,
      nameAr: governorate.nameAr,
      nameEn: governorate.nameEn
    });
    this.isEditingGovernorate = true;
    this.isAddingGovernorate = true;
  }

  updateGovernorate() {
    if (this.governorateForm.valid) {
      this.store.dispatch(GovernorateActions.updateGovernorate({ governorate: this.governorateForm.value }));
      this.governorateForm.reset();
      this.isEditingGovernorate = false;
      this.isAddingGovernorate = false;
    }
  }

  addCity() {
    if (this.cityForm.valid) {
      this.store.dispatch(CityActions.addCity({ city: this.cityForm.value }));
      this.cityForm.reset();
      this.isAddingCity = false;
    }
  }

  editCity(city: CityDto) {
    this.cityForm.patchValue({
      id: city.id,
      nameAr: city.nameAr,
      nameEn: city.nameEn,
      governorateId: city.governorateId
    });
    this.isEditingCity = true;
    this.isAddingCity = true;
  }

  updateCity() {
    if (this.cityForm.valid) {
      this.store.dispatch(CityActions.updateCity({ city: this.cityForm.value }));
      this.cityForm.reset();
      this.isEditingCity = false;
      this.isAddingCity = false;
    }
  }

  cancelEdit() {
    this.governorateForm.reset();
    this.cityForm.reset();
    this.isAddingGovernorate = false;
    this.isAddingCity = false;
    this.isEditingGovernorate = false;
    this.isEditingCity = false;
  }

  onGovernorateClick(govId: number) {
    this.selectedGovernorateId = govId;
    this.loadingCities = true;
    this.store.dispatch(CityActions.loadCitiesByGovernorateId({ governorateId: govId }));
  }

  deleteGovernorate(id: number) {
    if (confirm('Are you sure you want to delete this governorate?')) {
      this.store.dispatch(GovernorateActions.deleteGovernorate({ id }));
    }
  }

  deleteCity(id: number) {
    if (confirm('Are you sure you want to delete this city?')) {
      this.store.dispatch(CityActions.deleteCity({ id }));
    }
  }

  openDeleteModal(type: 'governorate' | 'city', id: number) {
    this.deleteType = type;
    this.deleteId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteType = null;
    this.deleteId = null;
  }

  confirmDelete() {
    if (this.deleteType === 'governorate' && this.deleteId !== null) {
      this.store.dispatch(GovernorateActions.deleteGovernorate({ id: this.deleteId }));
    } else if (this.deleteType === 'city' && this.deleteId !== null) {
      this.store.dispatch(CityActions.deleteCity({ id: this.deleteId }));
    }
    this.closeDeleteModal();
  }
}
