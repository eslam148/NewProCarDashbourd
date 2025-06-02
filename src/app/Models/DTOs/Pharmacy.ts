export interface PharmacyModel {
  id?: number;
  name: string;
  phoneNumber: string;
  lineNumber: string;
  email: string;
  latitude: string;
  longitude: string;
  cityId: number;
  governorateId: number;
  notes: string;
  addressNotes?: string;
}
export interface PharmacyResponseModel { 
  id: number;
  name: string;
  phoneNumber: string;
  lineNumber: string;
  email: string;
  latitude: string;
  longitude: string;
  cityId: number;
  governorateId: number;
  notes: string;
  addressNotes?: string;
}

export interface GetAllPharmaciesRequest {
  pageNumber: number;
  pageSize: number;
  searchText: string;
  cityId: number;
}
