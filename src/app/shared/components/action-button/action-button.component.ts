import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective, TooltipModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { TranslatePipe } from '../../../pipes/translate.pipe';

/**
 * ActionButtonComponent - Unified button component for consistent styling across the application
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
  @Input() shape: 'rounded-pill' | 'rounded' | '' = '';
  @Input() size: 'sm' | 'lg' | '' = '';
  @Input() variant: 'ghost' | 'outline' | '' = '';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() block: boolean = false;
  @Input() iconOnly: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
