import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromScoreBoard from './scoreboard.reducer';
import * as fromPlayer from './player.reducer';
import * as fromRouter from '@ngrx/router-store';
import {
  Params,
  ActivatedRouteSnapshot,
  RouterState,
  RouterStateSnapshot
} from '@angular/router';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface State {
  scoreboard: fromScoreBoard.State;
  player: fromPlayer.State;
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  scoreboard: fromScoreBoard.reducer,
  player: fromPlayer.reducer,
  routerReducer: fromRouter.routerReducer
};

export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('routerReducer');

export const getRouter = (state: State) => state.routerReducer.state;

export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  public serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams }
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}
