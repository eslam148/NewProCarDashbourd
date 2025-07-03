import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// CoreUI imports
import {
  CardModule,
  ButtonModule,
  FormModule,
  SpinnerModule,
  BreadcrumbModule,
  AlertModule,
  ModalModule,
  AvatarModule,
  BadgeModule,
  ProgressModule
} from '@coreui/angular';

// Services and models
import { AdminService } from '../../services/admin.service';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { Store } from '@ngrx/store';
import { updateProfileImage } from '../../store/profile/profile.actions';
import { UserAvatarComponent } from '../../components/user-avatar/user-avatar.component';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  role: string;
  profilePicture?: string;
  createdAt?: string;
  lastLogin?: string;
  isActive: boolean;
  // Add other relevant user fields
}

interface AdminsDto {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

interface UserStats {
  totalRequests?: number;
  completedRequests?: number;
  pendingRequests?: number;
  totalReservations?: number;
  // Add other relevant statistics
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    FormModule,
    SpinnerModule,
    BreadcrumbModule,
    AlertModule,
    ModalModule,
    AvatarModule,
    BadgeModule,
    ProgressModule,
    TranslatePipe,
    UserAvatarComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private platformId = inject(PLATFORM_ID);

  // Form and data properties
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  userProfile: UserProfile | null = null;
  userStats: UserStats = {};
  originalProfile: UserProfile | null = null;

  // UI state properties
  loading = false;
  saving = false;
  editMode = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Password change properties
  changingPassword = false;
  passwordError: string | null = null;
  passwordSuccessMessage: string | null = null;
  showChangePasswordModal = false;

  // File upload properties
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploadingImage = false;

  // Modal properties
  showCancelModal = false;
  showSaveModal = false;

  // Breadcrumb items
  breadcrumbItems = [
    { label: 'common.dashboard', url: '/dashboard' },
    { label: 'common.profile', active: true }
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {
    this.initializeForm();
    this.initializePasswordForm();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phone: ['', [Validators.pattern(/^[+]?[0-9\s\-\(\)]{10,15}$/)]],
      email: [{ value: '', disabled: true }], // Email is always disabled (read-only)
      // Add other editable fields as needed
    });

    // Disable form initially
    this.profileForm.disable();
  }

  private initializePasswordForm(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(formGroup: FormGroup): { [key: string]: any } | null {
    const newPassword = formGroup.get('newPassword');
    const confirmPassword = formGroup.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private loadUserProfile(): void {
    console.log('loadUserProfile called');
    this.loading = true;
    this.error = null;

    // Get current user ID from auth service
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user:', currentUser);
    if (!currentUser || !currentUser.UserId) {
      this.error = 'User not authenticated';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    // Load user profile data
    this.adminService.getAdminById(currentUser.UserId.toString())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === 0 && response.data) {
            console.log('response.data',response.data);
            // Convert AdminsDto to UserProfile
            const adminData = response.data;
            this.userProfile = {
              id: adminData.id,
              firstName: adminData.firstName || '',
              lastName: adminData.lastName || '',
              phone: adminData.phoneNumber,
              email: `${adminData.firstName?.toLowerCase() || 'user'}@company.com`, // Placeholder email
              role: 'admin', // Default role
              profilePicture: adminData.imageUrl || undefined,
              isActive: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };
            this.originalProfile = { ...this.userProfile };
            this.populateForm();
            this.loadUserStats();
          } else {
            this.error = response.message || 'Failed to load profile';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.error = 'Failed to load profile. Please try again.';
          this.loading = false;
        }
      });
  }

  private populateForm(): void {
    if (this.userProfile) {
      this.profileForm.patchValue({
        firstName: this.userProfile.firstName,
        lastName: this.userProfile.lastName,
        phone: this.userProfile.phone || '',
        email: this.userProfile.email || ''
      });
    }
  }

  private loadUserStats(): void {
    // Load user statistics if available
    // This would depend on your backend API structure
    // For now, we'll set some placeholder data
    this.userStats = {
      totalRequests: 0,
      completedRequests: 0,
      pendingRequests: 0,
      totalReservations: 0
    };
  }

  enableEditMode(): void {
    this.editMode = true;
    this.profileForm.enable();
    // Keep email field disabled (read-only)
    this.profileForm.get('email')?.disable();
    this.error = null;
    this.successMessage = null;
  }

