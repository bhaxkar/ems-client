import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubmitEnquiry } from '../enquiry/components/submit-enquiry/submit-enquiry';

declare var bootstrap: any;

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [RouterModule, CommonModule, SubmitEnquiry],
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member {
  private auth = inject(AuthService);
  private router = inject(Router);

  @ViewChild('enquiryModal') enquiryModal!: ElementRef;

  modalInstance: any;

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  openModal() {
    this.modalInstance = new bootstrap.Modal(this.enquiryModal.nativeElement);
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance?.hide();
  }
}