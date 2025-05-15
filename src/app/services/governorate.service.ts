import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { GovernorateDto } from '../Models/DTOs/GovernorateDto';
import { GenericResponse } from '../Models/Responses/GenericResponse';

@Injectable({
  providedIn: 'root'
})
export class GovernorateService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllGovernorates(): Observable<GenericResponse<GovernorateDto[]>> {
    return this.http.get<GenericResponse<GovernorateDto[]>>(`${this.apiUrl}/api/Governorate/GetAllGovernorates`);
  }

  getGovernorateById(id: number): Observable<GenericResponse<GovernorateDto>> {
    return this.http.get<GenericResponse<GovernorateDto>>(`${this.apiUrl}/api/Governorate/GetGovernorateById/${id}`);
  }

  addGovernorate(governorate: GovernorateDto): Observable<GenericResponse<GovernorateDto>> {
    return this.http.post<GenericResponse<GovernorateDto>>(`${this.apiUrl}/api/Governorate/AddGovernorate`, governorate);
  }

  updateGovernorate(governorate: GovernorateDto): Observable<GenericResponse<GovernorateDto>> {
    return this.http.put<GenericResponse<GovernorateDto>>(`${this.apiUrl}/api/Governorate/UpdateGovernorate`, governorate);
  }

  deleteGovernorate(id: number): Observable<GenericResponse<any>> {
    return this.http.delete<GenericResponse<any>>(`${this.apiUrl}/api/Governorate/DeleteGovernorate?id=${id}`);
  }

  getMobileGovernorates(): Observable<GenericResponse<GovernorateDto[]>> {
    return this.http.get<GenericResponse<GovernorateDto[]>>(`${this.apiUrl}/api/Governorate/GetMobileGovernorates`);
  }
}
