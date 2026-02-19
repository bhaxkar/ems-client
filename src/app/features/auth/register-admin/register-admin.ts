import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-register-admin',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './register-admin.html',
  styleUrl: './register-admin.css',
})

export class RegisterAdmin {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  success = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.value,
      role: 'ADMIN',
    };

    this.authService.registerAdmin(payload).subscribe({
      next: () => {
        this.success.set(true);
        this.form.reset();
      },
    });
  }
}
