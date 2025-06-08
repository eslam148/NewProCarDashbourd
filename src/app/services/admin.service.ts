import { AdminsSearchDto } from './../Models/DTOs/AdminsSearchDto';
import { environment } from './../../environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GenericResponse } from '../Models/Responses/GenericResponse';
import { UpdateAdminDto } from '../Models/DTOs/UpdateAdminDto';
import { AdminsDto } from '../Models/DTOs/AdminsDto';
import { RegisterDto } from '../Models/DTOs/RegisterDto';

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  count: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAdmins(searchDto: AdminsSearchDto): Observable<GenericResponse<PaginatedResponse<AdminsDto>>> {
    return this.http.post<GenericResponse<PaginatedResponse<AdminsDto>>>(`${this.apiUrl}/api/Admins/GetAllAdmins`, searchDto).pipe(
      tap(response => {
        if (!response || !response.data) {
          console.warn('AdminService - getAdmins: Response or response.data is null/undefined');
        }
      }),
      catchError(this.handleError)
    );
  }

  EditAdmin(updateAdminDto: UpdateAdminDto): Observable<GenericResponse<AdminsDto>> {
    const formData = new FormData();
    formData.append('Id', updateAdminDto.id);
    formData.append('FirstName', updateAdminDto.firstName);
    formData.append('LastName', updateAdminDto.lastName);
    if (updateAdminDto.image) {
      formData.append('Image', updateAdminDto.image);
    }

    console.log('AdminService - EditAdmin called with:', updateAdminDto);
    return this.http.put<GenericResponse<AdminsDto>>(`${this.apiUrl}/api/Admins/UpdateAdmin`, formData).pipe(
      tap(response => console.log('AdminService - EditAdmin response:', response)),
      catchError(this.handleError)
    );
  }

  GetAdminById(id: string): Observable<GenericResponse<AdminsDto>> {
    return this.http.get<GenericResponse<AdminsDto>>(`${this.apiUrl}/api/Admins/GetAdminById/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  DeleteAdmin(id: string): Observable<GenericResponse<AdminsDto>> {
    return this.http.delete<GenericResponse<AdminsDto>>(`${this.apiUrl}/api/Admins/DeleteAdmin/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Profile-specific methods
  getAdminById(id: string): Observable<GenericResponse<AdminsDto>> {
    return this.http.get<GenericResponse<AdminsDto>>(`${this.apiUrl}/api/Admins/GetAdminById/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateAdmin(updateData: any): Observable<GenericResponse<AdminsDto>> {
    const formData = new FormData();
    formData.append('Id', updateData.id);
    formData.append('FirstName', updateData.firstName || '');
    formData.append('LastName', updateData.lastName || '');
    formData.append('Phone', updateData.phone || '');

    // Include image file if provided
    if (updateData.image) {
      formData.append('Image', updateData.image);
    }

    return this.http.put<GenericResponse<AdminsDto>>(`${this.apiUrl}/api/Admins/UpdateAdmin`, formData).pipe(
      catchError(this.handleError)
    );
  }

  uploadProfilePicture(formData: FormData): Observable<GenericResponse<any>> {
    return this.http.post<GenericResponse<any>>(`${this.apiUrl}/api/Admins/UploadProfilePicture`, formData).pipe(
      catchError(this.handleError)
    );
  }

  RegisterAdmin(registerAdminDto: RegisterDto): Observable<GenericResponse<string>> {
    return this.http.post<GenericResponse<string>>(`${this.apiUrl}/api/Admins/AddAdmin`, registerAdminDto).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('AdminService - Error occurred:', error);
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
