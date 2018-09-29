import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';

import { TabsPage } from './tabs.page';
import { CarShowsService, createCarShowsServiceMock } from '../services/car-shows';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let carShowsServiceMock;

  beforeEach(() => {
    carShowsServiceMock = createCarShowsServiceMock();

    TestBed.configureTestingModule({
      declarations: [TabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: CarShowsService, useValue: carShowsServiceMock }]
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
      expect(carShowsServiceMock.getCurrent).toHaveBeenCalledTimes(1);
    });

    it('sets noCurrentShow true if there is no show', () => {
      carShowsServiceMock.getCurrent.and.returnValue(of({}));
      fixture.detectChanges();
      expect(component.noCurrentShow).toEqual(true);
    });

    it('sets noCurrentShow false if there is a show', () => {
      carShowsServiceMock.getCurrent.and.returnValue(
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
      carShowsServiceMock.getCurrent.calls.reset();
    });

    it('gets the current car show', () => {
      carShowsServiceMock.changed.next();
      expect(carShowsServiceMock.getCurrent).toHaveBeenCalledTimes(1);
    });

    it('sets noCurrentShow true if there is no show', () => {
      carShowsServiceMock.getCurrent.and.returnValue(of({}));
      carShowsServiceMock.changed.next();
      expect(component.noCurrentShow).toEqual(true);
    });

    it('sets noCurrentShow false if there is a show', () => {
      carShowsServiceMock.getCurrent.and.returnValue(
        of({
          id: 3,
          name: 'Waukesha Show 2017',
          date: '2017-08-10',
          year: 2017,
          classes: []
        })
      );
      carShowsServiceMock.changed.next();
      expect(component.noCurrentShow).toEqual(false);
    });
  });
});
