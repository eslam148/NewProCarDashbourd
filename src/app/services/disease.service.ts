import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap, retry, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { GenericResponse } from '../Models/Responses/GenericResponse';
import { DiseaseDto } from '../Models/DTOs/DiseaseDto';
import { Status } from '../Enums/Status.enum';
import { PaginatedResponse } from '../Models/Responses/PaginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class DiseaseService {
  private apiUrl = environment.apiUrl;

  // Headers for API requests
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    // Check API connectivity on service init
   }



  /**
   * Get all diseases with pagination
   */
  getAll(pageNumber: number, pageSize: number): Observable<GenericResponse<PaginatedResponse<DiseaseDto>>> {
    const url = `${this.apiUrl}/api/Disease/GetAll`;
    const body = { pageNumber, pageSize };

    // Use direct API response which is already in the correct format
    return this.http.post<any>(url, body, this.httpOptions);

  }

  /**
   * Get disease by ID
   */
  getById(id: string): Observable<GenericResponse<DiseaseDto>> {
    const url = `${this.apiUrl}/api/Disease/GetById/${id}`;

    return this.http.get<GenericResponse<DiseaseDto>>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<DiseaseDto>('getById'))
      );
  }

  /**
   * Add a new disease
   */
  add(disease: DiseaseDto): Observable<GenericResponse<DiseaseDto>> {
    const url = `${this.apiUrl}/api/Disease/Add`;

    return this.http.post<GenericResponse<DiseaseDto>>(url, disease, this.httpOptions)
      .pipe(
        catchError(this.handleError<DiseaseDto>('add'))
      );
  }

  /**
   * Update an existing disease
   */
  update(disease: DiseaseDto): Observable<GenericResponse<DiseaseDto>> {
    const url = `${this.apiUrl}/api/Disease/Update`;

    return this.http.put<GenericResponse<DiseaseDto>>(url, disease, this.httpOptions)
      .pipe(
        catchError(this.handleError<DiseaseDto>('update'))
      );
  }

  /**
   * Delete a disease by ID
   */
  delete(id: string): Observable<GenericResponse<any>> {
    const url = `${this.apiUrl}/api/Disease/Delete/${id}`;

    return this.http.delete<GenericResponse<any>>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('delete'))
      );
  }

  /**
   * Generic error handler for API calls
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<GenericResponse<T>> => {
      // Log the error
      console.error(`${operation} failed: ${error.message}`);

      // If the error is related to connection issues, prepare a more friendly message
      const errorMessage = error.status === 0
        ? 'Cannot connect to the server. Please check your connection'
        : error.error?.message || error.message || 'An error occurred';

      // Return an observable with a user-facing error message
      return of({
        status: Status.Error,
        subStatus: error.status,
        message: errorMessage,
        internalMessage: `Error in ${operation}: ${error.message}`,
        data: result as T
      });
    };
  }
}
