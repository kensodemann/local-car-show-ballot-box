import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { LoadingController } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import {
  CarShowsService,
  createCarShowsServiceMock
} from '../services/car-shows';
import {
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../test/mocks';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let carShowsServiceMock;
  let loadingController;
  let loadingSpinner;

  beforeEach(() => {
    carShowsServiceMock = createCarShowsServiceMock();
    loadingSpinner = createOverlayElementMock('LoadingElement');
    loadingController = createOverlayControllerMock(
      'LoadingController',
      loadingSpinner
    );

    TestBed.configureTestingModule({
      declarations: [TabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: CarShowsService, useValue: carShowsServiceMock },
        { provide: LoadingController, useValue: loadingController }
      ]
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
    it('gets the current car show', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(carShowsServiceMock.getCurrent).toHaveBeenCalledTimes(1);
    }));

    it('sets noCurrentShow true if there is no show', fakeAsync(() => {
      carShowsServiceMock.getCurrent.and.returnValue(Promise.resolve({}));
      fixture.detectChanges();
      tick();
      expect(component.noCurrentShow).toEqual(true);
    }));

    it('sets noCurrentShow false if there is a show', fakeAsync(() => {
      carShowsServiceMock.getCurrent.and.returnValue(
        Promise.resolve({
          id: 3,
          name: 'Waukesha Show 2017',
          date: '2017-08-10',
          year: 2017,
          classes: []
        })
      );
      fixture.detectChanges();
      tick();
      expect(component.noCurrentShow).toEqual(false);
    }));

    it('shows a loading spinner', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(loadingController.create).toHaveBeenCalledTimes(1);
      expect(loadingSpinner.present).toHaveBeenCalledTimes(1);
    }));

    it('dismisses the loading spinner', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      expect(loadingSpinner.dismiss).toHaveBeenCalledTimes(1);
    }));
  });

  describe('on car shows changed', () => {
    beforeEach(() => {
      fixture.detectChanges();
      carShowsServiceMock.getCurrent.calls.reset();
      loadingController.create.calls.reset();
      loadingSpinner.dismiss.calls.reset();
      loadingSpinner.present.calls.reset();
    });

    it('gets the current car show', fakeAsync(() => {
      carShowsServiceMock.changed.next();
      tick();
      expect(carShowsServiceMock.getCurrent).toHaveBeenCalledTimes(1);
    }));

    it('sets noCurrentShow true if there is no show', fakeAsync(() => {
      carShowsServiceMock.getCurrent.and.returnValue(Promise.resolve({}));
      carShowsServiceMock.changed.next();
      tick();
      expect(component.noCurrentShow).toEqual(true);
    }));

    it('sets noCurrentShow false if there is a show', fakeAsync(() => {
      carShowsServiceMock.getCurrent.and.returnValue(
        Promise.resolve({
          id: 3,
          name: 'Waukesha Show 2017',
          date: '2017-08-10',
          year: 2017,
          classes: []
        })
      );
      carShowsServiceMock.changed.next();
      tick();
      expect(component.noCurrentShow).toEqual(false);
    }));

    it('shows a loading spinner', fakeAsync(() => {
      carShowsServiceMock.changed.next();
      tick();
      expect(loadingController.create).toHaveBeenCalledTimes(1);
      expect(loadingSpinner.present).toHaveBeenCalledTimes(1);
    }));

    it('dismisses the loading spinner', fakeAsync(() => {
      carShowsServiceMock.changed.next();
      tick();
      expect(loadingSpinner.dismiss).toHaveBeenCalledTimes(1);
    }));
  });
});
