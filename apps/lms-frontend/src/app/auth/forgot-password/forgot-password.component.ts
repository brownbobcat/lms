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

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async submit() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      try {
        // Add your password reset logic here
        this.submittedEmail = this.forgotPasswordForm.get('email')?.value;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
        this.emailSent = true;
      } catch (error) {
        console.error('Password reset error:', error);
      } finally {
        this.loading = false;
      }
    }
  }

  async resendEmail() {
    this.resendLoading = true;
    try {
      // Add your resend email logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
    } catch (error) {
      console.error('Resend email error:', error);
    } finally {
      this.resendLoading = false;
    }
  }
}
