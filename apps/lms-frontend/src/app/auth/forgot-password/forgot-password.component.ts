import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;
  resendLoading = false;
  emailSent = false;
  submittedEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      if (!email) return;

      this.loading = true;
      this.authService
        .forgotPassword(email)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            this.emailSent = true;
            this.submittedEmail = email;
          },
          error: (error: string) => {
            this.snackBar.open(error, 'Close', { duration: 5000 });
          },
        });
    }
  }

  resendEmail() {
    if (!this.submittedEmail) return;

    this.loading = true;
    this.authService
      .forgotPassword(this.submittedEmail)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Reset link has been resent', 'Close', {
            duration: 5000,
          });
        },
        error: (error: string) => {
          this.snackBar.open(error, 'Close', { duration: 5000 });
        },
      });
  }
}
