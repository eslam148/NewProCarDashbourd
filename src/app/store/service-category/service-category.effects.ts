import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ServiceCategoryService } from '../../services/service-category.service';
import * as ServiceCategoryActions from './service-category.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { GenericResponse } from '../../Models/Responses/GenericResponse';
import { ServiceCategoryDto } from '../../Models/DTOs/ServiceCategoryDto';

@Injectable()
export class ServiceCategoryEffects {
  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCategoryActions.addCategory),
      mergeMap(({ category }) =>
        this.service.addCategory(category).pipe(
          map((response: GenericResponse<ServiceCategoryDto>) => ServiceCategoryActions.addCategorySuccess({ category: response.data })),
          catchError(error => of(ServiceCategoryActions.addCategoryFailure({ error })))
        )
      )
    )
  );

  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCategoryActions.updateCategory),
      mergeMap(({ category }) =>
        this.service.updateCategory(category).pipe(
          map((response: GenericResponse<ServiceCategoryDto>) => ServiceCategoryActions.updateCategorySuccess({ category: response.data })),
          catchError(error => of(ServiceCategoryActions.updateCategoryFailure({ error })))
        )
      )
    )
  );

  loadAllCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCategoryActions.loadAllCategories),
      mergeMap(() =>
        this.service.getAllCategories().pipe(
          map((response: GenericResponse<ServiceCategoryDto[]>) => ServiceCategoryActions.loadAllCategoriesSuccess({ categories: response.data })),
          catchError(error => of(ServiceCategoryActions.loadAllCategoriesFailure({ error })))
        )
      )
    )
  );

  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCategoryActions.deleteCategory),
      mergeMap(({ id }) =>
        this.service.deleteCategory(id).pipe(
          map(() => ServiceCategoryActions.deleteCategorySuccess({ id })),
          catchError(error => of(ServiceCategoryActions.deleteCategoryFailure({ error })))
        )
      )
    )
  );

  getCategoryById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCategoryActions.getCategoryById),
      mergeMap(({ id }) =>
        this.service.getCategoryById(id).pipe(
          map((response: GenericResponse<ServiceCategoryDto>) => ServiceCategoryActions.getCategoryByIdSuccess({ category: response.data })),
          catchError(error => of(ServiceCategoryActions.getCategoryByIdFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private service: ServiceCategoryService) {}
}
