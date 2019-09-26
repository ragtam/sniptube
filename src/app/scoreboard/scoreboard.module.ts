import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreboardRoutingModule } from './scoreboard-routing.module';
import { ScoreboardComponent } from './scoreboard.component';
import { StoreModule } from '@ngrx/store';
import * as fromScoreboard from '../store/reducers/scoreboard.reducer';

@NgModule({
  declarations: [ScoreboardComponent],
  imports: [
    CommonModule,
    ScoreboardRoutingModule,
    StoreModule.forFeature(
      fromScoreboard.scoreboardFeatureKey,
      fromScoreboard.reducer
    )
  ]
})
export class ScoreboardModule {}
