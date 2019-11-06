import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from "@angular/core";
import { Options, CustomStepDefinition } from "ng5-slider";

export interface EditorConfig {
  duration: number;
  playbackRates: number[];
  currentRate: number;
  snipStart: number;
  snipEnd: number;
}

export interface SliderConfig {
  value: number;
  highValue?: number;
  options: Options;
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
    rate: number;
  }>(true);

  public playbackSlider: SliderConfig;
  public rateSlider: SliderConfig;

  constructor() {}

  public ngOnChanges(sc: SimpleChanges): void {
    const ec: EditorConfig = sc && sc.config && sc.config.currentValue;
    if (ec) {
      this.playbackSlider = this.buildPlaybackSliderConfig(ec);
      this.rateSlider = this.buildRateSliderConfig(ec);
    }
  }

  public onClick(): void {
    this.snipConfigChange.next({
      start: this.playbackSlider.value,
      end: this.playbackSlider.highValue,
      rate: this.rateSlider.value
    });
  }

  private buildPlaybackSliderConfig(config: EditorConfig): SliderConfig {
    return {
      value: config.snipStart,
      highValue: config.snipEnd,
      options: {
        floor: 0,
        ceil: config.duration,
        translate: value => this.humanizeDuration(value)
      }
    };
  }

  private buildRateSliderConfig(config: EditorConfig): SliderConfig {
    return {
      value: config.currentRate,
      options: {
        showTicksValues: true,
        stepsArray: this.getPlaybackRatesStepsArray(config.playbackRates)
      }
    };
  }

  private humanizeDuration(seconds: number): string {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = Math.floor((seconds % 3600) % 60);
    return hh > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  private getPlaybackRatesStepsArray(rates: number[]): CustomStepDefinition[] {
    return rates.map((value, index, array) => ({
      value: value,
      legend: this.getLegend(index, array.length)
    }));
  }

  private getLegend(index: number, arrayLength: number): string {
    if (index === 0) {
      return "slower";
    } else if (index === arrayLength - 1) {
      return "faster";
    } else {
      return "";
    }
  }
}
