import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from './service/profile-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private profileService = inject(ProfileService);

  profile = signal<any>(null);

  selectedFile: File | null = null;

  // Default placeholder image
  imagePreview = signal<string>('https://via.placeholder.com/150');

  currentPassword = '';
  newPassword = '';
  otp = '';

  showOtpSection = signal(false);

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe((res: any) => {
      this.profile.set(res);

      // Show original image from backend
      if (res?.profileImage) {
        this.imagePreview.set(res.profileImage);
      }
    });
  }

  // =========================
  // IMAGE UPLOAD
  // =========================
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  uploadImage() {
    if (!this.selectedFile) return;

    this.profileService.uploadAvatar(this.selectedFile)
      .subscribe((res: any) => {
        this.imagePreview.set(res.imageUrl);
        alert('Profile image updated successfully');
        this.selectedFile = null;
      });
  }

  // =========================
  // CHANGE PASSWORD
  // =========================
  requestPasswordChange() {
    this.profileService
      .requestChangePassword(this.currentPassword, this.newPassword)
      .subscribe(() => {
        this.showOtpSection.set(true);
        alert('OTP sent to your email');
      });
  }

  confirmPasswordChange() {
    this.profileService.confirmChangePassword(this.otp)
      .subscribe(() => {
        alert('Password changed successfully');
        this.showOtpSection.set(false);
        this.currentPassword = '';
        this.newPassword = '';
        this.otp = '';
      });
  }

  resendOtp() {
    this.profileService.resendChangePasswordOtp()
      .subscribe(() => {
        alert('OTP resent successfully');
      });
  }
}

