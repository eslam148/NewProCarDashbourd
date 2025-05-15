import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { login } from '../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { selectCurrentLanguage } from '../../store/translation/translation.selectors';
import { Subject, takeUntil } from 'rxjs';

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
    ButtonDirective,
    TranslatePipe
  ],
  templateUrl: './main-login.component.html',
  styleUrl: './main-login.component.scss'
})
export class MainLoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  isAuthenticated$ = this.store.select(selectIsAuthenticated);
  currentLang$ = this.store.select(selectCurrentLanguage);
  private destroy$ = new Subject<void>();

  // Egyptian phone number pattern
  private readonly EGYPT_PHONE_PATTERN = /^01[0125][0-9]{8}$/;

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
  }

  ngOnInit() {
    // Redirect if already authenticated
    this.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['/dashboard']);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { phonenumber, password } = this.loginForm.value;
      this.store.dispatch(login({ phonenumber, password }));
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
