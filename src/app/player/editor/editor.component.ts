import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export interface EditorConfig {
  duration: number;
  playbackRates: number[];
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnChanges {
  @Input() public config: EditorConfig;

  public duration: number;
  public rates: number[];

  constructor() {}

  public ngOnChanges(sc: SimpleChanges): void {
    console.log('conf', this.config, sc.config);
    const c = sc && sc.config && sc.config.currentValue;
    if (c) {
      this.duration = c.duration;
      this.rates = c.rates;
    }
  }
}
