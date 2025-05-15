import { LoginResponse } from './../Models/Responses/LoginResponse';
import { LoginDto } from './../Models/DTOs/LoginDto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';
import { GenericResponse } from '../Models/Responses/GenericResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  Login(loginDto: LoginDto): Observable<GenericResponse<LoginResponse>> {
    return this.http.post<GenericResponse<LoginResponse>>(`${this.apiUrl}/api/Auth/Login`, loginDto);
  }
}
