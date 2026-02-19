import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Status } from '../model/status.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatusService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/status';

  statuses = signal<Status[]>([]);
  loading = signal(false);

  fetchAll() {
    this.loading.set(true);

    return this.http.get<Status[]>(this.apiUrl).pipe(
      tap({
        next: (data) => this.statuses.set(data),
        complete: () => this.loading.set(false),
      })
    );
  }

  create(data: { name: string; isActive: boolean }) {
    return this.http.post<Status>(this.apiUrl, data).pipe(
      tap((newStatus) => {
        this.statuses.update((current) => [...current, newStatus]);
      })
    );
  }

  update(id: number, data: { name: string; isActive: boolean }) {
    return this.http.patch<Status>(`${this.apiUrl}/${id}`, data).pipe(
      tap((updatedStatus) => {
        this.statuses.update((current) =>
          current.map((s) => (s.id === id ? updatedStatus : s))
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.statuses.update((current) =>
          current.filter((s) => s.id !== id)
        );
      })
    );
  }
}
