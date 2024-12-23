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

export interface Announcement {
  title: string;
  datePosted: Date;
  content: string;
  postedBy: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export interface SyllabusDocument {
  id: string;
  title: string;
  description: string;
  dateUploaded: Date;
  fileUrl: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  uploadedBy: string;
  dateUploaded: Date;
  folder: string;
}
