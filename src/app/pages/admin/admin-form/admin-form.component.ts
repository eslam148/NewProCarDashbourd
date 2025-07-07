import { Component, EventEmitter, Input, OnInit, Output, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AdminsDto } from '../../../Models/DTOs/AdminsDto';
import { RegisterDto } from '../../../Models/DTOs/RegisterDto';
import { UpdateAdminDto } from '../../../Models/DTOs/UpdateAdminDto';
import { ActionButtonComponent } from '../../../shared/components/action-button/action-button.component';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { BootstrapIconComponent } from '../../../components/bootstrap-icon/bootstrap-icon.component';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ActionButtonComponent, TranslatePipe, BootstrapIconComponent]
})
export class AdminFormComponent implements OnInit {
  @Input() admin: AdminsDto | null = null;
  @Output() submit = new EventEmitter<RegisterDto | UpdateAdminDto>();
  @Output() cancel = new EventEmitter<void>();

  adminForm: FormGroup;
  isEditMode = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder) {
    this.adminForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator()
      ]],
      confirmPassword: ['', this.isEditMode ? [] : [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordStrengthValidator(): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const errors: ValidationErrors = {};

      if (!hasUpperCase) {
        errors['noUpperCase'] = true;
      }
      if (!hasLowerCase) {
        errors['noLowerCase'] = true;
      }
      if (!hasSpecialChar) {
        errors['noSpecialChar'] = true;
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  ngOnInit() {
    if (this.admin) {
      this.isEditMode = true;
      this.adminForm.patchValue({
        firstName: this.admin.firstName,
        lastName: this.admin.lastName,
        phoneNumber: this.admin.phoneNumber,
        email: this.admin.email
      });
      this.imagePreview = this.admin.imageUrl;
      this.adminForm.get('password')?.clearValidators();
      this.adminForm.get('confirmPassword')?.clearValidators();
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.adminForm.valid) {
      const formData = this.adminForm.value;
      if (this.isEditMode && this.admin) {
        const updateDto: UpdateAdminDto = {
          id: this.admin.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        };
        if (this.selectedImage) {
          updateDto.image = this.selectedImage;
        }
        this.submit.emit(updateDto);
      } else {
        const registerDto: RegisterDto = {
          ...formData,
          image: this.selectedImage
        };
        this.submit.emit(registerDto);
      }
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
