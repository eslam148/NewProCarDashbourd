import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceCatalogDto } from '../Models/DTOs/ServiceCatalogDto';
import { AdminsSearchDto } from '../Models/DTOs/AdminsSearchDto';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ServiceCatalogService {
  private apiUrl = environment.apiUrl + '/api/ServiceCatalog';

  constructor(private http: HttpClient) {}

  addService(service: ServiceCatalogDto): Observable<any> {
    const formData = new FormData();
    formData.append('NameAr', service.nameAr);
    formData.append('NameEn', service.nameEn);
    if (service.descriptionAr) formData.append('DescriptionAr', service.descriptionAr);
    if (service.descriptionEn) formData.append('DescriptionEn', service.descriptionEn);
    formData.append('SubCategoryId', service.subCategoryId.toString());
    formData.append('Price', service.price.toString());
    return this.http.post(`${this.apiUrl}/AddService`, formData);
  }

  updateService(service: ServiceCatalogDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateService`, service);
  }

  getAllServices(search: AdminsSearchDto={ SearchKey: '', PageNumber: 1, PageSize: 10 }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/GetAllServices`, search);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteService/${id}`);
  }

  getServiceById(id: number): Observable<ServiceCatalogDto> {
    return this.http.get<ServiceCatalogDto>(`${this.apiUrl}/GetServiceById/${id}`);
  }

  getMobileServices(): Observable<ServiceCatalogDto[]> {
    return this.http.post<ServiceCatalogDto[]>(`${this.apiUrl}/GetMobileServices`, {});
  }
}
