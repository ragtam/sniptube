import { createAction, props } from '@ngrx/store';
import { PlayerConfig } from 'src/app/player';

export const goToPlayer = createAction(
  '[Navigation] go to player',
  props<{ config: PlayerConfig }>()
);
