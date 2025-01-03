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
  id: string;
  title: string;
  description: string;
  code: string;
  thumbnail?: string;
  status: string;
  instructor: {
    name: string;
    email: string;
  };
  isFavorite?: boolean;
}


export interface Announcement {
  id: string
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

export interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  datePosted: Date;
  lastUpdated: Date;
  mediaUrls?: string[];
  mediaTypes?: string[];
  likes: number;
  tags?: string[];
  comments: DiscussionComment[];
}

export interface DiscussionComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  datePosted: Date;
  lastUpdated?: Date;
  mediaUrls?: string[];
  mediaTypes?: string[];
  likes: number;
  parentCommentId?: string;
  replies: DiscussionComment[];
}

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin'
}
