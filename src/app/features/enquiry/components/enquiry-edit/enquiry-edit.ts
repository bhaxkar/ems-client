import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnquiryService } from '../../service/enquiry-service';
import { StatusService } from '../../../status/service/status-service';
import { Status } from '../../../status/model/status.model';

@Component({
  selector: 'app-enquiry-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enquiry-edit.html',
  styleUrl: './enquiry-edit.css',
})
export class EnquiryEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private enquiryService = inject(EnquiryService);
  private statusService = inject(StatusService);

  id!: number;
  statuses: Status[] = [];

  form = this.fb.group({
    title: [''],
    message: [''],
    customerName: [''],
    customerEmail: ['', Validators.email],
    customerPhone: [''],
    followUpDate: [''],
    statusId: [null as number | null],
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.statusService.fetchAll().subscribe((data) => {
      this.statuses = data;
    });

    this.enquiryService.getById(this.id).subscribe((data) => {
      this.form.patchValue({
        title: data.title,
        message: data.message,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        followUpDate: data.followUpDate
          ? data.followUpDate.substring(0, 10)
          : '',
        statusId: data.status?.id,
      });
    });
  }

  submit() {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.getRawValue(),
      statusId: this.form.value.statusId
        ? Number(this.form.value.statusId)
        : undefined,
    };

    this.enquiryService.update(this.id, payload).subscribe(() => {
      this.router.navigate(['/admin']);
    });
  }
}