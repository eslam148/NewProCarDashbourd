import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService, ChangeLanguageResponse } from './profile.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { GenericResponse } from '../Models/Responses/GenericResponse';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProfileService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change language via API', () => {
    const mockToken = 'mock-jwt-token';
    const mockResponse: GenericResponse<ChangeLanguageResponse> = {
      status: 0,
      message: 'Language changed successfully',
      data: {
        message: 'Language preference updated',
        success: true
      }
    };

    authServiceSpy.getToken.and.returnValue(mockToken);

    service.changeLanguage(2).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Profile/ChangeLanguage?language=2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.headers.get('Accept')).toBe('*/*');
    req.flush(mockResponse);
  });

  it('should map language codes correctly', () => {
    expect(service.mapLanguageToApiCode('ar')).toBe(1);
    expect(service.mapLanguageToApiCode('en')).toBe(2);
    expect(service.mapLanguageToApiCode('fr')).toBe(2); // defaults to English
  });

  it('should map API codes to language strings correctly', () => {
    expect(service.mapApiCodeToLanguage(1)).toBe('ar');
    expect(service.mapApiCodeToLanguage(2)).toBe('en');
    expect(service.mapApiCodeToLanguage(3)).toBe('en'); // defaults to English
  });

  it('should handle API error', () => {
    const mockToken = 'mock-jwt-token';
    authServiceSpy.getToken.and.returnValue(mockToken);

    service.changeLanguage(1).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Profile/ChangeLanguage?language=1`);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