  cancelEdit(): void {
    if (this.hasUnsavedChanges()) {
      this.showCancelModal = true;
    } else {
      this.exitEditMode();
    }
  }

  confirmCancel(): void {
    this.showCancelModal = false;
    this.exitEditMode();
  }

  private exitEditMode(): void {
    this.editMode = false;
    this.profileForm.disable();
    this.populateForm(); // Reset form to original values
    this.selectedFile = null;
    this.imagePreview = null;
    this.error = null;
    this.successMessage = null;
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.showSaveModal = true;
    } else {
      this.markFormGroupTouched();
    }
  }

  confirmSave(): void {
    this.showSaveModal = false;
    this.performSave();
  }

  private performSave(): void {
    if (!this.userProfile || !this.profileForm.valid) return;
    console.log('performSave called',this.userProfile);
    this.saving = true;
    this.error = null;

    const formData = this.profileForm.value;
    const updateData = {
      id: this.userProfile.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      image: this.selectedFile // Include selected image file
    };

    this.adminService.updateAdmin(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === 0) {
            // Update user profile with new data
            this.userProfile = {
              ...this.userProfile!,
              firstName: updateData.firstName,
              lastName: updateData.lastName,
              phone: updateData.phone
            };

            // Update profile picture if response contains new image URL
            if (response.data && response.data.imageUrl) {
              this.userProfile.profilePicture = response.data.imageUrl;
              // Update the store with new profile image
              this.store.dispatch(updateProfileImage({ imageUrl: response.data.imageUrl }));
            }

            this.originalProfile = { ...this.userProfile };
            this.successMessage = 'Profile updated successfully';
            this.exitEditMode();

            // Clear selected file after successful update
            this.selectedFile = null;
            this.imagePreview = null;
          } else {
            this.error = response.message || 'Failed to update profile';
          }
          this.saving = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.error = 'Failed to update profile. Please try again.';
          this.saving = false;
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error = 'Please select a valid image file';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'File size must be less than 5MB';
        return;
      }

      this.selectedFile = file;

      // Create image preview
      if (isPlatformBrowser(this.platformId)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }



  private hasUnsavedChanges(): boolean {
    if (!this.originalProfile) return false;

    const formData = this.profileForm.value;
    return (
      formData.firstName !== this.originalProfile.firstName ||
      formData.lastName !== this.originalProfile.lastName ||
      formData.phone !== (this.originalProfile.phone || '') ||
      this.selectedFile !== null
    );
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const control = this.profileForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        if (fieldName === 'firstName') return 'First name is required';
        if (fieldName === 'lastName') return 'Last name is required';
        return `${fieldName} is required`;
      }
      if (control.errors['minlength']) {
        if (fieldName === 'firstName') return 'First name is too short';
        if (fieldName === 'lastName') return 'Last name is too short';
        return `${fieldName} is too short`;
      }
      if (control.errors['maxlength']) {
        if (fieldName === 'firstName') return 'First name is too long';
        if (fieldName === 'lastName') return 'Last name is too long';
        return `${fieldName} is too long`;
      }
      if (control.errors['pattern']) return `Please enter a valid ${fieldName}`;
    }
    return null;
  }

  getRoleDisplayName(role: string): string {
    // Map role values to display names
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrator',
      'manager': 'Manager',
      'user': 'User',
      'moderator': 'Moderator'
    };
    return roleMap[role] || role;
  }

  getRoleBadgeColor(role: string): string {
    const colorMap: { [key: string]: string } = {
      'admin': 'danger',
      'manager': 'warning',
      'user': 'primary',
      'moderator': 'info'
    };
    return colorMap[role] || 'secondary';
  }

  dismissError(): void {
    this.error = null;
  }

  dismissSuccess(): void {
    this.successMessage = null;
  }

  /**
   * Get the profile image source with fallback to default avatar
   */
  getProfileImageSrc(): string {
    // If there's an image preview (during upload), use it
    if (this.imagePreview) {
      return this.imagePreview;
    }

    // If user has a profile picture, use it
    if (this.userProfile?.profilePicture) {
      return this.userProfile.profilePicture;
    }

    // Use a data URL for a default avatar SVG
    return this.getDefaultAvatarDataUrl();
  }

  /**
   * Generate a default avatar using SVG data URL
   */
  private getDefaultAvatarDataUrl(): string {
    const initials = this.getInitials();
    const backgroundColor = this.getAvatarBackgroundColor();

    // Create a scalable SVG that works at any size
    const svg = `
      <svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
        <circle cx="75" cy="75" r="75" fill="${backgroundColor}"/>
        <text x="75" y="75" font-family="Arial, sans-serif" font-size="54" font-weight="bold"
              text-anchor="middle" dominant-baseline="central" fill="white"
              style="user-select: none;">
          ${initials}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Get user initials for default avatar
   */
  private getInitials(): string {
    if (!this.userProfile) return 'U';

    const firstName = this.userProfile.firstName || '';
    const lastName = this.userProfile.lastName || '';

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    if (firstInitial && lastInitial) {
      return firstInitial + lastInitial;
    } else if (firstInitial) {
      return firstInitial;
    } else if (lastInitial) {
      return lastInitial;
    } else {
      return 'U'; // Default to 'U' for User
    }
  }

  /**
   * Get a consistent background color based on user name
   */
  private getAvatarBackgroundColor(): string {
    if (!this.userProfile) return '#6c757d'; // Default gray

    const name = (this.userProfile.firstName + this.userProfile.lastName).toLowerCase();

    // Generate a consistent color based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to a pleasant color
    const colors = [
      '#007bff', // Primary blue
      '#6f42c1', // Purple
      '#e83e8c', // Pink
      '#fd7e14', // Orange
      '#20c997', // Teal
      '#6610f2', // Indigo
      '#dc3545', // Red
      '#28a745', // Green
      '#17a2b8', // Info
      '#ffc107'  // Warning
    ];

    return colors[Math.abs(hash) % colors.length];
  }

  /**
   * Handle image loading errors by falling back to default avatar
   */
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement && this.userProfile) {
      // Set the source to our default avatar
      imgElement.src = this.getDefaultAvatarDataUrl();

      // Clear the broken profile picture URL to prevent future errors
      if (this.userProfile.profilePicture) {
        this.userProfile.profilePicture = undefined;
      }
    }
  }

  // Password change methods
  openChangePasswordModal(): void {
    this.showChangePasswordModal = true;
    this.passwordForm.reset();
    this.passwordError = null;
    this.passwordSuccessMessage = null;
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
    this.passwordForm.reset();
    this.passwordError = null;
    this.passwordSuccessMessage = null;
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.changingPassword = true;
      this.passwordError = null;

      const formData = this.passwordForm.value;
      const changePasswordDto = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      };

      this.authService.ChangePassword(changePasswordDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.status === 0) {
              this.passwordSuccessMessage = 'Password changed successfully';
              this.passwordForm.reset();
              setTimeout(() => {
                this.closeChangePasswordModal();
              }, 2000);
            } else {
              this.passwordError = response.message || 'Failed to change password';
            }
            this.changingPassword = false;
          },
          error: (error) => {
            console.error('Error changing password:', error);
            this.passwordError = 'Failed to change password. Please try again.';
            this.changingPassword = false;
          }
        });
    } else {
      this.markPasswordFormGroupTouched();
    }
  }

  private markPasswordFormGroupTouched(): void {
    Object.keys(this.passwordForm.controls).forEach(key => {
      const control = this.passwordForm.get(key);
      control?.markAsTouched();
    });
  }

  getPasswordFieldError(fieldName: string): string | null {
    const control = this.passwordForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        if (fieldName === 'oldPassword') return 'Current password is required';
        if (fieldName === 'newPassword') return 'New password is required';
        if (fieldName === 'confirmPassword') return 'Password confirmation is required';
      }
      if (control.errors['minlength']) {
        return 'Password must be at least 6 characters long';
      }
    }

    // Check for password mismatch
    if (fieldName === 'confirmPassword' && this.passwordForm.errors?.['passwordMismatch'] && control?.touched) {
      return 'Passwords do not match';
    }

    return null;
  }

  dismissPasswordError(): void {
    this.passwordError = null;
  }

  dismissPasswordSuccess(): void {
    this.passwordSuccessMessage = null;
  }
}
