import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from "@angular/core";
import { Options } from "ng5-slider";

export interface EditorConfig {
  duration: number;
  playbackRates: number[];
  snipStart: number;
  snipEnd: number;
}

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements OnChanges {
  @Input() public config: EditorConfig;
  @Output() public snipConfigChange = new EventEmitter<{
    start: number;
    end: number;
  }>(true);

  public rates: number[];
  public selectedRate: number = 1;

  public value: number;
  public highValue: number;
  public options: Options;

  constructor() {}

  public ngOnChanges(sc: SimpleChanges): void {
    const config = sc && sc.config && (sc.config.currentValue as EditorConfig);
    if (config) {
      this.value = config.snipStart;
      this.highValue = config.snipEnd;
      this.options = {
        floor: 0,
        ceil: config.duration,
        translate: value => this.humanizeDuration(value)
      };
      this.rates = config.playbackRates;
    }
  }

  public onClick(): void {
    this.snipConfigChange.next({ start: this.value, end: this.highValue });
  }

  private humanizeDuration(seconds: number): string {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = Math.floor((seconds % 3600) % 60);
    return hh > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  }
}
