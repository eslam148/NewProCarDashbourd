import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-landing-features',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title animate-fade-in" #animateElement>{{ 'landing.features_title' | translate | async }}</h2>
        <div class="features-grid">
          <div class="feature-card animate-slide-up" #animateElement
               *ngFor="let feature of featuresData; let i = index"
               [style.--delay]="(i * 0.1) + 's'">
            <div class="feature-icon" [innerHTML]="feature.icon"></div>
            <h3>{{ feature.title | translate | async }}</h3>
            <p>{{ feature.description | translate | async }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .features { padding: 4rem 0; background: var(--light); }

    .section-title {
      text-align: center;
      font-size: 2.2rem;
      color: var(--primary);
      margin-bottom: 3rem;
      font-weight: 700;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      border-radius: 12px;
      background: var(--light);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s;

      &:hover { transform: translateY(-5px); }

      h3 {
        color: var(--primary);
        margin-bottom: 1rem;
        font-size: 1.3rem;
      }

      p { color: var(--text); line-height: 1.6; }
    }

    .feature-icon { margin-bottom: 1.5rem; }

    /* Scroll Animations */
    .animate-fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .animate-slide-up {
      opacity: 0;
      transform: translateY(50px);
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      transition-delay: var(--delay);
    }

    /* Active state when in view */
    .animate-fade-in.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    .animate-slide-up.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    /* Original animations for immediate load */
    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class LandingFeaturesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('animateElement') animateElements!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;

  featuresData = [
    {
      icon: `<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#CD2C4E"/>
            </svg>`,
      title: 'landing.feature1_title',
      description: 'landing.feature1_desc'
    },
    {
      icon: `<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7H16V6C16 4.9 15.1 4 14 4H10C8.9 4 8 4.9 8 5V6H5C3.9 6 3 6.9 3 8V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V8C21 6.9 20.1 6 19 7ZM10 6H14V7H10V6ZM12 18C10.3 18 9 16.7 9 15S10.3 12 12 12S15 13.3 15 15S13.7 18 12 18Z" fill="#CD2C4E"/>
            </svg>`,
      title: 'landing.feature2_title',
      description: 'landing.feature2_desc'
    },
    {
      icon: `<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="#CD2C4E"/>
            </svg>`,
      title: 'landing.feature3_title',
      description: 'landing.feature3_desc'
    },
    {
      icon: `<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H17V12H7V10ZM7 14H14V16H7V14Z" fill="#CD2C4E"/>
            </svg>`,
      title: 'landing.feature4_title',
      description: 'landing.feature4_desc'
    }
  ];

  ngOnInit() {
    // Setup intersection observer for scroll animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
  }

  ngAfterViewInit() {
    // Observe all animate elements
    this.animateElements.forEach(element => {
      this.observer.observe(element.nativeElement);
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
