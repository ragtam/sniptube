import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import * as NavigationActions from '../actions/navigation.actions';

@Injectable()
export class NavigationEffects {
  goToPlayer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavigationActions.goToPlayer),
        tap(action => {
          this.router.navigate(['player'], { queryParams: action.config });
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private router: Router) {}
}
