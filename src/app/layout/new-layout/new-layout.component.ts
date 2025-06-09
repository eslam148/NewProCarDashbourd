import { Component } from '@angular/core';
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
    </div>
  `,
  styles: [`
    .landing-page {
      font-family: 'Cairo', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    router-outlet {
      flex: 1;
    }
  `]
})
export class NewLayoutComponent {}
