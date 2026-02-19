import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Enquiry } from '../model/enquiry.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnquiryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/enquiries';

  enquiries = signal<Enquiry[]>([]);
  loading = signal(false);

  create(data: any) {
    return this.http.post<Enquiry>(this.apiUrl, data).pipe(
      tap((newEnquiry) => {
        this.enquiries.update((current) => [...current, newEnquiry]);
      })
    );
  }

  fetchAll() {
    this.loading.set(true);
    return this.http.get<Enquiry[]>(this.apiUrl).pipe(
      tap((data) => {
        this.enquiries.set(data);
        this.loading.set(false);
      })
    );
  }

  fetchMyEnquiries() {
    this.loading.set(true);
    return this.http.get<Enquiry[]>(`${this.apiUrl}/my`).pipe(
      tap({
        next: (data) => this.enquiries.set(data),
        complete: () => this.loading.set(false),
      })
    );
  }

  getById(id: number) {
    return this.http.get<Enquiry>(`${this.apiUrl}/${id}`);
  }

  update(id: number, data: any) {
    return this.http.patch<Enquiry>(`${this.apiUrl}/${id}`, data).pipe(
      tap((updatedEnquiry) => {
        this.enquiries.update((current) =>
          current.map((e) => (e.id === id ? updatedEnquiry : e))
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.enquiries.update((current) => current.filter((e) => e.id !== id));
      })
    );
  }
}
