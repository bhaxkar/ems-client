import {
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from './service/category-service';
import { CategoryModel } from './model/category.model';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {

  private fb = inject(FormBuilder);
  readonly categoryService = inject(CategoryService);

  readonly editMode = signal(false);
  readonly selectedId = signal<number | null>(null);

  @ViewChild('categoryModal') modalElement!: ElementRef;
  private modalInstance!: Modal;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    this.categoryService.fetchAll().subscribe();
  }

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  openCreateModal() {
    this.reset();
    this.modalInstance.show();
  }

  openEditModal(cat: CategoryModel) {
    this.editMode.set(true);
    this.selectedId.set(cat.id);

    this.form.patchValue({
      name: cat.name,
      description: cat.description ?? '',
      isActive: cat.isActive,
    });

    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
    this.reset();
  }

  submit() {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue();

    if (this.editMode() && this.selectedId()) {
      this.categoryService.update(this.selectedId()!, payload)
        .subscribe(() => this.closeModal());
    } else {
      this.categoryService.create(payload)
        .subscribe(() => this.closeModal());
    }
  }

  remove(id: number) {
    this.categoryService.delete(id).subscribe();
  }

  reset() {
    this.editMode.set(false);
    this.selectedId.set(null);
    this.form.reset({ name: '', description: '', isActive: true });
  }
}