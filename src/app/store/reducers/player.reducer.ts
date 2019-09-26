import { createReducer, on, Action } from '@ngrx/store';
import * as PlayerActions from '../actions/player.actions';

export interface State {
    videoId: string;
    autoplay: boolean;
    start: number;
    end: number;
}

export const initialState: State = {
    videoId: '',
    autoplay: false,
    start: null,
    end: null
};

const playerReducer = createReducer(
    initialState,
    on(PlayerActions.setPlayerOptions, (state, playerOptions) => ({ ...state, ...playerOptions}))
);

export function reducer(state: State | undefined, action: Action) {
    return playerReducer(state, action);
}

export const playerFeatureKey = 'player';
