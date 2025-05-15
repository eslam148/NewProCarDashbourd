export interface GetMobileRequestDto {
  id: string;
  nurseName: string;
  nursePicture: string;
  phoneNumber: string;
  nurseId: string;
  status: string;
  speciality: string;
  longitude?: string;
  latitude?: string;
  nurseLongitude?: string;
  nurseLatitude?: string;
  createdAt?: string; // ISO string or Date
  totalPrice: number;
}
