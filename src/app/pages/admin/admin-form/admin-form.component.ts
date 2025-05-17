import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AdminsDto } from '../../../Models/DTOs/AdminsDto';
import { RegisterDto } from '../../../Models/DTOs/RegisterDto';
import { UpdateAdminDto } from '../../../Models/DTOs/UpdateAdminDto';
import { ActionButtonComponent } from '../../../shared/components/action-button/action-button.component';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ActionButtonComponent]
})
export class AdminFormComponent implements OnInit {
  @Input() admin: AdminsDto | null = null;
  @Output() submit = new EventEmitter<RegisterDto | UpdateAdminDto>();
  @Output() cancel = new EventEmitter<void>();

  adminForm: FormGroup;
  isEditMode = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder) {
    this.adminForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', this.isEditMode ? [] : [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
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
        phoneNumber: this.admin.phoneNumber
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
          lastName: formData.lastName
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
}
