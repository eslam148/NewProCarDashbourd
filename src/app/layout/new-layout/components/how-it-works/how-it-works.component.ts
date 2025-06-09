import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-landing-how-it-works',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section id="how-it-works" class="how-it-works">
      <div class="container">
        <h2 class="section-title animate-fade-in" #animateElement>{{ 'landing.how_it_works_title' | translate | async }}</h2>
        <div class="steps-container">
          <div class="step animate-scale-in" #animateElement
               *ngFor="let step of stepsData; let i = index"
               [style.--delay]="(i * 0.2) + 's'">
            <div class="step-number animate-bounce">{{ i + 1 }}</div>
            <div class="step-icon" [innerHTML]="step.icon"></div>
            <h3>{{ step.title | translate | async }}</h3>
            <p>{{ step.description | translate | async }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .how-it-works { padding: 4rem 0; background: var(--secondary); }

    .section-title {
      text-align: center;
      font-size: 2.2rem;
      color: var(--primary);
      margin-bottom: 3rem;
      font-weight: 700;
    }

    .steps-container {
      display: flex;
      justify-content: space-between;
      gap: 2rem;
    }

    .step {
      flex: 1;
      text-align: center;

      h3 { color: var(--primary); margin-bottom: 1rem; font-size: 1.3rem; }
      p { color: var(--text); line-height: 1.6; }
    }

    .step-number {
      width: 60px;
      height: 60px;
      background: var(--primary);
      color: var(--light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 auto 1rem;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    .step-icon { margin-bottom: 1.5rem; }

    /* Scroll Animations */
    .animate-fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .animate-scale-in {
      opacity: 0;
      transform: scale(0.7) translateY(30px);
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      transition-delay: var(--delay);
    }

    .animate-bounce {
      animation: none;
    }

    /* Active state when in view */
    .animate-fade-in.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    .animate-scale-in.in-view {
      opacity: 1;
      transform: scale(1) translateY(0);
    }

    .animate-scale-in.in-view .animate-bounce {
      animation: bounce 2s ease infinite 1s;
    }

    /* Original keyframes */
    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }

    @keyframes scaleIn {
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0,0,0);
      }
      40%, 43% {
        transform: translate3d(0, -5px, 0);
      }
      70% {
        transform: translate3d(0, -3px, 0);
      }
      90% {
        transform: translate3d(0, -1px, 0);
      }
    }

    @media (max-width: 768px) {
      .steps-container { flex-direction: column; }
    }
  `]
})
export class LandingHowItWorksComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('animateElement') animateElements!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;

  stepsData = [
    {
      icon: `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="#CD2C4E"/>
            </svg>`,
      title: 'landing.step1_title',
      description: 'landing.step1_desc'
    },
    {
      icon: `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" fill="#CD2C4E"/>
            </svg>`,
      title: 'landing.step2_title',
      description: 'landing.step2_desc'
    },
    {
      icon: `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#CD2C4E"/>
            </svg>`,
      title: 'landing.step3_title',
      description: 'landing.step3_desc'
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
