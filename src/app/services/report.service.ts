import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ReportModel,
  ReportFilterModel,
  AddOrUpdateReportModel,
  ReportResponseModel,
  PatientReportResponseModel
} from '../models/report.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly apiUrl = `${environment.apiUrl}/api/Report`;

  constructor(private http: HttpClient) {}

  /**
   * Get all reports with pagination and filters
   */
  getAllReports(filters: ReportFilterModel): Observable<ReportResponseModel> {
    const headers = this.getHeaders();
    return this.http.post<ReportResponseModel>(
      `${this.apiUrl}/GetAllReports`,
      filters,
      { headers }
    );
  }

  /**
   * Add or update report
   */
  addOrUpdateReport(report: AddOrUpdateReportModel): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/AddOrUpdateReport`,
      report,
      { headers }
    );
  }

  /**
   * Get report by patient ID
   */
  getReportByPatientId(patientId: string): Observable<PatientReportResponseModel> {
    const headers = this.getHeaders();
    return this.http.get<PatientReportResponseModel>(
      `${this.apiUrl}/Admin/GettById/${patientId}`,
      { headers }
    );
  }

  /**
   * Get authorization headers
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYjZhOTE3MC03YzY1LTRhNzUtODc5NS0xMzMxZTYzNTUyOGYiLCJqdGkiOiJjZDE2NTgzMS1lMDYwLTQwZmItOGNiNS0yMGMwMjFmODdiYTQiLCJ1c2VyTmFtZSI6IjAxMDk4MjA0NzA4Iiwicm9sZUlkIjoiMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZmlyc3ROYW1lIjoiRXNsYW0iLCJsYXN0TmFtZSI6Ik1vaGFtZWQiLCJwaG9uZU51bWJlciI6IjAxMDk4MjA0NzA4IiwiVXNlcklkIjoiZWI2YTkxNzAtN2M2NS00YTc1LTg3OTUtMTMzMWU2MzU1MjhmIiwiZXhwIjoxNzQ4OTczNjIyLCJpc3MiOiJQcm9DYXJlIiwiYXVkIjoiUHJvQ2FyZSJ9.bJ69W-CktGG6lgkpzPfhnmfFWskFJbxOwO1BCOktyI8';

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'accept': '*/*'
    });
  }

  /**
   * Format date for API
   */
  formatDateForApi(date: Date): string {
    return date.toISOString();
  }

  /**
   * Get mock diseases for dropdown (you can replace with actual API call)
   */
  getDiseases(): Observable<any[]> {
    // Mock data - replace with actual API call
    const mockDiseases = [
      { id: '66707958-7447-440f-e243-08dd91a53272', name: 'Hypertension (High Blood Pressure)' },
      { id: 'c7f846d0-d46a-41e8-540f-08dd91a9bfe2', name: 'Asthma' },
      { id: '8478fd64-83c5-45c2-5412-08dd91a9bfe2', name: 'Anemia' },
      { id: 'c2a9e8d2-5c7e-4147-e242-08dd91a53272', name: 'Nothing' }
    ];

    return new Observable(observer => {
      observer.next(mockDiseases);
      observer.complete();
    });
  }

  /**
   * Get mock services for dropdown (you can replace with actual API call)
   */
  getServices(): Observable<any[]> {
    // Mock data - replace with actual API call
    const mockServices = [
      { id: 1, name: 'Home Visit' },
      { id: 2, name: 'Medication Administration' },
      { id: 3, name: 'Health Monitoring' },
      { id: 4, name: 'Physical Therapy' }
    ];

    return new Observable(observer => {
      observer.next(mockServices);
      observer.complete();
    });
  }
}
