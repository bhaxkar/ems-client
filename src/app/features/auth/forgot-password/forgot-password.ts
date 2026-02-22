import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  @ViewChild('successToast') toastRef!: ElementRef;

  // Step control (1=email, 2=otp, 3=password)
  step = signal(1);
  loading = signal(false);
  message = signal<string | null>(null);
  emailValue = signal('');

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });

  passwordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  sendOtp() {
    if (this.emailForm.invalid) return;

    this.loading.set(true);
    const email = this.emailForm.value.email!;
    this.emailValue.set(email);

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.step.set(2);
        this.message.set('OTP sent to your email');
        this.loading.set(false);
      },
      error: (err) => {
        this.message.set(err.error?.message || 'Something went wrong');
        this.loading.set(false);
      }
    });
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;

    this.loading.set(true);

    this.authService.verifyOtp(
      this.emailValue(),
      this.otpForm.value.otp!
    ).subscribe({
      next: () => {
        this.step.set(3);
        this.message.set('OTP verified successfully');
        this.loading.set(false);
      },
      error: (err) => {
        this.message.set(err.error?.message || 'Invalid OTP');
        this.loading.set(false);
      }
    });
  }

  resetPassword() {
    if (this.passwordForm.invalid) return;

    const { newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.message.set('Passwords do not match');
      return;
    }

    this.loading.set(true);

    this.authService.resetPassword(
      this.emailValue(),
      newPassword!,
      confirmPassword!
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.showToast();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: (err) => {
        this.message.set(err.error?.message || 'Error resetting password');
        this.loading.set(false);
      }
    });
  }

  showToast() {
    const toastEl = this.toastRef.nativeElement;
    const toast = new (window as any).bootstrap.Toast(toastEl);
    toast.show();
  }
}