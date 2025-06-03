export interface ReportModel {
  id: string;
  drugs: string;
  notes: string;
  createdAt: string;
  patientName: string;
  patientPhone: string;
  patientId: string;
  nurseName: string;
  nursePhone: string;
  nurseId: string;
  diseases: DiseaseModel[];
}

export interface DiseaseModel {
  id: string;
  name: string;
}

export interface ReportFilterModel {
  pageNumber: number;
  pageSize: number;
  fromDate?: string;
  toDate?: string;
}

export interface AddOrUpdateReportModel {
  requestId: string;
  drugs: string;
  notes: string;
  diseasesIds: string[];
  serviceIds: number[];
}

export interface ReportResponseModel {
  status: number;
  message: string;
  internalMessage: string | null;
  data: {
    items: ReportModel[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    count: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  subStatus: number;
}

export interface PatientReportResponseModel {
  status: number;
  message: string;
  internalMessage: string | null;
  data: ReportModel[];
  subStatus: number;
}
