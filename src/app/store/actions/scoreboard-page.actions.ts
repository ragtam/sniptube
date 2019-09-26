import { createAction, props } from '@ngrx/store';

export interface Game {
    home: number;
    away: number;
}

export const homeScore = createAction('[Scoreboard Page] Home Score');
export const awayScore = createAction('[Scoreboard Page] Away Score');
export const resetScore = createAction('[Scoreboard Page] Score Reset');
export const setScores = createAction('[Scoreboard Page] Set Scores', props<{game: Game}>());
