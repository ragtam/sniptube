import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers';
import * as fromRoot from '../store/reducers';
import {
  PlayerOptions,
  YtPlayerService,
  StateType,
  StateChange
} from 'yt-player-angular';
import { map, switchMap, filter, tap, take, delay } from 'rxjs/operators';
import { Params } from '@angular/router';
import { of, combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { EditorConfig } from './editor/editor.component';

export interface PlayerConfig {
  videoId: string;
  start?: number;
  end?: number;
  playbackRate?: number;
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  public editorConfig: EditorConfig;

  private shouldPlayFromStart: boolean;
  private isPlaybackRateSetUp: boolean;

  private get stateAndConfig$(): Observable<[StateChange, PlayerConfig]> {
    return this.store.pipe(
      select(fromRoot.getRouter),
      map(({ queryParams }) => this.toPlayerConfig(queryParams)),
      tap(config => this.initializePlayer(config)),
      switchMap(config =>
        combineLatest(this.ytPlayerService.stateChange$, of(config))
      ),
      tap(([stateChange]) => this.initializeEditorConfig(stateChange)),
      filter(([stateChange]) => stateChange.type === StateType.PlaybackProgress)
    );
  }

  public constructor(
    private store: Store<State>,
    private ytPlayerService: YtPlayerService,
    private cd: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.stateAndConfig$.subscribe(([stateChange, playerConfig]) => {
      if (this.shouldSetPlaybackRate(playerConfig)) {
        this.setPlaybackRate(playerConfig);
      }
      this.playSnippet(stateChange.payload, playerConfig);
    });
  }

  private playSnippet(progress: number, config: PlayerConfig): void {
    if (this.shouldSeek(config, progress)) {
      this.seek(config.start);
    } else if (this.shouldReset(config, progress)) {
      this.shouldPlayFromStart = true;
    }
  }

  private seek(start: number): void {
    this.ytPlayerService.seek(start);
    this.shouldPlayFromStart = false;
  }

  private setPlaybackRate(config: PlayerConfig): void {
    this.ytPlayerService.setPlaybackRate(config.playbackRate);
    this.isPlaybackRateSetUp = true;
  }

  private shouldSeek(config: PlayerConfig, progress: number): boolean {
    return !!(this.shouldPlayFromStart && config.start && progress);
  }

  private shouldReset(config: PlayerConfig, progress: number): boolean {
    return !this.shouldPlayFromStart && config.end && progress > config.end - 1;
  }

  private shouldSetPlaybackRate(config: PlayerConfig): boolean {
    return !this.isPlaybackRateSetUp && config.playbackRate > 0;
  }

  private toPlayerConfig(params: Params): PlayerConfig {
    return {
      videoId: params.videoId,
      start: Number(params.start),
      end: Number(params.end),
      playbackRate: Number(params.playbackRate)
    };
  }

  private initializePlayer(config: PlayerConfig): void {
    this.shouldPlayFromStart = true;
    this.isPlaybackRateSetUp = false;
    this.videoId = config.videoId;
  }

  private initializeEditorConfig(stateChange: StateChange) {
    if (stateChange.type === StateType.Started && !this.editorConfig) {
      const duration = this.ytPlayerService.getDuration();
      const playbackRates = this.ytPlayerService.getAvailablePlaybackRates();
      this.editorConfig = { duration, playbackRates };
      // for unknown reasons change detector needs to be called manually
      this.cd.detectChanges();
    }
  }
}
