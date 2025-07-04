export interface AppVersionDto {
  id: number;
  version: string;
  platformName: string;
  platformType: number;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  modifiedBy: string;
}

export interface CreateAppVersionDto {
  version: string;
  platform: number;
}

export interface UpdateAppVersionDto {
  id: number;
  version: string;
  platform: number;
}

export interface ForceUpdateDto {
  version: string;
  platform: number;
}

export interface AppVersionSearchDto {
  pageNumber?: number;
  pageSize?: number;
  platform?: number;
  version?: string;
}

export enum PlatformType {
  IOS = 1,
  Android = 2
}

export const PlatformNames = {
  [PlatformType.IOS]: 'iOS',
  [PlatformType.Android]: 'Android'
};
