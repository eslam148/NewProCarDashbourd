import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>{{ 'landing.hero_title' | translate | async }}</h1>
          <p>{{ 'landing.hero_subtitle' | translate | async }}</p>
          <div class="app-buttons">
            <a href="#" class="app-button">
              <img src="assets/images/app-store.svg" alt="App Store">
            </a>
            <a href="#" class="app-button">
              <img src="assets/images/google-play.svg" alt="Google Play">
            </a>
          </div>
        </div>
        <div class="hero-image">
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

    @media (max-width: 768px) {
      .hero .container { flex-direction: column; text-align: center; }
      .hero h1 { font-size: 2rem; }
      .hero p { font-size: 1rem; }
    }
  `]
})
export class LandingHeroComponent {}
