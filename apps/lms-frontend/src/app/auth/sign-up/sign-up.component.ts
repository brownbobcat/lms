import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      passwords: this.fb.group({
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          this.passwordStrengthValidator()
        ]],
        confirmPassword: ['', [Validators.required]]
      }, { validators: this.passwordMatchValidator })
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

  async submit() {
    if (this.signupForm.valid) {
      this.loading = true;
      try {
        // Add your signup logic here
        const formData = {
          fullName: this.signupForm.get('fullName')?.value,
          email: this.signupForm.get('email')?.value,
          password: this.passwordsGroup.get('password')?.value
        };
        console.log(formData);
      } catch (error) {
        console.error('Signup error:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
