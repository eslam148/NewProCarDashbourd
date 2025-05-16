import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginDto } from '../Models/DTOs/LoginDto';
import { environment } from '../../environments/environment.prod';
import { GenericResponse } from '../Models/Responses/GenericResponse';
import { LoginResponse } from '../Models/Responses/LoginResponse';
import { LoginStatus } from '../Enums/LoginStatus';
import { Roles } from '../Enums/Roles.enum';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a POST request to login endpoint', () => {
    const mockLoginDto: LoginDto = {
      PhoneNumber: '1234567890',
      Password: 'password123'
    };

    const mockResponse: GenericResponse<LoginResponse> = {
      message: 'Login successful',
      data: {
        token: 'mock-token',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        birthOfDate: new Date(),
        role: Roles.Admin,
        loginStatus: LoginStatus.Success
      }
    };

    service.Login(mockLoginDto).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.message).toBe('Login successful');
      expect(response.data.token).toBe('mock-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Auth/Login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginDto);
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    const mockLoginDto: LoginDto = {
      PhoneNumber: '1234567890',
      Password: 'wrongpassword'
    };

    const mockErrorResponse = {
      message: 'Invalid credentials',
      data: null
    };

    service.Login(mockLoginDto).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Auth/Login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockErrorResponse, { status: 401, statusText: 'Unauthorized' });
  });
});
