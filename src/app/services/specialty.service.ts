import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SpecialtyDto } from '../Models/DTOs/SpecialtyDto';
import { GenericResponse } from '../Models/Responses/GenericResponse';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllSpecialties(): Observable<GenericResponse<SpecialtyDto[]>> {
    return this.http.get<GenericResponse<SpecialtyDto[]>>(`${this.apiUrl}/api/Specialty/GetAllSpecialties`);
  }

  getSpecialtyById(id: number): Observable<GenericResponse<SpecialtyDto>> {
    return this.http.get<GenericResponse<SpecialtyDto>>(`${this.apiUrl}/api/Specialty/GetSpecialtyById/${id}`);
  }

  addSpecialty(specialty: SpecialtyDto): Observable<GenericResponse<SpecialtyDto>> {
    return this.http.post<GenericResponse<SpecialtyDto>>(`${this.apiUrl}/api/Specialty/AddSpecialty`, specialty);
  }

  updateSpecialty(specialty: SpecialtyDto): Observable<GenericResponse<SpecialtyDto>> {
    return this.http.put<GenericResponse<SpecialtyDto>>(`${this.apiUrl}/api/Specialty/UpdateSpecialty`, specialty);
  }

  deleteSpecialty(id: number): Observable<GenericResponse<any>> {
    return this.http.delete<GenericResponse<any>>(`${this.apiUrl}/api/Specialty/DeleteSpecialty/${id}`);
  }

  getMobileSpecialties(): Observable<GenericResponse<SpecialtyDto[]>> {
    return this.http.get<GenericResponse<SpecialtyDto[]>>(`${this.apiUrl}/api/Specialty/GetMobileSpecialties`);
  }
}
