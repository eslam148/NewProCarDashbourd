import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { RTLSelectFix } from '../../utils/rtl-select-fix';
import { DropdownComponent, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    CommonModule,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    IconDirective
  ],
  template: `
    <c-dropdown alignment="end" variant="nav-item">
      <button [caret]="false" cDropdownToggle aria-label="Switch language" [disabled]="isChangingLanguage">
        <svg cIcon [name]="currentLang === 'en' ? 'cilGlobeAlt' : 'cilLanguage'" size="lg"></svg>
        <span *ngIf="isChangingLanguage" class="spinner-border spinner-border-sm ms-1" role="status" aria-hidden="true"></span>
      </button>
      <div cDropdownMenu>
        <button
          (click)="switchLanguage('en')"
          [active]="currentLang === 'en'"
          [disabled]="isChangingLanguage"
          cDropdownItem
          class="d-flex align-items-center"
        >
          <svg cIcon class="me-2" name="cilGlobeAlt" size="lg"></svg>
          English
          <span *ngIf="isChangingLanguage && currentLang !== 'en'" class="spinner-border spinner-border-sm ms-auto" role="status" aria-hidden="true"></span>
        </button>
        <button
          (click)="switchLanguage('ar')"
          [active]="currentLang === 'ar'"
          [disabled]="isChangingLanguage"
          cDropdownItem
          class="d-flex align-items-center"
        >
        <svg cIcon class="me-2" name="cilGlobeAlt" size="lg"></svg>
        العربية
        <span *ngIf="isChangingLanguage && currentLang !== 'ar'" class="spinner-border spinner-border-sm ms-auto" role="status" aria-hidden="true"></span>
        </button>
      </div>
    </c-dropdown>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class LanguageSwitcherComponent implements OnDestroy {
  currentLang = 'en';
  isChangingLanguage = false;
  private destroy$ = new Subject<void>();

  constructor(private translationService: TranslationService) {
    this.translationService.getCurrentLang()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.currentLang = lang;
      });

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

  switchLanguage(lang: string): void {
    // Use the new API-integrated method
    this.translationService.setLanguageWithApi(lang);

    // Apply RTL direction for Arabic
    const htmlElement = document.documentElement;
    if (lang === 'ar') {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.setAttribute('lang', 'ar');
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.setAttribute('lang', 'en');
    }

    // Apply RTL fixes to all select elements after language change
    setTimeout(() => {
      RTLSelectFix.applyRTLToAllSelects();
    }, 100);
  }
}
