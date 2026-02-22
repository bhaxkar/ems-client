import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { EnquiryService } from '../../service/enquiry-service';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { Toast } from 'bootstrap';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StatusService } from '../../../status/service/status-service';
import { Status } from '../../../status/model/status.model';
import { EnquiryEdit } from '../enquiry-edit/enquiry-edit';

@Component({
  selector: 'app-enquiry-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EnquiryEdit],
  templateUrl: './enquiry-list.html',
  styleUrl: './enquiry-list.css',
})
export class EnquiryList implements AfterViewInit {

  private fb = inject(FormBuilder);
  private statusService = inject(StatusService);
  enquiryService = inject(EnquiryService);

  selectedId: number | null = null;
  statuses: Status[] = [];

  private confirmToast!: Toast;
  private successToast!: Toast;
  private editModal!: Modal;

  @ViewChild('confirmToastRef') confirmToastRef!: ElementRef;
  @ViewChild('successToastRef') successToastRef!: ElementRef;
  @ViewChild('editModalRef') editModalRef!: ElementRef;
  @ViewChild(EnquiryEdit) editComponent!: EnquiryEdit;

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
    this.enquiryService.fetchAll().subscribe();

    this.statusService.fetchAll().subscribe((data) => {
      this.statuses = data;
    });
  }

  ngAfterViewInit() {
    this.confirmToast = new Toast(this.confirmToastRef.nativeElement, {
      autohide: false
    });

    this.successToast = new Toast(this.successToastRef.nativeElement, {
      autohide: true,
      delay: 300
    });

    this.editModal = new Modal(this.editModalRef.nativeElement);
  }

  edit(id: number) {
    this.editComponent.open(id);
  }

  updateEnquiry() {
    if (this.form.invalid || this.selectedId === null) return;

    const payload = {
      ...this.form.getRawValue(),
      statusId: this.form.value.statusId
        ? Number(this.form.value.statusId)
        : undefined,
    };

    this.enquiryService.update(this.selectedId, payload).subscribe(() => {
      this.editModal.hide();
      this.enquiryService.fetchAll().subscribe();
    });
  }

  remove(id: number) {
    this.selectedId = id;
    this.confirmToast.show();
  }

  confirmDelete() {
    if (this.selectedId !== null) {
      this.enquiryService.delete(this.selectedId).subscribe(() => {
        this.confirmToast.hide();

        setTimeout(() => {
          this.successToast.show();
        }, 300);

        this.selectedId = null;
      });
    }
  }

  cancelDelete() {
    this.confirmToast.hide();
    this.selectedId = null;
  }

  closeEditModal() {
    this.editModal.hide();
  }
}
