import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlayerRoutingModule } from "./player-routing.module";
import { PlayerComponent } from "./player.component";
import { StoreModule } from "@ngrx/store";
import * as fromPlayer from "./store/player.reducer";
import { YtPlayerAngularModule } from "yt-player-angular";
import { FlexLayoutModule } from "@angular/flex-layout";
import { EditorComponent } from "./editor/editor.component";
import { Ng5SliderModule } from "ng5-slider";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";

@NgModule({
  declarations: [PlayerComponent, EditorComponent],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    StoreModule.forFeature(fromPlayer.playerFeatureKey, fromPlayer.reducer),
    YtPlayerAngularModule,
    FlexLayoutModule,
    Ng5SliderModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule
  ]
})
export class PlayerModule {}
