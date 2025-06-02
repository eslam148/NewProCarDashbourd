import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  
  // Signal for current theme mode
  public currentTheme = signal<ThemeMode>('light');
  
  // Signal for actual applied theme (resolved from auto)
  public appliedTheme = signal<'light' | 'dark'>('light');

  private readonly STORAGE_KEY = 'procare-theme-mode';

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
      this.setupThemeEffect();
      this.setupSystemThemeListener();
    }
  }

  private initializeTheme(): void {
    // Get saved theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as ThemeMode;
    const initialTheme = savedTheme || 'light';
    
    this.currentTheme.set(initialTheme);
    this.updateAppliedTheme(initialTheme);
  }

  private setupThemeEffect(): void {
    effect(() => {
      const theme = this.currentTheme();
      this.updateAppliedTheme(theme);
      
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, theme);
      }
    });
  }

  private setupSystemThemeListener(): void {
    if (isPlatformBrowser(this.platformId)) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', () => {
        if (this.currentTheme() === 'auto') {
          this.updateAppliedTheme('auto');
        }
      });
    }
  }

  private updateAppliedTheme(mode: ThemeMode): void {
    let resolvedTheme: 'light' | 'dark' = 'light';

    if (mode === 'auto') {
      if (isPlatformBrowser(this.platformId)) {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } else {
      resolvedTheme = mode;
    }

    this.appliedTheme.set(resolvedTheme);
    this.applyThemeToDocument(resolvedTheme);
  }

  private applyThemeToDocument(theme: 'light' | 'dark'): void {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      
      // Remove existing theme classes
      htmlElement.classList.remove('light-theme', 'dark-theme');
      htmlElement.removeAttribute('data-coreui-theme');
      
      // Add new theme class
      htmlElement.classList.add(`${theme}-theme`);
      htmlElement.setAttribute('data-coreui-theme', theme);
      
      // Update CSS custom properties
      this.updateCSSVariables(theme);
    }
  }

  private updateCSSVariables(theme: 'light' | 'dark'): void {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      
      if (theme === 'dark') {
        // Dark theme colors
        root.style.setProperty('--cui-body-bg', '#1a1d23');
        root.style.setProperty('--cui-body-color', '#ffffff');
        root.style.setProperty('--cui-border-color', '#2d3748');
        root.style.setProperty('--cui-card-bg', '#2d3748');
        root.style.setProperty('--cui-sidebar-bg', '#1a1d23');
        root.style.setProperty('--cui-header-bg', '#2d3748');
        root.style.setProperty('--cui-input-bg', '#374151');
        root.style.setProperty('--cui-input-border', '#4a5568');
        root.style.setProperty('--cui-text-muted', '#a0aec0');
        root.style.setProperty('--cui-link-color', '#63b3ed');
        root.style.setProperty('--cui-link-hover-color', '#90cdf4');
      } else {
        // Light theme colors
        root.style.setProperty('--cui-body-bg', '#ffffff');
        root.style.setProperty('--cui-body-color', '#000000');
        root.style.setProperty('--cui-border-color', '#e2e8f0');
        root.style.setProperty('--cui-card-bg', '#ffffff');
        root.style.setProperty('--cui-sidebar-bg', '#ffffff');
        root.style.setProperty('--cui-header-bg', '#ffffff');
        root.style.setProperty('--cui-input-bg', '#ffffff');
        root.style.setProperty('--cui-input-border', '#e2e8f0');
        root.style.setProperty('--cui-text-muted', '#6b7280');
        root.style.setProperty('--cui-link-color', '#CD2C4E');
        root.style.setProperty('--cui-link-hover-color', '#a02240');
      }
    }
  }

  // Public methods
  public setTheme(mode: ThemeMode): void {
    this.currentTheme.set(mode);
  }

  public toggleTheme(): void {
    const current = this.currentTheme();
    if (current === 'light') {
      this.setTheme('dark');
    } else if (current === 'dark') {
      this.setTheme('auto');
    } else {
      this.setTheme('light');
    }
  }

  public getThemeIcon(): string {
    const applied = this.appliedTheme();
    return applied === 'dark' ? 'bi-moon-fill' : 'bi-sun-fill';
  }

  public getThemeLabel(): string {
    const current = this.currentTheme();
    switch (current) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      case 'auto': return 'Auto Mode';
      default: return 'Light Mode';
    }
  }
}
