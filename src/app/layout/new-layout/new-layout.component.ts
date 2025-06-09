import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LandingHeaderComponent } from './components/header/header.component';
import { LandingHeroComponent } from './components/hero/hero.component';
import { LandingFeaturesComponent } from './components/features/features.component';
import { LandingHowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { LandingWhyChooseComponent } from './components/why-choose/why-choose.component';
import { LandingTestimonialsComponent } from './components/testimonials/testimonials.component';
import { LandingFooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-new-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LandingHeaderComponent,
    LandingHeroComponent,
    LandingFeaturesComponent,
    LandingHowItWorksComponent,
    LandingWhyChooseComponent,
    LandingTestimonialsComponent,
    LandingFooterComponent
  ],
  template: `
    <div class="landing-page">
      <app-landing-header></app-landing-header>
      <app-landing-hero></app-landing-hero>
      <app-landing-features></app-landing-features>
      <app-landing-how-it-works></app-landing-how-it-works>
      <app-landing-why-choose></app-landing-why-choose>
      <app-landing-testimonials></app-landing-testimonials>
      <app-landing-footer></app-landing-footer>

      <!-- محتوى إضافي من الـ router -->
      <router-outlet></router-outlet>

      <!-- Back to Top Button -->
      <button
        class="back-to-top-btn"
        [class.visible]="showBackToTopButton"
        [class.on-footer]="isOnFooter"
        (click)="scrollToTop()"
        aria-label="العودة إلى الأعلى"
        title="العودة إلى الأعلى">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8L6 14L7.41 15.41L12 10.83L16.59 15.41L18 14L12 8Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .landing-page {
      font-family: 'Cairo', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    router-outlet {
      flex: 1;
    }

    /* Back to Top Button Styles */
    .back-to-top-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 56px;
      height: 56px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(205, 44, 78, 0.3);
      transform: translateY(100px);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      z-index: 1000;

      /* Pulse animation */
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        background: var(--primary);
        animation: pulse 2s infinite;
        z-index: -1;
      }

      /* Hover effects */
      &:hover {
        transform: translateY(0) scale(1.1);
        box-shadow: 0 6px 25px rgba(205, 44, 78, 0.4);

        &::before {
          animation-play-state: paused;
        }

        svg {
          animation: bounceUp 0.6s ease;
        }
      }

      /* Focus state for accessibility */
      &:focus {
        outline: 3px solid rgba(205, 44, 78, 0.5);
        outline-offset: 2px;
      }

      /* Active state */
      &:active {
        transform: translateY(0) scale(0.95);
      }

      svg {
        transition: all 0.3s ease;
      }
    }

    /* Footer styling - when button is on footer */
    .back-to-top-btn.on-footer {
      background: rgba(255, 255, 255, 0.95);
      color: var(--primary);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);

      &::before {
        background: rgba(255, 255, 255, 0.95);
        animation: pulseLight 2s infinite;
      }

      &:hover {
        background: white;
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
        transform: translateY(0) scale(1.1);

        &::before {
          animation-play-state: paused;
        }
      }

      &:focus {
        outline: 3px solid rgba(255, 255, 255, 0.8);
        outline-offset: 2px;
      }
    }

    /* Visible state */
    .back-to-top-btn.visible {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    /* Pulse animation keyframes */
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.15);
        opacity: 0.7;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Light pulse for footer */
    @keyframes pulseLight {
      0% {
        transform: scale(1);
        opacity: 0.9;
      }
      50% {
        transform: scale(1.15);
        opacity: 0.6;
      }
      100% {
        transform: scale(1);
        opacity: 0.9;
      }
    }

    /* Bounce up animation for arrow */
    @keyframes bounceUp {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-4px);
      }
      60% {
        transform: translateY(-2px);
      }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .back-to-top-btn {
        bottom: 1.5rem;
        right: 1.5rem;
        width: 48px;
        height: 48px;
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .back-to-top-btn {
        box-shadow: 0 4px 20px rgba(205, 44, 78, 0.4);

        &:hover {
          box-shadow: 0 6px 25px rgba(205, 44, 78, 0.5);
        }

        &.on-footer {
          background: rgba(40, 40, 40, 0.95);
          color: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.2);

          &:hover {
            background: rgba(60, 60, 60, 0.95);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
          }
        }
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .back-to-top-btn {
        transition: opacity 0.3s ease, visibility 0.3s ease;

        &::before {
          animation: none;
        }

        &:hover svg {
          animation: none;
        }
      }

      @keyframes pulse, pulseLight {
        /* Remove pulse animation for users who prefer reduced motion */
      }
    }
  `]
})
export class NewLayoutComponent implements OnInit, OnDestroy {
  showBackToTopButton = false;
  isOnFooter = false;

  ngOnInit() {
    // Initial check for scroll position
    this.checkScrollPosition();
  }

  ngOnDestroy() {
    // Component cleanup is handled automatically for HostListener
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    // Show button after scrolling down 300px
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showBackToTopButton = scrollPosition > 300;

    // Check if user is near footer
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const footerThreshold = documentHeight - windowHeight - 200; // 200px before footer

    this.isOnFooter = scrollPosition > footerThreshold;
  }

  scrollToTop(): void {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
