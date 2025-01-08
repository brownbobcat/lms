import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRole } from '../../../../libs/types';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  loading = false;
  togglePassword = true;
  toggleConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // if (this.authService.isAuthenticated()) {
    //   this.router.navigate(['/dashboard/overview']);
    // }

    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      passwords: this.fb.group(
        {
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              this.passwordStrengthValidator(),
            ],
          ],
          confirmPassword: ['', [Validators.required]],
        },
        { validators: this.passwordMatchValidator }
      ),
    });
  }

  get passwordsGroup() {
    return this.signupForm.get('passwords') as FormGroup;
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
  ngOnInit(): void {}

  passwordStrengthValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) return null;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

      return valid ? null : { weakPassword: true };
    };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.signupForm.valid && !this.loading) {
      this.loading = true;

      const registerData = {
        fullName: this.signupForm.get('fullName')?.value,
        email: this.signupForm.get('email')?.value,
        password: this.passwordsGroup.get('password')?.value,
        role: UserRole.STUDENT, // Default role for new registrations
      };

      this.authService.register(registerData).subscribe({
        next: () => {
          this.snackBar.open(
            'Registration successful! Please login to continue.',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            }
          );
          // Encode the email before adding it to URL
          const encodedEmail = encodeURIComponent(btoa(registerData.email));

          this.router.navigate(['/login'], {
            queryParams: {
              e: encodedEmail,
              r: '1',
            },
          });
        },
        error: (error) => {
          this.snackBar.open(error, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
}
