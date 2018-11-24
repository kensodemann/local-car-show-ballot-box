import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingController, NavController } from '@ionic/angular';

import {
  CarClassesService,
  createCarClassesServiceMock,
  testCarClasses
} from '../services/car-classes';
import {
  CarShowsService,
  createCarShowsServiceMock
} from '../services/car-shows';
import { CreateNewShowPage } from './create-new-show.page';

import {
  createNavControllerMock,
  createOverlayControllerMock,
  createOverlayElementMock
} from '../../../test/mocks';

describe('CreateNewShowPage', () => {
  let carClassesService;
  let carShowsService;
  let loadingController;
  let loadingSpinner;
  let navController;
  let component: CreateNewShowPage;
  let fixture: ComponentFixture<CreateNewShowPage>;

  beforeEach(async(() => {
    carClassesService = createCarClassesServiceMock();
    carClassesService.getAll.and.returnValue(Promise.resolve(testCarClasses));
    carShowsService = createCarShowsServiceMock();

    loadingSpinner = createOverlayElementMock('LoadingElement');
    loadingController = createOverlayControllerMock(
      'LoadingController',
      loadingSpinner
    );
    navController = createNavControllerMock();

    TestBed.configureTestingModule({
      declarations: [CreateNewShowPage],
      providers: [
        { provide: CarClassesService, useValue: carClassesService },
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
    it('shows a loading spinner', () => {
      expect(loadingController.create).toHaveBeenCalledTimes(1);
      expect(loadingSpinner.present).toHaveBeenCalledTimes(1);
    });

    it('initializes the carShow properties', () => {
      expect(component.carShow.id).toBeUndefined();
      expect(component.carShow.date).toEqual('2017-03-17');
      expect(component.carShow.year).toEqual(2017);
      expect(component.carShow.name).toEqual('Annual Car Show - 2017');
    });

    it('gets the car classes', () => {
      expect(carClassesService.getAll).toHaveBeenCalledTimes(1);
    });

    it('assigns the car classes without ID', () => {
      const expected = testCarClasses.map(c => ({
        name: c.name,
        description: c.description,
        active: c.active
      }));
      expect(component.carShowClasses).toEqual(expected);
    });

    it('dismisses the loading spinner', () => {
      expect(loadingSpinner.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('create show', () => {
    beforeEach(() => {
      carShowsService.save.and.returnValue(
        Promise.resolve({
          id: 73,
          date: '2017-03-17',
          year: 2017,
          name: 'Annual Car Show - 2017'
        })
      );
      loadingController.create.calls.reset();
      loadingSpinner.dismiss.calls.reset();
      loadingSpinner.present.calls.reset();
    });

    it('shows a loading spinner', async () => {
      await component.createShow();
      expect(loadingController.create).toHaveBeenCalledTimes(1);
      expect(loadingSpinner.present).toHaveBeenCalledTimes(1);
    });

    it('saves the show', async () => {
      await component.createShow();
      expect(carShowsService.save).toHaveBeenCalledTimes(1);
      expect(carShowsService.save).toHaveBeenCalledWith({
        date: '2017-03-17',
        year: 2017,
        name: 'Annual Car Show - 2017'
      });
    });

    it('saves the show classes', async () => {
      const expected = testCarClasses.map(c => ({
        name: c.name,
        description: c.description,
        active: c.active,
        carShowRid: 73
      }));
      await component.createShow();
      expect(carClassesService.saveAll).toHaveBeenCalledTimes(1);
      expect(carClassesService.saveAll).toHaveBeenCalledWith(expected);
    });

    it('navigates back to the starting page', async () => {
      await component.createShow();
      expect(navController.goBack).toHaveBeenCalledTimes(1);
    });

    it('dismisses the loading spinner', async () => {
      await component.createShow();
      expect(loadingSpinner.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('close', () => {
    it('navigates back to the starting page', () => {
      component.close();
      expect(navController.goBack).toHaveBeenCalledTimes(1);
    });
  });
});
