import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';
import { StoreModule } from '@ngrx/store';
import * as fromPlayer from './store/player.reducer';
import { YtPlayerAngularModule } from 'yt-player-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [PlayerComponent, EditorComponent],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    StoreModule.forFeature(fromPlayer.playerFeatureKey, fromPlayer.reducer),
    YtPlayerAngularModule,
    FlexLayoutModule
  ]
})
export class PlayerModule {}
