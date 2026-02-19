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

  login(data: any) {
    return this.http.post<{ access_token: string }>(
      `${this.apiUrl}/login`,
      data
    );
  }

  register(data: any) {
    return this.http.post<{ access_token: string }>(
      `${this.apiUrl}/register`,
      data
    );
  }

  registerAdmin(data: any) {
    return this.http.post(`${this.apiUrl}/admin/register`, data);
  }

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
}
