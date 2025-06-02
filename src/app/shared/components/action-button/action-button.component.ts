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
}
