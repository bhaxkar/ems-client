import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface JwtPayload {
  userId: number;
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:3000/auth';

  currentUser = signal<JwtPayload | null>(null);
  isAuthenticated = signal(false);

  // =========================
  // LOGIN
  // =========================
  login(data: any) {
    return this.http.post<{
      message: string;
      data: {
        name: string;
        email: string;
        role: 'ADMIN' | 'MEMBER';
        accessToken: string;
      };
    }>(`${this.apiUrl}/login`, data);
  }

  // =========================
  // REGISTER
  // =========================
  register(data: any) {
    return this.http.post<{ message: string; data: any }>(
      `${this.apiUrl}/register/member`,
      data
    );
  }

  registerAdmin(data: any) {
    return this.http.post(`${this.apiUrl}/register/admin`, data);
  }

  // =========================
  // EMAIL VERIFICATION
  // =========================
  verifyEmailOtp(email: string, otp: string) {
    return this.http.post(`${this.apiUrl}/email-verification/verify`, { email, otp });
  }

  resendVerifyEmailOtp(email: string) {
    return this.http.post(`${this.apiUrl}/email-verification/resend-otp`, { email });
  }

  // =========================
  // FORGOT PASSWORD
  // =========================
  forgotPassword(email: string) {
    return this.http.post(
      `${this.apiUrl}/forgot-password/request`,
      { email }
    );
  }

  verifyOtp(email: string, otp: string) {
    return this.http.post(
      `${this.apiUrl}/forgot-password/verify`,
      { email, otp }
    );
  }

  resetPassword(
    email: string,
    newPassword: string,
    confirmPassword: string
  ) {
    return this.http.post(
      `${this.apiUrl}/forgot-password/reset`,
      {
        email,
        newPassword,
        confirmPassword,
      }
    );
  }

  resendResetPasswordOtp(email: string) {
    return this.http.post(
      `${this.apiUrl}/forgot-password/resend-otp`,
      { email }
    );
  }

  // =========================
  // CHANGE PASSWORD (Logged-in User)
  // =========================
  requestChangePassword(
    currentPassword: string,
    newPassword: string
  ) {
    return this.http.post(
      `${this.apiUrl}/change-password/request`,
      {
        currentPassword,
        newPassword,
      }
    );
  }

  confirmChangePassword(otp: string) {
    return this.http.post(
      `${this.apiUrl}/change-password/confirm`,
      { otp }
    );
  }

  resendChangePasswordOtp() {
    return this.http.post(
      `${this.apiUrl}/change-password/resend-otp`,
      {}
    );
  }

  // =========================
  // TOKEN HANDLING
  // =========================
  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.decodeAndStore(token);
  }

  private decodeAndStore(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
    this.currentUser.set(payload);
    this.isAuthenticated.set(true);
  }

  initializeAuth() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.decodeAndStore(token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return this.currentUser()?.role;
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  redirectByRole() {
    const role = this.getRole();

    if (role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'MEMBER') {
      this.router.navigate(['/member']);
    } else {
      this.router.navigate(['/']);
    }
  }
}