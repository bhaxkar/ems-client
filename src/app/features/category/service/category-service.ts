import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryModel } from '../model/category.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/category';

  categories = signal<CategoryModel[]>([]);
  loading = signal(false);

  fetchAll() {
    this.loading.set(true);
    return this.http.get<CategoryModel[]>(this.apiUrl).pipe(
      tap((data) => {
        this.categories.set(data);
        this.loading.set(false);
      })
    );
  }

  create(data: { name: string; description?: string; isActive?: boolean }) {
    return this.http.post<CategoryModel>(this.apiUrl, data).pipe(
      tap((newCat) => {
        console.log('CREATED:', newCat);
        this.categories.update((cats) => [newCat, ...cats]);
      })
    );
  }

  update(
    id: number,
    data: { name: string; description?: string; isActive?: boolean }
  ) {
    return this.http.patch<CategoryModel>(`${this.apiUrl}/${id}`, data).pipe(
      tap((updatedCat) => {
        this.categories.update((cats) =>
          cats.map((cat) => (cat.id === id ? updatedCat : cat))
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.categories.update((cats) => cats.filter((cat) => cat.id !== id));
      })
    );
  }
}
