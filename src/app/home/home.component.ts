import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/reducers';
import * as NavigationActions from '../store/actions/navigation.actions';
import { PlayerConfig } from '../player';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private store: Store<State>) {}

  ngOnInit() {}

  public goToPlayer(): void {
    const po: PlayerConfig = { videoId: 'vLdPL3xvq3M' };
    this.store.dispatch(NavigationActions.goToPlayer({ config: po }));
  }
}
