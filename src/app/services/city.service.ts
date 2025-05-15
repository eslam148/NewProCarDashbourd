import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { CityDto } from '../Models/DTOs/CityDto';
import { GenericResponse } from '../Models/Responses/GenericResponse';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllCities(): Observable<GenericResponse<CityDto[]>> {
    return this.http.get<GenericResponse<CityDto[]>>(`${this.apiUrl}/api/City/GetAllCities`);
  }

  getCityById(id: number): Observable<GenericResponse<CityDto>> {
    return this.http.get<GenericResponse<CityDto>>(`${this.apiUrl}/api/City/GetCityById/${id}`);
  }

  addCity(city: CityDto): Observable<GenericResponse<CityDto>> {
    return this.http.post<GenericResponse<CityDto>>(`${this.apiUrl}/api/City/AddCity`, city);
  }

  updateCity(city: CityDto): Observable<GenericResponse<CityDto>> {
    return this.http.put<GenericResponse<CityDto>>(`${this.apiUrl}/api/City/UpdateCity`, city);
  }

  deleteCity(id: number): Observable<GenericResponse<any>> {
    return this.http.delete<GenericResponse<any>>(`${this.apiUrl}/api/City/DeleteCity?id=${id}`);
  }

  getCityByGovernorateId(governorateId: number): Observable<GenericResponse<CityDto[]>> {
    return this.http.get<GenericResponse<CityDto[]>>(`${this.apiUrl}/api/City/GetCityByGovernorateId/${governorateId}`);
  }
}
