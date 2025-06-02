import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective } from '@coreui/angular';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { login } from '../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { selectCurrentLanguage } from '../../store/translation/translation.selectors';
import { Subject, takeUntil, Observable } from 'rxjs';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
@Component({
  selector: 'app-main-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ActionButtonComponent,
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

  // Egyptian phone number pattern
  private readonly EGYPT_PHONE_PATTERN = /^01[0125][0-9]{8}$/;
  private deviceToken: string = '';

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
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
     //  this.getFcmToken();
  }
private async getFcmToken() {
    try {
      const supported = await isSupported();
      if (supported) {
        const messaging = getMessaging();
        const token = await getToken(messaging, {
          vapidKey: 'YOUR_VAPID_KEY' // Replace with your actual VAPID key
        });
        this.deviceToken = token || '';
        console.log('FCM Token:', this.deviceToken);
      } else {
        console.log('Firebase messaging is not supported in this browser');
        this.deviceToken = '';
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      this.deviceToken = '';
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
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
}
