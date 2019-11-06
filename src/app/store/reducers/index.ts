import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromPlayer from '../../player';
import * as fromRouter from '@ngrx/router-store';
import { RouterStateUrl } from './router.reducer';

export interface State {
  player: fromPlayer.State;
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  player: fromPlayer.reducer,
  router: fromRouter.routerReducer
};

export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('router');

export const getRouter = (state: State) => state.router.state;
