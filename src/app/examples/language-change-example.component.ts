import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';
import { ProfileService } from '../services/profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Example component demonstrating how to use the language change API
 * This component shows both local language switching and API-synchronized language changes
 */
@Component({
  selector: 'app-language-change-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h5>Language Change API Example</h5>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <strong>Current Language:</strong> {{ currentLanguage }}
        </div>
        
        <div class="mb-3">
          <strong>API Status:</strong> 
          <span [class]="isChangingLanguage ? 'text-warning' : 'text-success'">
            {{ isChangingLanguage ? 'Changing...' : 'Ready' }}
          </span>
        </div>

        <div class="mb-3">
          <h6>Local Language Change (No API):</h6>
          <button 
            class="btn btn-outline-primary me-2" 
            (click)="setLocalLanguage('en')"
            [disabled]="isChangingLanguage">
            English (Local)
          </button>
          <button 
            class="btn btn-outline-primary" 
            (click)="setLocalLanguage('ar')"
            [disabled]="isChangingLanguage">
            العربية (Local)
          </button>
        </div>

        <div class="mb-3">
          <h6>API-Synchronized Language Change:</h6>
          <button 
            class="btn btn-primary me-2" 
            (click)="setApiLanguage('en')"
            [disabled]="isChangingLanguage">
            <span *ngIf="isChangingLanguage" class="spinner-border spinner-border-sm me-1"></span>
            English (API)
          </button>
          <button 
            class="btn btn-primary" 
            (click)="setApiLanguage('ar')"
            [disabled]="isChangingLanguage">
            <span *ngIf="isChangingLanguage" class="spinner-border spinner-border-sm me-1"></span>
            العربية (API)
          </button>
        </div>

        <div class="mb-3">
          <h6>Direct API Call Example:</h6>
          <button 
            class="btn btn-success me-2" 
            (click)="callApiDirectly(2)"
            [disabled]="isChangingLanguage">
            Call API (English = 2)
          </button>
          <button 
            class="btn btn-success" 
            (click)="callApiDirectly(1)"
            [disabled]="isChangingLanguage">
            Call API (Arabic = 1)
          </button>
        </div>

        <div *ngIf="lastApiResponse" class="alert alert-info">
          <strong>Last API Response:</strong>
          <pre>{{ lastApiResponse | json }}</pre>
        </div>

        <div *ngIf="lastError" class="alert alert-danger">
          <strong>Error:</strong> {{ lastError }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      max-width: 600px;
      margin: 20px auto;
    }
    pre {
      font-size: 0.8em;
      margin: 0;
    }
  `]
})
export class LanguageChangeExampleComponent implements OnDestroy {
  currentLanguage = 'en';
  isChangingLanguage = false;
  lastApiResponse: any = null;
  lastError: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private translationService: TranslationService,
    private profileService: ProfileService
  ) {
    // Subscribe to current language
    this.translationService.getCurrentLang()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.currentLanguage = lang;
      });

    // Subscribe to loading state
    this.translationService.getIsChangingLanguage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isChanging => {
        this.isChangingLanguage = isChanging;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Set language locally without API call
   */
  setLocalLanguage(language: string): void {
    this.clearMessages();
    this.translationService.setLanguage(language);
  }

  /**
   * Set language with API synchronization
   */
  setApiLanguage(language: string): void {
    this.clearMessages();
    this.translationService.setLanguageWithApi(language);
  }

  /**
   * Call the API directly for demonstration
   */
  callApiDirectly(languageCode: number): void {
    this.clearMessages();
    this.profileService.changeLanguage(languageCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.lastApiResponse = response;
          console.log('Direct API call successful:', response);
        },
        error: (error) => {
          this.lastError = error.message || 'API call failed';
          console.error('Direct API call failed:', error);
        }
      });
  }

  private clearMessages(): void {
    this.lastApiResponse = null;
    this.lastError = null;
  }
}
