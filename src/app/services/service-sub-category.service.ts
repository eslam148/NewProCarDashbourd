import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServiceSubCategoryDto } from '../Models/DTOs/ServiceSubCategoryDto';
import { GenericResponse } from '../Models/Responses/GenericResponse';

@Injectable({
  providedIn: 'root'
})
export class ServiceSubCategoryService {
  private apiUrl = `${environment.apiUrl}/api/ServiceSubCategory`;

  constructor(private http: HttpClient) { }

  addSubCategory(subCategory: ServiceSubCategoryDto): Observable<GenericResponse<ServiceSubCategoryDto>> {
    return this.http.post<GenericResponse<ServiceSubCategoryDto>>(`${this.apiUrl}/AddSubCategory`, subCategory);
  }

  updateSubCategory(id: number, subCategory: ServiceSubCategoryDto): Observable<GenericResponse<ServiceSubCategoryDto>> {
    return this.http.put<GenericResponse<ServiceSubCategoryDto>>(`${this.apiUrl}/UpdateSubCategory/${id}`, subCategory);
  }

  getAllSubCategories(): Observable<GenericResponse<ServiceSubCategoryDto[]>> {
    return this.http.get<GenericResponse<ServiceSubCategoryDto[]>>(`${this.apiUrl}/GetAllSubCategories`);
  }

  getSubCategoryById(id: number): Observable<GenericResponse<ServiceSubCategoryDto>> {
    return this.http.get<GenericResponse<ServiceSubCategoryDto>>(`${this.apiUrl}/GetSubCategoryById/${id}`);
  }

  deleteSubCategory(id: number): Observable<GenericResponse<boolean>> {
    return this.http.delete<GenericResponse<boolean>>(`${this.apiUrl}/DeleteSubCategory/${id}`);
  }

  getSubCategoriesByCategoryId(categoryId: number): Observable<GenericResponse<ServiceSubCategoryDto[]>> {
    return this.http.get<GenericResponse<ServiceSubCategoryDto[]>>(`${this.apiUrl}/GetSubCategoriesByCategoryId/${categoryId}`);
  }
}
