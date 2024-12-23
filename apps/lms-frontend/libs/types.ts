import { FormControl } from '@angular/forms';

export interface PasswordStrengthErrors {
  minLength?: boolean;
  upperCase?: boolean;
  lowerCase?: boolean;
  numbers?: boolean;
  specialCharacters?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface Course {
  code: string;
  title: string;
  instructor: string;
  isFavorite: boolean;
}
