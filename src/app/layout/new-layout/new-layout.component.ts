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
      <router-outlet></router-outlet>
      <app-landing-footer></app-landing-footer>

      <!-- محتوى إضافي من الـ router -->

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

      <!-- Contact Button -->
      <div class="contact-fab" [class.expanded]="isContactExpanded">
        <button
          class="contact-main-btn"
          (click)="toggleContact()"
          aria-label="تواصل معنا"
          title="تواصل معنا">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
          </svg>
        </button>

        <!-- Contact Options -->
        <div class="contact-options">
          <a href="https://wa.me/+201234567890"
             class="contact-option whatsapp"
             target="_blank"
             aria-label="واتساب"
             title="واتساب">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382C17.367 14.382 17.139 14.382 16.78 14.382C16.421 14.382 16.155 14.516 15.982 14.784C15.809 15.052 15.809 15.186 15.982 15.186C16.155 15.186 16.421 15.052 16.78 14.784C17.139 14.516 17.367 14.382 17.472 14.382ZM12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.99 3.06 16.26L2 22L7.74 20.94C9.01 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM19.5 12C19.5 16.14 16.14 19.5 12 19.5C10.76 19.5 9.57 19.2 8.5 18.65L4.5 19.5L5.35 15.5C4.8 14.43 4.5 13.24 4.5 12C4.5 7.86 7.86 4.5 12 4.5C16.14 4.5 19.5 7.86 19.5 12Z" fill="currentColor"/>
            </svg>
          </a>

          <a href="mailto:info@procare.com"
             class="contact-option email"
             aria-label="إيميل"
             title="إيميل">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
            </svg>
          </a>

          <a href="tel:+201234567890"
             class="contact-option phone"
             aria-label="تليفون"
             title="تليفون">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .landing-page {
      font-family: 'Cairo', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      padding-top: 80px; /* Space for fixed header */
    }

    router-outlet {
      flex: 1;
    }

    /* Adjust padding for mobile */
    @media (max-width: 768px) {
      .landing-page {
        padding-top: 70px; /* Smaller space for mobile */
      }
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

    /* Contact FAB Styles */
    .contact-fab {
      position: fixed;
      bottom: 2rem;
      left: 2rem;
      z-index: 1000;
    }

    .contact-main-btn {
      width: 56px;
      height: 56px;
      background: #25D366; /* WhatsApp green */
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      position: relative;

      /* Pulse animation */
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        background: #25D366;
        animation: pulse 2s infinite;
        z-index: -1;
      }

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px rgba(37, 211, 102, 0.4);

        &::before {
          animation-play-state: paused;
        }
      }

      &:focus {
        outline: 3px solid rgba(37, 211, 102, 0.5);
        outline-offset: 2px;
      }

      svg {
        transition: transform 0.3s ease;
      }
    }

    .contact-fab.expanded .contact-main-btn {
      transform: rotate(45deg);
      background: #128C7E; /* Darker green when expanded */
    }

    .contact-options {
      position: absolute;
      bottom: 70px;
      left: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .contact-fab.expanded .contact-options {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .contact-option {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transform: scale(0);
      animation: popIn 0.3s ease forwards;
    }

    .contact-fab.expanded .contact-option:nth-child(1) {
      animation-delay: 0.1s;
    }

    .contact-fab.expanded .contact-option:nth-child(2) {
      animation-delay: 0.2s;
    }

    .contact-fab.expanded .contact-option:nth-child(3) {
      animation-delay: 0.3s;
    }

    .contact-option.whatsapp {
      background: #25D366;

      &:hover {
        background: #128C7E;
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
      }
    }

    .contact-option.email {
      background: #EA4335; /* Gmail red */

      &:hover {
        background: #D33B2C;
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(234, 67, 53, 0.4);
      }
    }

    .contact-option.phone {
      background: #1976D2; /* Material blue */

      &:hover {
        background: #1565C0;
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
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

    /* Pop in animation for contact options */
    @keyframes popIn {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
        opacity: 1;
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

      .contact-fab {
        bottom: 1.5rem;
        left: 1.5rem;
      }

      .contact-main-btn {
        width: 48px;
        height: 48px;
      }

      .contact-option {
        width: 44px;
        height: 44px;
      }

      .contact-options {
        bottom: 60px;
      }
    }

    /* Small mobile adjustments */
    @media (max-width: 480px) {
      .contact-fab {
        bottom: 1rem;
        left: 1rem;
      }

      .back-to-top-btn {
        bottom: 1rem;
        right: 1rem;
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

      @keyframes pulse {
        /* Remove pulse animation for users who prefer reduced motion */
      }

      @keyframes pulseLight {
        /* Remove pulse animation for users who prefer reduced motion */
      }
    }
  `]
})
export class NewLayoutComponent implements OnInit, OnDestroy {
  showBackToTopButton = false;
  isOnFooter = false;
  isContactExpanded = false;

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

  toggleContact(): void {
    this.isContactExpanded = !this.isContactExpanded;

    // Auto-close after 5 seconds if expanded
    if (this.isContactExpanded) {
      setTimeout(() => {
        this.isContactExpanded = false;
      }, 5000);
    }
  }
}
