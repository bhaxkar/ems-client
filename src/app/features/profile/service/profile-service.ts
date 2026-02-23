import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = 'http://localhost:3000'; // change if needed

  // =========================
  // GET PROFILE
  // =========================
  getProfile() {
    return this.http.get(`${this.apiUrl}/user/me`);
  }

  // =========================
  // UPLOAD AVATAR
  // =========================
  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post(
      `${this.apiUrl}/user/upload-avatar`,
      formData
    );
  }

  // =========================
  // CHANGE PASSWORD FLOW
  // =========================
  requestChangePassword(
    currentPassword: string,
    newPassword: string
  ) {
    return this.authService.requestChangePassword(
      currentPassword,
      newPassword
    );
  }

  confirmChangePassword(otp: string) {
    return this.authService.confirmChangePassword(otp);
  }

  resendChangePasswordOtp() {
    return this.authService.resendChangePasswordOtp();
  }
}