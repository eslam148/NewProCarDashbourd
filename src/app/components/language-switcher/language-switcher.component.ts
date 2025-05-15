import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { DropdownComponent, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

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
      <button [caret]="false" cDropdownToggle aria-label="Switch language">
        <svg cIcon [name]="currentLang === 'en' ? 'cilGlobeAlt' : 'cilLanguage'" size="lg"></svg>
      </button>
      <div cDropdownMenu>
        <button
          (click)="switchLanguage('en')"
          [active]="currentLang === 'en'"
          cDropdownItem
          class="d-flex align-items-center"
        >
          <svg cIcon class="me-2" name="cilGlobeAlt" size="lg"></svg>
          English
        </button>
        <button
          (click)="switchLanguage('ar')"
          [active]="currentLang === 'ar'"
          cDropdownItem
          class="d-flex align-items-center"
        >
        <svg cIcon class="me-2" name="cilGlobeAlt" size="lg"></svg>
        العربية
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
export class LanguageSwitcherComponent {
  currentLang = 'en';

  constructor(private translationService: TranslationService) {
    this.translationService.getCurrentLang().subscribe(lang => {
      this.currentLang = lang;
    });
  }

  switchLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
  }
}