import {
  Component,
  inject,
  signal,
  effect,
  computed,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-verify-email',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = signal<string | null>(null);
  loading = signal(false);
  resendLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  countdown = signal(0);

  form = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    // Read email from query params
    this.route.queryParamMap.subscribe((params) => {
      const emailParam = params.get('email');
      this.email.set(emailParam);
    });

    // Countdown effect
    effect(() => {
      if (this.countdown() > 0) {
        const timer = setTimeout(() => {
          this.countdown.update((v) => v - 1);
        }, 1000);

        return () => clearTimeout(timer);
      }
      return;
    });
  }

  submit() {
    if (this.form.invalid || !this.email()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth
      .verifyEmailOtp(this.email()!, this.form.controls.otp.value)
      .subscribe({
        next: () => {
          this.successMessage.set('Email verified successfully!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage.set(
            err?.error?.message || 'Invalid or expired OTP'
          );
          this.loading.set(false);
        },
      });
  }

  resendOtp() {
    if (!this.email() || this.countdown() > 0) return;

    this.resendLoading.set(true);
    this.errorMessage.set(null);

    this.auth.resendVerifyEmailOtp(this.email()!).subscribe({
      next: () => {
        this.countdown.set(30); // 30 second cooldown
        this.resendLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err?.error?.message || 'Failed to resend OTP'
        );
        this.resendLoading.set(false);
      },
    });
  }

  canResend = computed(() => this.countdown() === 0);
}
