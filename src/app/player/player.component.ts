import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers';
import * as fromRoot from '../store/reducers';
import { PlayerOptions, YtPlayerService, StateType } from 'yt-player-angular';
import { map, switchMap, filter, tap } from 'rxjs/operators';
import { Params } from '@angular/router';
import { of, combineLatest } from 'rxjs';

export interface PlayerConfig {
  videoId: string;
  start: number;
  end: number;
  playbackRate: number;
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  public videoId = '';
  public options: PlayerOptions = {
    autoplay: true,
    modestBranding: true,
    annotations: false,
    related: false,
    info: false
  };

  private shouldPlayFromStart: boolean;
  private isPlaybackRateSetUp: boolean;

  constructor(
    private store: Store<State>,
    private ytPlayerService: YtPlayerService
  ) {}

  ngOnInit() {
    this.store
      .pipe(
        select(fromRoot.getRouter),
        map(({ queryParams }) => this.toPlayerConfig(queryParams)),
        tap(config => this.initializePlayer(config)),
        switchMap(config =>
          combineLatest(this.ytPlayerService.stateChange$, of(config))
        ),
        filter(
          ([stateChange]) => stateChange.type === StateType.PlaybackProgress
        )
      )
      .subscribe(([stateChange, playerConfig]) => {
        if (!this.isPlaybackRateSetUp && playerConfig.playbackRate > 0) {
          this.ytPlayerService.setPlaybackRate(playerConfig.playbackRate);
          this.isPlaybackRateSetUp = true;
        }
        this.playSnippet(stateChange.payload, playerConfig);
      });
  }

  private playSnippet(progress: number, config: PlayerConfig): void {
    if (this.shouldPlayFromStart && config.start > 0 && progress > 0) {
      this.ytPlayerService.seek(config.start);
      this.shouldPlayFromStart = false;
    } else if (
      !this.shouldPlayFromStart &&
      config.end > 0 &&
      progress > config.end - 1
    ) {
      this.shouldPlayFromStart = true;
    }
  }

  private toPlayerConfig(params: Params): PlayerConfig {
    return {
      videoId: params.videoId,
      start: Number(params.start) || -1,
      end: Number(params.end) || -1,
      playbackRate: Number(params.playbackRate) || -1
    };
  }

  private initializePlayer(config: PlayerConfig): void {
    this.shouldPlayFromStart = true;
    this.isPlaybackRateSetUp = false;
    this.videoId = config.videoId;
  }
}
