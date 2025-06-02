import { GetAllPharmaciesRequest, PharmacyModel, PharmacyResponseModel } from './../Models/DTOs/Pharmacy';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericResponse } from '../Models/Responses/GenericResponse';




@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private baseUrl = `${environment.apiUrl}/api/Pharmacy`;

  constructor(private http: HttpClient) { }

  /**
   * Get all pharmacies with pagination and filtering
   */
  getAll(request: GetAllPharmaciesRequest): Observable<GenericResponse<PharmacyResponseModel[]>> {
    return this.http.post<GenericResponse<PharmacyResponseModel[]>>(`${this.baseUrl}/GetAll`, request);

  }

  /**
   * Get a pharmacy by ID
   */
  getById(id: number): Observable<GenericResponse<PharmacyModel>> {
    return this.http.get<GenericResponse<PharmacyModel>>(`${this.baseUrl}/GetById/${id}`);
  }

  /**
   * Add a new pharmacy
   */
  add(pharmacy: PharmacyModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddPharmacy`, pharmacy);
  }

  /**
   * Update an existing pharmacy
   */
  update(pharmacy: PharmacyModel): Observable<any> {
    return this.http.put(`${this.baseUrl}/Update`, pharmacy);
  }

  /**
   * Delete a pharmacy by ID
   */
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeletePharmacy/${id}`);
  }
}
