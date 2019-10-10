import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/reducers';
import * as NavigationActions from '../store/actions/navigation.actions';
import { PlayerConfig } from '../player';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public form: FormGroup;

  private readonly urlRegex = /^http(s)?:\/\/(www\.)?youtube\.com\/watch\?v=*/;

  public get formControls(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public constructor(
    private store: Store<State>,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      url: new FormControl('', Validators.pattern(this.urlRegex))
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const url = this.form.controls.url.value;
      const videoId = this.getVideoId(url);
      this.goToPlayer({ videoId });
    }
  }

  private goToPlayer(config: PlayerConfig): void {
    this.store.dispatch(NavigationActions.goToPlayer({ config }));
  }

  private getVideoId(url: string): string {
    return new URL(url).searchParams.get('v');
  }
}
