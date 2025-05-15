import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { GovernorateService } from '../../services/governorate.service';
import * as GovernorateActions from './governorate.actions';

@Injectable()
export class GovernorateEffects {
  constructor(
    private actions$: Actions,
    private governorateService: GovernorateService
  ) {}

  loadGovernorates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GovernorateActions.loadGovernorates),
      mergeMap(() =>
        this.governorateService.getAllGovernorates().pipe(
          map(response => GovernorateActions.loadGovernoratesSuccess({ governorates: response.data })),
          catchError(error => of(GovernorateActions.loadGovernoratesFailure({ error })))
        )
      )
    )
  );

  loadGovernorateById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GovernorateActions.loadGovernorateById),
      mergeMap(({ id }) =>
        this.governorateService.getGovernorateById(id).pipe(
          map(response => GovernorateActions.loadGovernorateByIdSuccess({ governorate: response.data })),
          catchError(error => of(GovernorateActions.loadGovernorateByIdFailure({ error })))
        )
      )
    )
  );

  addGovernorate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GovernorateActions.addGovernorate),
      mergeMap(({ governorate }) =>
        this.governorateService.addGovernorate(governorate).pipe(
          map(response => GovernorateActions.addGovernorateSuccess({ governorate: response.data })),
          catchError(error => of(GovernorateActions.addGovernorateFailure({ error })))
        )
      )
    )
  );

  updateGovernorate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GovernorateActions.updateGovernorate),
      mergeMap(({ governorate }) =>
        this.governorateService.updateGovernorate(governorate).pipe(
          map(response => GovernorateActions.updateGovernorateSuccess({ governorate: response.data })),
          catchError(error => of(GovernorateActions.updateGovernorateFailure({ error })))
        )
      )
    )
  );

  deleteGovernorate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GovernorateActions.deleteGovernorate),
      mergeMap(({ id }) =>
        this.governorateService.deleteGovernorate(id).pipe(
          map(() => GovernorateActions.deleteGovernorateSuccess({ id })),
          catchError(error => of(GovernorateActions.deleteGovernorateFailure({ error })))
        )
      )
    )
  );
}
