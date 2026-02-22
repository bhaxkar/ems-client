import { Component, inject, OnInit } from '@angular/core';
import { EnquiryService } from '../../service/enquiry-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-enquiry-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-enquiry-list.html',
  styleUrl: './my-enquiry-list.css',
})
export class MyEnquiryList implements OnInit {

  enquiryService = inject(EnquiryService);

  ngOnInit() {
    this.enquiryService.fetchMyEnquiries().subscribe();
  }
}