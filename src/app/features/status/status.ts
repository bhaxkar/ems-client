import {
  Component,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { StatusService } from './service/status-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './status.html',
  styleUrl: './status.css',
})
export class Status implements OnInit, AfterViewInit {

  statusService = inject(StatusService);
  private fb = inject(FormBuilder);

  editMode = signal(false);
  selectedId = signal<number | null>(null);

  @ViewChild('statusModal') modalElement!: ElementRef;
  private modalInstance!: Modal;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    isActive: [true],
  });

  ngOnInit() {
    this.statusService.fetchAll().subscribe();
  }

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  openCreateModal() {
    this.reset();
    this.modalInstance.show();
  }

  openEditModal(status: any) {
    this.editMode.set(true);
    this.selectedId.set(status.id);

    this.form.patchValue({
      name: status.name,
      isActive: status.isActive,
    });

    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
    this.reset();
  }

  submit() {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();

    if (this.editMode() && this.selectedId()) {
      this.statusService.update(this.selectedId()!, value)
        .subscribe(() => this.closeModal());
    } else {
      this.statusService.create(value)
        .subscribe(() => this.closeModal());
    }
  }

  remove(id: number) {
    this.statusService.delete(id).subscribe();
  }

  reset() {
    this.editMode.set(false);
    this.selectedId.set(null);
    this.form.reset({ name: '', isActive: true });
  }
}