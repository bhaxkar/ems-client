import { Component, inject, signal } from '@angular/core';
import { StatusService } from './service/status-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-status',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './status.html',
  styleUrl: './status.css',
})
export class Status {

  statusService = inject(StatusService);
  private fb = inject(FormBuilder);

  editMode = signal(false);
  selectedId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    isActive: [true],
  });

  ngOnInit() {
    this.statusService.fetchAll().subscribe();
  }

  submit() {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();

    if (this.editMode() && this.selectedId()) {
      this.statusService.update(this.selectedId()!, value).subscribe(() => {
        this.reset();
      });
    } else {
      this.statusService.create(value).subscribe(() => {
        this.form.reset({ name: '', isActive: true });
      });
    }
  }

  edit(status: any) {
    this.editMode.set(true);
    this.selectedId.set(status.id);
    this.form.patchValue({
      name: status.name,
      isActive: status.isActive,
    });
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
