import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';
import { StoreModule } from '@ngrx/store';
import * as fromPlayer from '../store/reducers/player.reducer';
import { YtPlayerAngularModule } from 'yt-player-angular';

@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    StoreModule.forFeature(fromPlayer.playerFeatureKey, fromPlayer.reducer),
    YtPlayerAngularModule
  ]
})
export class PlayerModule {}
