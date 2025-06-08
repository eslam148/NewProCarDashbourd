import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { GenericResponse } from '../Models/Responses/GenericResponse';

export interface ChangeLanguageResponse {
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Change user's preferred language
   * @param language - Language code (1 for Arabic, 2 for English)
   * @returns Observable with API response
   */
  changeLanguage(language: number): Observable<GenericResponse<ChangeLanguageResponse>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': '*/*'
    });

    const url = `${this.apiUrl}/api/Profile/ChangeLanguage?language=${language}`;
    
    return this.http.put<GenericResponse<ChangeLanguageResponse>>(url, {}, { headers });
  }

  /**
   * Map language string to API language code
   * @param languageCode - Language code ('ar' or 'en')
   * @returns API language number (1 for Arabic, 2 for English)
   */
  mapLanguageToApiCode(languageCode: string): number {
    return languageCode === 'ar' ? 1 : 2;
  }

  /**
   * Map API language code to language string
   * @param apiCode - API language code (1 or 2)
   * @returns Language string ('ar' or 'en')
   */
  mapApiCodeToLanguage(apiCode: number): string {
    return apiCode === 1 ? 'ar' : 'en';
  }
}
