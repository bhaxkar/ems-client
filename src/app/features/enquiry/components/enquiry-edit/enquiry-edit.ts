import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  inject,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { EnquiryService } from '../../service/enquiry-service';
import { StatusService } from '../../../status/service/status-service';
import { Status } from '../../../status/model/status.model';

@Component({
  selector: 'app-enquiry-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enquiry-edit.html',
})
export class EnquiryEdit implements AfterViewInit {

  private fb = inject(FormBuilder);
  private enquiryService = inject(EnquiryService);
  private statusService = inject(StatusService);

  @Input() enquiryId!: number;
  @Output() updated = new EventEmitter<void>();

  @ViewChild('editModalRef') editModalRef!: ElementRef;

  private editModal!: Modal;

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
    this.statusService.fetchAll().subscribe(data => {
      this.statuses = data;
    });
  }

  ngAfterViewInit() {
    this.editModal = new Modal(this.editModalRef.nativeElement);
  }

  open(id: number) {
    this.enquiryId = id;

    this.enquiryService.getById(id).subscribe(data => {
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

      this.editModal.show();
    });
  }

  update() {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.getRawValue(),
      statusId: this.form.value.statusId
        ? Number(this.form.value.statusId)
        : undefined,
    };

    this.enquiryService.update(this.enquiryId, payload).subscribe(() => {
      this.editModal.hide();
      this.updated.emit();
    });
  }

  close() {
    this.editModal.hide();
  }
}