import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, Subject } from 'rxjs';

import { TabsPage } from './tabs.page';
import { CarShowsService } from '../services/car-shows.service';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let carShows;

  beforeEach(() => {
    carShows = jasmine.createSpyObj('CarShowsService', {
      getCurrent: of()
    });
    carShows.currentChanged = new Subject();

    TestBed.configureTestingModule({
      declarations: [TabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: CarShowsService, useValue: carShows }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exists', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    beforeEach(() => {
      carShows.getCurrent.calls.reset();
    });

    it('gets the current car show', () => {
      component.ngOnInit();
      expect(carShows.getCurrent).toHaveBeenCalledTimes(1);
    });
  });

  describe('noCurrentShow', () => {
    it('is undefined by default', () => {
      expect(component.noCurrentShow).toBeUndefined();
    });

    it('is true if there is no current show', () => {
      carShows.currentChanged.next(null);
      expect(component.noCurrentShow).toEqual(true);
    });

    it('is false if there is current show', () => {
      carShows.currentChanged.next({
        id: 3,
        name: 'Waukesha Show 2017',
        date: '2017-08-10',
        year: 2017,
        classes: [
          {
            id: 9,
            name: 'A',
            description: 'Antique through 1954, Cars & Trucks',
            active: true
          },
          {
            id: 10,
            name: 'B',
            description: '1955-1962, Cars Only',
            active: true
          },
          {
            id: 11,
            name: 'C',
            description: '1963-1967, Cars Only',
            active: true
          },
          {
            id: 12,
            name: 'D',
            description: '1968-1970, Cars Only',
            active: true
          }
        ]
      });
      expect(component.noCurrentShow).toEqual(false);
    });
  });
});
