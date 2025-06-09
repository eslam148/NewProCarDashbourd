import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { Subject, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <header [class.scrolled]="isScrolled">
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
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    /* Scrolled state with enhanced styling */
    header.scrolled {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    nav {
      padding: 1rem 0;
      transition: padding 0.3s ease;

      .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    /* Compact nav when scrolled */
    header.scrolled nav {
      padding: 0.75rem 0;
    }

    .logo {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--primary);
      transition: all 0.3s ease;
    }

    header.scrolled .logo {
      font-size: 1.6rem;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      a {
        text-decoration: none;
        color: var(--text);
        font-weight: 600;
        transition: all 0.3s ease;
        position: relative;
        padding: 0.5rem 0;

        &:hover {
          color: var(--primary);
          transform: translateY(-1px);
        }

        /* Underline animation */
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: width 0.3s ease;
        }

        &:hover::after {
          width: 100%;
        }
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
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        &:hover {
          background: var(--primary);
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(205, 44, 78, 0.3);

          &::before {
            left: 100%;
          }
        }

        &:active {
          transform: translateY(0);
        }
      }
    }

    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      header {
        background: rgba(40, 40, 40, 0.95);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      header.scrolled {
        background: rgba(20, 20, 20, 0.95);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .mobile-menu-toggle { display: block; }
      .nav-links { display: none; }

      nav {
        padding: 0.75rem 0;
      }

      header.scrolled nav {
        padding: 0.5rem 0;
      }

      .logo {
        font-size: 1.6rem;
      }

      header.scrolled .logo {
        font-size: 1.4rem;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      header, nav, .logo, .nav-links a, .lang-btn {
        transition: none;
      }
    }
  `]
})
export class LandingHeaderComponent implements OnInit, OnDestroy {
  currentLang = 'ar';
  isScrolled = false;
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

  ngOnInit() {
    this.checkScrollPosition();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50; // Add scrolled class after 50px
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.translationService.setLanguageWithApi(this.currentLang);
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
