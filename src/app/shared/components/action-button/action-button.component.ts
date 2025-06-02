import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective, TooltipModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { TranslatePipe } from '../../../pipes/translate.pipe';

/**
 * ActionButtonComponent - Unified button component for consistent styling across the application
 *
 * Standardized Color Scheme:
 * - primary: Main actions (Add, Save, Update, Submit)
 * - secondary: Secondary actions (Cancel, Close)
 * - success: Positive confirmations (Confirm, Approve)
 * - danger: Destructive actions (Delete, Remove)
 * - warning: Caution actions (Warning, Alert)
 * - info: Informational actions (View, Details)
 * - light: Neutral actions (Reset, Clear)
 * - dark: Alternative primary actions
 *
 * Usage example:
 * <app-action-button
 *   text="common.edit"
 *   icon="cilPencil"
 *   color="primary"
 *   (clicked)="onEdit(item)"
 * ></app-action-button>
 */
@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonDirective,
    IconModule,
    TooltipModule,
    TranslatePipe
  ]
})
export class ActionButtonComponent {
  @Input() text: string = '';
  @Input() color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'primary';
  @Input() icon: string = '';
  @Input() tooltip: string = '';
  @Input() shape: 'rounded-pill' | 'rounded' | '' = 'rounded-pill'; // Default to pill shape for consistency
  @Input() size: 'sm' | 'lg' | '' = '';
  @Input() variant: 'ghost' | 'outline' | '' = '';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() block: boolean = false;
  @Input() iconOnly: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<void>();

  /**
   * Get standardized color based on action type
   * This method can be used to automatically assign colors based on common action patterns
   */
  getStandardizedColor(actionType: 'add' | 'edit' | 'delete' | 'save' | 'cancel' | 'view' | 'confirm'): string {
    const colorMap = {
      'add': 'primary',
      'edit': 'primary',
      'save': 'primary',
      'delete': 'danger',
      'cancel': 'secondary',
      'view': 'info',
      'confirm': 'success'
    };
    return colorMap[actionType] || 'primary';
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }

  /**
   * Maps CoreUI icon names to Bootstrap Icons
   */
  getBootstrapIconClass(): string {
    const iconMap: { [key: string]: string } = {
      // Common actions
      'cilPlus': 'bi bi-plus-circle-fill',
      'cilPencil': 'bi bi-pencil-fill',
      'cilTrash': 'bi bi-trash-fill',
      'cilX': 'bi bi-x-circle',
      'cilCheck': 'bi bi-check-circle-fill',
      'cilCheckAlt': 'bi bi-check-circle-fill',
      'cilSave': 'bi bi-floppy-fill',
      'cilReload': 'bi bi-arrow-clockwise',

      // Navigation
      'cilHome': 'bi bi-house-fill',
      'cilList': 'bi bi-list-ul',
      'cilMenu': 'bi bi-list',
      'cilSearch': 'bi bi-search',
      'cilMagnifyingGlass': 'bi bi-search',
      'cilFilter': 'bi bi-funnel-fill',

      // Status and alerts
      'cilWarning': 'bi bi-exclamation-triangle-fill',
      'cilBan': 'bi bi-exclamation-triangle-fill',
      'cilInfo': 'bi bi-info-circle-fill',
      'cilBell': 'bi bi-bell-fill',

      // User and people
      'cilUser': 'bi bi-person-fill',
      'cilPeople': 'bi bi-people-fill',
      'cilUserFollow': 'bi bi-person-plus-fill',
      'cilUserPlus': 'bi bi-person-plus',

      // Medical
      'cilMedicalCross': 'bi bi-heart-pulse',
      'cilHeart': 'bi bi-heart-fill',
      'cilHeartPulse': 'bi bi-heart-pulse',

      // Location
      'cilLocationPin': 'bi bi-geo-alt-fill',
      'cilMap': 'bi bi-map-fill',

      // Communication
      'cilPhone': 'bi bi-telephone-fill',
      'cilEnvelope': 'bi bi-envelope-fill',
      'cilChat': 'bi bi-chat-fill',

      // Files and data
      'cilFolder': 'bi bi-folder-fill',
      'cilLayers': 'bi bi-layers-fill',
      'cilCloudUpload': 'bi bi-cloud-upload-fill',
      'cilDescription': 'bi bi-file-text-fill',
      'cilNotes': 'bi bi-journal-text',

      // Time and calendar
      'cilCalendar': 'bi bi-calendar-fill',
      'cilClock': 'bi bi-clock-fill',
      'cilTask': 'bi bi-check2-square',

      // Settings and tools
      'cilSettings': 'bi bi-gear-fill',
      'cilOptions': 'bi bi-three-dots',
      'cilSpeedometer': 'bi bi-speedometer2',

      // Arrows and navigation
      'cilChevronLeft': 'bi bi-chevron-left',
      'cilChevronRight': 'bi bi-chevron-right',
      'cilChevronTop': 'bi bi-chevron-up',
      'cilChevronBottom': 'bi bi-chevron-down',

      // Misc
      'cilStar': 'bi bi-star-fill',
      'cilEye': 'bi bi-eye-fill',
      'cilEyeSlash': 'bi bi-eye-slash-fill',
      'cilShield': 'bi bi-shield-fill',
      'cilLockLocked': 'bi bi-lock-fill',
      'cilLockUnlocked': 'bi bi-unlock-fill'
    };

    return iconMap[this.icon] || `bi bi-${this.icon}`;
  }
}
