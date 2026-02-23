// import { Component, inject } from '@angular/core';
// import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { AuthService } from '../../../core/services/auth';

// @Component({
//   selector: 'app-register',
//   imports: [ReactiveFormsModule, RouterLink],
//   templateUrl: './register.html',
//   styleUrl: './register.css',
// })
// export class Register {
//   private fb = inject(FormBuilder);
//   private auth = inject(AuthService);
//   private router = inject(Router);

//   form = this.fb.nonNullable.group({
//     name: ['', Validators.required],
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', [Validators.required, Validators.minLength(6)]],
//     role: ['MEMBER'],
//   });

//   submit() {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     this.auth.register(this.form.getRawValue()).subscribe({
//       const email = this.form.controls.email.value;

//       this.router.navigate(['/verify-email'], {
//         queryParams: { email },
//       });
//     });
//   }
// }

import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['MEMBER'],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => {
        const email = this.form.controls.email.value;

        // 🔥 Redirect to verify email page
        this.router.navigate(['/verify-email'], {
          queryParams: { email },
        });
      },
      error: (err) => {
        this.errorMessage.set(
          err?.error?.message || 'Registration failed'
        );
        this.loading.set(false);
      },
    });
  }
}


