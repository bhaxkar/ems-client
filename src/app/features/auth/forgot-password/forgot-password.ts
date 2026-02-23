import {
  Component,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword implements AfterViewInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  @ViewChild('successToast') toastRef!: ElementRef;
  @ViewChild('otpInput') otpInput!: ElementRef;

  // STEP CONTROL
  step = signal(1);

  // STATE
  loading = signal(false);
  resendLoading = signal(false);
  message = signal<string | null>(null);
  emailValue = signal('');

  // RESEND TIMER
  countdown = signal(60);
  canResend = signal(false);
  private timer: any;

  // FORMS
  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });

  passwordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  ngAfterViewInit() {}

  // =========================
  // STEP 1 - SEND OTP
  // =========================
  sendOtp() {
    if (this.emailForm.invalid) return;

    this.loading.set(true);
    this.message.set(null);

    const email = this.emailForm.value.email!;
    this.emailValue.set(email);

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.step.set(2);
        this.startCountdown();
        this.loading.set(false);

        setTimeout(() => this.otpInput?.nativeElement.focus(), 200);
      },
      error: (err) => {
        this.message.set(err.error?.message || 'Something went wrong');
        this.loading.set(false);
      }
    });
  }

  // =========================
  // STEP 2 - VERIFY OTP
  // =========================
  verifyOtp() {
    if (this.otpForm.invalid) return;

    this.loading.set(true);
    this.message.set(null);

    this.authService.verifyOtp(
      this.emailValue(),
      this.otpForm.value.otp!
    ).subscribe({
      next: () => {
        this.step.set(3);
        this.loading.set(false);
      },
      error: (err) => {
        this.message.set(err.error?.message || 'Invalid OTP');
        this.loading.set(false);
      }
    });
  }

  // =========================
  // RESEND OTP
  // =========================
  resendOtp() {
    if (!this.canResend()) return;

    this.resendLoading.set(true);
    this.message.set(null);

    this.authService
      .resendResetPasswordOtp(this.emailValue())
      .subscribe({
        next: () => {
          this.resendLoading.set(false);
          this.startCountdown();
        },
        error: (err) => {
          this.message.set(err.error?.message || 'Failed to resend OTP');
          this.resendLoading.set(false);
        }
      });
  }

  // =========================
  // STEP 3 - RESET PASSWORD
  // =========================
  resetPassword() {
    if (this.passwordForm.invalid) return;

    const { newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.message.set('Passwords do not match');
      return;
    }

    this.loading.set(true);
    this.message.set(null);

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

  // =========================
  // COUNTDOWN TIMER
  // =========================
  private startCountdown() {
    this.canResend.set(false);
    this.countdown.set(60);

    clearInterval(this.timer);

    this.timer = setInterval(() => {
      const value = this.countdown() - 1;
      this.countdown.set(value);

      if (value <= 0) {
        clearInterval(this.timer);
        this.canResend.set(true);
      }
    }, 1000);
  }

  // =========================
  // SUCCESS TOAST
  // =========================
  private showToast() {
    const toastEl = this.toastRef.nativeElement;
    const toast = new (window as any).bootstrap.Toast(toastEl);
    toast.show();
  }
}