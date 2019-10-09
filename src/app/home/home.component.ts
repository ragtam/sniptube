import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/reducers';
import * as NavigationActions from '../store/actions/navigation.actions';
import { PlayerConfig } from '../player';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public form: FormGroup;

  constructor(private store: Store<State>, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      url: ''
    });
  }

  public onSubmit() {
    const url = this.form.controls.url.value;
    const videoId = this.getVideoId(url);
    this.goToPlayer({ videoId });
  }

  private goToPlayer(config: PlayerConfig): void {
    this.store.dispatch(NavigationActions.goToPlayer({ config }));
  }

  private getVideoId(url: string): string {
    return new URL(url).searchParams.get('v');
  }
}
