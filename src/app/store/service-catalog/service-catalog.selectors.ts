import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ServiceCatalogState } from './service-catalog.reducer';

export const selectServiceCatalogState = createFeatureSelector<ServiceCatalogState>('serviceCatalog');

export const selectAllServices = createSelector(
  selectServiceCatalogState,
  (state: ServiceCatalogState) => Array.isArray(state.services) ? state.services : []
);

export const selectServiceCatalogLoading = createSelector(
  selectServiceCatalogState,
  (state: ServiceCatalogState) => state.loading
);

export const selectServiceCatalogError = createSelector(
  selectServiceCatalogState,
  (state: ServiceCatalogState) => state.error
);

export const selectSelectedService = createSelector(
  selectServiceCatalogState,
  (state: ServiceCatalogState) => state.selectedService
);
