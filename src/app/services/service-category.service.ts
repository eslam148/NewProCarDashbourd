import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceCategoryDto } from '../Models/DTOs/ServiceCategoryDto';
import { environment } from '../../environments/environment';
import { GenericResponse } from '../Models/Responses/GenericResponse';

export interface ServiceCategory {
  id: number;
  nameAr: string;
  nameEn: string;
  // Add other fields as needed
}

@Injectable({ providedIn: 'root' })
export class ServiceCategoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addCategory(category: ServiceCategoryDto): Observable<GenericResponse<ServiceCategoryDto>> {
    const formData = new FormData();
    formData.append('NameAr', category.nameAr);
    formData.append('NameEn', category.nameEn);
    formData.append('DescriptionAr', category.descriptionAr);
    formData.append('DescriptionEn', category.descriptionEn);
    if (category.icon) formData.append('Icon', category.icon);
    return this.http.post<GenericResponse<ServiceCategoryDto>>(`${this.apiUrl}/api/ServiceCategory/AddCategory`, formData);
  }

  updateCategory(category: ServiceCategoryDto): Observable<GenericResponse<ServiceCategoryDto>> {
    const formData = new FormData();
    formData.append('Id', category.id?.toString() ?? '');
    formData.append('NameAr', category.nameAr);
    formData.append('NameEn', category.nameEn);
    formData.append('DescriptionAr', category.descriptionAr);
    formData.append('DescriptionEn', category.descriptionEn);
    if (category.icon) formData.append('Icon', category.icon);

    return this.http.put<GenericResponse<ServiceCategoryDto>>(`${this.apiUrl}/api/ServiceCategory/updateCategory`, formData);
  }

  getAllCategories(): Observable<GenericResponse<ServiceCategoryDto[]>> {
    return this.http.get<GenericResponse<ServiceCategoryDto[]>>(`${this.apiUrl}/api/ServiceCategory/GetAllCategories`);
  }

  getCategoryById(id: number): Observable<GenericResponse<ServiceCategoryDto>> {
    return this.http.get<GenericResponse<ServiceCategoryDto>>(`${this.apiUrl}/api/ServiceCategory/GetCategoryById/${id}`);
  }

  deleteCategory(id: number): Observable<GenericResponse<any>> {
    return this.http.delete<GenericResponse<any>>(`${this.apiUrl}/api/ServiceCategory/DeleteCategory/${id}`);
  }

  getMobileCategories(): Observable<GenericResponse<ServiceCategoryDto[]>> {
    return this.http.get<GenericResponse<ServiceCategoryDto[]>>(`${this.apiUrl}/api/ServiceCategory/GetMobileCategories`);
  }
}
