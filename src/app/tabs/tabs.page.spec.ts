import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { of, Subject } from 'rxjs';

import { TabsPage } from './tabs.page';
import { CarShowsService } from '../services/car-shows.service';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let carShows;

  beforeEach(() => {
    carShows = jasmine.createSpyObj('CarShowsService', {
      getCurrent: of(null)
    });
    carShows.changed = new Subject();

    TestBed.configureTestingModule({
      declarations: [TabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: CarShowsService, useValue: carShows }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
  });

  it('exists', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('gets the current car show', () => {
      fixture.detectChanges();
      expect(carShows.getCurrent).toHaveBeenCalledTimes(1);
    });

    it('sets noCurrentShow true if there is no show', () => {
      carShows.getCurrent.and.returnValue(of({}));
      fixture.detectChanges();
      expect(component.noCurrentShow).toEqual(true);
    });

    it('sets noCurrentShow false if there is a show', () => {
      carShows.getCurrent.and.returnValue(
        of({
          id: 3,
          name: 'Waukesha Show 2017',
          date: '2017-08-10',
          year: 2017,
          classes: []
        })
      );
      fixture.detectChanges();
      expect(component.noCurrentShow).toEqual(false);
    });
  });

  describe('on car shows changed', () => {
    beforeEach(() => {
      fixture.detectChanges();
      carShows.getCurrent.calls.reset();
    });

    it('gets the current car show', () => {
      carShows.changed.next();
      expect(carShows.getCurrent).toHaveBeenCalledTimes(1);
    });

    it('sets noCurrentShow true if there is no show', () => {
      carShows.getCurrent.and.returnValue(of({}));
      carShows.changed.next();
      expect(component.noCurrentShow).toEqual(true);
    });

    it('sets noCurrentShow false if there is a show', () => {
      carShows.getCurrent.and.returnValue(
        of({
          id: 3,
          name: 'Waukesha Show 2017',
          date: '2017-08-10',
          year: 2017,
          classes: []
        })
      );
      carShows.changed.next();
      expect(component.noCurrentShow).toEqual(false);
    });
  });
});
