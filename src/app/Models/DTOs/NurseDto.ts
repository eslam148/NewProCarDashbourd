export interface NurseDto {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  rate: number | null;
  specialization: string;
  specializationId: number;
  imageUrl: string;
  governorate: string;
  governorateId: number;
  city: string;
  cityId: number;
  latitude: string;
  longitude: string;
  licenseNumber: string;
  reviews:ReviewDto[];
}
export interface ReviewDto{
  id:number;
  comment: string ;
  rating: number ;
  patientName:string;
  createdAt: Date;
  isUsedInPublic: boolean;
}

