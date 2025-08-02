import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NurseDto } from '../Models/DTOs/NurseDto';

export interface NurseSearchParams {
  pageNumber: number;
  pageSize: number;
  searchKey: string;
  cityId: number;
  latitude: number;
  longitude: number;
}

@Injectable({ providedIn: 'root' })
export class NurseService {
  private apiUrl = environment.apiUrl + '/api/Nurse';

  constructor(private http: HttpClient) {}

  addNurse(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  updateNurse(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateNurse`, formData);
  }

  getAllNurses(search: NurseSearchParams): Observable<{ data: { items: NurseDto[]; totalCount: number; pageNumber: number; pageSize: number; totalPages: number; count: number; hasNextPage: boolean; hasPreviousPage: boolean } }> {
    console.log('Sending nurse search request with params:', search);
    return this.http.post<{ data: { items: NurseDto[]; totalCount: number; pageNumber: number; pageSize: number; totalPages: number; count: number; hasNextPage: boolean; hasPreviousPage: boolean } }>(`${this.apiUrl}/GetAllNurses`, search);
  }

  getNurseById(id: string): Observable<NurseDto> {
    return this.http.get<NurseDto>(`${this.apiUrl}/GetNurseById/${id}`);
  }

  deleteNurse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteNurse/${id}`);
  }

  changeStatus(id: string, status: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/changeStatus`, { id, status });
  }

  getMobileNurseById(id: string): Observable<NurseDto> {
    return this.http.get<NurseDto>(`${this.apiUrl}/GetMobileNurseById/${id}`);
  }

  getAllMobileNurses(search: any): Observable<{ data: { items: NurseDto[] } }> {
    return this.http.post<{ data: { items: NurseDto[] } }>(`${this.apiUrl}/GetAllMobileNurses`, search);
  }
}
