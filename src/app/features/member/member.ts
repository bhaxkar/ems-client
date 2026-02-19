import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-member',
  imports: [RouterModule], 
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member {
  private auth = inject(AuthService);
  private router = inject(Router);

   showEnquiryButton = signal(true);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const isEnquiryPage = this.router.url.includes('/member/enquiry');
        this.showEnquiryButton.set(!isEnquiryPage);
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
