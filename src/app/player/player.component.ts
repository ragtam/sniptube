import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "../store/reducers";
import * as fromRoot from "../store/reducers";
import {
  PlayerOptions,
  YtPlayerService,
  StateChange,
  StateChangeType
} from "yt-player-angular";
import { map, switchMap, filter, tap } from "rxjs/operators";
import { Params } from "@angular/router";
import { of, combineLatest, Observable } from "rxjs";
import { EditorConfig } from "./editor/editor.component";
import { untilDestroyed } from "ngx-take-until-destroy";
import * as NavigationActions from "../store/actions/navigation.actions";

export interface PlayerConfig {
  videoId: string;
  start?: number;
  end?: number;
  playbackRate?: number;
}

@Component({
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnInit, OnDestroy {
  public videoId = "";
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
      )
    );
  }

  public constructor(
    private store: Store<State>,
    private ytPlayerService: YtPlayerService
  ) {}

  public ngOnInit(): void {
    this.subscribeOnStartedState();
    this.subscribeOnPlaybackProgressState();
  }

  public ngOnDestroy(): void {}

  public onSnipConfigChange({ start, end, rate }): void {
    const config = {
      start: start,
      end: end,
      videoId: this.videoId,
      playbackRate: rate
    } as PlayerConfig;
    this.store.dispatch(NavigationActions.goToPlayer({ config }));
  }

  private subscribeOnPlaybackProgressState(): void {
    this.stateAndConfig$
      .pipe(
        filter(
          ([stateChange]) =>
            stateChange.type === StateChangeType.PlaybackProgress
        ),
        untilDestroyed(this)
      )
      .subscribe(([stateChange, playerConfig]) => {
        if (this.shouldSetPlaybackRate(playerConfig)) {
          this.setPlaybackRate(playerConfig);
        }
        this.playSnippet(stateChange.payload, playerConfig);
      });
  }

  private subscribeOnStartedState(): void {
    this.stateAndConfig$
      .pipe(
        filter(([stateChange]) => stateChange.type === StateChangeType.Started),
        map(([stateChange, playerConfig]) => playerConfig),
        untilDestroyed(this)
      )
      .subscribe(playerConfig => {
        this.initializeEditorConfig(playerConfig);
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

  private initializeEditorConfig(playerConfig: PlayerConfig) {
    if (this.editorConfig) {
      return;
    }

    this.editorConfig = {
      duration: this.ytPlayerService.getDuration(),
      playbackRates: this.ytPlayerService.getAvailablePlaybackRates(),
      currentRate: this.ytPlayerService.getPlaybackRate(),
      snipStart: playerConfig.start || 0,
      snipEnd: playerConfig.end || this.ytPlayerService.getDuration()
    };
  }
}
