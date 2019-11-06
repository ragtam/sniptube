import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PlayerComponent } from "./player.component";
import { YtPlayerService, StateChangeType } from "yt-player-angular";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { State } from "../store/reducers";
import { Store } from "@ngrx/store";
import { of } from "rxjs";

describe("PlayerComponent", () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let store: MockStore<State>;
  const initialState: State = {
    player: null,
    router: {
      navigationId: 0,
      state: {
        params: { videoId: "123", start: 0, end: 10, playbackRate: 1 },
        queryParams: { videoId: "123", start: 0, end: 10, playbackRate: 1 },
        url: null
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerComponent],
      providers: [
        {
          provide: YtPlayerService,
          useFactory: () => ({
            stateChange$: of({
              type: StateChangeType.PlaybackProgress,
              payload: 5
            }),
            seek: () => {},
            setPlaybackRate: () => {},
            getDuration: () => {},
            getAvailablePlaybackRates: () => {},
            getPlaybackRate: () => {}
          })
        },
        provideMockStore({ initialState })
      ]
    })
      .overrideComponent(PlayerComponent, { set: { template: "" } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get<Store<State>>(Store);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
