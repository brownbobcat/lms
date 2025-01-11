import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  AuthResponse,
  LoginCredentials,
  PasswordResponse,
  RegisterCredentials,
  User,
} from '../../../libs/types';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private readonly API_URL = `${environment.apiUrl}`;

  private readonly currentUser = signal<User | null>(null);
  private readonly authToken = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this.authToken());
  readonly user = computed(() => this.currentUser());

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');

    if (token && user) {
      this.authToken.set(token);
      this.currentUser.set(JSON.parse(user));
    }
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/register`, credentials)
      .pipe(catchError(this.handleError));
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.authToken.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    sessionStorage.setItem('token', response.access_token);
    sessionStorage.setItem('user', JSON.stringify(response.user));
    this.authToken.set(response.access_token);
    this.currentUser.set(response.user);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid email or password';
          break;
        case 403:
          errorMessage = 'Access denied';
          break;
        case 404:
          errorMessage = 'Service not found';
          break;
        case 409:
          errorMessage = 'User already exists';
          break;
        case 500:
          errorMessage = 'Server error';
          break;
      }
    }

    return throwError(() => errorMessage);
  }

  getAuthToken(): string | null {
    return this.authToken();
  }

  forgotPassword(email: string): Observable<PasswordResponse> {
    return this.http
      .post<PasswordResponse>(`${this.API_URL}/auth/forgot-password`, { email })
      .pipe(catchError(this.handleError));
  }

  resetPassword(
    token: string,
    newPassword: string
  ): Observable<PasswordResponse> {
    return this.http
      .post<PasswordResponse>(`${this.API_URL}/auth/reset-password`, {
        token,
        newPassword,
      })
      .pipe(catchError(this.handleError));
  }
}
