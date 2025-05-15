export interface ServiceSubCategoryDto {
  id?: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: number;
  icon?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
