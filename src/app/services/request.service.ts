import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { RequestSearchDto } from '../Models/DTOs/RequestSearchDto';
import { GenericResponse } from '../Models/Responses/GenericResponse';
import { PaginatedResponse } from '../Models/Responses/PaginatedResponse';
import { GetMobileRequestDto } from '../Models/DTOs/GetMobileRequestDto';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllCurrentRequests(searchDto: RequestSearchDto): Observable<GenericResponse<PaginatedResponse<GetMobileRequestDto>>> {
    return this.http.post<GenericResponse<PaginatedResponse<GetMobileRequestDto>>>(
      `${this.apiUrl}/api/Request/Admin/GetAllCurrentRequests`,
      searchDto
    );
  }

  getAllPreviousRequests(searchDto: RequestSearchDto): Observable<GenericResponse<PaginatedResponse<GetMobileRequestDto>>> {
    return this.http.post<GenericResponse<PaginatedResponse<GetMobileRequestDto>>>(
      `${this.apiUrl}/api/Request/Admin/GetAllPreviousRequests`,
      searchDto
    );
  }
}
