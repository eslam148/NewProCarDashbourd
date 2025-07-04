import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AppVersionDto,
  CreateAppVersionDto,
  UpdateAppVersionDto,
  ForceUpdateDto,
  AppVersionSearchDto
} from '../Models/DTOs/AppVersionDto';
import { PaginatedResponse } from '../Models/Responses/PaginatedResponse';
import { GenericResponse } from '../Models/Responses/GenericResponse';

@Injectable({
  providedIn: 'root'
})
export class AppVersionService {
  private readonly baseUrl = `${environment.apiUrl}/api/AppVersion`;

  constructor(private http: HttpClient) {}

  /**
   * Get all app versions
   */
  getAllVersions(): Observable<GenericResponse<AppVersionDto[]>> {
    return this.http.get<GenericResponse<AppVersionDto[]>>(`${this.baseUrl}/GetAllVersions`);
  }

  /**
   * Get app version by ID
   */
  getVersionById(id: number): Observable<GenericResponse<AppVersionDto>> {
    return this.http.get<GenericResponse<AppVersionDto>>(`${this.baseUrl}/GetVersionById`, {
      params: { id: id.toString() }
    });
  }

  /**
   * Get paginated app versions with search
   */
  getVersionsPaginated(searchDto: AppVersionSearchDto): Observable<PaginatedResponse<AppVersionDto>> {
    let params = new HttpParams();

    if (searchDto.pageNumber) {
      params = params.set('pageNumber', searchDto.pageNumber.toString());
    }
    if (searchDto.pageSize) {
      params = params.set('pageSize', searchDto.pageSize.toString());
    }
    if (searchDto.platform) {
      params = params.set('platform', searchDto.platform.toString());
    }
    if (searchDto.version) {
      params = params.set('version', searchDto.version);
    }

    return this.http.get<PaginatedResponse<AppVersionDto>>(`${this.baseUrl}/GetVersionsPaginated`, { params });
  }

  /**
   * Add new app version
   */
  addNewVersion(createDto: CreateAppVersionDto): Observable<GenericResponse<AppVersionDto>> {
    return this.http.post<GenericResponse<AppVersionDto>>(`${this.baseUrl}/AddNewVersion`, createDto);
  }

  /**
   * Update existing app version
   */
  updateVersion(updateDto: UpdateAppVersionDto): Observable<GenericResponse<AppVersionDto>> {
    return this.http.put<GenericResponse<AppVersionDto>>(`${this.baseUrl}/UpdateVersion`, updateDto);
  }

  /**
   * Delete app version
   */
  deleteVersion(id: number): Observable<GenericResponse<any>> {
    return this.http.delete<GenericResponse<any>>(`${this.baseUrl}/DeleteVersion`, {
      params: { id: id.toString() }
    });
  }

  /**
   * Force update for a specific version and platform
   */
  forceUpdate(forceUpdateDto: ForceUpdateDto): Observable<GenericResponse<any>> {
    return this.http.post<GenericResponse<any>>(`${this.baseUrl}/ForceUpdate`, forceUpdateDto);
  }

  /**
   * Get current latest version for a platform
   */
  getLatestVersion(platform: number): Observable<GenericResponse<AppVersionDto>> {
    return this.http.get<GenericResponse<AppVersionDto>>(`${this.baseUrl}/GetLatestVersion`, {
      params: { platform: platform.toString() }
    });
  }

  /**
   * Check if update is available for a specific version and platform
   */
  checkUpdateAvailable(currentVersion: string, platform: number): Observable<GenericResponse<boolean>> {
    return this.http.get<GenericResponse<boolean>>(`${this.baseUrl}/CheckUpdateAvailable`, {
      params: {
        currentVersion: currentVersion,
        platform: platform.toString()
      }
    });
  }
}
