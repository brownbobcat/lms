import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordValidator } from '../../../../libs/validators';
import { catchError, EMPTY, finalize, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth.service';
import { LoginForm } from '../../../../libs/types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private unsubscribe = new Subject<void>();
  showPassword = false;
  isLoading = false;

  readonly loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, passwordValidator()],
      nonNullable: true,
    }),
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      try {
        if (params['r'] === '1' && params['e']) {
          // Decode the email
          const decodedEmail = atob(decodeURIComponent(params['e']));
          
          // Validate the decoded email
          if (this.isValidEmail(decodedEmail)) {
            this.loginForm.get('email')?.setValue(decodedEmail);
            
            this.snackBar.open('Welcome! Please login with your credentials.', 'Close', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        }
      } catch (error) {
        console.error('Error decoding email parameter:', error);
        // Silently fail if there's a decoding error
      }
    });
  }

  private isValidEmail(email: string): boolean {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  readonly isFormValid = computed(() => {
    const emailValid = this.emailControl?.valid;
    const passwordValid = this.passwordControl?.valid;
    const formValid = this.loginForm.valid;

    return formValid && emailValid && passwordValid;
  });

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.isLoading = true;

    this.authService
      .login({ email, password })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.isLoading = false)),
        catchError((error) => {
          this.showError(error);
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.showSuccess();
          this.router.navigate(['/dashboard/overview']);
        },
      });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  private showSuccess(): void {
    this.snackBar.open('Successfully logged in!', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
