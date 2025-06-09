import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section animate-slide-up" #animateElement [style.--delay]="'0s'">
            <h3 class="footer-title">proCare</h3>
            <p>{{ 'landing.footer_description' | translate | async }}</p>
            <div class="social-links">
              <a href="#" aria-label="Facebook" class="social-link">📘</a>
              <a href="#" aria-label="Twitter" class="social-link">🐦</a>
              <a href="#" aria-label="Instagram" class="social-link">📷</a>
              <a href="#" aria-label="LinkedIn" class="social-link">💼</a>
            </div>
          </div>

          <div class="footer-section animate-slide-up" #animateElement [style.--delay]="'0.1s'">
            <h4>{{ 'landing.footer_quick_links' | translate | async }}</h4>
            <ul>
              <li><a href="#features">{{ 'landing.features' | translate | async }}</a></li>
              <li><a href="#how-it-works">{{ 'landing.how_it_works' | translate | async }}</a></li>
              <li><a href="#why-choose">{{ 'landing.why_choose' | translate | async }}</a></li>
              <li><a href="#faq">{{ 'landing.faq' | translate | async }}</a></li>
            </ul>
          </div>

          <div class="footer-section animate-slide-up" #animateElement [style.--delay]="'0.2s'">
            <h4>{{ 'landing.footer_contact' | translate | async }}</h4>
            <ul>
              <li>📞 {{ 'landing.footer_phone' | translate | async }}</li>
              <li>✉️ {{ 'landing.footer_email' | translate | async }}</li>
              <li>📍 {{ 'landing.footer_address' | translate | async }}</li>
            </ul>
          </div>

          <div class="footer-section animate-slide-up" #animateElement [style.--delay]="'0.3s'">
            <h4>{{ 'landing.footer_download' | translate | async }}</h4>
            <div class="app-buttons">
              <a href="#" class="app-button">
                <img src="assets/images/app-store.svg" alt="App Store">
              </a>
              <a href="#" class="app-button">
                <img src="assets/images/google-play.svg" alt="Google Play">
              </a>
            </div>
          </div>
        </div>

        <div class="footer-bottom animate-fade-in" #animateElement [style.--delay]="'0.4s'">
          <p>&copy; 2024 proCare. {{ 'landing.footer_rights' | translate | async }}</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--primary);
      color: white;
      padding: 3rem 0 1rem;
      margin-top: 4rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section {
      h3, h4 {
        color: white;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }

      p {
        line-height: 1.6;
        margin-bottom: 1rem;
        opacity: 0.9;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          margin-bottom: 0.5rem;

          a {
            color: white;
            text-decoration: none;
            opacity: 0.9;
            transition: opacity 0.3s;

            &:hover { opacity: 1; }
          }
        }
      }
    }

    .social-links {
      display: flex;
      gap: 1rem;

      .social-link {
        font-size: 1.5rem;
        text-decoration: none;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.2) rotate(10deg);
        }
      }
    }

    .app-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .app-button {
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-2px);
        }
      }

      img {
        height: 40px;
        width: auto;
      }
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);

      p {
        opacity: 0.8;
        font-size: 0.9rem;
      }
    }

    /* Scroll Animations */
    .animate-slide-up {
      opacity: 0;
      transform: translateY(40px);
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      transition-delay: var(--delay);
    }

    .animate-fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      transition-delay: var(--delay);
    }

    /* Active state when in view */
    .animate-slide-up.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    .animate-fade-in.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    /* Original keyframes */
    @keyframes slideUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .app-buttons {
        align-items: center;
      }
    }
  `]
})
export class LandingFooterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('animateElement') animateElements!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;

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
