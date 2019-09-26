import { createAction, props } from '@ngrx/store';
import { PlayerOptions } from 'yt-player-angular';

export const setPlayerOptions = createAction(
    '[Player] Set Player Options',
    props<{ playerOptions: PlayerOptions }>()
);
