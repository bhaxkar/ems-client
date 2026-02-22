import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EnquiryService } from '../../service/enquiry-service';
import { CategoryService } from '../../../category/service/category-service';

@Component({
  selector: 'app-submit-enquiry',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './submit-enquiry.html',
  styleUrl: './submit-enquiry.css',
})
export class SubmitEnquiry implements OnInit {
  private fb = inject(FormBuilder);
  private enquiryService = inject(EnquiryService);
  categoryService = inject(CategoryService);

  loading = signal(false);
  submitted = signal(false);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    customerName: ['', [Validators.required]],
    customerEmail: ['', [Validators.required, Validators.email]],
    customerPhone: [''],
    followUpDate: [''],
    categoryId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    this.categoryService.fetchAll().subscribe();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const payload = {
      ...this.form.getRawValue(),
      categoryId: Number(this.form.value.categoryId),
      followUpDate: this.form.value.followUpDate || undefined,
    };

    console.log(payload);

    this.enquiryService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);

        this.form.reset({
          title: '',
          message: '',
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          followUpDate: '',
          categoryId: 0,
        });
      },
      error: () => {
        this.loading.set(false);
        alert('Something went wrong');
      },
    });
  }

  get f() {
    return this.form.controls;
  }
}

