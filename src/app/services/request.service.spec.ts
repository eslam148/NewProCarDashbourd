import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RequestService } from './request.service';
import { RequestSearchDto } from '../Models/DTOs/RequestSearchDto';
import { GenericResponse } from '../Models/Responses/GenericResponse';
import { PaginatedResponse } from '../Models/Responses/PaginatedResponse';
import { GetMobileRequestDto } from '../Models/DTOs/GetMobileRequestDto';
import { environment } from '../../environments/environment.prod';

describe('RequestService', () => {
  let service: RequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestService]
    });
    service = TestBed.inject(RequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all current requests', () => {
    const mockSearchDto: RequestSearchDto = {
      pageNumber: 1,
      pageSize: 10,
      fromDate: '2024-01-01',
      toDate: '2024-12-31'
    };

    const mockResponse: GenericResponse<PaginatedResponse<GetMobileRequestDto>> = {
      message: 'Success',
      data: {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0
      }
    };

    service.getAllCurrentRequests(mockSearchDto).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.message).toBe('Success');
      expect(response.data.items).toEqual([]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Request/Admin/GetAllCurrentRequests`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSearchDto);
    req.flush(mockResponse);
  });

  it('should get all previous requests', () => {
    const mockSearchDto: RequestSearchDto = {
      pageNumber: 1,
      pageSize: 10,
      fromDate: '2024-01-01',
      toDate: '2024-12-31'
    };

    const mockResponse: GenericResponse<PaginatedResponse<GetMobileRequestDto>> = {
      message: 'Success',
      data: {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0
      }
    };

    service.getAllPreviousRequests(mockSearchDto).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.message).toBe('Success');
      expect(response.data.items).toEqual([]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Request/Admin/GetAllPreviousRequests`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSearchDto);
    req.flush(mockResponse);
  });

  it('should handle error in getAllCurrentRequests', () => {
    const mockSearchDto: RequestSearchDto = {
      pageNumber: 1,
      pageSize: 10,
      fromDate: '2024-01-01',
      toDate: '2024-12-31'
    };

    const mockErrorResponse = {
      message: 'Error occurred',
      data: null
    };

    service.getAllCurrentRequests(mockSearchDto).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Request/Admin/GetAllCurrentRequests`);
    expect(req.request.method).toBe('POST');
    req.flush(mockErrorResponse, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error in getAllPreviousRequests', () => {
    const mockSearchDto: RequestSearchDto = {
      pageNumber: 1,
      pageSize: 10,
      fromDate: '2024-01-01',
      toDate: '2024-12-31'
    };

    const mockErrorResponse = {
      message: 'Error occurred',
      data: null
    };

    service.getAllPreviousRequests(mockSearchDto).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/Request/Admin/GetAllPreviousRequests`);
    expect(req.request.method).toBe('POST');
    req.flush(mockErrorResponse, { status: 500, statusText: 'Internal Server Error' });
  });
});
