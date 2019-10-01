import { Component } from '@angular/core';
import { PlayerConfig } from './player/player.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public playConfig: PlayerConfig = {
    videoId: '_LjcTPkLIxE',
    start: 55,
    end: 70,
    playbackRate: 1
  };

  public playSlowlyConfig: PlayerConfig = {
    ...this.playConfig,
    playbackRate: 0.75
  };
}
