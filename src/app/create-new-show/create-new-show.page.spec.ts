import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingController, NavController } from '@ionic/angular';
import { of } from 'rxjs';

import {
  CarShowsService,
  createCarShowsServiceMock,
  testCarShows
} from '../services/car-shows';
import { CreateNewShowPage } from './create-new-show.page';
import { CarShow } from '../models/car-show';
import { deepCopy } from '../../../test/util';

import {
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../test/mocks';

describe('CreateNewShowPage', () => {
  let carShowsService;
  let loadingController;
  let loadingSpinner;
  let navController;
  let carShow: CarShow;
  let component: CreateNewShowPage;
  let fixture: ComponentFixture<CreateNewShowPage>;

  beforeEach(async(() => {
    carShow = deepCopy(testCarShows.find(c => c.id === 4));
    delete carShow.id;

    carShowsService = createCarShowsServiceMock();
    carShowsService.createCarShow.and.returnValue(of(carShow));
    carShowsService.save.and.returnValue(of({ id: 73, ...carShow }));

    loadingSpinner = createOverlayElementMock('LoadingElement');
    loadingController = createOverlayControllerMock(
      'LoadingController',
      loadingSpinner
    );
    navController = createNavControllerMock();

    TestBed.configureTestingModule({
      declarations: [CreateNewShowPage],
      providers: [
        { provide: CarShowsService, useValue: carShowsService },
        { provide: LoadingController, useValue: loadingController },
        { provide: NavController, useValue: navController }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async () => {
    jasmine.clock().mockDate(new Date(2017, 2, 17));
    fixture = TestBed.createComponent(CreateNewShowPage);
    component = fixture.componentInstance;
    await fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('exists', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('creates a new car show', () => {
      expect(carShowsService.createCarShow).toHaveBeenCalledTimes(1);
    });

    it('assigns the car show', () => {
      expect(component.carShow).toEqual(carShow);
    });

    it('shows a loading spinner', () => {
      expect(loadingController.create).toHaveBeenCalledTimes(1);
      expect(loadingSpinner.present).toHaveBeenCalledTimes(1);
    });

    it('dismisses the loading spinner', () => {
      expect(loadingSpinner.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('create show', () => {
    beforeEach(() => {
      loadingController.create.calls.reset();
      loadingSpinner.dismiss.calls.reset();
      loadingSpinner.present.calls.reset();
    });

    it('creates the show', async () => {
      await component.createShow();
      expect(carShowsService.save).toHaveBeenCalledTimes(1);
      expect(carShowsService.save).toHaveBeenCalledWith(carShow);
    });

    it('shows a loading spinner', async () => {
      await component.createShow();
      expect(loadingController.create).toHaveBeenCalledTimes(1);
      expect(loadingSpinner.present).toHaveBeenCalledTimes(1);
    });

    it('dismisses the loading spinner', async () => {
      await component.createShow();
      expect(loadingSpinner.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('close', () => {
    it('navigates back to the starting page', async () => {
      await component.close();
      expect(navController.goBack).toHaveBeenCalledTimes(1);
    });
  });
});
