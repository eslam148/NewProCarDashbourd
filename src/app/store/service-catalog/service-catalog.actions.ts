import { createAction, props } from '@ngrx/store';
import { ServiceCatalogDto } from '../../Models/DTOs/ServiceCatalogDto';

export const addService = createAction('[ServiceCatalog] Add Service', props<{ service: ServiceCatalogDto }>());
export const addServiceSuccess = createAction('[ServiceCatalog] Add Service Success', props<{ service: ServiceCatalogDto }>());
export const addServiceFailure = createAction('[ServiceCatalog] Add Service Failure', props<{ error: any }>());

export const updateService = createAction('[ServiceCatalog] Update Service', props<{ service: ServiceCatalogDto }>());
export const updateServiceSuccess = createAction('[ServiceCatalog] Update Service Success', props<{ service: ServiceCatalogDto }>());
export const updateServiceFailure = createAction('[ServiceCatalog] Update Service Failure', props<{ error: any }>());

export const loadAllServices = createAction('[ServiceCatalog] Load All Services');
export const loadAllServicesSuccess = createAction('[ServiceCatalog] Load All Services Success', props<{ services: ServiceCatalogDto[] }>());
export const loadAllServicesFailure = createAction('[ServiceCatalog] Load All Services Failure', props<{ error: any }>());

export const deleteService = createAction('[ServiceCatalog] Delete Service', props<{ id: number }>());
export const deleteServiceSuccess = createAction('[ServiceCatalog] Delete Service Success', props<{ id: number }>());
export const deleteServiceFailure = createAction('[ServiceCatalog] Delete Service Failure', props<{ error: any }>());

export const getServiceById = createAction('[ServiceCatalog] Get Service By Id', props<{ id: number }>());
export const getServiceByIdSuccess = createAction('[ServiceCatalog] Get Service By Id Success', props<{ service: ServiceCatalogDto }>());
export const getServiceByIdFailure = createAction('[ServiceCatalog] Get Service By Id Failure', props<{ error: any }>());

export const loadMobileServices = createAction('[ServiceCatalog] Load Mobile Services');
export const loadMobileServicesSuccess = createAction('[ServiceCatalog] Load Mobile Services Success', props<{ services: ServiceCatalogDto[] }>());
export const loadMobileServicesFailure = createAction('[ServiceCatalog] Load Mobile Services Failure', props<{ error: any }>());
