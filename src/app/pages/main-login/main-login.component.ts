import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, FormControlDirective } from '@coreui/angular';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { login } from '../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { selectCurrentLanguage } from '../../store/translation/translation.selectors';
import { TranslationService } from '../../services/translation.service';
import { Subject, takeUntil, Observable, take } from 'rxjs';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { NotificationService } from 'src/app/services/Notification.service';
@Component({
  selector: 'app-main-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    IconDirective,
    FormControlDirective,
    TranslatePipe
  ],
  templateUrl: './main-login.component.html',
  styleUrl: './main-login.component.scss'
})
export class MainLoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  currentLang$: Observable<string>;
  private destroy$ = new Subject<void>();

  // Password visibility toggle
  showPassword = false;

  // Enhanced error handling
  loginError: string | null = null;
  phoneError: string | null = null;

  // Current language for toggle
  currentLanguage: string = 'en';

  // Egyptian phone number pattern
  private readonly EGYPT_PHONE_PATTERN = /^01[0125][0-9]{8}$/;
  private deviceToken: string = '';
  token: string | null = null;
  message: any;
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private translationService: TranslationService,
    private NotificationService : NotificationService
  ) {
    this.loginForm = this.fb.group({
      phonenumber: ['', [
        Validators.required,
        Validators.pattern(this.EGYPT_PHONE_PATTERN)
      ]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Initialize observables after store is available
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.currentLang$ = this.store.select(selectCurrentLanguage);
  }

  ngOnInit() {
    // Redirect if already authenticated
    this.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.router.navigate(['/dashboard']);
        }
      });

    // Enhanced error handling
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: any) => {
        this.handleLoginError(error);
      });

    // Track current language
    this.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang: string) => {
        this.currentLanguage = lang;
      });

         this.NotificationService.currentToken$.subscribe(token => {
      this.deviceToken = token || '';
    });
 this.enableNotifications();
    this.NotificationService.message$.subscribe(payload => {
      if (payload) {
        this.message = payload.notification || payload;
      }
    });

  }
 enableNotifications() {
    this.NotificationService.requestPermission();
  }
  async requestFcmToken() {
    try {
      console.log('Requesting FCM token...');
      await this.NotificationService.requestPermission();
      this.NotificationService.listen();
    } catch (error) {
      console.error('Error requesting FCM token:', error);
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    // Clear previous errors
      this.enableNotifications()

    console.log('Device Token:', this.token);

    this.loginError = null;
    this.phoneError = null;
    console.log('Device Token:', this.deviceToken);
    if (this.loginForm.valid) {
      const { phonenumber, password } = this.loginForm.value;
      this.store.dispatch(login({ phonenumber, password,deviceToken:this.deviceToken }));
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Enhanced error handling for API responses with translation support
   */
  private handleLoginError(error: any): void {
    if (!error) {
      this.loginError = null;
      this.phoneError = null;
      return;
    }

    // Handle specific API response format:
    // {"status": 1, "message": "Invalid phone number or password.", "data": {"token": null, "loginStatus": 2}}
    if (error.status === 1 && error.data) {
      // Check if token is null - this indicates invalid credentials
      if (error.data.token === null) {
        this.loginError = error.message || 'Phone number or password is wrong.';
        this.phoneError = null;
        return;
      }

      switch (error.data.loginStatus) {
        case 2:
          // Invalid credentials - use the message from API response
          this.loginError = error.message || 'Phone number or password is wrong.';
          this.phoneError = null;
          break;
        case 1:
          // Phone number format error
          this.phoneError = 'Please enter a valid Egyptian phone number.';
          this.loginError = null;
          break;
        default:
          this.loginError = error.message || 'Login failed. Please try again.';
          this.phoneError = null;
      }
    } else if (error.status === 1) {
      // Fallback for status 1 without data object
      this.loginError = error.message || 'Phone number or password is wrong.';
      this.phoneError = null;
    } else {
      // Generic error handling
      this.loginError = error.message || error || 'An unexpected error occurred. Please try again.';
      this.phoneError = null;
    }
  }

  /**
   * Get field error message
   */
  getFieldError(fieldName: string): string | null {
    const field = this.loginForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return fieldName === 'phonenumber' ? 'Phone number is required' : 'Password is required';
      }
      if (field.errors?.['pattern']) {
        return 'Please enter a valid Egyptian phone number (e.g., 01012345678)';
      }
      if (field.errors?.['minlength']) {
        return 'Password must be at least 6 characters long';
      }
    }
    return null;
  }

  /**
   * Check if field has error
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Toggle language between English and Arabic
   */
  toggleLanguage(): void {
    // Use the tracked current language to avoid subscription issues
    const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.translationService.setLanguage(newLang);
  }

  /**
   * Get current language for display
   */
  getCurrentLanguageDisplay(): Observable<string> {
    return this.currentLang$;
  }
}
