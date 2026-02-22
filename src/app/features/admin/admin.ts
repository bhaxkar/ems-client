import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
