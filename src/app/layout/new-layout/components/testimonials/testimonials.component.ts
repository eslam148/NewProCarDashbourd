import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-landing-testimonials',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section class="testimonials">
      <div class="container">
        <h2 class="section-title animate-fade-in" #animateElement>{{ 'landing.testimonials_title' | translate | async }}</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card animate-slide-up" #animateElement
               *ngFor="let testimonial of testimonialsData; let i = index"
               [style.--delay]="(i * 0.15) + 's'">
            <div class="stars animate-twinkle">
              <span>★★★★★</span>
            </div>
            <p>{{ testimonial.text | translate | async }}</p>
            <div class="testimonial-author">
              <strong>{{ testimonial.author | translate | async }}</strong>
              <span>{{ testimonial.location | translate | async }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials {
      padding: 4rem 0;
      background: var(--secondary);
    }

    .section-title {
      text-align: center;
      font-size: 2.2rem;
      color: var(--primary);
      margin-bottom: 3rem;
      font-weight: 700;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .testimonial-card {
      background: var(--light);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      }

      .stars {
        color: #ffc107;
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-style: italic;
        margin-bottom: 1.5rem;
        color: var(--text);
      }

      .testimonial-author {
        strong {
          display: block;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        span {
          color: var(--text);
          font-size: 0.9rem;
        }
      }
    }

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

    .animate-twinkle {
      animation: none;
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

    .animate-slide-up.in-view .animate-twinkle {
      animation: twinkle 2s ease-in-out infinite 1s;
    }

    /* Original keyframes */
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

    @keyframes twinkle {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.05);
      }
    }
  `]
})
export class LandingTestimonialsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('animateElement') animateElements!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;

  testimonialsData = [
    {
      text: 'landing.testimonial1_text',
      author: 'landing.testimonial1_author',
      location: 'landing.testimonial1_location'
    },
    {
      text: 'landing.testimonial2_text',
      author: 'landing.testimonial2_author',
      location: 'landing.testimonial2_location'
    },
    {
      text: 'landing.testimonial3_text',
      author: 'landing.testimonial3_author',
      location: 'landing.testimonial3_location'
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
