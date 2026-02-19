import { Component, inject } from '@angular/core';
import { EnquiryService } from '../../service/enquiry-service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enquiry-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './enquiry-list.html',
  styleUrl: './enquiry-list.css',
})
export class EnquiryList {
  enquiryService = inject(EnquiryService);
  private router = inject(Router);

  ngOnInit() {
    this.enquiryService.fetchAll().subscribe();
  }

  edit(id: number) {
    this.router.navigate(['/admin/enquiries/edit', id]);
  }

  remove(id: number) {
    this.enquiryService.delete(id).subscribe();
  }

}
