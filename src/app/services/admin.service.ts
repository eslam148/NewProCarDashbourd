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
    console.log('AdminService - getAdmins called with:', searchDto);
    console.log('API URL:', `${this.apiUrl}/api/Admins/GetAllAdmins`);

    return this.http.post<GenericResponse<PaginatedResponse<AdminsDto>>>(`${this.apiUrl}/api/Admins/GetAllAdmins`, searchDto).pipe(
      tap(response => {
        console.log('AdminService - getAdmins response:', response);
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
    console.log('AdminService - GetAdminById called with:', id);
    return this.http.get<GenericResponse<AdminsDto>>(`${this.apiUrl}/api/Admins/GetAdminById/${id}`).pipe(
      tap(response => console.log('AdminService - GetAdminById response:', response)),
      catchError(this.handleError)
    );
  }

  DeleteAdmin(id: string): Observable<GenericResponse<AdminsDto>> {
    console.log('AdminService - DeleteAdmin called with:', id);
    return this.http.delete<GenericResponse<AdminsDto>>(`${this.apiUrl}/api/Admins/DeleteAdmin/${id}`).pipe(
      tap(response => console.log('AdminService - DeleteAdmin response:', response)),
      catchError(this.handleError)
    );
  }

  RegisterAdmin(registerAdminDto: RegisterDto): Observable<GenericResponse<string>> {
    console.log('AdminService - RegisterAdmin called with:', registerAdminDto);
    return this.http.post<GenericResponse<string>>(`${this.apiUrl}/api/Admins/AddAdmin`, registerAdminDto).pipe(
      tap(response => console.log('AdminService - RegisterAdmin response:', response)),
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
