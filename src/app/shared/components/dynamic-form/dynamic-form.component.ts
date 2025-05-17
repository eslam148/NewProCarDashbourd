import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { ButtonModule, CardModule, FormModule, ModalModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

export interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'date' | 'file';
  defaultValue?: any;
  required?: boolean;
  validators?: ValidatorFn[];
  options?: { label: string; value: any }[];
  disabled?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  rows?: number;
  cols?: number;
  multiple?: boolean;
  accept?: string;
  classes?: string;
}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    CardModule,
    ButtonModule,
    ModalModule,
    FormModule,
    IconModule
  ]
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() fields: FormFieldConfig[] = [];
  @Input() initialValues: any = {};
  @Input() title: string = '';
  @Input() submitText: string = 'common.save';
  @Input() cancelText: string = 'common.cancel';
  @Input() isModal: boolean = true;
  @Input() loading: boolean = false;
  @Input() showButtons: boolean = true;
  @Input() formLayout: 'horizontal' | 'vertical' = 'horizontal';

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] || changes['initialValues']) {
      this.buildForm();
    }
  }

  buildForm(): void {
    const formConfig: { [key: string]: FormControl } = {};

    this.fields.forEach(field => {
      // Get initial value - use initialValues, or defaultValue, or appropriate empty value
      let initialValue = this.initialValues && this.initialValues[field.key] !== undefined ?
        this.initialValues[field.key] :
        field.defaultValue !== undefined ? field.defaultValue : this.getEmptyValue(field.type);

      // Build validators
      const validators: ValidatorFn[] = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.minLength !== undefined) {
        validators.push(Validators.minLength(field.minLength));
      }

      if (field.maxLength !== undefined) {
        validators.push(Validators.maxLength(field.maxLength));
      }

      if (field.min !== undefined) {
        validators.push(Validators.min(field.min));
      }

      if (field.max !== undefined) {
        validators.push(Validators.max(field.max));
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      // Add custom validators if provided
      if (field.validators && field.validators.length) {
        validators.push(...field.validators);
      }

      formConfig[field.key] = new FormControl(
        { value: initialValue, disabled: field.disabled },
        validators
      );
    });

    this.form = this.fb.group(formConfig);
  }

  getEmptyValue(type: string): any {
    switch (type) {
      case 'number':
        return null;
      case 'checkbox':
        return false;
      case 'select':
        return '';
      case 'file':
        return null;
      default:
        return '';
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.getRawValue());
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return 'validation.required';
      } else if (control.errors['email']) {
        return 'validation.email';
      } else if (control.errors['minlength']) {
        return 'validation.minlength';
      } else if (control.errors['maxlength']) {
        return 'validation.maxlength';
      } else if (control.errors['min']) {
        return 'validation.min';
      } else if (control.errors['max']) {
        return 'validation.max';
      } else {
        return 'validation.invalid';
      }
    }
    return '';
  }
}
