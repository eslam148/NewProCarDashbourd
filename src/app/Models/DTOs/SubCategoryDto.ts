export interface SubCategoryDto {
  id?: number;
  fromCallCenter?: boolean;
  serviceCategoryId: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon?: File | null;
  iconUrl?: string | null;
}
