import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DiseaseService } from './disease.service';
import { environment } from '../../environments/environment';
import { DiseaseDto } from '../Models/DTOs/DiseaseDto';
import { GenericResponse } from '../Models/Responses/GenericResponse';
import { Status } from '../Enums/Status.enum';

describe('DiseaseService', () => {
  let service: DiseaseService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DiseaseService]
    });
    service = TestBed.inject(DiseaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all diseases with pagination', () => {
      const mockResponse: GenericResponse<DiseaseDto[]> = {
        status: Status.Success,
        subStatus: 200,
        message: 'Success',
        internalMessage: 'Success',
        data: [
          { id: '1', nameEn: 'Flu', nameAr: 'إنفلونزا' },
          { id: '2', nameEn: 'Cold', nameAr: 'زكام' }
        ]
      };

      service.getAll(1, 10).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/api/Disease/GetAll`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ pageNumber: 1, pageSize: 10 });
      req.flush(mockResponse);
    });
  });

  describe('getById', () => {
    it('should return a disease by id', () => {
      const mockResponse: GenericResponse<DiseaseDto> = {
        status: Status.Success,
        subStatus: 200,
        message: 'Success',
        internalMessage: 'Success',
        data: { id: '1', nameEn: 'Flu', nameAr: 'إنفلونزا' }
      };

      service.getById('1').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/api/Disease/GetById/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('add', () => {
    it('should add a new disease', () => {
      const disease: DiseaseDto = { nameEn: 'Flu', nameAr: 'إنفلونزا' };
      const mockResponse: GenericResponse<DiseaseDto> = {
        status: Status.Success,
        subStatus: 200,
        message: 'Success',
        internalMessage: 'Success',
        data: { id: '1', ...disease }
      };

      service.add(disease).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/api/Disease/Add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(disease);
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should update an existing disease', () => {
      const disease: DiseaseDto = { id: '1', nameEn: 'Flu Updated', nameAr: 'إنفلونزا محدثة' };
      const mockResponse: GenericResponse<DiseaseDto> = {
        status: Status.Success,
        subStatus: 200,
        message: 'Success',
        internalMessage: 'Success',
        data: disease
      };

      service.update(disease).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/api/Disease/Update`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(disease);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a disease', () => {
      const mockResponse: GenericResponse<any> = {
        status: Status.Success,
        subStatus: 200,
        message: 'Success',
        internalMessage: 'Success',
        data: null
      };

      service.delete('1').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/api/Disease/Delete/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
