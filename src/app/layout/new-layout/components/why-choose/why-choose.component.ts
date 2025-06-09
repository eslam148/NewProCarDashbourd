import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-landing-why-choose',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section id="why-choose" class="why-choose">
      <div class="container">
        <h2 class="section-title">{{ 'landing.why_choose_title' | translate | async }}</h2>
        <div class="benefits-grid">
          <div class="benefit-card" *ngFor="let benefit of benefitsData">
            <div class="benefit-icon" [innerHTML]="benefit.icon"></div>
            <h3>{{ benefit.title | translate | async }}</h3>
            <p>{{ benefit.description | translate | async }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .why-choose { padding: 4rem 0; background: var(--light); }

    .section-title {
      text-align: center;
      font-size: 2.2rem;
      color: var(--primary);
      margin-bottom: 3rem;
      font-weight: 700;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .benefit-card {
      text-align: center;
      padding: 2rem;
      border-radius: 12px;
      background: var(--light);
      border: 2px solid var(--secondary);
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
        border-color: var(--primary);
      }

      h3 {
        color: var(--primary);
        margin-bottom: 1rem;
        font-size: 1.3rem;
      }

      p { color: var(--text); line-height: 1.6; }
    }

    .benefit-icon { margin-bottom: 1.5rem; }
  `]
})
export class LandingWhyChooseComponent {
  benefitsData = [
    {
      icon: `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#CD2C4E"/>
            </svg>`,
      title: 'landing.benefit1_title',
      description: 'landing.benefit1_desc'
    },
    {
      icon: `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13S14 13.9 14 15S13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z" fill="#CD2C4E"/>
            </svg>`,
      title: 'landing.benefit2_title',
      description: 'landing.benefit2_desc'
    },
    {
      icon: `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="#CD2C4E"/>
            </svg>`,
      title: 'landing.benefit3_title',
      description: 'landing.benefit3_desc'
    },
    {
      icon: `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.99 2C6.47 2 2 6.48 2 12S6.47 22 11.99 22C17.52 22 22 17.52 22 12S17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12S7.58 4 12 4S20 7.58 20 12S16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#CD2C4E"/>
            </svg>`,
      title: 'landing.benefit4_title',
      description: 'landing.benefit4_desc'
    }
  ];
}
