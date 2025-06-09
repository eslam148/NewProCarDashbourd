import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-new-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './new-layout.component.html',
  styleUrls: ['./new-layout.component.scss']
})
export class NewLayoutComponent {
  currentLang: string = 'ar'; // Default to Arabic since the template is in Arabic
  activeFaqIndex: number | null = null;

  switchLanguage(lang: 'en' | 'ar') {
    this.currentLang = lang;
  }

  toggleFaq(index: number) {
    if (this.activeFaqIndex === index) {
      this.activeFaqIndex = null;
    } else {
      this.activeFaqIndex = index;
    }
  }

  isFaqActive(index: number): boolean {
    return this.activeFaqIndex === index;
  }
}
