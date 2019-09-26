import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers';
import * as fromRoot from '../store/reducers';
import { PlayerOptions } from 'yt-player-angular';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  public videoId: string;
  public options: PlayerOptions;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.store.pipe(select(fromRoot.getRouter)).subscribe(res => {
      // tslint:disable-next-line: no-string-literal
      const autoplay = res.queryParams['autoplay'] === 'true';
      // tslint:disable-next-line: no-string-literal
      const videoId = res.queryParams['videoId'];

      this.options = { ...this.options, autoplay };
      this.videoId = videoId;
    });
  }
}
