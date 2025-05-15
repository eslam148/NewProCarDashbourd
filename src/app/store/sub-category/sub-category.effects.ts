import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SubCategoryService } from '../../services/sub-category.service';
import * as SubCategoryActions from './sub-category.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class SubCategoryEffects {
  addSubCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubCategoryActions.addSubCategory),
      mergeMap(({ subCategory }) =>
        this.service.addSubCategory(subCategory).pipe(
          map(newSubCategory => SubCategoryActions.addSubCategorySuccess({ subCategory: newSubCategory })),
          catchError(error => of(SubCategoryActions.addSubCategoryFailure({ error })))
        )
      )
    )
  );

  updateSubCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubCategoryActions.updateSubCategory),
      mergeMap(({ subCategory }) =>
        this.service.updateSubCategory(subCategory).pipe(
          map(updatedSubCategory => SubCategoryActions.updateSubCategorySuccess({ subCategory: updatedSubCategory })),
          catchError(error => of(SubCategoryActions.updateSubCategoryFailure({ error })))
        )
      )
    )
  );

  loadAllSubCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubCategoryActions.loadAllSubCategories),
      mergeMap(() =>
        this.service.getAllSubCategories().pipe(
          map(subCategories => SubCategoryActions.loadAllSubCategoriesSuccess({ subCategories })),
          catchError(error => of(SubCategoryActions.loadAllSubCategoriesFailure({ error })))
        )
      )
    )
  );

  deleteSubCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubCategoryActions.deleteSubCategory),
      mergeMap(({ id }) =>
        this.service.deleteSubCategory(id).pipe(
          map(() => SubCategoryActions.deleteSubCategorySuccess({ id })),
          catchError(error => of(SubCategoryActions.deleteSubCategoryFailure({ error })))
        )
      )
    )
  );

  getSubCategoryById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubCategoryActions.getSubCategoryById),
      mergeMap(({ id }) =>
        this.service.getSubCategoryById(id).pipe(
          map(subCategory => SubCategoryActions.getSubCategoryByIdSuccess({ subCategory })),
          catchError(error => of(SubCategoryActions.getSubCategoryByIdFailure({ error })))
        )
      )
    )
  );

  loadMobileSubCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubCategoryActions.loadMobileSubCategories),
      mergeMap(({ categoryId }) =>
        this.service.getMobileSubCategories(categoryId).pipe(
          map(subCategories => SubCategoryActions.loadMobileSubCategoriesSuccess({ subCategories })),
          catchError(error => of(SubCategoryActions.loadMobileSubCategoriesFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private service: SubCategoryService) {}
}
