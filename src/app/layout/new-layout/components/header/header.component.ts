import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { Subject, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <header>
      <nav>
        <div class="container">
          <div class="logo">proCare</div>
          <button class="mobile-menu-toggle" aria-label="Toggle mobile menu">☰</button>
          <div class="nav-links">
            <a href="#features">{{ 'landing.features' | translate | async }}</a>
            <a href="#how-it-works">{{ 'landing.how_it_works' | translate | async }}</a>
            <a href="#why-choose">{{ 'landing.why_choose' | translate | async }}</a>
            <a href="#faq">{{ 'landing.faq' | translate | async }}</a>

            <!-- Language Switcher -->
            <div class="lang-switcher">
              <button class="lang-btn" (click)="toggleLanguage()">
                {{ currentLang === 'ar' ? 'العربية' : 'English' }}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    header {
      background: var(--light);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    nav {
      padding: 1rem 0;
      .container { display: flex; justify-content: space-between; align-items: center; }
    }

    .logo { font-size: 1.8rem; font-weight: 700; color: var(--primary); }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      a {
        text-decoration: none;
        color: var(--text);
        font-weight: 600;
        transition: color 0.3s;
        &:hover { color: var(--primary); }
      }
    }

    .lang-switcher {
      .lang-btn {
        background: var(--primary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s;

        &:hover {
          background: var(--primary);
          opacity: 0.9;
          transform: translateY(-1px);
        }
      }
    }

    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .mobile-menu-toggle { display: block; }
      .nav-links { display: none; }
    }
  `]
})
export class LandingHeaderComponent {
  currentLang = 'ar';
  private destroy$ = new Subject<void>();
  isChangingLanguage = false;

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
  toggleLanguage() {
    this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.translationService.setLanguageWithApi( this.currentLang );
    // Apply direction changes
    const htmlElement = document.documentElement;
    if (this.currentLang === 'ar') {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.setAttribute('lang', 'ar');
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.setAttribute('lang', 'en');
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
