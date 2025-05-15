import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubCategoryDto } from '../Models/DTOs/SubCategoryDto';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SubCategoryService {
  private apiUrl = environment.apiUrl + '/api/SubCategory';

  constructor(private http: HttpClient) {}

  addSubCategory(subCategory: SubCategoryDto): Observable<any> {
    const formData = new FormData();
    if (subCategory.fromCallCenter !== undefined) formData.append('FromCallCenter', String(subCategory.fromCallCenter));
    formData.append('ServiceCategoryId', subCategory.serviceCategoryId.toString());
    formData.append('NameAr', subCategory.nameAr);
    formData.append('NameEn', subCategory.nameEn);
    formData.append('DescriptionAr', subCategory.descriptionAr);
    formData.append('DescriptionEn', subCategory.descriptionEn);
    if (subCategory.icon) formData.append('Icon', subCategory.icon);
    return this.http.post(`${this.apiUrl}/AddSubCategory`, formData);
  }

  updateSubCategory(subCategory: SubCategoryDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateSubCategory`, subCategory);
  }

  getAllSubCategories(): Observable<SubCategoryDto[]> {
    return this.http.get<any>(`${this.apiUrl}/GetAllSubCategories`)
      .pipe(
        map(response => response.data)
      );
  }

  getSubCategoryById(id: number): Observable<SubCategoryDto> {
    return this.http.get<SubCategoryDto>(`${this.apiUrl}/GetSubCategoryById/${id}`);
  }

  deleteSubCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteSubCategory/${id}`);
  }

  getMobileSubCategories(categoryId: number): Observable<SubCategoryDto[]> {
    return this.http.get<SubCategoryDto[]>(`${this.apiUrl}/GetMobileSubCategories/${categoryId}`);
  }

  addSubCategoryWithIcon(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddSubCategory`, formData);
  }

  updateSubCategoryWithIcon(id: number, formData: FormData): Observable<any> {
    console.log(formData);
    formData.append('id', id.toString());
    return this.http.put(`${this.apiUrl}/UpdateSubCategory`, formData);
  }
}
