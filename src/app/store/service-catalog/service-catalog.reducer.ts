import { createReducer, on } from '@ngrx/store';
import * as ServiceCatalogActions from './service-catalog.actions';
import { ServiceCatalogDto } from '../../Models/DTOs/ServiceCatalogDto';

export interface ServiceCatalogState {
  services: ServiceCatalogDto[];
  selectedService: ServiceCatalogDto | null;
  loading: boolean;
  error: any;
}

export const initialState: ServiceCatalogState = {
  services: [],
  selectedService: null,
  loading: false,
  error: null
};

export const serviceCatalogReducer = createReducer(
  initialState,
  on(
    ServiceCatalogActions.addService,
    ServiceCatalogActions.updateService,
    ServiceCatalogActions.loadAllServices,
    ServiceCatalogActions.deleteService,
    ServiceCatalogActions.getServiceById,
    ServiceCatalogActions.loadMobileServices,
    state => ({ ...state, loading: true })
  ),
  on(ServiceCatalogActions.addServiceSuccess, (state, { service }) => ({
    ...state,
    loading: false,
    services: [...state.services, service]
  })),
  on(ServiceCatalogActions.updateServiceSuccess, (state, { service }) => ({
    ...state,
    loading: false,
    services: state.services.map(s => s.id === service.id ? service : s)
  })),
  on(ServiceCatalogActions.loadAllServicesSuccess, (state, { services }) => ({
    ...state,
    loading: false,
    services
  })),
  on(ServiceCatalogActions.deleteServiceSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    services: state.services.filter(s => s.id !== id)
  })),
  on(ServiceCatalogActions.getServiceByIdSuccess, (state, { service }) => ({
    ...state,
    loading: false,
    selectedService: service
  })),
  on(ServiceCatalogActions.loadMobileServicesSuccess, (state, { services }) => ({
    ...state,
    loading: false,
    services
  })),
  on(
    ServiceCatalogActions.addServiceFailure,
    ServiceCatalogActions.updateServiceFailure,
    ServiceCatalogActions.loadAllServicesFailure,
    ServiceCatalogActions.deleteServiceFailure,
    ServiceCatalogActions.getServiceByIdFailure,
    ServiceCatalogActions.loadMobileServicesFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
