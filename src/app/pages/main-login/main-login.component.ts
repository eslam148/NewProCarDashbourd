import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ContainerComponent, RowComponent, ColComponent, FormControlDirective } from '@coreui/angular';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { login } from '../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { selectCurrentLanguage } from '../../store/translation/translation.selectors';
import { TranslationService } from '../../services/translation.service';
import { Subject, takeUntil, Observable, take } from 'rxjs';
 import { NotificationService } from '../../services/Notification.service';
 import { saveFcmToken } from '../../store/auth/auth.actions';
@Component({
  selector: 'app-main-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
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
    private NotificationService : NotificationService,
   ) {
    this.loginForm = this.fb.group({
      Email: ['', [
        Validators.required,

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
    // Redirect if already authenticated and save FCM token
    this.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (isAuthenticated: boolean) => {
        if (isAuthenticated) {
          // Save FCM token to store and localStorage after successful login
          // Add a small delay to ensure FCM token is ready
          setTimeout(async () => {
            await this.saveFcmTokenAfterLogin();
          }, 500);
          this.router.navigate(['/profile']);
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

    // Initialize Firebase messaging
    this.initializeFirebaseMessaging();

    // Subscribe to FCM token updates
    this.NotificationService.currentToken$
      .pipe(takeUntil(this.destroy$))
      .subscribe(token => {
        this.deviceToken = token || '';
      });

    // Subscribe to Firebase messages
    this.NotificationService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        if (payload) {
          this.message = payload.notification || payload;
        }
      });
  }

  /**
   * Initialize Firebase messaging with full setup
   */
  private async initializeFirebaseMessaging() {
    try {
      console.log('Initializing Firebase messaging in login component...');
      await this.NotificationService.initializeFirebaseMessaging();
      console.log('Firebase messaging initialized successfully in login');
    } catch (error) {
      console.error('Error initializing Firebase messaging in login:', error);
    }
  }

  /**
   * Enable notifications (legacy method - kept for compatibility)
   */
  enableNotifications() {
    this.NotificationService.requestPermission();
  }

  /**
   * Request FCM token (legacy method - kept for compatibility)
   */
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
    this.enableNotifications();

    this.loginError = null;
    this.phoneError = null;

    if (this.loginForm.valid) {
      const { Email, password } = this.loginForm.value;

      // Dispatch login action with FCM token
      this.store.dispatch(login({
        Email,
        password,
        deviceToken: this.deviceToken
      }));

      // Also save FCM token immediately if available
      if (this.deviceToken) {
        this.store.dispatch(saveFcmToken({ fcmToken: this.deviceToken }));
      }
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
        return fieldName === 'Email' ? 'Email is required' : 'Password is required';
      }
      if (field.errors?.['pattern']) {
        return 'Please enter a valid email address.';
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
    // Use local setLanguage since user is not authenticated yet
    this.translationService.setLanguage(newLang);
  }

  /**
   * Get current language for display
   */
  getCurrentLanguageDisplay(): Observable<string> {
    return this.currentLang$;
  }

  /**
   * Save FCM token to store and localStorage after successful login
   */
  private async saveFcmTokenAfterLogin(): Promise<void> {
    try {
      // Get the current FCM token from the component's deviceToken property
      let currentToken = this.deviceToken;

      // If no token, try to get it from the notification service
      if (!currentToken) {
        // Try to get token from notification service observable
        this.NotificationService.currentToken$
          .pipe(take(1))
          .subscribe(token => {
            if (token) {
              currentToken = token;
              this.deviceToken = token;
            }
          });
      }

      // If still no token, try to request permission and generate new token
      if (!currentToken) {
        try {
          await this.NotificationService.requestPermission();
          await this.NotificationService.initializeFirebaseMessaging();

          // Wait for token to be generated
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Check again
          this.NotificationService.currentToken$
            .pipe(take(1))
            .subscribe(token => {
              if (token) {
                currentToken = token;
                this.deviceToken = token;
              }
            });
        } catch (error) {
          console.error('Error generating new FCM token:', error);
        }
      }

      if (currentToken) {
        // Dispatch action to save FCM token to store
        this.store.dispatch(saveFcmToken({ fcmToken: currentToken }));

        // Also save directly to localStorage as backup
        localStorage.setItem('fcmToken', currentToken);

        // Save with metadata
        const tokenData = {
          token: currentToken,
          timestamp: new Date().toISOString(),
          userId: this.getCurrentUserId()
        };
        localStorage.setItem('fcmTokenData', JSON.stringify(tokenData));
      }
    } catch (error) {
      console.error('Error saving FCM token after login:', error);
    }
  }

  /**
   * Get current user ID for FCM token metadata
   */
  private getCurrentUserId(): string | null {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user?.id || user?.UserId || null;
      } catch {
        return null;
      }
    }
    return null;
  }
}
