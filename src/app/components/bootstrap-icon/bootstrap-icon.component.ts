import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bootstrap-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <i 
      [class]="getIconClass()" 
      [style.font-size]="size"
      [style.color]="color"
      [attr.aria-label]="ariaLabel"
      [attr.title]="title">
    </i>
  `,
  styles: [`
    i {
      display: inline-block;
      line-height: 1;
      vertical-align: middle;
      transition: all 0.3s ease;
    }
    
    .icon-hover:hover {
      transform: scale(1.1);
    }
    
    .icon-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class BootstrapIconComponent {
  @Input() name: string = '';
  @Input() size: string = '1rem';
  @Input() color: string = '';
  @Input() hover: boolean = false;
  @Input() spin: boolean = false;
  @Input() ariaLabel: string = '';
  @Input() title: string = '';

  getIconClass(): string {
    let classes = ['bi'];
    
    if (this.name) {
      // Ensure the icon name starts with 'bi-'
      const iconName = this.name.startsWith('bi-') ? this.name : `bi-${this.name}`;
      classes.push(iconName);
    }
    
    if (this.hover) {
      classes.push('icon-hover');
    }
    
    if (this.spin) {
      classes.push('icon-spin');
    }
    
    return classes.join(' ');
  }
}

// Common Bootstrap Icons used in the application
export const BOOTSTRAP_ICONS = {
  // Navigation
  house: 'bi-house',
  houseFill: 'bi-house-fill',
  grid: 'bi-grid',
  list: 'bi-list',
  menu: 'bi-list',
  
  // Actions
  plus: 'bi-plus',
  plusCircle: 'bi-plus-circle',
  plusCircleFill: 'bi-plus-circle-fill',
  pencil: 'bi-pencil',
  pencilSquare: 'bi-pencil-square',
  trash: 'bi-trash',
  trashFill: 'bi-trash-fill',
  search: 'bi-search',
  filter: 'bi-filter',
  
  // Status
  check: 'bi-check',
  checkCircle: 'bi-check-circle',
  checkCircleFill: 'bi-check-circle-fill',
  x: 'bi-x',
  xCircle: 'bi-x-circle',
  xCircleFill: 'bi-x-circle-fill',
  exclamationTriangle: 'bi-exclamation-triangle',
  exclamationTriangleFill: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle',
  infoFill: 'bi-info-circle-fill',
  
  // Theme
  sun: 'bi-sun',
  sunFill: 'bi-sun-fill',
  moon: 'bi-moon',
  moonFill: 'bi-moon-fill',
  circleHalf: 'bi-circle-half',
  
  // User
  person: 'bi-person',
  personFill: 'bi-person-fill',
  people: 'bi-people',
  peopleFill: 'bi-people-fill',
  personPlus: 'bi-person-plus',
  personPlusFill: 'bi-person-plus-fill',
  
  // Medical
  heart: 'bi-heart',
  heartFill: 'bi-heart-fill',
  heartPulse: 'bi-heart-pulse',
  hospital: 'bi-hospital',
  hospitalFill: 'bi-hospital-fill',
  
  // Location
  geoAlt: 'bi-geo-alt',
  geoAltFill: 'bi-geo-alt-fill',
  map: 'bi-map',
  mapFill: 'bi-map-fill',
  
  // Communication
  telephone: 'bi-telephone',
  telephoneFill: 'bi-telephone-fill',
  envelope: 'bi-envelope',
  envelopeFill: 'bi-envelope-fill',
  chat: 'bi-chat',
  chatFill: 'bi-chat-fill',
  
  // Files
  file: 'bi-file',
  fileFill: 'bi-file-fill',
  fileText: 'bi-file-text',
  fileTextFill: 'bi-file-text-fill',
  download: 'bi-download',
  upload: 'bi-upload',
  
  // Navigation arrows
  arrowLeft: 'bi-arrow-left',
  arrowRight: 'bi-arrow-right',
  arrowUp: 'bi-arrow-up',
  arrowDown: 'bi-arrow-down',
  chevronLeft: 'bi-chevron-left',
  chevronRight: 'bi-chevron-right',
  chevronUp: 'bi-chevron-up',
  chevronDown: 'bi-chevron-down',
  
  // Settings
  gear: 'bi-gear',
  gearFill: 'bi-gear-fill',
  sliders: 'bi-sliders',
  toggleOn: 'bi-toggle-on',
  toggleOff: 'bi-toggle-off',
  
  // Time
  clock: 'bi-clock',
  clockFill: 'bi-clock-fill',
  calendar: 'bi-calendar',
  calendarFill: 'bi-calendar-fill',
  calendarEvent: 'bi-calendar-event',
  calendarEventFill: 'bi-calendar-event-fill',
  
  // Misc
  star: 'bi-star',
  starFill: 'bi-star-fill',
  eye: 'bi-eye',
  eyeFill: 'bi-eye-fill',
  eyeSlash: 'bi-eye-slash',
  eyeSlashFill: 'bi-eye-slash-fill',
  bell: 'bi-bell',
  bellFill: 'bi-bell-fill',
  shield: 'bi-shield',
  shieldFill: 'bi-shield-fill',
  shieldCheck: 'bi-shield-check',
  shieldCheckFill: 'bi-shield-check-fill'
} as const;
