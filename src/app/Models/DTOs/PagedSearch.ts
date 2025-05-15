export interface PagedSearch {
  PageNumber: number;
  PageSize: number;
  SortColumn?: string;
  SortDirection?: 'asc' | 'desc';
}

