import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-landing-testimonials',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section class="testimonials">
      <div class="container">
        <h2 class="section-title">{{ 'landing.testimonials_title' | translate | async }}</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card" *ngFor="let testimonial of testimonialsData">
            <div class="stars">
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
  `]
})
export class LandingTestimonialsComponent {
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
}
