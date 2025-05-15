import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CityService } from '../../services/city.service';
import * as CityActions from './city.actions';

@Injectable()
export class CityEffects {
  constructor(
    private actions$: Actions,
    private cityService: CityService
  ) {}

  loadCities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CityActions.loadCities),
      mergeMap(() =>
        this.cityService.getAllCities().pipe(
          map(response => CityActions.loadCitiesSuccess({ cities: response.data })),
          catchError(error => of(CityActions.loadCitiesFailure({ error })))
        )
      )
    )
  );

  loadCityById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CityActions.loadCityById),
      mergeMap(({ id }) =>
        this.cityService.getCityById(id).pipe(
          map(response => CityActions.loadCityByIdSuccess({ city: response.data })),
          catchError(error => of(CityActions.loadCityByIdFailure({ error })))
        )
      )
    )
  );

  addCity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CityActions.addCity),
      mergeMap(({ city }) =>
        this.cityService.addCity(city).pipe(
          map(response => CityActions.addCitySuccess({ city: response.data })),
          catchError(error => of(CityActions.addCityFailure({ error })))
        )
      )
    )
  );

  updateCity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CityActions.updateCity),
      mergeMap(({ city }) =>
        this.cityService.updateCity(city).pipe(
          map(response => CityActions.updateCitySuccess({ city: response.data })),
          catchError(error => of(CityActions.updateCityFailure({ error })))
        )
      )
    )
  );

  deleteCity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CityActions.deleteCity),
      mergeMap(({ id }) =>
        this.cityService.deleteCity(id).pipe(
          map(() => CityActions.deleteCitySuccess({ id })),
          catchError(error => of(CityActions.deleteCityFailure({ error })))
        )
      )
    )
  );

  loadCitiesByGovernorateId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CityActions.loadCitiesByGovernorateId),
      mergeMap(({ governorateId }) =>
        this.cityService.getCityByGovernorateId(governorateId).pipe(
          map(response => CityActions.loadCitiesByGovernorateIdSuccess({ cities: response.data })),
          catchError(error => of(CityActions.loadCitiesByGovernorateIdFailure({ error })))
        )
      )
    )
  );
}
