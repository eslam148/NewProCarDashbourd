import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section class="hero" [class.loaded]="isLoaded">
      <div class="container">
        <div class="hero-content">
          <h1 class="animate-fadeInUp" #animateElement>{{ 'landing.hero_title' | translate | async }}</h1>
          <p class="animate-fadeInUp delay-1" #animateElement>{{ 'landing.hero_subtitle' | translate | async }}</p>
          <div class="app-buttons animate-fadeInUp delay-2" #animateElement>
            <a href="#" class="app-button">
              <img src="assets/images/app-store.svg" alt="App Store">
            </a>
            <a href="#" class="app-button">
              <img src="assets/images/google-play.svg" alt="Google Play">
            </a>
          </div>
        </div>
        <div class="hero-image animate-fadeInRight" #animateElement>
          <img src="assets/images/hero-image.svg" alt="proCare Healthcare App">
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      padding: 4rem 0;
      background: var(--secondary);
      .container { display: flex; align-items: center; }
      h1 { font-size: 2.5rem; color: var(--primary); margin-bottom: 1rem; }
      p { font-size: 1.2rem; margin-bottom: 2rem; }
    }

    .hero-content, .hero-image { flex: 1; }
    .hero-image { text-align: center; img { max-width: 100%; } }

    .app-buttons {
      display: flex;
      gap: 1rem;
      img { height: 40px; }
    }

    .app-button {
      transition: transform 0.3s ease;
      &:hover {
        transform: translateY(-2px);
      }
    }

    /* Scroll Animations */
    .animate-fadeInUp {
      opacity: 0;
      transform: translateY(50px);
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .animate-fadeInRight {
      opacity: 0;
      transform: translateX(50px);
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .delay-1 { transition-delay: 0.2s; }
    .delay-2 { transition-delay: 0.4s; }

    /* Active state when in view */
    .animate-fadeInUp.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    .animate-fadeInRight.in-view {
      opacity: 1;
      transform: translateX(0);
    }

    /* Initial load animation */
    .hero.loaded {
      .animate-fadeInUp,
      .animate-fadeInRight {
        opacity: 1;
        transform: translateY(0) translateX(0);
      }
    }

    @media (max-width: 768px) {
      .hero .container { flex-direction: column; text-align: center; }
      .hero h1 { font-size: 2rem; }
      .hero p { font-size: 1rem; }
    }
  `]
})
export class LandingHeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('animateElement') animateElements!: QueryList<ElementRef>;

  isLoaded = false;
  private observer!: IntersectionObserver;

  ngOnInit() {
    // Initial load animation
    setTimeout(() => {
      this.isLoaded = true;
    }, 100);

    // Setup intersection observer for scroll animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
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
