import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  template: `
    <app-action-button
      color="secondary"
      [icon]="getThemeIcon()"
      [text]="getThemeText()"
      variant="ghost"
      (clicked)="toggleTheme()"
      [tooltip]="themeService.getThemeLabel()"
    ></app-action-button>
  `,
  styles: [`
    .theme-toggle-btn {
      display: flex;
      align-items: center;
      border: 1px solid var(--cui-border-color);
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      background: var(--cui-body-bg);
      color: var(--cui-body-color);
      transition: all 0.3s ease;
      font-size: 0.875rem;
      font-weight: 500;

      &:hover {
        background: var(--cui-tertiary-bg);
        border-color: var(--cui-primary);
        color: var(--cui-primary);
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(var(--cui-primary-rgb), 0.25);
      }

      i {
        font-size: 1rem;
        transition: transform 0.3s ease;
      }

      &:hover i {
        transform: scale(1.1);
      }
    }

    .theme-label {
      white-space: nowrap;
    }

    // Dark theme specific styles
    :host-context(.dark-theme) .theme-toggle-btn {
      border-color: #4a5568;

      &:hover {
        background: #374151;
        border-color: var(--cui-primary);
      }
    }

    // Responsive adjustments
    @media (max-width: 768px) {
      .theme-toggle-btn {
        padding: 0.4rem;

        .theme-label {
          display: none !important;
        }
      }
    }
  `]
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getThemeIcon(): string {
    const current = this.themeService.currentTheme();
    const applied = this.themeService.appliedTheme();

    if (current === 'auto') {
      return 'cilContrast';
    }

    return applied === 'dark' ? 'cilMoon' : 'cilSun';
  }

  getThemeText(): string {
    const current = this.themeService.currentTheme();
    switch (current) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'auto': return 'Auto';
      default: return 'Light';
    }
  }
}
