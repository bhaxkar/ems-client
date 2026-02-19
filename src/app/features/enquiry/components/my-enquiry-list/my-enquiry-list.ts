import { Component, inject } from '@angular/core';
import { EnquiryService } from '../../service/enquiry-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-enquiry-list',
  imports: [CommonModule],
  templateUrl: './my-enquiry-list.html',
  styleUrl: './my-enquiry-list.css',
})
export class MyEnquiryList {

  enquiryService = inject(EnquiryService);

  ngOnInit() {
    this.enquiryService.fetchMyEnquiries().subscribe();
  }
}
