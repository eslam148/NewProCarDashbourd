import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ServiceCatalogService } from '../../services/service-catalog.service';
import * as ServiceCatalogActions from './service-catalog.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ServiceCatalogDto } from '../../Models/DTOs/ServiceCatalogDto';

@Injectable()
export class ServiceCatalogEffects {
  addService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCatalogActions.addService),
      mergeMap(({ service }) =>
        this.service.addService(service).pipe(
          map(newService => ServiceCatalogActions.addServiceSuccess({ service: newService })),
          catchError(error => of(ServiceCatalogActions.addServiceFailure({ error })))
        )
      )
    )
  );

  updateService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCatalogActions.updateService),
      mergeMap(({ service }) =>
        this.service.updateService(service).pipe(
          map(updatedService => ServiceCatalogActions.updateServiceSuccess({ service: updatedService })),
          catchError(error => of(ServiceCatalogActions.updateServiceFailure({ error })))
        )
      )
    )
  );

  loadAllServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCatalogActions.loadAllServices),
      mergeMap(({ page, pageSize, searchKey }) =>
        this.service.getAllServices({ SearchKey: searchKey || '', PageNumber: page, PageSize: pageSize }).pipe(
          map(response => ServiceCatalogActions.loadAllServicesSuccess({ services: response.items, totalCount: response.totalCount })),
          catchError(error => of(ServiceCatalogActions.loadAllServicesFailure({ error })))
        )
      )
    )
  );

  deleteService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCatalogActions.deleteService),
      mergeMap(({ id }) =>
        this.service.deleteService(id).pipe(
          map(() => ServiceCatalogActions.deleteServiceSuccess({ id })),
          catchError(error => of(ServiceCatalogActions.deleteServiceFailure({ error })))
        )
      )
    )
  );

  getServiceById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCatalogActions.getServiceById),
      mergeMap(({ id }) =>
        this.service.getServiceById(id).pipe(
          map(service => ServiceCatalogActions.getServiceByIdSuccess({ service })),
          catchError(error => of(ServiceCatalogActions.getServiceByIdFailure({ error })))
        )
      )
    )
  );

  loadMobileServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCatalogActions.loadMobileServices),
      mergeMap(() =>
        this.service.getMobileServices().pipe(
          map(services => ServiceCatalogActions.loadMobileServicesSuccess({ services })),
          catchError(error => of(ServiceCatalogActions.loadMobileServicesFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private service: ServiceCatalogService) {}
}
